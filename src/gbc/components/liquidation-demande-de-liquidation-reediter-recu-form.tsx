import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import DataTable  from 'react-data-table-component'; 
import { costumeStyles } from '../../helpers/costume-styles';
import { BsArrowDownCircleFill, BsPlusLg, BsTrash } from 'react-icons/bs';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams, GridToolbarContainer } from '@mui/x-data-grid';
import { ConnectedUser, Gestion, IdBudget } from '../helpers/session-storage';
import Stack from '@mui/material/Stack';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import { PJPourEngagement } from '../models/pj-pour-engagment';
import PieceJustifService from '../services/piece-justif-service';
import { formatDateWithHoursAndMinutes } from '../../helpers/format-date';
import LiquidationViewService from '../services/liquidation-view-service';

// FORUMULAIRE RECU DE DEMANDE DE LIQUIDATION
type FormReçuDemandeDeLiquidation = {
  numBe: Field,
  benum: Field,
  dateCreation: Field,
  codBud: Field,
  montantEngagement: Field,
  dejaLiquideEngagement: Field;
  resteALiquiderEngagement: Field,
  natDepense: Field,
  idContrat: Field,
  montantContrat: Field,
  engageValidContrat: Field,
  mandateValidContrat: Field,
  referenceContrat: Field,
  dateSaisieContrat: Field,
  idFourn: Field,
  ifuMle: Field,
  nom: Field,
  gestion: Field,
  numBl: Field,
  dateLiq: Field,
  montant: Field,
  nombrePj: Field
}

// CRITERES DE RECHERCHE RDL
type FormRRdl = {
  nom: Field,
}

