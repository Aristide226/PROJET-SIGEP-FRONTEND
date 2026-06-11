import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import DataTable  from 'react-data-table-component'; 
import { costumeStyles } from '../../helpers/costume-styles';
import { BsPlusLg, BsTrash } from 'react-icons/bs';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams, GridToolbarContainer } from '@mui/x-data-grid';
import { ConnectedUser, Gestion, IdBudget } from '../helpers/session-storage';
import { PJPourEngagement } from '../models/pj-pour-engagment';
import PieceJustifService from '../services/piece-justif-service';
import { formatDateWithHoursAndMinutes } from '../../helpers/format-date';
import { addSepartor, removeNonNumeric } from '../../helpers/format';
import { Stack } from '@mui/material';
import EngagementEN01ViewService from '../services/engagement-en01-view-service';

// FORUMULAIRE ENGAGEMNT
type FormEng = {
  natDepense: Field,
  auProfit: Field,
  montant: Field,
  dotInitiale: Field,
  dispoAvant: Field,
  disponible: Field,
  dateEtat: Field,
  idUser: Field,
  avecDecision: Field,
  apartirDemandLiq: Field,
  apartirContrat: Field,
  grh: Field,
  receptionne: Field,
  dateValid: Field,
  dateCreat: Field,
  codLiq: Field,
  codBord: Field,
  idContrat: Field,
  idEngParent: Field,
  etat: Field,
  idEtatTrans: Field,
  proced: Field,
  codBud: Field,
  idBudget: Field,
  idFourn: Field,
  gestion: Field,
  numBe: Field,
  benum: Field,
  dateCreation: Field,
  chap: Field,
  art: Field,
  parag: Field,
	rub: Field,
  intitule: Field,
  dotationCorrigee: Field,
  totalEngag: Field,
  nbreEngag: Field,
  referenceContrat: Field,
  dateSaisieContrat: Field,
  montantContrat: Field,
  engageContrat: Field,
  resteAEngagerContrat: Field,
  ifuMle: Field,
  nom: Field,
  dejaLiquide: Field,
  resteALiquider: Field,
  montantNouveauEng: Field,
  dateCreationNouveauEng: Field,
  benumNouveauEng: Field,
  natDepenseNouveauEng: Field
}

// CRITERES DE RECHERCHE ENGAGEMENT
type FormREngagement = {
  benum: Field,
}

