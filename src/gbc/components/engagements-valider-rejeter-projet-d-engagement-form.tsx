import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import { DataGrid, GridColDef, GridRowModel, GridToolbarContainer, GridValueFormatterParams } from '@mui/x-data-grid';
import { ConnectedUser, Gestion, IdBudget } from '../helpers/session-storage';
import Stack from '@mui/material/Stack';
import EngagementService from '../services/engagement-service';
import { okSuccessDialog, okWarnignDialog } from '../../helpers/dialogs';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { formatDateWithHoursAndMinutes } from '../../helpers/format-date';
import { AlertProps } from '@mui/material/Alert';
import { IdEngAction } from '../models/id-eng-action';
import { MotifsRejetDossierRequestDto } from '../models/motifs-rejet-dossier';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import DoNotDisturbAltOutlinedIcon from '@mui/icons-material/DoNotDisturbAltOutlined';
import { emptyInfosPourValiderOuRejeterEngagement, InfosPourValiderOuRejeterEngagement } from '../models/infos-pour-valider-ou-rejeter-engagement';
import EngagementViewService from '../services/engagement-view-service';
import ServerDateService from '../../shared/system/services/server-date-service';

// CRITERES DE RECHERCHE ENGAGEMENT
type FormREngagement = {
  numeroBordTransmis: Field,
  chapitre: Field,
  article: Field,
  paragraphe: Field,
  rubrique: Field
}

