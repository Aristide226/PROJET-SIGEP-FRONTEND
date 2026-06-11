import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import DataTable  from 'react-data-table-component'; 
import { costumeStyles } from '../../helpers/costume-styles';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams, GridToolbarContainer } from '@mui/x-data-grid';
import { Gestion, IdBudget } from '../helpers/session-storage';
import Stack from '@mui/material/Stack';
import { IoCloseOutline } from "react-icons/io5";
import { PJPourEngagement } from '../models/pj-pour-engagment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import PieceJustifService from '../services/piece-justif-service';
import { BsArrowDownCircleFill, BsPencilSquare, BsPlusLg, BsTrash } from 'react-icons/bs';
import EngagementViewService from '../services/engagement-view-service';
import EngagementEN01ViewService from '../services/engagement-en01-view-service';
import EngagementEN02ViewService from '../services/engagement-en02-view-service';
import ReportService from '../../shared/report/services/report-service';
import { okWarnignDialog } from '../../helpers/dialogs';
import PdfViewer from '../../helpers/pdf-viewer';
import { emptyReport, Report } from '../../shared/report/models/report';

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
  compteFourn: Field,
  estOrdre: Field,
  dateLiq: Field,
  numeroDemande: Field,
  numBeRDL: Field, // Va servir a recuperer les pices de l'eng crée a partir de RDL
  auProfitDuCompte: Field // Utilisé pour stocker le compte
}

// CRITERES DE RECHERCHE ENGAGEMENT
type FormREngagement = {
  benum: Field,
}

