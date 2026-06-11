import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef, GridRowSelectionModel, GridValueFormatterParams } from '@mui/x-data-grid';
import { ConnectedUser, Gestion, IdBudget } from '../helpers/session-storage';
import Stack from '@mui/material/Stack';
import EngagementService from '../services/engagement-service';
import { okSuccessDialog } from '../../helpers/dialogs';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { formatDateWithHoursAndMinutes } from '../../helpers/format-date';
import GestionService from '../services/gestion-service';
import { emptyInfosPourRetrograderEngagement, InfosPourRetrograderrEngagement } from '../models/infos-pour-retrograder-engagement';
import EngagementViewService from '../services/engagement-view-service';

// CRITERES DE RECHERCHE ENGAGEMENT
type FormREngagement = {
  numeroBordTransmis: Field,
  chapitre: Field,
  article: Field,
  paragraphe: Field,
  rubrique: Field
}

const ExceptionsRetrograderUnEngagementForm: FunctionComponent = () => {

  const [gestionCourante] = useState<string>(Gestion() ?? '');
  const [idBudget] = useState<string>(IdBudget() ?? '');
  const [utilisateurCourante] = useState<string>(ConnectedUser() ?? '');
  const [isGestionClose, setIsGestionClose] = useState<boolean>(false);
  const dateEnregistrementPourGestionClose: Date = new Date(gestionCourante + '-12-31');    
  const [disableValiderEngagment, setDisableValiderEngagment] = useState<boolean>(true);

  useEffect(() => {
    // Recuperere la derniere gestion actif : si la gestion en cours est strictement inférieur à la dernier gestion actif alors elle est close :
    GestionService.getLastByEtat("ACTIF").then(data => {
      if ( Number(gestionCourante) < Number(data.courante)) setIsGestionClose(true); else setIsGestionClose(false)   
    }) 
  }, [])   

  ///////////////// GESTION ENGAGEMENTS A VALIDER
  const [engagements, setEngagements] = useState<any[]>([]);
  const [filteredEngagements, setFilteredEngagements] = useState<any[]>([]);
  const [loaderEngagements, setLoaderEngagements] = useState<boolean>(true);
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

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
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      width: 100,
      headerClassName: 'header',
    },
    {
      field: 'motifs',
      headerName: 'Motif de rejet',
      type: 'string',
      width: 180,
      headerClassName: 'header',
      headerAlign: 'center'
    },
  ];

  useEffect(() => {
    getEngagements()
  }, [])
  
  const getEngagements = () => {
    EngagementViewService.getEngagementRetrogradables(Number(gestionCourante), Number(idBudget), utilisateurCourante).then(data => {
      setEngagements(data) 
      setFilteredEngagements(data)
      setLoaderEngagements(false)
    })
  }
  ///////////////// GESTION ENGAGEMENTS A VILIDER

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

  ///////////////// GESTION VALIDER ENGAGEMENT
  const handleValiderEngagementButtonClick = () => {
    let ids : number[] = [];
    selectedRowIds.forEach(id => {
      ids.push(Number(id.valueOf()));
    });

    let infosPourRetrograderrEngagement: InfosPourRetrograderrEngagement = emptyInfosPourRetrograderEngagement;
    infosPourRetrograderrEngagement.ids = ids;
    infosPourRetrograderrEngagement.date = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
    infosPourRetrograderrEngagement.idUser = utilisateurCourante;     

    EngagementService.retrograder(infosPourRetrograderrEngagement).then(res => {
      if (res) {
        setSelectedRowIds([]);
        getEngagements();
        okSuccessDialog("Engagments retrogradé(s) avec succès !");
      }
    })
  }

  useEffect(() => {
    if (selectedRowIds.length !== 0) setDisableValiderEngagment(false); else setDisableValiderEngagment(true);
  }, [selectedRowIds])
  ///////////////// GESTION VALIDER ENGAGEMENT

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
            <h6 className="shadow-sm text-primary text-center rounded">EXCEPTIONS &gt; RETROGRATION DE PROJET D'ENGAGEMENT</h6>
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
                      <Button variant="outline-primary" title="Retrograder les engagements sélectionnés" className='me-1' style={{maxWidth:"65px", maxHeight:"30px"}} onClick={ () => handleValiderEngagementButtonClick()} disabled={disableValiderEngagment}><SaveRoundedIcon /></Button>
                    </ButtonGroup>
                  </Form.Group>
                </Card.Body>
              </Card>
              <Card className="">
                <Card.Body className='p-1' style={{height: "450px"}}>
                  <DataGrid
                      rows={filteredEngagements}
                      loading={loaderEngagements}
                      getRowId={(row) => row.numBe}
                      columns={tableEngagementColumns}
                      columnHeaderHeight={50}
                      hideFooter={true}
                      rowHeight={25}
                      checkboxSelection
                      keepNonExistentRowsSelected
                      disableRowSelectionOnClick={true}
                      rowSelectionModel={selectedRowIds}
                      onRowSelectionModelChange={(ids) => {
                        setSelectedRowIds(ids)
                      }}
                      slots={{
                        noRowsOverlay: NoRowsOverlay,
                      }}
                      sx={{
                        '& .header': {
                          backgroundColor: '#dc3545',
                          marginTop:'2px',
                        }
                      }}
                    />
                </Card.Body>                        
              </Card>
            </Form>
          </div>
      </Container>
  );
};

export default ExceptionsRetrograderUnEngagementForm;