const LiquidationDemandeDeLiquidationReediterRecuForm: FunctionComponent = () => {

  const [gestionCourante] = useState<string>(Gestion() ?? '');
  const [idBudget] = useState<string>(IdBudget() ?? '');
  const [utilisateurCourante] = useState<string>(ConnectedUser() ?? '');
  const [disableEditerLeReçu, setDisableEditerLeReçu] = useState<boolean>(true);
  
  ///////////////// GESTION RECU DE DEMANDE DE LIQUIDATION
  const [formReçuDemandeDeLiquidation, setFormReçuDemandeDeLiquidation] = useState<FormReçuDemandeDeLiquidation>({
    numBe: { value: '' },
    benum: { value: '' },
    dateCreation: { value: '' },
    codBud: { value: '' },
    montantEngagement: { value: 0},
    dejaLiquideEngagement: { value: 0},
    resteALiquiderEngagement: { value: 0},
    natDepense: { value: '' },
    idContrat: { value: '' },
    montantContrat: { value: 0 },
    engageValidContrat: { value: 0 },
    mandateValidContrat: { value: 0 },
    referenceContrat: { value: '' },
    dateSaisieContrat: { value: '' },
    idFourn: { value: '' },
    ifuMle: { value: '' },
    nom: { value: '' },
    gestion: { value: '' },
    numBl: { value: '' },
    dateLiq: { value: '' },
    montant: { value: '' },
    nombrePj: { value: 0 },
  })

  const initFormReçuDemandeDeLiquidation = () => {
    setFormReçuDemandeDeLiquidation({
      numBe: { value: '' },
      benum: { value: '' },
      dateCreation: { value: '' },
      codBud: { value: '' },
      montantEngagement: { value: 0},
      dejaLiquideEngagement: { value: 0},
      resteALiquiderEngagement: { value: 0},
      natDepense: { value: '' },
      idContrat: { value: '' },
      montantContrat: { value: 0 },
      engageValidContrat: { value: 0 },
      mandateValidContrat: { value: 0 },
      referenceContrat: { value: '' },
      dateSaisieContrat: { value: '' },
      idFourn: { value: '' },
      ifuMle: { value: '' },
      nom: { value: '' },
      gestion: { value: '' },
      numBl: { value: '' },
      dateLiq: { value: '' },
      montant: { value: '' },
      nombrePj: { value: 0 },
    });
    setPjSelectionnees([])
    setNumBlPourRechercherRdl('');

    setDisableEditerLeReçu(true);
  }
  ///////////////// GESTION RECU DE DEMANDE DE LIQUIDATION

  ///////////////// GESTION RECHERCHE RECU DE DEMANDE DE LIQUIDATION
  const [rdls, setRdls] = useState<any[]>([]);
  const [filteredRdls, setFilteredRdls] = useState<any[]>([]);
  const [showModalSelectionnerRdl, setShowModalSelectionnerRdl] = useState(false);
  const [numBlPourRechercherRdl, setNumBlPourRechercherRdl] = useState<string>('');

  const tableRdlColumns = [
    {
      name: "Date",
      selector: (row: any) => new Date(row.dateLiq).toLocaleDateString(),
      width: "100px",
      center: true,
    },
    {
      name: "Numero",
      selector: (row: any) => row.numeroDemande,
      width: "100px",
      center: true
    },
    {
      name: "Bénéficiaire",
      selector: (row: any) => row.nom,
      width: "200px",
      wrap: true
    },
    {
      name: "Objet",
      selector: (row: any) => row.objet,
      wrap: true
    },
    {
      name: "Montant",
      selector: (row: any) => Number(row.montant).toLocaleString(),
      width: "110px",
      right: true,
    }
  ]

  const handleNumBlRechercherRdlInputChange = (e: any): void => {
    setNumBlPourRechercherRdl(e.target.value.toLowerCase());
  }

  const [formRRdl, setFormRRdl] = useState<FormRRdl>({
    nom: { value: ''},
  })

  const handleInputChangeFormRRDL = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormRRdl({ ...formRRdl, ...newField})
  }

  useEffect( () => {
    const results = rdls.filter(item => {
      return ((item.nom || '').toString().toLowerCase().includes(formRRdl.nom.value.toString().toLowerCase()))
    })
    setFilteredRdls(results);
  }, [formRRdl])  

  const getRdls = () => {
    LiquidationViewService.getByGestionAndIdBudgetOrderByNumBlDesc(Number(gestionCourante), Number(idBudget)).then(data => {
      setRdls(data) 
      if (formRRdl.nom.value !== "") {
        const results = rdls.filter(item => {
          return ((item.nom || '').toString().toLowerCase().includes(formRRdl.nom.value.toString().toLowerCase()))
        })
        setFilteredRdls(results);
      } else {
        setFilteredRdls(data)
      }
    })
  }
  
  const handleCloseModalSelectionnerRdl = () => {
    setShowModalSelectionnerRdl(false);
  }

  const handleShowModalSelectionnerRdl = () => {
    getRdls();
    setShowModalSelectionnerRdl(true);
  }
  
  const rechercherAfficherRdl = (numBl: number) => {
    LiquidationViewService.getByGestionAndIdBudgetOrderByNumBlDesc(Number(gestionCourante), Number(idBudget)).then(data => {
      const result = data.filter(item => {
        return (item.numBl === numBl)
      })

      if (result.length !== 0) {
        setDisableEditerLeReçu(false);

        setFormReçuDemandeDeLiquidation({
          numBe: { value: result[0].numBe },
          benum: { value: result[0].benum },
          dateCreation: { value: result[0].dateCreationEng },
          codBud: { value: result[0].codBud },
          montantEngagement: { value: result[0].montantEng},
          dejaLiquideEngagement: { value: result[0].dejaLiquideEng },
          resteALiquiderEngagement: { value: result[0].resteALiquiderEng },
          natDepense: { value: result[0].objet },
          idContrat: { value: result[0].idContrat },
          montantContrat: { value: result[0].montantContrat },
          engageValidContrat: { value: result[0].engageValidContrat },
          mandateValidContrat: { value: result[0].mandateValidContrat },
          referenceContrat: { value: result[0].referenceContrat },
          dateSaisieContrat: { value: result[0].dateSaisieContrat },
          idFourn: { value: result[0].idFourn },
          ifuMle: { value: result[0].ifumle },
          nom: { value: result[0].nom },
          gestion: { value: result[0].gestion },
          numBl: { value: result[0].numBl  },
          dateLiq: { value: result[0].dateLiq },
          montant: { value: result[0].montant.toLocaleString() },
          nombrePj: { value: 0 },
        });

        // RECUPERATION DES PIECES JUSTIFICATIVES
        getPjSelectionnees(result[0].codLiq);
  
      } else {
        initFormReçuDemandeDeLiquidation();
      }
    });
  }  

  const handleRechercheButtonClick = () => {
    if (numBlPourRechercherRdl === "") {
      handleShowModalSelectionnerRdl();
    } else {
      rechercherAfficherRdl(Number(numBlPourRechercherRdl));
    }
  } 
  ///////////////// GESTION RECHERCHE RECU DE DEMANDE DE LIQUIDATION

  ///////////////// GESTION EDITER RECU
  const handleEditerLeReçuButtonClick = () => {
    
  }
  ///////////////// GESTION EDITER RECU

  ///////////////// GESTION PIECES JUSTIFICATIVES SELECTIONNEES POUR LE RDL
  const [pjSelectionnees, setPjSelectionnees] = useState<PJPourEngagement[]>([]);

  const tablePjSelectionneesColumns: GridColDef[] = [
    {
      field: 'pj',
      headerName: 'Piece justificative',
      type: 'string',
      width: 350,
      headerClassName: 'header',
    },
    {
      field: 'numero',
      headerName: 'Numero',
      type: 'string',
      width: 200,
      headerClassName: 'header',
    },
    {
      field: 'date',
      headerName: 'Date',
      type: 'date',
      width: 100,
      headerClassName: 'header',
    },
    {
      field: 'montant',
      headerName: 'Montant',
      type: 'number',
      width: 150,
      headerClassName: 'header',
    },
    {
      field: 'actions',
      headerName: '',
      type: 'actions',
      width: 100,
      cellClassName: 'actions',
      getActions: (params: GridRowParams) => {
        return [
          <GridActionsCellItem sx={{ mr: 0 }}
            icon={<Button variant="outline-primary" size="sm" title="PJ" disabled={true}>PJ</Button>}
            label="PJ"
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<Button variant="outline-danger" size="sm" title="Supprimer" disabled={true}><BsTrash /></Button>}
            label="Delete"
            color="inherit"
          />,
        ];
      },
      headerClassName: 'header',
    } 
  ];

  function EditToolbar() {
    return (
      <GridToolbarContainer>
        <ButtonGroup size="sm">
          <Button size='sm' variant="outline-success" title="Ajouter une pièce justificative" className='me-1' style={{width: "100px"}} disabled><BsPlusLg /></Button>
          <Button size='sm' variant="outline-success" title="Rappel pieces justificatifives" disabled>Rappel Pieces Justificatifives</Button>
        </ButtonGroup>
      </GridToolbarContainer>
    );
  }

  const getPjSelectionnees = (codLiq: number) => {
    PieceJustifService.getByCodLiqOrderByPieceJustificative(codLiq).then(data => {
      let pieceJustifs: PJPourEngagement[] = [];
      data.forEach(item => {
        pieceJustifs.push({
          identifiant: pieceJustifs.length+1,
          pj: item.pieceJustificative,
          numero: item.numero,
          date: (item.datePj !== null)? new Date(item.datePj) : null,
          montant: item.montant,
          codLiq: item.codLiq
        });
      });
      setPjSelectionnees(pieceJustifs);
    })
  } 
  ///////////////// GESTION PIECES JUSTIFICATIVES SELECTIONNEES POUR LE RDL

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
            <h6 className="shadow-sm text-primary text-center rounded">LIQUIDATION &gt; DEMANDE DE LIQUIDATION &gt; REEDTION DE RE&Ccedil;U DE DEMANDE DE LIQUIDATION</h6>
            <Form>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <Form.Group as={Row}>
                    <InputGroup as={Col}>
                      <Form.Control name='' size='sm' value={"Référence Reçu :"} type="text" className='me-1' disabled />
                      <Form.Control name='' size='sm' value={gestionCourante} type="text" className='me-1' style={{maxWidth:"50px", maxHeight:"30px"}} disabled />
                      <Form.Control name='' size='sm'  value={String(formReçuDemandeDeLiquidation.numBl.value).padStart(4, '0')} type="text" className='me-1' style={{maxWidth:"50px", maxHeight:"30px"}} disabled />
                      <Form.Control name='' size='sm' value={numBlPourRechercherRdl} type="text" onChange={e => handleNumBlRechercherRdlInputChange(e)} style={{maxWidth:"50px", maxHeight:"30px"}} />
                      <Button variant="outline-warning" size='sm' title="Lancer la recherche" style={{maxHeight:"31px"}} onClick={ () => handleRechercheButtonClick()}><QuestionMarkOutlinedIcon /></Button>
                    </InputGroup>
                    <Col xs={5}>
                      <Form.Group controlId="" as={Row}>
                        <Col xs={5}><Form.Label className="label2">Date de réception :</Form.Label></Col>
                        <Col><Form.Control name='' size='sm' value={(formReçuDemandeDeLiquidation.dateLiq.value === "") ? "": formatDateWithHoursAndMinutes(new Date(formReçuDemandeDeLiquidation.dateLiq.value))} type="text" disabled /></Col>
                      </Form.Group>
                    </Col>
                    <ButtonGroup as={Col} xs={2} size="sm" className='justify-content-end'>
                      <Button variant="outline-primary" title="Editer le réçu" className='me-1' style={{maxWidth:"65px", maxHeight:"30px"}} onClick={ () => handleEditerLeReçuButtonClick()} disabled={disableEditerLeReçu}><LocalPrintshopIcon /></Button>
                    </ButtonGroup>
                  </Form.Group>
                </Card.Body>
              </Card>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <div>
                    <Row className="">
                      <Col>
                        <Card>
                          <Card.Body className='p-1'>
                            <Card.Title style={{fontSize:"0.8em", marginBottom:"0px"}}>Engagement<Button variant="outline-primary" title="Cliquez pour sélectionner un engagement" size="sm" style={{width:"30px", height:"30px"}} disabled><BsArrowDownCircleFill /></Button></Card.Title>
                              <tr style={{fontSize:"0.75em"}}>Numero {formReçuDemandeDeLiquidation.numBe.value && gestionCourante + "-" + String(formReçuDemandeDeLiquidation.benum.value).padStart(4, '0')} du { formReçuDemandeDeLiquidation.dateCreation.value && formatDateWithHoursAndMinutes(new Date(formReçuDemandeDeLiquidation.dateCreation.value))}</tr>
                              <Table responsive striped bordered hover variant="" size="sm" style={{marginBottom:"0px"}}>
                                <thead>
                                  <tr>
                                    <th style={{width:"40px"}}>Montant</th>
                                    <th style={{width:"40px"}}>Reste à liquider</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr style={{fontWeight:"bold", fontSize:"1.1em"}} className='text-center'>
                                    <td>{formReçuDemandeDeLiquidation.montantEngagement.value.toLocaleString()}</td>
                                    <td>{formReçuDemandeDeLiquidation.resteALiquiderEngagement.value.toLocaleString()}</td>
                                  </tr>
                                </tbody>
                              </Table>
                          </Card.Body>                        
                        </Card>
                      </Col>
                      <Col>
                        <Card>
                          <Card.Body className='p-1'>
                            <Card.Title style={{fontSize:"0.8em", marginBottom:"0px"}}>Contrat<Button variant="outline-primary" title="Cliquez pour sélectionner le contrat" size="sm" style={{width:"30px", height:"30px"}} disabled><BsArrowDownCircleFill /></Button></Card.Title>
                              <tr style={{fontSize:"0.75em"}}>Marché N° {formReçuDemandeDeLiquidation.referenceContrat.value} du { formReçuDemandeDeLiquidation.dateSaisieContrat.value && new Date(formReçuDemandeDeLiquidation.dateSaisieContrat.value).toLocaleDateString()}</tr>
                              <Table responsive striped bordered hover variant="" size="sm" style={{marginBottom:"0px"}}>
                                <thead>
                                  <tr>
                                    <th style={{width:"40px"}}>Montant</th>
                                    <th style={{width:"40px"}}>Engagés</th>
                                    <th style={{width:"40px"}}>Déja liquidé</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr style={{fontWeight:"bold", fontSize:"1.1em"}} className='text-center'>
                                    <td>{(formReçuDemandeDeLiquidation.montantContrat.value !== null)? formReçuDemandeDeLiquidation.montantContrat.value.toLocaleString() : 0}</td>
                                    <td>{(formReçuDemandeDeLiquidation.engageValidContrat.value !== null)? formReçuDemandeDeLiquidation.engageValidContrat.value.toLocaleString() : 0}</td>
                                    <td>{(formReçuDemandeDeLiquidation.mandateValidContrat.value !== null)? formReçuDemandeDeLiquidation.mandateValidContrat.value.toLocaleString() : 0}</td>
                                  </tr>
                                </tbody>
                              </Table>
                          </Card.Body>                        
                        </Card>
                      </Col>
                    </Row>
                  </div>
                  <hr></hr>
                  <div>
                    <Row className="mb-1">
                      <Col>
                        <Card>
                          <Card.Body className='p-1'>
                            <Card.Title style={{fontSize:"0.8em", marginBottom:"1px"}}>
                              Fournisseur<Button variant="outline-primary" title="Cliquez pour sélectionner le fournisseur" size="sm" style={{width:"30px", height:"30px"}} disabled><BsArrowDownCircleFill /></Button>
                            </Card.Title>
                            <Table className='mb-4' responsive striped bordered hover variant="" size="sm">
                              <tbody>
                                <tr style={{fontWeight:"bold", fontSize:"1.1em"}} className='text-center'>
                                  <td style={{width:"100px",height:"29px"}}>{formReçuDemandeDeLiquidation.ifuMle.value}</td>
                                  <td style={{height:"29px"}}>{formReçuDemandeDeLiquidation.nom.value}</td>
                                </tr>
                              </tbody>
                            </Table>
                          </Card.Body>                        
                        </Card>
                      </Col>
                      <Col>
                        <Card>
                          <Card.Body className='p-1'>
                            <Col>
                              <Form.Group controlId="montant" as={Row} className='mb-1 label2'>
                                <Col xs={3}><Form.Label>Montant :</Form.Label></Col>
                                <Col><Form.Control name='montant' value={formReçuDemandeDeLiquidation.montant.value} size='sm' type="text" disabled /></Col>
                              </Form.Group>
                              <Form.Group controlId="natDepense" as={Row} className='label2'>
                                <Col xs={3}><Form.Label>Object :</Form.Label></Col>
                                <Col><Form.Control as="textarea" rows={2} name='natDepense' value={formReçuDemandeDeLiquidation.natDepense.value} title={formReçuDemandeDeLiquidation.natDepense.value} size='sm' disabled /></Col>
                              </Form.Group>
                            </Col>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>                        
              </Card>
              <Card>
                <Card.Body className='p-1' style={{height: "300px"}}>
                  <DataGrid
                      rows={pjSelectionnees}
                      getRowId={(row) => row.identifiant}
                      columns={tablePjSelectionneesColumns}
                      columnHeaderHeight={25}
                      hideFooter={true}
                      rowHeight={25}
                      disableRowSelectionOnClick={false}
                      slots={{
                        toolbar: EditToolbar,
                        noRowsOverlay: NoRowsOverlay,
                      }}
                      sx={{
                        '& .header': {
                          backgroundColor: '#fff',
                          marginTop:'2px',
                        },
                      }}
                    />
                </Card.Body>                        
              </Card>
            </Form>
          </div>

          {/* GESTION RECHERCHE RECU DE DEMANDE DE LIQUIDATION */}
          <Modal show={showModalSelectionnerRdl} onHide={handleCloseModalSelectionnerRdl} backdrop="static" keyboard={false} size="xl">
            <Modal.Header className='p-1'>
              <Modal.Title as="h6">Demande de liquidation { Number(gestionCourante)}</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2'>
              <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tableRdlColumns}
                    data={filteredRdls}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    fixedHeaderScrollHeight='450px'
                    highlightOnHover
                    responsive
                    striped
                    onRowClicked={ (row, e) => {
                      rechercherAfficherRdl(row.numBl);
                      handleCloseModalSelectionnerRdl();
                    }}
                    subHeader
                    subHeaderComponent={
                      <Form.Control name="nom" value={formRRdl.nom.value} size='sm' type="text" placeholder='Nom du bénéficiaire' className='w-25' onChange={e => handleInputChangeFormRRDL(e)}/>
                    }
                    />
                </Card.Body>
              </Card>
            </Modal.Body>

            <Modal.Footer className='p-1'>
              <Button variant="outline-danger" size='sm' onClick={handleCloseModalSelectionnerRdl}>Fermer</Button>
            </Modal.Footer>
          </Modal>           

      </Container>
  );
};

export default LiquidationDemandeDeLiquidationReediterRecuForm;
