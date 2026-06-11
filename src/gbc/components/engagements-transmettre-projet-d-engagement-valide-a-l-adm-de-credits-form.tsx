import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef, GridRowSelectionModel, GridValueFormatterParams } from '@mui/x-data-grid';
import { ConnectedUser, Gestion, IdBudget } from '../helpers/session-storage';
import Stack from '@mui/material/Stack';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import { BordTransmisRequestDto, BordTransmisResponseDto, emptyBordTransmisRequestDto } from '../models/bord-transmis';
import AccesCodeService from '../services/accesCodeService';
import AccesCodeDto, { emptyAccesCodeDto } from '../models/accesCodeDto';
import BordTransmisService from '../services/bord-transmis-service';
import Swal from 'sweetalert2';
import { removeNonNumeric } from '../../helpers/format';
import { okWarnignDialog } from '../../helpers/dialogs';
import { emptyIdEngsCodBord, IdEngsCodBord } from '../models/id-engs-cod-bord';
import EngagementService from '../services/engagement-service';
import EngagementViewService from '../services/engagement-view-service';

// CRITERES DE RECHERCHE ENGAGEMENT
type FormREngagement = {
  numeroBordTransmis: Field,
  chapitre: Field,
  article: Field,
  paragraphe: Field,
  rubrique: Field
}