const EngagementsReediterBonDEngagementForm: FunctionComponent = () => {

  const [gestionCourante] = useState<string>(Gestion() ?? '');
  const [idBudget] = useState<string>(IdBudget() ?? '');
  const [disableEditerEngagment, setDisableEditerEngagment] = useState<boolean>(true);
  const [disableEditerDecision, setDisableEditerDecision] = useState<boolean>(true);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<any>();
  const [pdfNameForDownload, setPdfNameForDownload] = useState("");

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
    proced: { value: 'EN01' },
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
    compteFourn: { value: null },
    estOrdre: { value: false },
    dateLiq: { value: '' },
    numeroDemande: { value: '' },
    numBeRDL: { value: '' },
    auProfitDuCompte: { value: ''},
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
      proced: { value: 'EN01' },
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
      compteFourn: { value: '' },
      estOrdre: { value: false },
      dateLiq: { value: '' },
      numeroDemande: { value: '' },
      numBeRDL: { value: '' },
      auProfitDuCompte: { value: ''},
    });
    setPjSelectionnees([]);

    setDisableEditerEngagment(true);
  }

  const handleInputChangeFormEng = (e: any): void => {
    const fieldName: string = e.target.name;
    let fieldValue: string = e.target.value;

    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormEng({ ...formEng, ...newField}); 
  }
  ///////////////// GESTION ENGAGEMENT

  ///////////////// GESTION RECHERCHE ENGAGEMENT
  const [engagements, setEngagements] = useState<any[]>([]);
  const [filteredEngagements, setFilteredEngagements] = useState<any[]>([]);
  const [showModalSelectionnerEngagement, setShowModalSelectionnerEngagement] = useState(false);

  const tableEngagmentColumns = [
    {
      name: "Gestion",
      selector: (row: any) => row.gestion,
      width: "100px",
      center: true,
    },
    {
      name: "Numero",
      selector: (row: any) => String(row.benum).padStart(4, '0'),
      width: "100px",
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
    EngagementViewService.getByGestionAndIdBudgetAndMontantGreaterThanOrderByBenumDesc(Number(gestionCourante), Number(idBudget)).then(data => {
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

  const rechercherAfficherEngagement = (benum: number, proced: string) => {
    if (proced === "EN01") {
      EngagementEN01ViewService.getByGestionAndIdBudgetAndMontantGreaterThanOrderByBenumDesc(Number(gestionCourante), Number(idBudget)).then(data => {
        const result = data.filter(item => {
          return (item.benum === Number(benum))
        })

        if (result.length !== 0) {

          // ACTIVER 
          setDisableEditerEngagment(false);
          if (result[0].avecDecision) setDisableEditerDecision(false); else setDisableEditerDecision(true);

          setFormEng({
            natDepense: { value: result[0].natDepense }, //
            auProfit: { value: result[0].auProfit },//
            montant: { value: result[0].montant }, //
            dotInitiale: { value: result[0].dotInitiale },//
            dispoAvant: { value: result[0].dispoAvant },//
            disponible: { value: result[0].disponible },//
            dateEtat: { value: result[0].dateEtat },//
            idUser: { value: result[0].idUser },//
            avecDecision: { value: result[0].avecDecision },//
            apartirDemandLiq: { value: result[0].apartirDemandLiq },//
            apartirContrat: { value: (result[0].idContrat !== null && result[0].apartirDemandLiq === false)? true : false },//
            grh: { value: result[0].grh },//
            receptionne: { value: result[0].receptionne },//
            dateValid: { value: result[0].dateValid },//
            dateCreat: { value: result[0].dateCreat },//
            codLiq: { value: result[0].codLiq },//
            codBord: { value: result[0].idBord },//
            idContrat: { value: result[0].idContrat },//
            idEngParent: { value: result[0].idEng },//
            etat: { value: result[0].etat },//
            idEtatTrans: { value: result[0].idEtatTrans },//
            proced: { value: result[0].proced },//
            codBud: { value: result[0].codBud },//
            idBudget: { value: result[0].idBudget },//
            idFourn: { value: result[0].idFourn },//
            gestion: { value: result[0].gestion },//
            numBe: { value: result[0].numBe },//
            benum: { value: result[0].benum },//
            dateCreation: { value: result[0].dateCreation },//
            chap: { value: result[0].chap },//
            art: { value: result[0].art },//
            parag: { value: result[0].parag },//
            rub: { value: result[0].rub },//
            intitule: { value: result[0].intitule },//
            dotationCorrigee: { value: result[0].dotationCorrigee },//
            totalEngag: { value:  result[0].totalEngag },//
            nbreEngag: { value: result[0].nbreEngag },//
            referenceContrat: { value: result[0].referenceContrat },//
            dateSaisieContrat: { value: result[0].dateSaisieContrat },//
            montantContrat: { value: result[0].montantContrat },//
            engageContrat: { value: result[0].engageContratPourModifierEngagement },//
            resteAEngagerContrat: { value: result[0].resteAEngagerContratPourModifierEngagement },//
            ifuMle: { value: result[0].ifumle }, //
            nom: { value: result[0].nom }, //
            compteFourn: { value: '' },//
            estOrdre: { value: false },//
            dateLiq: { value: '' },//
            numeroDemande: { value: '' },
            numBeRDL: { value: '' },
            auProfitDuCompte: { value: '' },
          });
          
          // RECUPERATION DES PIECES JUSTIFICATIVES
          getPjSelectionnees(result[0].numBe);

        } else {
          initFormEng();
        }
      });
    } else {
      EngagementEN02ViewService.getByGestionAndIdBudgetAndMontantGreaterThanOrderByBenumDesc(Number(gestionCourante), Number(idBudget)).then(data => {
        const result = data.filter(item => {
          return (item.benum === Number(benum))
        })

        if (result.length !== 0) {

          // ACTIVER 
          setDisableEditerEngagment(false);
          if (result[0].avecDecision) setDisableEditerDecision(false); else setDisableEditerDecision(true);

          setFormEng({
            natDepense: { value: result[0].natDepense }, //
            auProfit: { value: result[0].auProfit },//
            montant: { value: result[0].montant }, //
            dotInitiale: { value: result[0].dotInitiale },//
            dispoAvant: { value: result[0].dispoAvant },//
            disponible: { value: result[0].disponible },//
            dateEtat: { value: result[0].dateEtat },//
            idUser: { value: result[0].idUser },//
            avecDecision: { value: result[0].avecDecision },//
            apartirDemandLiq: { value: result[0].apartirDemandLiq },//
            apartirContrat: { value: (result[0].idContrat !== null && result[0].apartirDemandLiq === false)? true : false },//
            grh: { value: result[0].grh },//
            receptionne: { value: result[0].receptionne },//
            dateValid: { value: result[0].dateValid },//
            dateCreat: { value: result[0].dateCreat },//
            codLiq: { value: result[0].codLiq },//
            codBord: { value: result[0].idBord },//
            idContrat: { value: result[0].idContrat },//
            idEngParent: { value: result[0].idEng },//
            etat: { value: result[0].etat },//
            idEtatTrans: { value: result[0].idEtatTrans },//
            proced: { value: result[0].proced },//
            codBud: { value: result[0].codBud },//
            idBudget: { value: result[0].idBudget },//
            idFourn: { value: result[0].idFourn },//
            gestion: { value: result[0].gestion },//
            numBe: { value: result[0].numBe },//
            benum: { value: result[0].benum },//
            dateCreation: { value: result[0].dateCreation },//
            chap: { value: result[0].chap },//
            art: { value: result[0].art },//
            parag: { value: result[0].parag },//
            rub: { value: result[0].rub },//
            intitule: { value: result[0].intitule },//
            dotationCorrigee: { value: result[0].dotationCorrigee },//
            totalEngag: { value:  result[0].totalEngag },//
            nbreEngag: { value: result[0].nbreEngag },//
            referenceContrat: { value: result[0].referenceContrat },//
            dateSaisieContrat: { value: result[0].dateSaisieContrat },//
            montantContrat: { value: result[0].montantContrat },//
            engageContrat: { value: result[0].engageContratPourModifierEngagement },//
            resteAEngagerContrat: { value: result[0].resteAEngagerContratPourModifierEngagement },//
            ifuMle: { value: result[0].ifumle }, //
            nom: { value: result[0].nom }, //
            compteFourn: { value: result[0].compteFourn },//
            estOrdre: { value: result[0].estOrdre},//
            dateLiq: { value: '' },//
            numeroDemande: { value: '' },
            numBeRDL: { value: '' },
            auProfitDuCompte: { value: (result[0].compteFourn !== null)? result[0].abreviation + " " + result[0].libelleAgence + " N°" + result[0].codeBanque + " " + result[0].codeAgence + " " + result[0].numCompte + " " + result[0].cleRib : ''},
          });
          
          // RECUPERATION DES PIECES JUSTIFICATIVES
          getPjSelectionnees(result[0].numBe);

        } else {
          initFormEng();
        }
      });
    } 
  }

  const handleRechercheButtonClick = () => {
    if (formEng.benum.value === "") {
      handleShowModalSelectionnerEngagement();
    } else {
      EngagementViewService.getByGestionAndIdBudgetAndMontantGreaterThanOrderByBenumDesc(Number(gestionCourante), Number(idBudget)).then(data => {
        const result = data.find((item) => item.benum === Number(formEng.benum.value));
        if (result) {
          rechercherAfficherEngagement(formEng.benum.value, result.proced);
        } else {
          initFormEng();
        }
      })
    }
  }
  ///////////////// GESTION RECHERCHE ENGAGEMENT

  ///////////////// GESTION EDITER ENGAGEMENT
  const handleEditerEngagementButtonClick = () => {
    if (formEng.proced.value ==="EN01") {
      let report: Report = emptyReport;
      report.name = "fiche_engagement_procedure_normale";
      report.params = [
        {key: "GESTION", value: Number(gestionCourante)},
        {key: "IDBUDGET", value: Number(idBudget)},
        {key: "BENUM", value: Number(formEng.benum.value)}
      ];
      ReportService.createReport(report)
        .then(pdfBlob => {
          setPdfBlob(pdfBlob);
          setShowPdfViewer(true);
          setPdfNameForDownload("fiche_engagement_procedure_normale");
        })
        .catch(error => {
          okWarnignDialog("Erreur lors de l'impression");
        });
    } else {
      let report: Report = emptyReport;
      report.name = "rapport_principal_engagement_procedure_simplifiee";
      report.params = [
        {key: "GESTION", value: Number(gestionCourante)},
        {key: "IDBUDGET", value: Number(idBudget)},
        {key: "BENUM", value: Number(formEng.benum.value)},
        {key: "SUBREPORT_ENGAGEMENT_PROCEDURE_SIMPLIFIEE", value: "fiche_engagement_procedure_simplifiee"},
        {key: "SUBREPORT_LIQUIDATION_PROCEDURE_SIMPLIFIEE", value: "fiche_liquidation_procedure_simplifiee"},
        {key: "SUBREPORT_ORDONNANCE_PAIEMENT_PROCEDURE_SIMPLIFIEE", value: "fiche_ordonnance_paiement_procedure_simplifiee"}
      ];
      ReportService.createReport(report)
        .then(pdfBlob => {
          setPdfBlob(pdfBlob);
          setShowPdfViewer(true);
          setPdfNameForDownload("fiche_engagement_procedure_simplifiee");
        })
        .catch(error => {
          okWarnignDialog("Erreur lors de l'impression");
        });
    }  
  }  
  ///////////////// GESTION EDITER ENGAGEMENT

  ///////////////// GESTION EDITER DECISION
  const handleEditerDecisionButtonClick = () => {
    
  }
  ///////////////// GESTION EDITER DECISION

  ///////////////// GESTION GENERER RDL
  const handleGenererRDLButtonClick = () => {
    
  }
  ///////////////// GESTION GENERER RDL

  ///////////////// GESTION GENERER CI
  const handleGenererCIButtonClick = () => {
    
  }
  ///////////////// GESTION GENERER CI

  ///////////////// GESTION CORRIGER LA DECISION
  const [showModalCorrigerLaDecision, setShowModalCorrigerLaDecision] = useState(false);

  const handleCloseModalCorrigerLaDecision = () => {
    setShowModalCorrigerLaDecision(false);
  }

  const handleShowModalCorrigerLaDecision = () => {
    setShowModalCorrigerLaDecision(true);
  }

  const handleCorrigerLaDecisionButtonClick = () => {
    handleShowModalCorrigerLaDecision();
  }
  ///////////////// GESTION CORRIGER LA DECISION

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
          <Button size='sm' variant="outline-success" title="Ajouter une pièce justificative" className='me-1' style={{width: "100px"}} disabled><BsPlusLg /></Button>
          <Button size='sm' variant="outline-success" title="Rappel pieces justificatifives" disabled>Rappel Pieces Justificatifives</Button>
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
            <h6 className="shadow-sm text-primary text-center rounded">ENGAGEMENTS &gt; REEDITION DE BON D'ENGAGEMENT</h6>
            <Form>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <Form.Group as={Row}>
                    <InputGroup as={Col}>
                        <Form.Control name='' size='sm' value={"Engagement No :"} type="text" className='me-1' disabled />
                        <Form.Control name='' size='sm' value={gestionCourante} type="text" className='me-1' style={{minWidth:"50px", maxWidth:"50px"}} disabled />
                        <Form.Control name='benum' size='sm' value={formEng.benum.value} type="number" onChange={e => handleInputChangeFormEng(e)} style={{minWidth:"65px", maxWidth:"65px"}} />
                        <Button variant="outline-warning" size='sm' title="Lancer la recherche" style={{maxHeight:"31px"}} onClick={ () => handleRechercheButtonClick()}><QuestionMarkOutlinedIcon /></Button>
                    </InputGroup>
                    <Col>
                      <Form.Group controlId="dateCreation" as={Row}>
                        <Col xs={2}><Form.Label className="label2">du :</Form.Label></Col>
                        <Col>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker 
                              value={dayjs(formEng.dateCreation.value)} 
                              onChange={(newValue) => formEng.dateCreation.value = newValue?.toISOString()} 
                              views={['year', 'month', 'day', 'hours', 'minutes']} 
                              viewRenderers={{hours: null, minutes: null }} 
                              format="DD/MM/YYYY HH:mm" 
                              disabled
                              sx={{ 
                                "& .MuiInputBase-input": 
                                  { 
                                    fontSize: '0.9em', 
                                    height: 15, 
                                    padding: 1
                                  } 
                              }}
                            />
                          </LocalizationProvider> 
                        </Col>
                      </Form.Group>
                    </Col>
                    <ButtonGroup as={Col} size="sm" className='justify-content-end'>
                      <Button variant="outline-primary" title="Créer un nouveau engagment" className='me-1' style={{maxWidth:"100px", maxHeight:"30px"}} disabled={true}><BsPlusLg /></Button>
                      <Button variant="outline-primary" type='submit' title="Enregistrer l'engagment" className='me-1' style={{maxWidth:"100px", maxHeight:"30px"}} disabled><SaveRoundedIcon /></Button>
                      <Button variant="outline-primary" title="Editer l'engagement" className='me-1' style={{maxWidth:"100px", maxHeight:"30px"}} onClick={ () => handleEditerEngagementButtonClick()} disabled={disableEditerEngagment}><LocalPrintshopIcon /></Button>
                      <Button variant="outline-primary" title="Editer la décision" style={{maxWidth:"100px", maxHeight:"30px"}} onClick={ () => handleEditerDecisionButtonClick()} disabled={disableEditerDecision}><LocalPrintshopOutlinedIcon /></Button>
                    </ButtonGroup>
                  </Form.Group>
                </Card.Body>
              </Card>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <Card.Title style={{fontSize:"0.8em"}}>
                    <Form.Check name='apartirDemandLiq' type="checkbox" inline label={"A partir du RDL N°" + ((formEng.numeroDemande.value ==="")? "_______________": formEng.numeroDemande.value) + " du " + ((formEng.dateLiq.value ==="" || formEng.dateLiq.value === null)? "_______________": new Date(formEng.dateLiq.value).toLocaleDateString())} checked={formEng.apartirDemandLiq.value} disabled /><Button variant="outline-primary" title="Cliquez pour sélectionner le reçu de demande de liquidation" size="sm" style={{width:"30px", height:"30px", marginRight:"1px"}} disabled><BsArrowDownCircleFill /></Button><Button variant="outline-primary" title="Cliquez pour générer le RDL" size="sm" className='me-1' onClick={() => handleGenererRDLButtonClick()} disabled>Générer RDL <BsPencilSquare /></Button>
                    <Button variant="outline-primary" title="Cliquez pour générer le changement d'imputation" size="sm" className='me-1' onClick={() => handleGenererCIButtonClick()} disabled>Générer CI <BsPencilSquare /></Button>
                    <Button variant="outline-primary" title="Cliquez pour Sélectiontionner la ligne budgétaire" size="sm" disabled>Renseignements ligne budgétaire <BsArrowDownCircleFill /></Button>
                  </Card.Title>
                    <Table responsive striped bordered hover variant="" size="sm" style={{marginBottom:"0px"}}>
                      <thead className='bg-danger'>
                          <tr>
                              <th style={{width:"40px"}}>Chap.</th>
                              <th style={{width:"40px"}}>Art.</th>
                              <th style={{width:"40px"}}>Parag.</th>
                              <th style={{width:"40px"}}>Rub.</th>
                              <th>Intitulé</th>
                              <th style={{width:"100px"}}>Dotation Corrigée</th>
                              <th style={{width:"100px"}}>Engagments précédents</th>
                              <th style={{width:"100px"}}>Disponible avant</th>
                              <th style={{width:"100px"}}>Disponible réel</th>
                              <th style={{width:"40px"}}>Nbre Engmt</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr style={{fontWeight:"bold", fontSize:"1.1em"}} className='text-center'>
                              <td>{formEng.chap.value}</td>
                              <td>{formEng.art.value}</td>
                              <td>{formEng.parag.value}</td>
                              <td>{formEng.rub.value}</td>
                              <td>{formEng.intitule.value}</td>
                              <td style={{color:"#198754"}}>{formEng.dotationCorrigee.value.toLocaleString()}</td>
                              <td style={{color:"#dc3545"}}>{formEng.totalEngag.value.toLocaleString()}</td>
                              <td style={{color:"#198754"}}>{formEng.dispoAvant.value.toLocaleString()}</td>
                              <td style={{backgroundColor:"#90EE90"}}>{formEng.disponible.value.toLocaleString()}</td>
                              <td style={{color:"#0d6efd"}}>{formEng.nbreEngag.value.toLocaleString()}</td>
                          </tr>
                      </tbody>
                    </Table>
                </Card.Body>                        
              </Card>
              <div>
                <Row className="mb-1">
                  <Col>
                    <Card>
                      <Card.Body className='p-1'>
                        <Card.Title style={{fontSize:"0.8em", marginBottom:"0px"}}><Form.Check name='apartirContrat' type="checkbox" inline label="A partir d'un contrat" className='me-0' checked={formEng.apartirContrat.value} disabled /><Button variant="outline-primary" title="Cliquez pour sélectionner le contrat" size="sm" style={{width:"30px", height:"30px"}} disabled><BsArrowDownCircleFill /></Button></Card.Title>
                          <tr style={{fontSize:"0.75em"}}>Marché N° {formEng.referenceContrat.value} du { formEng.dateSaisieContrat.value && new Date(formEng.dateSaisieContrat.value).toLocaleDateString()}</tr>
                          <Table responsive striped bordered hover variant="" size="sm" style={{marginBottom:"0px"}}>
                            <thead>
                              <tr>
                                <th style={{width:"40px"}}>Montant</th>
                                <th style={{width:"40px"}}>Engagés</th>
                                <th style={{width:"40px"}}>Reste à engager</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{fontWeight:"bold", fontSize:"1.1em"}} className='text-center'>
                                <td>{(formEng.montantContrat.value !== null)? formEng.montantContrat.value.toLocaleString() : 0}</td>
                                <td>{(formEng.engageContrat.value !== null)? formEng.engageContrat.value.toLocaleString() : 0}</td>
                                <td>{(formEng.resteAEngagerContrat.value !== null)? formEng.resteAEngagerContrat.value.toLocaleString() : 0}</td>
                              </tr>
                            </tbody>
                          </Table>
                      </Card.Body>                        
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <Card.Body className='p-1'>
                        <Card.Title style={{fontSize:"0.8em", marginBottom:"0px"}}>
                          <Form.Check inline type="radio" label="Fournisseur ou Bénéficiaire /" name="auProfit" value="F" checked={formEng.auProfit.value === "F"} disabled />
                          <Form.Check inline type="radio" label="Agent" name="auProfit" value="A" checked={formEng.auProfit.value === "A"} disabled />
                          <Button variant="outline-primary" title="Cliquez pour sélectionner le bénéficiaire" size="sm" style={{width:"30px", height:"30px"}} disabled><BsArrowDownCircleFill /></Button>
                        </Card.Title>
                        <Table className='mb-2' responsive striped bordered hover variant="" size="sm">
                          <tbody>
                            <tr style={{fontWeight:"bold", fontSize:"1.1em"}} className='text-center'>
                              <td style={{height:"29px"}}>{formEng.ifuMle.value}</td>
                              <td style={{height:"29px"}}>{formEng.nom.value}</td>
                            </tr>
                          </tbody>
                        </Table>
                        <div className='text-left' style={{fontWeight:"bold", fontSize:"0.8em"}}>
                          <Form.Check name='estOrdre' type="checkbox" label="Avec mandat d'ordre" inline checked={formEng.estOrdre.value} disabled />
                          <Form.Check name='avecDecision' type="checkbox" label="Avec décision" inline checked={formEng.avecDecision.value} disabled />
                          <Button variant="outline-primary" title="Cliquez pour corriger la décision" size="sm" onClick={() => handleCorrigerLaDecisionButtonClick()} disabled>Corriger la décision <BsPencilSquare /></Button>
                        </div>
                      </Card.Body>                        
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Card className="mb-1">
                      <Card.Body className='p-1'>
                        <div>
                          <Row style={{fontSize:"0.8em"}}>
                            <Col>
                              <Form.Group controlId="proced" as={Row} className='mb-1'>
                                <Col xs={4}><Form.Label>Procédure :</Form.Label></Col>
                                <Col>
                                  <Form.Select name='proced' value={formEng.proced.value} size="sm" disabled>
                                    <option value='EN01'>Normale</option>
                                    <option value='EN02'>Simplifiée</option>
                                  </Form.Select>
                                </Col>
                              </Form.Group>
                              <Form.Group controlId="montant" as={Row} className='mb-1'>
                                <Col xs={4}><Form.Label>Montant Engag :</Form.Label></Col>
                                <Col><Form.Control name='montant' value={formEng.montant.value.toLocaleString()} size='sm' type="text" disabled /></Col>
                              </Form.Group>
                            </Col>
                            <Col>
                              <Form.Group controlId="natDepense" as={Row} className='mb-1'>
                                <Col xs={4}><Form.Label>Object :</Form.Label></Col>
                                <Col><Form.Control as="textarea" rows={2} name='natDepense' value={formEng.natDepense.value} size='sm' title={formEng.natDepense.value} disabled /></Col>
                              </Form.Group>
                              <Form.Group controlId="" as={Row}>
                                <Col xs={4}><Form.Label>Au profit du compte :</Form.Label></Col>
                                <Col>
                                  <InputGroup size='sm'>
                                    <Form.Select name='compteFourn' value={formEng.compteFourn.value} size='sm' title={formEng.auProfitDuCompte.value} disabled>
                                      <option>{formEng.auProfitDuCompte.value}</option>
                                    </Form.Select>
                                    <Button variant="outline-danger" title="Cliquez pour éffacer le compte" size="sm" disabled><IoCloseOutline /></Button>
                                  </InputGroup>
                                </Col>
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>
                      </Card.Body>                        
                    </Card>
                  </Col>
                </Row>
              </div>
              <Card className="">
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
                        }
                      }}
                    />
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
                      rechercherAfficherEngagement(row.benum, row.proced);
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

          { showPdfViewer && <PdfViewer blob={pdfBlob} name={pdfNameForDownload} />}

      </Container>
  );
};

export default EngagementsReediterBonDEngagementForm;