const EngagementsCorrectionMontantReediterUnBonDAnnulationForm: FunctionComponent = () => {

  const [gestionCourante] = useState<string>(Gestion() ?? '');
  const [idBudget] = useState<string>(IdBudget() ?? '');
  const [utilisateurCourante] = useState<string>(ConnectedUser() ?? '');
  const [disableEditerEngagment, setDisableEditerEngagment] = useState<boolean>(true);
  const [disableMontantNouveauEng, setDisableMontantNouveauEng] = useState<boolean>(true);
  const [disableNatDepenseNouveauEng, setDisableNatDepenseNouveauEng] = useState<boolean>(true);
  const [disableAjouterUnePieceJustificative, setDisableAjouterUnePieceJustificative] = useState<boolean>(true);


  ///////////////// GESTION ENGAGEMENT
  const [formEng, setFormEng] = useState<FormEng>({
    natDepense: { value: '' },
    auProfit: { value: 'F' },
    montant: { value: 0 },
    dotInitiale: { value: 0 },
    dispoAvant: { value: 0 },
    disponible: { value: 0 },
    dateEtat: { value: '' },
    idUser: { value: '' },
    avecDecision: { value: false },
    apartirDemandLiq: { value: false },
    apartirContrat: { value: false },
    grh: { value: false },
    receptionne: { value: false },
    dateValid: { value: '' },
    dateCreat: { value: '' },
    codLiq: { value: '' },
    codBord: { value: '' },
    idContrat: { value: '' },
    idEngParent: { value: '' },
    etat: { value: 'E0' },
    idEtatTrans: { value: 0 },
    proced: { value: '' },
    codBud: { value: '' },
    idBudget: { value: '' },
    idFourn: { value: '' },
    gestion: { value: '' },
    numBe: { value: '' },
    benum: { value: '' },
    dateCreation: { value: '' },
    chap: { value: '' },
    art: { value: '' },
    parag: { value: '' },
    rub: { value: '' },
    intitule: { value: '' },
    dotationCorrigee: { value: 0 },
    totalEngag: { value: 0 },
    nbreEngag: { value: 0 },
    referenceContrat: { value: '' },
    dateSaisieContrat: { value: '' },
    montantContrat: { value: 0 },
    engageContrat: { value: 0 },
    resteAEngagerContrat: { value: 0 },
    ifuMle: { value: '' },
    nom: { value: '' },
    dejaLiquide: { value: 0 },
    resteALiquider: { value: 0 },
    montantNouveauEng: { value: 0 },
    dateCreationNouveauEng: { value: '' },
    benumNouveauEng: { value: '' },
    natDepenseNouveauEng: { value: '' },
  })

  const initFormEng = () => {
    setFormEng({
      natDepense: { value: '' },
      auProfit: { value: 'F' },
      montant: { value: 0 },
      dotInitiale: { value: 0 },
      dispoAvant: { value: 0 },
      disponible: { value: 0 },
      dateEtat: { value: '' },
      idUser: { value: '' },
      avecDecision: { value: false },
      apartirDemandLiq: { value: false },
      apartirContrat: { value: false },
      grh: { value: false },
      receptionne: { value: false },
      dateValid: { value: '' },
      dateCreat: { value: '' },
      codLiq: { value: '' },
      codBord: { value: '' },
      idContrat: { value: '' },
      idEngParent: { value: '' },
      etat: { value: 'E0' },
      idEtatTrans: { value: 0 },
      proced: { value: '' },
      codBud: { value: '' },
      idBudget: { value: '' },
      idFourn: { value: '' },
      gestion: { value: '' },
      numBe: { value: '' },
      benum: { value: '' },
      dateCreation: { value: '' },
      chap: { value: '' },
      art: { value: '' },
      parag: { value: '' },
      rub: { value: '' },
      intitule: { value: '' },
      dotationCorrigee: { value: 0 },
      totalEngag: { value: 0 },
      nbreEngag: { value: 0 },
      referenceContrat: { value: '' },
      dateSaisieContrat: { value: '' },
      montantContrat: { value: 0 },
      engageContrat: { value: 0 },
      resteAEngagerContrat: { value: 0 },
      ifuMle: { value: '' },
      nom: { value: '' },
      dejaLiquide: { value: 0 },
      resteALiquider: { value: 0 },
      montantNouveauEng: { value: 0 },
      dateCreationNouveauEng: { value: '' },
      benumNouveauEng: { value: '' },
      natDepenseNouveauEng: { value: '' },
    });
    setPjSelectionnees([]);
    setBenumPourRechercherEng('');

    setDisableEditerEngagment(true);
    setDisableMontantNouveauEng(true);
    setDisableNatDepenseNouveauEng(true);
  }
  ///////////////// GESTION ENGAGEMENT

  ///////////////// GESTION RECHERCHE ENGAGEMENT
  const [engagements, setEngagements] = useState<any[]>([]);
  const [engagementAModifier, setEngagementAModifier] = useState<any>({});
  const [engagementParent, setEngagementParent] = useState<any>({});
  const [filteredEngagements, setFilteredEngagements] = useState<any[]>([]);
  const [showModalSelectionnerEngagement, setShowModalSelectionnerEngagement] = useState(false);
  const [benumPourRechercherEng, setBenumPourRechercherEng] = useState<string>('');

  const tableEngagmentColumns = [
    {
      name: "Gestion",
      selector: (row: any) => row.gestion,
      width: "100px",
      center: true,
    },
    {
      name: "\u2116",
      selector: (row: any) => String(row.benum).padStart(4, '0'),
      width: "60px",
      center: true
    },
    {
      name: "Montant",
      selector: (row: any) => Number(row.montant).toLocaleString(),
      width: "110px",
      right: true,
    },
    {
      name: "Fournisseur / Bénéficiaire",
      selector: (row: any) => row.nom,
      wrap: true
    },
  ]

  const handleBenumRechercherEngInputChange = (e: any): void => {
    setBenumPourRechercherEng(e.target.value.toLowerCase());
  }

  const [formREngagement, setFormREngagement] = useState<FormREngagement>({
    benum: { value: ''},
  })

  const handleInputChangeFormREngagement = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormREngagement({ ...formREngagement, ...newField})
  }

  useEffect( () => {
    const results = engagements.filter(item => {
      return ((item.benum || '').toString().toLowerCase().includes(formREngagement.benum.value.toString().toLowerCase()))
    })
    setFilteredEngagements(results);
  }, [formREngagement])

  useEffect( () => {
    getEngagements()
  }, [])

  const getEngagements = () => {
    EngagementEN01ViewService.getBonDAnnulationModifiables(Number(gestionCourante), Number(idBudget)).then(data => {
      setEngagements(data) 
      setFilteredEngagements(data)
    })
  }

  const handleCloseModalSelectionnerEngagement = () => {
    setShowModalSelectionnerEngagement(false);
  }

  const handleShowModalSelectionnerEngagement = () => {
    getEngagements();
    setShowModalSelectionnerEngagement(true);
  }

  const rechercherAfficherEngagement = (benum: number) => {
    EngagementEN01ViewService.getBonDAnnulationModifiables(Number(gestionCourante), Number(idBudget)).then(data => {
      const result = data.filter(item => {
        return (item.benum === Number(benum))
      })

      if (result.length !== 0) {
        EngagementEN01ViewService.getByNumBe(result[0].idEng).then(engParent => {

          setDisableEditerEngagment(false);

          setEngagementAModifier(result[0]);
          setEngagementParent(engParent);
          setFormEng({
            natDepense: { value: engParent.natDepense }, //
            auProfit: { value: engParent.auProfit },//
            montant: { value: engParent.montant }, //
            dotInitiale: { value: engParent.dotInitiale },//
            dispoAvant: { value: engParent.dispoAvant },//
            disponible: { value: engParent.disponible },//
            dateEtat: { value: engParent.dateEtat },//
            idUser: { value: engParent.idUser },//
            avecDecision: { value: engParent.avecDecision },//
            apartirDemandLiq: { value: engParent.apartirDemandLiq },//
            apartirContrat: { value: (engParent.idContrat !== null && engParent.apartirDemandLiq === false)? true : false },//
            grh: { value: engParent.grh },//
            receptionne: { value: engParent.receptionne },//
            dateValid: { value: engParent.dateValid },//
            dateCreat: { value: engParent.dateCreat },//
            codLiq: { value: engParent.codLiq },//
            codBord: { value: engParent.idBord },//
            idContrat: { value: engParent.idContrat },//
            idEngParent: { value: engParent.idEng },//
            etat: { value: engParent.etat },//
            idEtatTrans: { value: engParent.idEtatTrans },//
            proced: { value: engParent.proced },//
            codBud: { value: engParent.codBud },//
            idBudget: { value: engParent.idBudget },//
            idFourn: { value: engParent.idFourn },//
            gestion: { value: engParent.gestion },//
            numBe: { value: engParent.numBe },//
            benum: { value: engParent.benum },//
            dateCreation: { value: engParent.dateCreation },//
            chap: { value: engParent.chap },//
            art: { value: engParent.art },//
            parag: { value: engParent.parag },//
            rub: { value: engParent.rub },//
            intitule: { value: engParent.intitule },//
            dotationCorrigee: { value: engParent.dotationCorrigee },//
            totalEngag: { value:  engParent.totalEngag },//
            nbreEngag: { value: engParent.nbreEngag },//
            referenceContrat: { value: engParent.referenceContrat },//
            dateSaisieContrat: { value: engParent.dateSaisieContrat },//
            montantContrat: { value: engParent.montantContrat },//
            engageContrat: { value: engParent.engageContrat },//
            resteAEngagerContrat: { value: engParent.resteAEngagerContrat },//
            ifuMle: { value: engParent.ifumle }, //
            nom: { value: engParent.nom }, //
            dejaLiquide: { value: engParent.dejaLiquide },
            resteALiquider: { value: engParent.resteALiquider },
            montantNouveauEng: { value: addSepartor(removeNonNumeric(result[0].montant)) },
            dateCreationNouveauEng: { value: result[0].dateCreation },
            benumNouveauEng: { value: result[0].benum },
            natDepenseNouveauEng: { value: "Dégagement de " + addSepartor(removeNonNumeric(result[0].resteALiquider)) + " de l'engagement \u2116 " + result[0].gestion + "-" + String(engParent.benum).padStart(4, '0') },
          });

          // RECUPERATION DES PIECES JUSTIFICATIVES
          getPjSelectionnees(result[0].numBe);
        })
      } else {
        initFormEng();
      }
    });
  }

  const handleRechercheButtonClick = () => {
    if (benumPourRechercherEng === "") {
      handleShowModalSelectionnerEngagement();
    } else {
      rechercherAfficherEngagement(Number(benumPourRechercherEng));
    }
  }
  ///////////////// GESTION RECHERCHE ENGAGEMENT

  ///////////////// GESTION EDITER ENGAGEMENT
  const handleEditerBonDAnnulationOuDeDegagementButtonClick = () => {
    
  }
  ///////////////// GESTION EDITER ENGAGEMENT


  ///////////////// GESTION PIECES JUSTIFICATIVES SELECTIONNEES POUR L'ENGAGEMENT
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
          <Button size='sm' variant="outline-success" title="Ajouter une pièce justificative" className='me-1' style={{width: "100px"}} disabled={disableAjouterUnePieceJustificative}><BsPlusLg /></Button>
        </ButtonGroup>
      </GridToolbarContainer>
    );
  }

  const getPjSelectionnees = (numBe: number) => {
    PieceJustifService.getByNumBeOrderByPieceJustificative(numBe).then(data => {
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
      setPjSelectionnees(pieceJustifs)
    })
  }
  ///////////////// GESTION PIECES JUSTIFICATIVES SELECTIONNEES POUR L'ENGAGEMENT

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
            <h6 className="shadow-sm text-primary text-center rounded">ENGAGEMENTS &gt; CORRECTION MONTANT &gt; EDITION DE BON D'ANNULATION OU DE DEGAGEMENT</h6>
            <Form>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <Form.Group as={Row}>
                    <InputGroup as={Col}>
                      <Form.Control name='' size='sm' value={"Engagement de correction numero :"} type="text" className='me-1' disabled />
                      <Form.Control name='' size='sm' value={gestionCourante} type="text" className='me-1' style={{minWidth:"50px", maxWidth:"50px"}} disabled />
                      <Form.Control name='' size='sm' value={benumPourRechercherEng} type="number" onChange={e => handleBenumRechercherEngInputChange(e)} style={{minWidth:"65px", maxWidth:"65px"}} />
                      <Button variant="outline-warning" size='sm' title="Lancer la recherche" style={{maxHeight:"31px"}} onClick={ () => handleRechercheButtonClick()}><QuestionMarkOutlinedIcon /></Button>
                    </InputGroup>
                    <ButtonGroup as={Col} xs={4} size="sm" className='justify-content-end'>
                      <Button variant="outline-primary" title="Editer bon d'annulation ou de dégagement" style={{maxWidth:"65px", maxHeight:"30px"}} onClick={ () => handleEditerBonDAnnulationOuDeDegagementButtonClick()} disabled={disableEditerEngagment}><LocalPrintshopIcon /></Button>
                    </ButtonGroup>
                  </Form.Group>
                </Card.Body>
              </Card>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <Card.Title style={{fontSize:"0.7em"}}>
                    ENGAGEMENT EN ANNULATION
                  </Card.Title>
                  <Table responsive striped bordered hover variant="" size="sm" style={{marginBottom:"1px"}}>
                    <thead className='bg-primary'>
                        <tr>
                            <th style={{width:"100px"}}>Numero</th>
                            <th style={{width:"100px"}}>Montant engagé</th>
                            <th style={{width:"100px"}}>Montant liquidé</th>
                            <th style={{width:"100px"}}>Reste à liquider</th>
                            <th style={{width:"100px"}}>Procédure</th>
                            <th>Date Création</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{fontWeight:"bold", fontSize:"1.1em"}} className='text-center'>
                            <td>{(formEng.benum.value !=="")? formEng.gestion.value + "-" + String(formEng.benum.value).padStart(4, '0') : ""}</td>
                            <td>{formEng.montant.value.toLocaleString()}</td>
                            <td>{formEng.dejaLiquide.value.toLocaleString()}</td>
                            <td>{formEng.resteALiquider.value.toLocaleString()}</td>
                            <td>{formEng.proced.value}</td>
                            <td>{(formEng.dateCreation.value === "")? '' : formatDateWithHoursAndMinutes(new Date(formEng.dateCreation.value))}</td>
                        </tr>
                    </tbody>
                  </Table>
                  <Row>
                    <Col>
                      <Form.Group controlId="natDepense">
                        <Form.Label className='label2'>Object :</Form.Label>
                        <Form.Control as="textarea" rows={1} name='natDepense' value={formEng.natDepense.value} title={formEng.natDepense.value} size='sm' disabled />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Label className='label2'>Fournisseur / Bénéficiare :</Form.Label>
                      <InputGroup>
                        <Form.Control name='' size='sm' value={formEng.ifuMle.value} title={formEng.ifuMle.value} type="text" style={{minWidth:"100px", maxWidth:"100px"}} disabled />
                        <Form.Control name='' size='sm' value={formEng.nom.value} title={formEng.nom.value} type="text" disabled />
                      </InputGroup>
                    </Col>
                  </Row>
                  <Table responsive striped bordered hover variant="" size="sm" style={{marginBottom:"0px", marginTop:"4px"}}>
                    <thead className='bg-primary'>
                        <tr>
                            <th style={{width:"40px"}}>Chap.</th>
                            <th style={{width:"40px"}}>Art.</th>
                            <th style={{width:"40px"}}>Parag.</th>
                            <th style={{width:"40px"}}>Rub.</th>
                            <th>Intitulé</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{fontWeight:"bold", fontSize:"1.1em", height:'29px'}} className='text-center'>
                            <td>{formEng.chap.value}</td>
                            <td>{formEng.art.value}</td>
                            <td>{formEng.parag.value}</td>
                            <td>{formEng.rub.value}</td>
                            <td className='text-start'>{formEng.intitule.value}</td>
                        </tr>
                    </tbody>
                  </Table>
                </Card.Body>                        
              </Card>
              <Card className="">
                <Card.Body className='p-1'>
                  <div>
                    <Row style={{fontSize:"0.7em"}}>
                      <Col>
                        <Form.Group controlId="montantNouveauEng" as={Row} className='mb-1'>
                          <Col xs={4}><Form.Label>Montant :</Form.Label></Col>
                          <Col><Form.Control name='montantNouveauEng' value={formEng.montantNouveauEng.value} size='sm' type="text" disabled={disableMontantNouveauEng} /></Col>
                        </Form.Group>
                        <Form.Group controlId="natDepenseNouveauEng" as={Row} className='mb-1'>
                          <Col xs={4}><Form.Label>Object :</Form.Label></Col>
                          <Col><Form.Control as="textarea" rows={2} name='natDepenseNouveauEng' value={formEng.natDepenseNouveauEng.value} title={formEng.natDepenseNouveauEng.value} size='sm' disabled={disableNatDepenseNouveauEng} /></Col>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="" as={Row} className='mb-1'>
                          <Col xs={4}><Form.Label>Numero :</Form.Label></Col>
                          <Col>
                            <InputGroup size='sm'>
                              <Form.Control name='' size='sm' value={(formEng.gestion.value === '')? '' : formEng.gestion.value} type="text" className='me-1' style={{minWidth:"50px", maxWidth:"50px"}} disabled />
                              <Form.Control name='benumNouveauEng' size='sm' value={(formEng.benumNouveauEng.value === '')? '' : String(formEng.benumNouveauEng.value).padStart(4, '0') } type="text" style={{maxWidth:"50px"}} disabled />
                            </InputGroup>
                          </Col>
                        </Form.Group>
                        <Form.Group controlId="dateCreationNouveauEng" as={Row} className='mb-1'>
                          <Col xs={4}><Form.Label>Date de création :</Form.Label></Col>
                          <Col><Form.Control name='dateCreationNouveauEng' value={(formEng.dateCreationNouveauEng.value === "")? '' : formatDateWithHoursAndMinutes(new Date(formEng.dateCreationNouveauEng.value))} size='sm' type="text" disabled/></Col>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                  <div style={{height: "150px"}}>
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
                        }
                      }}
                    />
                  </div>
                </Card.Body>                        
              </Card>
            </Form>
          </div>

          {/* GESTION RECHERCHE ENGAGEMENT */}
          <Modal show={showModalSelectionnerEngagement} onHide={handleCloseModalSelectionnerEngagement} backdrop="static" keyboard={false} size="lg">
            <Modal.Header className='p-1'>
                <Modal.Title as="h6">Liste des BE</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2'>
              <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tableEngagmentColumns}
                    data={filteredEngagements}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    responsive
                    striped
                    fixedHeaderScrollHeight='450px'
                    highlightOnHover
                    onRowClicked={ (row, e) => {
                      rechercherAfficherEngagement(row.benum);
                      handleCloseModalSelectionnerEngagement();
                    }}
                    subHeader
                    subHeaderComponent={
                      <Form.Control name="benum" value={formREngagement.benum.value} size='sm' type="text" placeholder="Numero engagement" className='w-25' onChange={e => handleInputChangeFormREngagement(e)} />
                    }
                    />
                </Card.Body>
              </Card>
            </Modal.Body>

            <Modal.Footer className='p-1'>
              <Button variant="outline-danger" size='sm' onClick={handleCloseModalSelectionnerEngagement}>Fermer</Button>
            </Modal.Footer>
          </Modal>

      </Container>
  );
};

export default EngagementsCorrectionMontantReediterUnBonDAnnulationForm;