const EngagementsTransmettreProjetDEngagementValideALAdmDeCreditsForm: FunctionComponent = () => {

  const [gestionCourante] = useState<string>(Gestion() ?? '');
  const [idBudget] = useState<string>(IdBudget() ?? '');
  const [utilisateurCourante] = useState<string>(ConnectedUser() ?? '');
  const [disableValiderEngagment, setDisableValiderEngagment] = useState<boolean>(true);

  ///////////////// GESTION ENGAGEMENTS A VALIDER
  const [engagements, setEngagements] = useState<any[]>([]);
  const [filteredEngagements, setFilteredEngagements] = useState<any[]>([]);
  const [loaderEngagements, setLoaderEngagements] = useState<boolean>(true);
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const tableEngagementColumns: GridColDef[] = [
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
      field: 'proced',
      headerName: 'Procédure',
      type: 'string',
      width: 100,
      align: "center",
      headerClassName: 'header',
      headerAlign: 'center'
    },
    {
      field: 'nom',
      headerName: 'Fournisseur / Bénéficiaire',
      type: 'string',
      width: 430,
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
  ];

  useEffect(() => {
    getEngagements()
    getAccesCodeCourante();
  }, [])
  
  const getEngagements = () => {
    EngagementViewService.getEngagementValideAE2EtNonTransmis(Number(gestionCourante), Number(idBudget)).then(data => {
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

  ///////////////// GESTION EDITER BORDEREAU ENGAGEMENT
  const [accesCodeCourante, setAccesCodeCourante] = useState<AccesCodeDto>(emptyAccesCodeDto);
  
  const handleEditerBordereauEngagementButtonClick = () => {
    let ids : number[] = [];
    selectedRowIds.forEach(id => {
      ids.push(Number(id.valueOf()));
    });

    let bordTransmisRequestDto: BordTransmisRequestDto = emptyBordTransmisRequestDto;
    bordTransmisRequestDto.gestion = gestionCourante;
    bordTransmisRequestDto.dossier = "E2";
    bordTransmisRequestDto.expeditaire = accesCodeCourante.code.trim();
    bordTransmisRequestDto.idLogin = utilisateurCourante;
    bordTransmisRequestDto.dateReception = null;
    bordTransmisRequestDto.idLoginRecep = null;
    bordTransmisRequestDto.identiteRecept = null;
    bordTransmisRequestDto.idBudget = idBudget;
    bordTransmisRequestDto.numBesBordTransEng = ids;
    bordTransmisRequestDto.numMandsBordTransMand = [];
    bordTransmisRequestDto.numMandsBordTransLiq = [];
    bordTransmisRequestDto.idMotifs = [];

    BordTransmisService.add(bordTransmisRequestDto).then(data => {
      let idEngsCodBord: IdEngsCodBord = emptyIdEngsCodBord;
      idEngsCodBord.ids = ids;
      idEngsCodBord.codBord = data.codBord;
      EngagementService.transmettre(idEngsCodBord).then(res => {
        if (res) {
          setSelectedRowIds([])
          getEngagements();
          getBordTransmis();
          Swal.fire({
            title: 'GesBud',
            text: "Engagments transmis avec succès !",
            icon: 'success',
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            confirmButtonColor: '#007E33' 
          }).then( (result) => {
            if (result.isConfirmed) {
              // IMPRIMER BORDEREAU DE TRANSMISSION DE PROJETS D'ENGAGEMENT VALIDES A E2
              
            }
          });
        }
      })
    });
  }

  useEffect(() => {
    if (selectedRowIds.length !== 0) setDisableValiderEngagment(false); else setDisableValiderEngagment(true);
  }, [selectedRowIds])

  useEffect(() => {
    getAccesCodeCourante()
  }, [])

  const getAccesCodeCourante = () => {
    AccesCodeService.get(ConnectedUser()).then( data => {
      setAccesCodeCourante(data)
    });
  }
  ///////////////// GESTION EDITER BORDEREAU ENGAGEMENT

  ///////////////// GESTION REEDITER BORDEREAU ENGAGEMENT
  const [bordTransmis, setBordTransmis] = useState<BordTransmisResponseDto[]>([]);
  const [numero, setNumero] = useState<string>("");

  const handleInputChangeNumero = (e: any): void => {
    setNumero(removeNonNumeric(e.target.value))
  }

  useEffect(() => {
    if (accesCodeCourante.code !== null) getBordTransmis();
  }, [accesCodeCourante.code])

  const getBordTransmis = () => {
    BordTransmisService.getByGestionAndIdBudgetAndExpeditaire(Number(gestionCourante), Number(idBudget), accesCodeCourante.code.trim()).then( data => {
      if (data.length !== 0) setNumero(data[0].numero);
      setBordTransmis(data);
    });
  }

  const handleReediterBordereauEngagementButtonClick = () => {
    const result = bordTransmis.find((item) => item.numero === Number(numero));
    if (result) {
        // IMPRIMER BORDEREAU DE TRANSMISSION DE PROJETS D'ENGAGEMENT VALIDES : numero, codBord
        
    } else {
      okWarnignDialog("Ce numero ne corresond à aucun bordereau !")
    }
  }
  ///////////////// GESTION REEDITER BORDEREAU ENGAGEMENT

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
            <h6 className="shadow-sm text-primary text-center rounded">ENGAGEMENTS &gt; EDITION DE BORDEREAU DE TRANSMISSION DE PROJETS D'ENGAGEMENTS VALIDES</h6>
            <Form>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <Card.Subtitle>Nouvelle édition</Card.Subtitle>
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
                      <Button variant="outline-primary" title="Editer bordereau des engagements sélectionnés" className='me-1' style={{maxWidth:"65px", maxHeight:"30px"}} onClick={ () => handleEditerBordereauEngagementButtonClick()} disabled={disableValiderEngagment}><LocalPrintshopIcon /></Button>
                    </ButtonGroup>
                  </Form.Group>
                </Card.Body>
              </Card>
              <Card className="mb-4">
                <Card.Body className='p-1' style={{height: "350px"}}>
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
              <Card>
                <Card.Body className='p-1'>
                  <Card.Subtitle>Réedition</Card.Subtitle>
                  <Form.Group as={Row}>
                    <InputGroup as={Col}>
                      <Form.Control name='' size='sm' value={"Bordereau No :"} type="text" className='me-1' disabled />
                      <Form.Control name='' size='sm' value={gestionCourante} type="text" className='me-1' style={{minWidth:"50px", maxWidth:"50px", fontWeight:'bold'}} disabled />
                      <Form.Control name='numero' value={numero} size='sm' type="text" onChange={e => handleInputChangeNumero(e)} className='' style={{minWidth:"65px", maxWidth:"65px", fontWeight:'bold'}} />
                      <Form.Select name='numero' value={numero} size='sm' aria-label="Default select example" onChange={e => handleInputChangeNumero(e)} style={{minWidth:"1px", maxWidth:"1px", fontWeight:'bold'}}>
                        {
                          bordTransmis.map( bt => (
                          <option key={bt.codBord} value={bt.numero}>{bt.numero}</option>
                          ))
                        }
                      </Form.Select>
                    </InputGroup>
                    <ButtonGroup as={Col} xs={1} size="sm" className='justify-content-end'>
                      <Button variant="outline-primary" title="Réediter le bordereau sélectionné" className='me-1' style={{maxWidth:"65px", maxHeight:"30px"}} onClick={ () => handleReediterBordereauEngagementButtonClick()}><LocalPrintshopOutlinedIcon /></Button>
                    </ButtonGroup>
                  </Form.Group>
                </Card.Body>
              </Card>
            </Form>
          </div>
      </Container>
  );
};

export default EngagementsTransmettreProjetDEngagementValideALAdmDeCreditsForm;