const EngagementsValiderRejeterProjetDEngagementForm: FunctionComponent = () => {

  const [gestionCourante] = useState<string>(Gestion() ?? '');
  const [idBudget] = useState<string>(IdBudget() ?? '');
  const [utilisateurCourante] = useState<string>(ConnectedUser() ?? '');
  const [isGestionClose, setIsGestionClose] = useState<boolean>(false);
  const dateEnregistrementPourGestionClose: Date = new Date(gestionCourante + '-12-31');   
  const [disableValiderOuRejetterEngagment, setDisableValiderOuRejetterEngagment] = useState<boolean>(true);
  const [disableValiderTout, setDisableValiderTout] = useState<boolean>(true);
  const [disableRejeterTout, setDisableRejeterTout] = useState<boolean>(true);
  const [disableNeRienFairePourTout, setDisableNeRienFairePourTout] = useState<boolean>(true);

  useEffect(() => {
    // On recupere la date du server : si la gestion en cours est strictement inférieur à l'année de la date du serveur alors elle est close :
    ServerDateService.getServerDate().then(data => {
      if (Number(gestionCourante) < new Date(data).getFullYear()) setIsGestionClose(true); else setIsGestionClose(false)   
    }) 
  }, [])   
  
  ///////////////// GESTION ENGAGEMENTS A VALIDER OU REJETER
  const [engagements, setEngagements] = useState<any[]>([]);
  const [filteredEngagements, setFilteredEngagements] = useState<any[]>([]);
  const [loaderEngagements, setLoaderEngagements] = useState<boolean>(true);
  const [engagementsAValiderOuRejeter, setEngagementsAValiderOuRejeter] = useState<IdEngAction[]>([]);
  const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);

  const tableEngagementColumns: GridColDef[] = [
    {
      field: 'dateEtat',
      headerName: 'Date de MAJ',
      type: 'Date',
      width: 150,
      align: "center",
      valueFormatter: (params : GridValueFormatterParams<any>) => {
        return formatDateWithHoursAndMinutes(new Date(params.value));
      },
      headerClassName: 'header',
    },
    {
      field: 'gestion',
      headerName: 'Gestion',
      type: 'string',
      width: 100,
      align: "center",
      headerClassName: 'header',
    },
    {
      field: 'benum',
      headerName: 'Numéro',
      type: 'number',
      width: 100,
      align: "center",
      valueFormatter: (params : GridValueFormatterParams<any>) => {
        return String(params.value).padStart(4, '0');
      },
      headerClassName: 'header',
    },
    {
      field: 'nom',
      headerName: 'Fournisseur / Bénéficiaire',
      type: 'string',
      width: 200,
      headerClassName: 'header',
      headerAlign: 'center'
    },
    {
      field: 'montant',
      headerName: 'Montant',
      type: 'number',
      width: 120,
      headerClassName: 'header',
      headerAlign: 'center'
    }, 
    {
      field: 'action',
      headerName: 'Actions',
      type: 'singleSelect',
      editable: true,
      valueOptions: [
        { value: 'V', label: 'V' },
        { value: 'R', label: 'R' },
        { value: 'N', label: 'N' },
      ],
      width: 60,
      headerClassName: 'header',
      cellClassName: 'super-app-theme--cell1',
    },
    {
      field: 'motifs',
      headerName: 'Motif de rejet',
      type: 'string',
      width: 220,
      editable: true,
      headerClassName: 'header',
      cellClassName: 'super-app-theme--cell2',
      headerAlign: 'center'
    },
  ];

  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel): GridRowModel => {
    return new Promise<GridRowModel>((resolve, reject) => {
      if (newRow.action ==="V" || newRow.action ==="N") newRow.motifs ="";

      // Motif de rejet dans le cas d'un rejet
      const motifsRejetDossierRequestDto: MotifsRejetDossierRequestDto = {
        motifs: newRow.motifs,
        dateSaisie: (isGestionClose)? dateEnregistrementPourGestionClose : new Date(),
        numBe: newRow.numBe,
        numMand: newRow.numMand,
        codLiq: newRow.codLiq,
        idTitre: newRow.idTitreMotif,
        userName: utilisateurCourante,
        dateEnreg: (isGestionClose)? dateEnregistrementPourGestionClose : new Date(),
        actif: true,
      };
      
      // La ligne concerné par la modification
      const newLigneModifiee: IdEngAction = {
        idEng: newRow.numBe,
        action: newRow.action,
        motifsRejetDossierRequestDto: (newRow.action ==="V" || newRow.action ==="N")? null : motifsRejetDossierRequestDto,
      };
      
      // On recupere la ligne modifiée
      const result = engagementsAValiderOuRejeter.some(item => item.idEng === newRow.numBe);
      if (result) {
        const indexOfObject = engagementsAValiderOuRejeter.findIndex(item => item.idEng === newRow.numBe);
          if (indexOfObject !== -1) {
            if (newRow.action ==="V" || newRow.action ==="R") {
              // Remplace par la nouvelle ligne
              engagementsAValiderOuRejeter[indexOfObject] = newLigneModifiee;
            } else {
              // Retire la ligne
              engagementsAValiderOuRejeter.splice(indexOfObject, 1);
            }
          }
      } else {
        // Ajoute la nouvelle ligne
        setEngagementsAValiderOuRejeter([...engagementsAValiderOuRejeter, newLigneModifiee]);
      }

      // Promesse resolue
      resolve(newRow);
    });
  }

  const handleProcessRowUpdateError = (error: Error) => {
    setSnackbar({ children: error.message, severity: 'error' });
  };

  function EditToolbar() {
    return (
      <GridToolbarContainer className='justify-content-end mb-1'>
        <ButtonGroup size="sm">
          <Button size='sm' variant="outline-success" title="Valider tout" className='me-1' style={{minWidth:"140px", maxWidth:"150px", maxHeight:"30px"}} onClick={() => handleValiderToutButtonClick()} disabled={disableValiderTout}>Valider tout <DoneOutlineOutlinedIcon /></Button>
          <Button size='sm' variant="outline-danger" title="Rejeter tout" className='me-1' style={{minWidth:"140px", maxWidth:"150px", maxHeight:"30px"}} onClick={() => handleRejeterToutButtonClick()} disabled={disableRejeterTout}>Rejetr tout <ThumbDownAltOutlinedIcon /></Button>
          <Button size='sm' variant="outline-primary" title="Ne rien faire pour tout" style={{minWidth:"140px", maxWidth:"150px", maxHeight:"30px"}} onClick={() => handleNeRienFairePourToutButtonClick()} disabled={disableNeRienFairePourTout}>Ne rien faire tout <DoNotDisturbAltOutlinedIcon /></Button>
        </ButtonGroup>
      </GridToolbarContainer>
    );
  }

  const handleValiderToutButtonClick = () => {
    getEngagements("V"); 
  }

  const handleRejeterToutButtonClick = () => {
    getEngagements("R");
  }

  const handleNeRienFairePourToutButtonClick = () => {
    getEngagements("N");
  }

  useEffect(() => {
    getEngagements("N");
  }, [])
  
  const getEngagements = (action: string) => {
    let idEngActions: IdEngAction[] = [];
    EngagementViewService.getEngagementValideEtTransmisEtReceptionne(Number(gestionCourante), Number(idBudget)).then((data: any[]) => {
      data.forEach(item => {
        item.action = action;
        if (action ==="V" || action ==="R") {
          idEngActions.push({
            idEng: item.numBe,
            action: action,
            motifsRejetDossierRequestDto: null
          })
        }
       });
      setEngagementsAValiderOuRejeter(idEngActions);
      setEngagements(data) 
      setFilteredEngagements(data)
      setLoaderEngagements(false)
      if (data.length !== 0) {
        setDisableValiderOuRejetterEngagment(false);
        setDisableValiderTout(false);
        setDisableRejeterTout(false);
        setDisableNeRienFairePourTout(false);
      } else {
        setDisableValiderOuRejetterEngagment(true);
        setDisableValiderTout(true);
        setDisableRejeterTout(true);
        setDisableNeRienFairePourTout(true);
      }
    })
  }
  ///////////////// GESTION ENGAGEMENTS A VILIDER OU REJETER

  ///////////////// GESTION RECHERCHE ENGAGEMENT
  const [formREngagement, setFormREngagement] = useState<FormREngagement>({
    numeroBordTransmis: { value: ''},
    chapitre: { value: ''},
    article: { value: ''},
    paragraphe: { value: ''},
    rubrique: { value: ''},
  })

  const handleInputChangeFormREngagement = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormREngagement({ ...formREngagement, ...newField})

    if (fieldName === 'numeroBordTransmis') {
      const results = engagements.filter(item => {
        return ((item.numeroBordTransmis || '').toString().startsWith(fieldValue))
        && ((item.chap || '').toString().startsWith(formREngagement.chapitre.value))
        && ((item.art || '').toString().startsWith(formREngagement.article.value))
        && ((item.parag || '').toString().startsWith(formREngagement.paragraphe.value))
        && ((item.rub || '').toString().startsWith(formREngagement.rubrique.value))
      })
      setFilteredEngagements(results);
    }

    if (fieldName === 'chapitre') {
      const results = engagements.filter(item => {
        return ((item.numeroBordTransmis || '').toString().startsWith(formREngagement.numeroBordTransmis.value))
        && ((item.chap || '').toString().startsWith(fieldValue))
        && ((item.art || '').toString().startsWith(formREngagement.article.value))
        && ((item.parag || '').toString().startsWith(formREngagement.paragraphe.value))
        && ((item.rub || '').toString().startsWith(formREngagement.rubrique.value))
      })
      setFilteredEngagements(results);
    }

    if (fieldName === 'article') {
      const results = engagements.filter(item => {
        return ((item.numeroBordTransmis || '').toString().startsWith(formREngagement.numeroBordTransmis.value))
        && ((item.chap || '').toString().startsWith(formREngagement.chapitre.value))
        && ((item.art || '').toString().startsWith(fieldValue))
        && ((item.parag || '').toString().startsWith(formREngagement.paragraphe.value))
        && ((item.rub || '').toString().startsWith(formREngagement.rubrique.value))
      })
      setFilteredEngagements(results);
    }

    if (fieldName === 'paragraphe') {
      const results = engagements.filter(item => {
        return ((item.numeroBordTransmis || '').toString().startsWith(formREngagement.numeroBordTransmis.value))
        && ((item.chap || '').toString().startsWith(formREngagement.chapitre.value))
        && ((item.art || '').toString().startsWith(formREngagement.article.value))
        && ((item.parag || '').toString().startsWith(fieldValue))
        && ((item.rub || '').toString().startsWith(formREngagement.rubrique.value))
      })
      setFilteredEngagements(results);
    }

    if (fieldName === 'rubrique') {
      const results = engagements.filter(item => {
        return ((item.numeroBordTransmis || '').toString().startsWith(formREngagement.numeroBordTransmis.value))
        && ((item.chap || '').toString().startsWith(formREngagement.chapitre.value))
        && ((item.art || '').toString().startsWith(formREngagement.article.value))
        && ((item.parag || '').toString().startsWith(formREngagement.paragraphe.value))
        && ((item.rub || '').toString().startsWith(fieldValue))
      })
      setFilteredEngagements(results);
    }
  }
  ///////////////// GESTION RECHERCHE ENGAGEMENT

  ///////////////// GESTION VALIDER OU REJETER ENGAGEMENT
  const handleValiderEngagementButtonClick = () => {
    if (engagementsAValiderOuRejeter.length !== 0) {

      let infosPourValiderOuRejeterEngagement: InfosPourValiderOuRejeterEngagement = emptyInfosPourValiderOuRejeterEngagement;
      infosPourValiderOuRejeterEngagement.idEngActions = engagementsAValiderOuRejeter;
      infosPourValiderOuRejeterEngagement.date = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
      infosPourValiderOuRejeterEngagement.idUser = utilisateurCourante;   

      EngagementService.validerOuRejeter(infosPourValiderOuRejeterEngagement).then(res => {
        if (res) {
        setEngagementsAValiderOuRejeter([]);
        getEngagements("N");
        okSuccessDialog("Engagments validé(s) ou réjeté(s) avec succès !");
        setDisableValiderOuRejetterEngagment(true);
        }
      })
    } else {
      okWarnignDialog("Veuillez selectionner les engagements à valider ou rejeter !")
    }
  }
  ///////////////// GESTION VALIDER OU REJETER ENGAGEMENT

  //////////////// MESSAGE AFFICHER QUAND IL NY A PAS DE DONNEES
  const NoRowsOverlay = () => {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        Aucun enregistrement à afficher !
      </Stack>
    );
  }
  //////////////// MESSAGE AFFICHER QUAND IL NY A PAS DE DONNEES

  return (
    <Container>
          <div className="mt-1 p-1">
            <h6 className="shadow-sm text-primary text-center rounded">ENGAGEMENTS &gt; VALIDATION / REJET DE PROJET D'ENGAGEMENT</h6>
            <Form>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <Form.Group as={Row}>
                    <InputGroup as={Col}>
                      <Form.Control name='' size='sm' value={"Bordereau No :"} type="text" className='me-1' disabled />
                      <Form.Control name='' size='sm' value={gestionCourante} type="text" className='me-1' style={{minWidth:"50px", maxWidth:"50px"}} disabled />
                      <Form.Control name='numeroBordTransmis' value={formREngagement.numeroBordTransmis.value} size='sm' type="number" onChange={e => handleInputChangeFormREngagement(e)} className='me-2' style={{minWidth:"65px", maxWidth:"65px"}} />
                      <Form.Control name='chapitre' value={formREngagement.chapitre.value} size='sm' type="number" placeholder='chapitre' onChange={e => handleInputChangeFormREngagement(e)} className='me-1' style={{minWidth:"80px", maxWidth:"80px"}} />
                      <Form.Control name='article' value={formREngagement.article.value} size='sm' type="number" placeholder='article' onChange={e => handleInputChangeFormREngagement(e)} className='me-1' style={{minWidth:"80px", maxWidth:"80px"}} />
                      <Form.Control name='paragraphe' value={formREngagement.paragraphe.value} size='sm' type="number" placeholder='paragraphe' onChange={e => handleInputChangeFormREngagement(e)} className='me-1' style={{minWidth:"80px", maxWidth:"80px"}} />
                      <Form.Control name='rubrique' value={formREngagement.rubrique.value} size='sm' type="number" placeholder='rubrique' onChange={e => handleInputChangeFormREngagement(e)} className='me-1' style={{minWidth:"80px", maxWidth:"80px"}} />
                    </InputGroup>
                    <ButtonGroup as={Col} xs={1} size="sm" className='justify-content-end'>
                      <Button variant="outline-primary" title="Valider/Rejeter les engagements sélectionné(s)" className='me-1' style={{maxWidth:"65px", maxHeight:"30px"}} onClick={ () => handleValiderEngagementButtonClick()} disabled={disableValiderOuRejetterEngagment}><SaveRoundedIcon /></Button>
                    </ButtonGroup>
                  </Form.Group>
                </Card.Body>
              </Card>
              <Card className="">
                <Card.Body className='p-1' style={{height: "400px"}}>
                  <DataGrid
                      rows={filteredEngagements}
                      loading={loaderEngagements}
                      getRowId={(row) => row.numBe}
                      columns={tableEngagementColumns}
                      columnHeaderHeight={50}
                      hideFooter={true}
                      rowHeight={25}
                      disableRowSelectionOnClick={true}
                      processRowUpdate={processRowUpdate}
                      onProcessRowUpdateError={handleProcessRowUpdateError}
                      slots={{
                        toolbar: EditToolbar,
                        noRowsOverlay: NoRowsOverlay,
                      }}
                      sx={{
                        '& .header': {
                          backgroundColor: '#dc3545',
                          marginTop:'2px',
                        },
                        '& .super-app-theme--cell1': {
                          backgroundColor: '#ffcccb',
                        },
                        '& .super-app-theme--cell2': {
                          backgroundColor: '#90EE90',
                        },
                      }}
                    />
                </Card.Body>  
                <Card.Footer className="text-danger text-center">NB : Pour les rejets, le motif est obligatoire</Card.Footer>                      
              </Card>
            </Form>
          </div>
      </Container>
  );
};

export default EngagementsValiderRejeterProjetDEngagementForm;
