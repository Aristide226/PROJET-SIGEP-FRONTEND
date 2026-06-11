import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import Swal from 'sweetalert2';
import DataTable  from 'react-data-table-component'; 
import { costumeStyles } from '../../helpers/costume-styles';
import { okSuccessDialog, okWarnignDialog } from '../../helpers/dialogs';
import { BsArrowDownCircleFill, BsPencilSquare, BsPlusLg, BsTrash } from 'react-icons/bs';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowModel, GridRowParams, GridToolbarContainer } from '@mui/x-data-grid';
import { ConnectedUser, Gestion, IdBudget } from '../helpers/session-storage';
import Alert, { AlertProps } from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import { IoCloseOutline } from "react-icons/io5";
import DepensesPourCreationEngagementViewViewService from '../services/depenses-pour-creation-engagement-service';
import PjService from '../services/pj-service';
import { emptyPJPourEngagement, PJPourEngagement } from '../models/pj-pour-engagment';
import ContratsPourCreationEngagementViewService from '../services/contrats-pour-creation-engagement-service';
import ContratTypeService from '../services/contrat-type-service';
import DestinataireService from '../services/destinataire-service';
import { DirectionServiceResponseDto } from '../models/direction-service';
import DirectionServiceService from '../services/direction-service-service';
import AgentService from '../services/agent-service';
import { AgentRequestDto, emptyAgentRequestDto } from '../models/agent';
import { DestinataireRequestDto, emptyDestinataireRequestDto } from '../models/destinataire';
import CompteDestinataireService from '../services/compte-destinataire-service';
import { emptyEngagementRequestDto, EngagementRequestDto } from '../models/engagement';
import EngagementService from '../services/engagement-service';
import PieceJustifService from '../services/piece-justif-service';
import { PieceJustifRequestDto } from '../models/piece-justif';
import { emptyMandatRequestDto, MandatRequestDto } from '../models/mandat';
import MandatService from '../services/mandat-service';
import LiquidationsPourCreationEngagementViewService from '../services/liquidations-pour-creation-engagement-service';
import AgentsDirectionServiceSDestinatairesViewService from '../services/agents-direction-service-s-destinaires-view-service';
import { formatDateWithHoursAndMinutes } from '../../helpers/format-date';
import { addSepartor, removeNonNumeric } from '../../helpers/format';
import ReportService from '../../shared/report/services/report-service';
import PdfViewer from '../../helpers/pdf-viewer';
import ServerDateService from '../../shared/system/services/server-date-service';
import { Report, emptyReport } from '../../shared/report/models/report';

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
}

// CRITERES DE RECHERCHE RDL
type FormRRDL = {
  nom: Field,
}

// CRITERES DE RECHERCHE DEPENSE
type FormRCpteBudgetaireDepense = {
  idPlan: Field,
  intitule: Field,
}

// CRITERES DE RECHERCHE CONTRAT
type FormRCContrat = {
  type: Field,
  nom: Field,
}

// CRITERES DE RECHERCHE BENEFICIAIRE
type FormRBeneficiaire = {
  type: Field,
  nom: Field,
  ifumle: Field,
}

// FORMULAIRE AGENT, CRITERES DE RECHERCHE AGENT
type FormAgent = {
  ifumle: Field,
  mle: Field,
  nom: Field,
  prenom: Field,
  telephone: Field,
  email: Field,
  sexe: Field,
  service: Field,
  signataire: Field,
  titreHonorifique: Field,
  actif: Field,
}

const EngagementsCreerUnEngagementForm: FunctionComponent = () => {

  const [gestionCourante] = useState<string>(Gestion() ?? '');
  const [idBudget] = useState<string>(IdBudget() ?? '');
  const [utilisateurCourante] = useState<string>(ConnectedUser() ?? '');
  const [isGestionClose, setIsGestionClose] = useState<boolean>(false);
  const dateEnregistrementPourGestionClose: Date = new Date(gestionCourante + '-12-31');
  const [disableApartirRDL, setDisableApartirRDL] = useState<boolean>(true);
  const [disableDunContrat, setDisableDunContrat] = useState<boolean>(true);
  const [disableEditerEngagment, setDisableEditerEngagment] = useState<boolean>(true);
  const [disableEditerDecision, setDisableEditerDecision] = useState<boolean>(true);
  const [disableSelectionnerRDL, setDisableSelectionnerRDL] = useState<boolean>(true);
  const [disableGenererCI, setDisableGenererCI] = useState<boolean>(true);
  const [disableGenererRDL, setDisableGenererRDL] = useState<boolean>(true);
  const [disableRenseignementLigneBudgetaire, setDisableRenseignementLigneBudgetaire] = useState<boolean>(true);
  const [disableMontantEngagement, setDisableMontantEngagement] = useState<boolean>(true);
  const [disableNatDepense, setDisableNatDepense] = useState<boolean>(true);
  const [disableSelectionnerLeContrat, setDisableSelectionnerLeContrat] = useState<boolean>(true);
  const [disableAuProfit, setDisableAuProfit] = useState<boolean>(true);
  const [disableSelectionnerLeBeneficiare, setDisableSelectionnerLeBeneficiare] = useState<boolean>(true);
  const [disableAvecMandatDOrdre, setDisableAvecMandatDOrdre] = useState<boolean>(true);
  const [disableAvecDecision, setDisableAvecDecision] = useState<boolean>(true);
  const [disableCorrigerLaDecision, setDisableCorrigerLaDecision] = useState<boolean>(true);
  const [disableProceed, setDisableProceed] = useState<boolean>(true);
  const [disableAuProfitDuCompte, setDisableAuProfitDuCompte] = useState<boolean>(true);
  const [disableEffacerAuProfitDuCompte, setDisableEffacerAuProfitDuCompte] = useState<boolean>(true);
  const [disableAjouterUnePieceJustificative, setDisableAjouterUnePieceJustificative] = useState<boolean>(true);
  const [disableRappelPiecesJustificatives, setDisableRappelPiecesJustificatives] = useState<boolean>(true);
  const [borderColorSelectionnerLigneBudgetaire, setBorderColorSelectionnerLigneBudgetaire] = useState<string>("");
  const [borderColorSelectionnerBeneficiaire, setBorderColorSelectionnerBeneficiaire] = useState<string>("");
  const [borderColorProced, setBorderColorProced] = useState<string>("");
  const [borderColorMontant, setBorderColorMontant] = useState<string>("");
  const [borderColorObjet, setBorderColorObjet] = useState<string>("");
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<any>();
  const [pdfNameForDownload, setPdfNameForDownload] = useState("");

  useEffect(() => {
    // On recupere la date du server : si la gestion en cours est strictement inférieur à l'année de la date du serveur alors elle est close :
    ServerDateService.getServerDate().then(data => {
      if (Number(gestionCourante) < new Date(data).getFullYear()) setIsGestionClose(true); else setIsGestionClose(false)   
    }) 
  }, [])  

  ///////////////// GESTION ENGAGEMENT
  const [compteDestinataires, setCompteDestinataires] = useState<any[]>([]);
  const [disabledEnregistrer, setDisabledEnregistrer] = useState<boolean>(true);

  const [formEng, setFormEng] = useState<FormEng>({
    natDepense: { value: '' },
    auProfit: { value: 'F' },
    montant: { value: '' },
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
    benum: { value: '0000' },
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
  })

  const initFormEng = () => {
    setFormEng({
      natDepense: { value: '' },
      auProfit: { value: 'F' },
      montant: { value: '' },
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
      benum: { value: '0000' },
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
    });
    setCompteDestinataires([]);
    setPjSelectionnees([])

    setDisabledEnregistrer(true);
    setDisableEditerEngagment(true);
    setDisableAvecDecision(true);
    setDisableApartirRDL(true);
    setDisableSelectionnerRDL(true);
    setDisableGenererRDL(true);
    setDisableGenererCI(true);
    setDisableRenseignementLigneBudgetaire(true);
    setDisableDunContrat(true);
    setDisableSelectionnerLeContrat(true);
    setDisableAuProfit(true);
    setDisableSelectionnerLeBeneficiare(true);
    setDisableAvecMandatDOrdre(true);
    setDisableAvecDecision(true);
    setDisableCorrigerLaDecision(true);
    setDisableProceed(true);
    setDisableMontantEngagement(true);
    setDisableNatDepense(true);
    setDisableAuProfitDuCompte(true);
    setDisableEffacerAuProfitDuCompte(true);
    setDisableAjouterUnePieceJustificative(true);
    setDisableRappelPiecesJustificatives(true);
  }
  
  const handleInputChangeFormEng = (e: any): void => {
    const fieldName: string = e.target.name;
    let fieldValue: string = e.target.value;

    if (fieldName === "montant") {
      fieldValue = addSepartor(removeNonNumeric(fieldValue));
      if (removeNonNumeric(fieldValue)> formEng.dispoAvant.value) {
        fieldValue = addSepartor(removeNonNumeric(formEng.dispoAvant.value));
        okWarnignDialog("Montant de l'engagement doit etre inférieur ou égal à disponible avant !")
      }
    }

    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormEng({ ...formEng, ...newField}); 

    if (fieldName ==="proced") {
      if (fieldValue ==="EN01") {
        setDisableAvecDecision(true);formEng.avecDecision.value = false;
        setDisableCorrigerLaDecision(true);
        setDisableAuProfitDuCompte(true);
        setDisableEffacerAuProfitDuCompte(true);
      } else {
        setDisableAvecDecision(false);
        setDisableCorrigerLaDecision(false);
        setDisableAuProfitDuCompte(false);
        setDisableEffacerAuProfitDuCompte(false);
      }
    }

    if (fieldName ==="auProfit") {
      formEng.idFourn.value = "";
      formEng.ifuMle.value = "";
      formEng.nom.value = "";
      setCompteDestinataires([])
    } 
  }

  const handleCheckboxInputChangeFormEng = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: boolean = e.target.checked;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormEng({ ...formEng, ...newField});

    if (fieldName ==="apartirDemandLiq") {
      if (fieldValue) {
        handleShowModalSelectionnerRDL();
      } else {
        RDLDecoche();
      }
    }

    if (fieldName ==="apartirContrat") {
      if (fieldValue) {
        handleShowModalSelectionnerLeContrat();
      } else {
        contratDecoche();        
      }
    }
  }

  const RDLDecoche = () => {
    setDisableSelectionnerRDL(true);
    setDisableGenererRDL(true);
    setDisableRappelPiecesJustificatives(true);
    
    formEng.dateLiq.value = "";
    formEng.numeroDemande.value = "";
    formEng.codLiq.value = "";
    formEng.idContrat.value = "";
    formEng.montant.value = 0;
    formEng.auProfit.value = "F";
    formEng.idFourn.value = "";
    formEng.ifuMle.value = "";
    formEng.nom.value = "";
    formEng.natDepense.value = "";
    formEng.numBeRDL.value = "";    
  }

  const contratDecoche = () => {
    setDisableSelectionnerLeContrat(true);
    setDisableAuProfit(false);
    setDisableSelectionnerLeBeneficiare(false);
    setDisableAvecMandatDOrdre(false);  

    formEng.idContrat.value = "";
    formEng.referenceContrat.value = "";
    formEng.dateSaisieContrat.value = "";
    formEng.montantContrat.value = 0;
    formEng.engageContrat.value = 0;
    formEng.resteAEngagerContrat.value = 0; 
    //formEng.montant.value = 0;
    //formEng.auProfit.value = 'F';
    //formEng.idFourn.value = "";
    //formEng.ifuMle.value = "";
    //formEng.nom.value = "";  
    //formEng.natDepense.value = "";   
  }

  const validateFormEng = () => {
    let newForm: FormEng = formEng;

    // Ligne budgétaire
    if(formEng.codBud.value === "") {
      const errorMsg: string = 'Ligne budgetaire obligatoire !';
      const newField: Field = { value: formEng.codBud.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ codBud: newField } };
      setBorderColorSelectionnerLigneBudgetaire("red")
    } else {
      const newField: Field = { value: formEng.codBud.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ codBud: newField } };
      setBorderColorSelectionnerLigneBudgetaire("")
    }

    // Beneficiaire
    if(formEng.idFourn.value === "") {
      const errorMsg: string = 'Destinataire obligatoire !';
      const newField: Field = { value: formEng.idFourn.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ idFourn: newField } };
      setBorderColorSelectionnerBeneficiaire("red")
    } else {
      const newField: Field = { value: formEng.idFourn.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ idFourn: newField } };
      setBorderColorSelectionnerBeneficiaire("")
    }

    // Procedure
    if(formEng.proced.value === "") {
      const errorMsg: string = 'Procédure obligatoire !';
      const newField: Field = { value: formEng.proced.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ proced: newField } };
      setBorderColorProced("red")
    } else {
      const newField: Field = { value: formEng.proced.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ proced: newField } };
      setBorderColorProced("")
    }

    // Montant Eng
    if(formEng.montant.value === "" || formEng.montant.value <= 0) {
      const errorMsg: string = 'Montant obligatoire !';
      const newField: Field = { value: formEng.montant.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ montant: newField } };
      setBorderColorMontant("red")
    } else {
      const newField: Field = { value: formEng.montant.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ montant: newField } };
      setBorderColorMontant("")
    }

    // Nature depense
    if(formEng.natDepense.value === "") {
      const errorMsg: string = 'Object obligatoire !';
      const newField: Field = { value: formEng.natDepense.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ natDepense: newField } };
      setBorderColorObjet("red")
    } else {
      const newField: Field = { value: formEng.natDepense.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ natDepense: newField } };
      setBorderColorObjet("")
    }

    setFormEng(newForm);
    return newForm.codBud.isValid && newForm.idFourn.isValid && newForm.proced.isValid && newForm.montant.isValid && newForm.natDepense.isValid;
  }

  const handleSubmitFormEng = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormEng()) {
      Swal.fire({
        title: 'GesBud',
        text: "Veuillez renseigner les parties encadrées en rouge !",
        icon: 'warning',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
      });
      return;
    }

    // On demande une confirmation avant toute action si la gestion est close
    if (isGestionClose) {
      Swal.fire({
        title: 'GesBud',
        text: "Cette gestion est déjà close. Voulez-vous néamoins continuer l'enregistrement ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
      }).then( (result) => {
        if (result.isConfirmed) {
          addEng();
        }
      });
    } else {
      addEng();
    }    
  }

  const addEng = () => {
    if (formEng.proced.value ==='EN01') {
        // CREATION D'UN ENGAGEMENT EN PROCEDURE NORMALE
        let newEng: EngagementRequestDto = emptyEngagementRequestDto;
        newEng.dateCreation = (isGestionClose === true)? dateEnregistrementPourGestionClose : new Date();
        newEng.natDepense = formEng.natDepense.value;
        newEng.auProfit = formEng.auProfit.value;
        newEng.montant = removeNonNumeric(formEng.montant.value);
        newEng.dotInitiale = formEng.dotInitiale.value;
        newEng.dispoAvant = formEng.dispoAvant.value;
        newEng.dateEtat = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
        newEng.idUser = utilisateurCourante;
        newEng.avecDecision = false;
        newEng.apartirDemandLiq = formEng.apartirDemandLiq.value;
        newEng.grh = formEng.grh.value;
        newEng.receptionne = formEng.receptionne.value;
        newEng.dateValid = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
        newEng.dateCreat = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
        newEng.codLiq = null;
        newEng.codBord = null;
        newEng.idContrat = formEng.idContrat.value;
        newEng.idEngParent = formEng.idEngParent.value; // ???
        newEng.etat = 'E0'; // E0 lors de la création
        newEng.idEtatTrans = 0; // 0 lors de la création
        newEng.proced = formEng.proced.value;
        newEng.codBud = formEng.codBud.value;
        newEng.idBudget = idBudget;
        newEng.idFourn = formEng.idFourn.value;
        newEng.gestion = gestionCourante;
        
        EngagementService.add(newEng).then(data => {
          // ON ENREGISTRE LES PIECES JUSTIFICATIVES DANS PieceJustif
          let pieceJustifs: PieceJustifRequestDto[] = [];
          pjSelectionnees.forEach(item => {
            pieceJustifs.push({
              numBe: data.numBe,
              codLiq: data.codLiq,
              numMand: null,
              pieceJustificative: item.pj,
              numero: item.numero,
              datePj: item.date,
              montant: item.montant,
              idRetenu: null, // A demander
              idBord: null, // A demander
            });
          });
          PieceJustifService.addPiecesJustificatives(data.numBe, pieceJustifs).then(res => {
            if (res) {
              formEng.montant.value = data.montant;
              formEng.benum.value = data.benum;
              formEng.dateCreation.value = data.dateCreation;
              getDepenses(); // Pour actu ls ligne budgetaires
              setDisabledEnregistrer(true);
              setDisableEditerEngagment(false);
              setDisableRenseignementLigneBudgetaire(true);
              setDisableMontantEngagement(true);
              okSuccessDialog("Engagment crée avec succès !");
            }
          })
        })
    } else {
        // CREATION D'UN ENGAGEMENT EN PROCEDURE SIMPLIFIEE
        let newEng: EngagementRequestDto = emptyEngagementRequestDto;
        newEng.dateCreation = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
        newEng.natDepense = formEng.natDepense.value;
        newEng.auProfit = formEng.auProfit.value;
        newEng.montant = removeNonNumeric(formEng.montant.value);
        newEng.dotInitiale = formEng.dotInitiale.value;
        newEng.dispoAvant = formEng.dispoAvant.value;
        newEng.dateEtat = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
        newEng.idUser = utilisateurCourante;
        newEng.avecDecision = formEng.avecDecision.value;
        newEng.apartirDemandLiq = formEng.apartirDemandLiq.value;
        newEng.grh = formEng.grh.value;
        newEng.receptionne = formEng.receptionne.value;
        newEng.dateValid = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
        newEng.dateCreat = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
        newEng.codLiq = null;
        newEng.codBord = null;
        newEng.idContrat = formEng.idContrat.value;
        newEng.idEngParent = formEng.idEngParent.value; // ???
        newEng.etat = 'E0'; // E0 lors de la création
        newEng.idEtatTrans = 0; // 0 lors de la création
        newEng.proced = formEng.proced.value;
        newEng.codBud = formEng.codBud.value;
        newEng.idBudget = idBudget;
        newEng.idFourn = formEng.idFourn.value;
        newEng.gestion = gestionCourante;

        EngagementService.add(newEng).then(engagement => {
          // CREATION DU MANDAT DE L'ENGAGEMENT
          let newMand: MandatRequestDto = emptyMandatRequestDto;
          newMand.dateMand = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
          newMand.montant = engagement.montant;
          newMand.dateEtat = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
          newMand.datePaie = null;
          newMand.montantPaie = null;
          newMand.idCompte = null;
          newMand.idUser = utilisateurCourante;
          newMand.datePosition = null;
          newMand.benum = engagement.benum;
          newMand.objet = engagement.natDepense;
          newMand.montEngage = engagement.montant;
          newMand.montDjaLiq = 0;
          newMand.dateEtatBl = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
          newMand.datePec = null;
          newMand.receptionne = false; 
          newMand.genererOv = false; 
          newMand.avecReversement = false;
          newMand.precompte = 0; 
          newMand.datePrecompte = null;
          newMand.userPrecompte = null;
          newMand.dateValid = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
          newMand.idFiche = 0;
          newMand.montantTotalPec = 0;
          newMand.dateCreat = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
          newMand.estOrdre = formEng.estOrdre.value;
          newMand.mandNumApresVisaCf = 0;
          newMand.idEtatTransL = 0; // à transmettre
          newMand.idEtatTransM = 0; // à transmettre
          newMand.idBordEmis = null;
          newMand.idBord = null;
          newMand.codBud = engagement.codBud;
          newMand.idBudget = engagement.idBudget;
          newMand.compteFourn = formEng.compteFourn.value;
          newMand.idContrat = engagement.idContrat;
          newMand.idFourn = engagement.idFourn;
          newMand.gestion = engagement.gestion;
          newMand.codLiq = engagement.codLiq;
          newMand.idLettrage = null;
          newMand.idModePaie = null;
          newMand.numBe = engagement.numBe;
          newMand.etat = 'M0'; // Nouveau mandat
          newMand.etatBl = 'L0'; // Nouvelle liquidation
          newMand.numMandParent = null;
          MandatService.add(newMand).then(mandat => {
            // ON ENREGISTRE LES PIECES JUSTIFICATIVES DANS PieceJustif
            let pieceJustifs: PieceJustifRequestDto[] = [];
            pjSelectionnees.forEach(item => {
              pieceJustifs.push({
                numBe: engagement.numBe,
                codLiq: engagement.codLiq,
                numMand: mandat.numMand,
                pieceJustificative: item.pj,
                numero: item.numero,
                datePj: item.date,
                montant: item.montant,
                idRetenu: null, // A demander
                idBord: null, // A demander
              });
            });
            PieceJustifService.addPiecesJustificatives(engagement.numBe, pieceJustifs).then(res => {
              if (res) {
                formEng.montant.value = engagement.montant;
                formEng.benum.value = engagement.benum;
                formEng.dateCreation.value = engagement.dateCreation;
                getDepenses(); // Pour actu ls ligne budgetaires
                setDisabledEnregistrer(true);
                setDisableEditerEngagment(false);
                setDisableRenseignementLigneBudgetaire(true);
                setDisableMontantEngagement(true);
                if (engagement.avecDecision) setDisableEditerDecision(false);
                okSuccessDialog("Engagment crée avec succès !");
              }
            })
          })
        })
    }
  }

  const handleAddEng = () => {
    initFormEng();
    handleShowModalSelectionnerLigneBudgetaire();
  }

  const getCompteDestinataires = (idDest: number) => {
    CompteDestinataireService.getByDestinataires(idDest).then(data => {
      if (data.length !== 0) {
        formEng.compteFourn.value = data[0].id;
      } else {
        formEng.compteFourn.value = null;
      }
      setCompteDestinataires(data);
    })
  }
  ///////////////// GESTION ENGAGEMENT

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

  ///////////////// GESTION SELECTIONNER RDL
  const [rdls, setRdls] = useState<any[]>([]);
  const [filteredRdls, setFilteredRdls] = useState<any[]>([]);
  const [showModalSelectionnerRDL, setShowModalSelectionnerRDL] = useState(false);

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

  const [formRRDL, setFormRRDL] = useState<FormRRDL>({
    nom: { value: ''},
  })

  const handleInputChangeFormRRDL = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormRRDL({ ...formRRDL, ...newField})
  }

  useEffect( () => {
    const results = rdls.filter(item => {
      return ((item.nom || '').toString().toLowerCase().includes(formRRDL.nom.value.toString().toLowerCase()))
    })
    setFilteredRdls(results);
  }, [formRRDL])

  useEffect( () => {
    getRdls()
  }, [])

  const getRdls = () => {
    LiquidationsPourCreationEngagementViewService.getByGestion(Number(gestionCourante)-1).then(data => {
      setRdls(data) 
      setFilteredRdls(data)
    })
  }

  const handleCloseModalSelectionnerRDL = () => {
    // SI LE NUMERO EST DEFINI ALORS UN RDL EST SELECTIONNEE
    if (formEng.numeroDemande.value) { 
      formEng.apartirDemandLiq.value = true;
      setDisableSelectionnerRDL(false);
      setDisableGenererRDL(false);
    } else {
      formEng.apartirDemandLiq.value = false;
    }
    setShowModalSelectionnerRDL(false);
  }

  const handleShowModalSelectionnerRDL = () => {
    setShowModalSelectionnerRDL(true);
  }

  const handleSelectionnerRDLButtonClick = () => {
    handleShowModalSelectionnerRDL()
  }
  ///////////////// GESTION SELECTIONNER RDL

  ///////////////// GESTION GENERER RDL
  const handleGenererRDLButtonClick = () => {
    
  }
  ///////////////// GESTION GENERER RDL

  ///////////////// GESTION GENERER CI
  const handleGenererCIButtonClick = () => {
    
  }
  ///////////////// GESTION GENERER CI

  ///////////////// GESTION SELECTIONNER LA LINGE BUDGETAIRE : BUDGET DEPENSES AVEC DISP > 0
  const [depenses, setDepenses] = useState<any[]>([]);
  const [filteredDepenses, setFilteredDepenses] = useState<any[]>([]);
  const [showModalSelectionnerLigneBudgetaire, setShowModalSelectionnerLigneBudgetaire] = useState(false);

  const tableDepenseColumns = [
    {
      name: "Compte",
      selector: (row: any) => row.idPlan,
      width: "100px",
      center: true,
    },
    {
      name: "Intitule",
      selector: (row: any) => row.intitule,
      wrap: true
    },
    {
      name: "Dotation Corrigée",
      selector: (row: any) => Number(row.dotationCorrigee).toLocaleString(),
      width: "150px",
      right: true,
    },
    {
      name: "Exécution",
      selector: (row: any) => Number(row.totalEngag).toLocaleString(),
      width: "100px",
      right: true,
    },
    {
      name: "Disponible",
      selector: (row: any) => Number(row.disponible).toLocaleString(),
      width: "100px",
      right: true,
    }
  ]

  const [formRCpteBudgetaireDepense, setFormRCpteBudgetaireDepense] = useState<FormRCpteBudgetaireDepense>({
    idPlan: { value: ''},
    intitule: { value: ''},
  })

  const handleInputChangeFormRCpteBudgetaireDepense = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormRCpteBudgetaireDepense({ ...formRCpteBudgetaireDepense, ...newField})
  }

  useEffect( () => {
    const results = depenses.filter(item => {
      return ((item.idPlan || '').toString().startsWith(formRCpteBudgetaireDepense.idPlan.value))
      && ((item.intitule || '').toString().toLowerCase().includes(formRCpteBudgetaireDepense.intitule.value.toString().toLowerCase()))
    })
    setFilteredDepenses(results);
  }, [formRCpteBudgetaireDepense])

  useEffect( () => {
    getDepenses()
  }, [])

  const getDepenses = () => {
    DepensesPourCreationEngagementViewViewService.getByGestionAndIdBudget(Number(gestionCourante), Number(idBudget)).then(data => {
      setDepenses(data) 
      setFilteredDepenses(data)
    })
  }

  const handleCloseModalSelectionnerLigneBudgetaire = () => {
    setShowModalSelectionnerLigneBudgetaire(false);
  }

  const handleShowModalSelectionnerLigneBudgetaire = () => {
    setShowModalSelectionnerLigneBudgetaire(true);
  }

  const handleSelectionnerLigneBudgetaireButtonClick= () => {
    handleShowModalSelectionnerLigneBudgetaire();
  }
  ///////////////// GESTION SELECTIONNER LA LINGE BUDGETAIRE : BUDGET DEPENSES AVEC DISP > 0

  ///////////////// GESTION SELECTIONNER LE CONTRAT
  const [contrats, setContrats] = useState<any[]>([]);
  const [filteredContrats, setFilteredContrats] = useState<any[]>([]);
  const [showModalSelectionnerLeContrat, setShowModalSelectionnerLeContrat] = useState(false);
  const [contratTypes, setContratTypes] = useState<any[]>([]);

  const tableContratColumns = [
    {
      name: "ID",
      selector: (row: any) => row.idContrat,
      width: "60px",
      center: true,
    },
    {
      name: "Type",
      selector: (row: any) => row.libelle,
      width: "90px",
      wrap: true,
    },
    {
      name: "Numero",
      selector: (row: any) => row.reference,
      width: "200px",
      wrap: true
    },
    {
      name: "Objet",
      selector: (row: any) => row.objet,
      width: "300px",
      wrap: true
    },
    {
      name: "Prestataire",
      selector: (row: any) => row.nom,
      width: "200px",
      wrap: true
    },
    {
      name: "Montant",
      selector: (row: any) => Number(row.montant).toLocaleString(),
      width: "110px",
      right: true,
    },
    {
      name: "Engagé",
      selector: (row: any) => Number(row.engage).toLocaleString(),
      width: "110px",
      right: true,
    },
    {
      name: "Reste à engagé",
      selector: (row: any) => Number(row.resteAEngager).toLocaleString(),
      width: "110px",
      right: true,
    }
  ]

  const [formRCContrat, setFormRCContrat] = useState<FormRCContrat>({
    type: { value: ''},
    nom: { value: ''},
  })

  const handleInputChangeFormRCContrat = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormRCContrat({ ...formRCContrat, ...newField})
  }

  useEffect( () => {
    const results = contrats.filter(item => {
      return ((item.type || '').toString().toLowerCase().includes(formRCContrat.type.value.toString().toLowerCase()))
      && ((item.nom || '').toString().toLowerCase().includes(formRCContrat.nom.value.toString().toLowerCase()))
    })
    setFilteredContrats(results);
  }, [formRCContrat])

  useEffect( () => {
    getContrats()
    getContratTypes()
  }, [])

  const getContrats = () => {
    ContratsPourCreationEngagementViewService.getByGestionAndIdBudget(Number(gestionCourante), Number(idBudget)).then(data => {
      setContrats(data) 
      setFilteredContrats(data)
    })
  }

  const getContratTypes = () => {
    ContratTypeService.getAll().then(data => {
      setContratTypes(data)
    })
  }

  const handleCloseModalSelectionnerLeContrat = () => {
    // SI IDCONTRAT EST DEFINI ET RDL N'EST PAS SELECTIONNE ALORS UN CONTRAT EST SELECTIONNEE
    if (formEng.idContrat.value && formEng.apartirDemandLiq.value === false) { 
      formEng.apartirContrat.value = true;
      setDisableSelectionnerLeContrat(false); 
      setDisableAuProfit(true);
      setDisableSelectionnerLeBeneficiare(true);
      setDisableAvecMandatDOrdre(true);
    } else {
      formEng.apartirContrat.value = false;
    }
    setShowModalSelectionnerLeContrat(false);
  }

  const handleShowModalSelectionnerLeContrat = () => {
    setShowModalSelectionnerLeContrat(true);
  }

  const handleSelectionnerLeContratButtonClick = () => {
    handleShowModalSelectionnerLeContrat();
  }
  ///////////////// GESTION SELECTIONNER LE CONTRAT

  ///////////////// GESTION SELECTIONNER LE BENEFICIAIRE
  const [beneficiaires, setBeneficiaires] = useState<any[]>([]);
  const [filteredBeneficiaires, setFilteredBeneficiaires] = useState<any[]>([]);
  const [showModalSelectionnerLeBeneficiaire, setShowModalSelectionnerLeBeneficiaire] = useState(false);

  const tableBeneficiaireColumns = [
    {
      name: "ID",
      selector: (row: any) => row.idDest,
      width: "60px",
      center: true,
    },
    {
      name: "Nom",
      selector: (row: any) => row.nom,
      wrap: true
    },
    {
      name: "IFU/MLE",
      selector: (row: any) => row.ifumle,
      width: "200px",
      wrap: true
    },
  ]

  const [formRBeneficiaire, setFormRBeneficiaire] = useState<FormRBeneficiaire>({
    type: { value: 'autresTiers'},
    nom: { value: ''},
    ifumle: { value: ''},
  })

  const handleInputChangeFormRBeneficiaire = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormRBeneficiaire({ ...formRBeneficiaire, ...newField})
  }

  useEffect( () => {
    if (formRBeneficiaire.type.value ==='autresTiers') {
      const results = beneficiaires.filter(item => {
        return ((item.ftype || '').toString().includes("F"))
        && ((item.nom || '').toString().toLowerCase().includes(formRBeneficiaire.nom.value.toString().toLowerCase()))
        && ((item.ifumle || '').toString().toLowerCase().includes(formRBeneficiaire.ifumle.value.toString().toLowerCase()))
      })
      setFilteredBeneficiaires(results);
    }
    if (formRBeneficiaire.type.value ==='banques') {
      const results = beneficiaires.filter(item => {
        return ((item.ftype || '').toString().includes("I"))
        && ((item.nom || '').toString().toLowerCase().includes(formRBeneficiaire.nom.value.toString().toLowerCase()))
        && ((item.ifumle || '').toString().toLowerCase().includes(formRBeneficiaire.ifumle.value.toString().toLowerCase()))
      })
      setFilteredBeneficiaires(results);
    }
    if (formRBeneficiaire.type.value ==='caissesPopulaires') {
      const results = beneficiaires.filter(item => {
        return ((item.ftype || '').toString() !== 'F') && ((item.ftype || '').toString() !== 'I')
        && ((item.nom || '').toString().toLowerCase().includes(formRBeneficiaire.nom.value.toString().toLowerCase()))
        && ((item.ifumle || '').toString().toLowerCase().includes(formRBeneficiaire.ifumle.value.toString().toLowerCase()))
      })
      setFilteredBeneficiaires(results);
    }
  }, [formRBeneficiaire])

  useEffect( () => {
    getBeneficiaires()
  }, [])

  const getBeneficiaires = () => {
    DestinataireService.getDestinataireSansAgents().then(data => {
      setBeneficiaires(data) 
      const results = data.filter(item => {
        return ((item.ftype || '').toString().includes("F"))
        && ((item.nom || '').toString().toLowerCase().includes(formRBeneficiaire.nom.value.toString().toLowerCase()))
        && ((item.ifumle || '').toString().toLowerCase().includes(formRBeneficiaire.ifumle.value.toString().toLowerCase()))
      })
      setFilteredBeneficiaires(results);
    })
  }

  const handleCloseModalSelectionnerLeBeneficiaire = () => {
    setShowModalSelectionnerLeBeneficiaire(false);
  }

  const handleShowModalSelectionnerLeBeneficiaire = () => {
    setShowModalSelectionnerLeBeneficiaire(true);
  }

  const handleSelectionnerLeBeneficiaireButtonClick = () => {
    if (formEng.auProfit.value ==='F') handleShowModalSelectionnerLeBeneficiaire(); 
    else handleShowModalSelectionnerAgent();
  }
  ///////////////// GESTION SELECTIONNER LE BENEFICIAIRE

  ///////////////// GESTION SELECTIONNER AGENT
  const [agents, setAgents] = useState<any[]>([]);
  const [filteredAgents, setFilteredFilteredAgents] = useState<any[]>([]);
  const [showModalSelectionnerAgent, setShowModalSelectionnerAgent] = useState(false);
  const [directionServiceResponseDtos, setDirectionServiceResponseDtos] = useState<DirectionServiceResponseDto[]>([]);
  const [operationAgent, setOperationAgent] = useState<string>("add");

  const [formAgent, setFormAgent] = useState<FormAgent>({
    ifumle: { value: '' },
    mle: { value: '' },
    nom: { value: '' },
    prenom: { value: '' },
    telephone: { value: '' },
    email: { value: '' },
    sexe: { value: '' },
    service: { value: '' },
    signataire: { value: '' },
    titreHonorifique: { value: '' },
    actif: { value: true }
  })

  const initFormAgent = () => {
    setOperationAgent('add');
    setFormAgent({
      ifumle: { value: '' },
      mle: { value: '' },
      nom: { value: '' },
      prenom: { value: '' },
      telephone: { value: '' },
      email: { value: '' },
      sexe: { value: '' },
      service: { value: '' },
      signataire: { value: '' },
      titreHonorifique: { value: '' },
      actif: { value: true }
    })
  }

  const tableAgentColumns = [
    {
      name: "Matricule",
      selector: (row: any) => row.ifumle,
      sortable: true
    },
    {
      name: "Nom",
      selector: (row: any) => row.nom,
      sortable: true
    },
    {
      name: "Prénom",
      selector: (row: any) => row.prenom,
      sortable: true
    },
    {
      name: "Sexe",
      selector: (row: any) => (row.sexe === 'M')? 'Masculin' :  'Féminin',
      sortable: true
    },
    {
      name: "Service",
      selector: (row: any) => row.libelle,
      sortable: true
    },
    {
      name: "Actif",
      selector: (row: any) => <Form.Check type='checkbox' checked={row.actif} className='label2' />
    },
    {
      name: "Signataire",
      selector: (row: any) => row.signataire,
      sortable: true
    },
    {
      name: "Titre honorifique",
      selector: (row: any) => row.titreHonoSign,
    },
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            <Button variant="outline-warning" title="Modifier" className='me-1' onClick={() => handleEditAgent(row)}><BsPencilSquare /></Button>
            <Button variant="outline-danger" title="Supprimer" className='me-1' onClick={() => handleDeleteAgent(row.mle)}><BsTrash /></Button>
        </ButtonGroup>
      )
    }
  ]

  const handleInputChangeFormAgent = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormAgent({ ...formAgent, ...newField})
  }

  const handleCheckboxInputChangeFormAgent = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: boolean = e.target.checked;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormAgent({ ...formAgent, ...newField})
  }

  const validateFormAgent = () => {
    let newForm: FormAgent = formAgent;

    // Nom
    if(formAgent.nom.value === "") {
      const errorMsg: string = 'Nom obligatoire !';
      const newField: Field = { value: formAgent.nom.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ nom: newField } };
    } else {
      const newField: Field = { value: formAgent.nom.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ nom: newField } };
    }

    // Prenom
    if(formAgent.prenom.value === "") {
      const errorMsg: string = 'Prenom obligatoire !';
      const newField: Field = { value: formAgent.prenom.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ prenom: newField } };
    } else {
      const newField: Field = { value: formAgent.prenom.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ prenom: newField } };
    }

    // Sexe
    if(formAgent.sexe.value === "") {
      const errorMsg: string = 'Sexe obligatoire !';
      const newField: Field = { value: formAgent.sexe.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ sexe: newField } };
    } else {
      const newField: Field = { value: formAgent.sexe.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ sexe: newField } };
    }

    // Service
    if(formAgent.service.value === "") {
      const errorMsg: string = 'Service obligatoire !';
      const newField: Field = { value: formAgent.service.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ service: newField } };
    } else {
      const newField: Field = { value: formAgent.service.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ service: newField } };
    }

    setFormAgent(newForm);

    return newForm.nom.isValid && newForm.prenom.isValid && newForm.sexe.isValid && newForm.service.isValid;
  }

  const handleSubmitFormAgent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormAgent()) {
      Swal.fire({
        title: 'GesBud',
        text: 'Les champs nom, prenom, sexe et service sont obligatoires !',
        icon: 'warning',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
      });
      return;
    }  

    if (operationAgent === 'add') addAgent();
    if (operationAgent === 'edit') editAgent(); 
  }

  const libelleOperationAgent = () => {
    if (operationAgent === 'add') return "Ajouter agent"
    if (operationAgent === 'edit') return "Modifier agent"
  }

  const libelleButtonSumbitAgent = () => {
    if (operationAgent === 'add') return "Enregistrer"
    if (operationAgent === 'edit') return "Enregistrer"
  }

  const handleAddAgent = () => {
    initFormAgent();
  }

  const handleEditAgent = (row: any) => {
    setOperationAgent("edit")
    setFormAgent({
      ifumle: { value: row.ifumle, isValid: true },
      mle: { value: row.mle, isValid: true },
      nom: { value: row.nom, isValid: true },
      prenom: { value: row.prenom, isValid: true },
      telephone: { value: row.contactTel, isValid: true },
      email: { value: row.contactEmail, isValid: true },
      sexe: { value: row.sexe, isValid: true },
      service: { value: row.idService, isValid: true },
      signataire: { value: row.signataire, isValid: true },
      titreHonorifique: { value: row.titreHonoSign, isValid: true },
      actif: { value: row.actif, isValid: true }
    })
  }

  const handleDeleteAgent = (id: number) => {
    initFormAgent()
    setOperationAgent('add')
    Swal.fire({
      title: 'GesBud',
      text: "Supprimer cet agent ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      allowOutsideClick: false,
      confirmButtonColor: '#007E33' 
    }).then( (result) => {
      if (result.isConfirmed) {
        DestinataireService.delete(id).then(() => {
          getAgents();
          okSuccessDialog("Agent supprimé avec success !");
        });
      }
    });
  }

  const addAgent = () => {
    let newObject: AgentRequestDto = emptyAgentRequestDto;
    newObject.nom = formAgent.nom.value;
    newObject.prenom = formAgent.prenom.value;
    newObject.sexe = formAgent.sexe.value;
    newObject.signataire = formAgent.signataire.value;
    newObject.titreHonoSign = formAgent.titreHonorifique.value;
    newObject.actif = formAgent.actif.value;
    newObject.idService = formAgent.service.value;
    AgentService.add(newObject).then( data => {
      editDestinataire(data.mle, "Agent ajouté avec success !")
    })
  }

  const editAgent = () => {
    let newObject: AgentRequestDto = emptyAgentRequestDto;
    newObject.nom = formAgent.nom.value;
    newObject.prenom = formAgent.prenom.value;
    newObject.sexe = formAgent.sexe.value;
    newObject.signataire = formAgent.signataire.value;
    newObject.titreHonoSign = formAgent.titreHonorifique.value;
    newObject.actif = formAgent.actif.value;
    newObject.idService = formAgent.service.value;
    AgentService.edit(formAgent.mle.value, newObject).then( () => {
      editDestinataire(formAgent.mle.value, "Agent modifié avec success !")
    })
  }

  const editDestinataire = (id: number, message: string) => {
    let newObject: DestinataireRequestDto = emptyDestinataireRequestDto;
    newObject.ifumle = formAgent.ifumle.value;
    newObject.ftype = "A";
    newObject.contactTel = formAgent.telephone.value;
    newObject.contactEmail = formAgent.email.value;
    DestinataireService.edit(id, newObject).then( () => {
      getAgents()
      initFormAgent();
      Swal.fire({
        title: 'GesBud',
        text: message,
        icon: 'success',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
      });
    })
  }

  useEffect( () => {
    const results = agents.filter(item => {
      return ((item.ifumle || '').toString().toLowerCase().includes(formAgent.ifumle.value.toString().toLowerCase()))
      && ((item.nom || '').toString().toLowerCase().includes(formAgent.nom.value.toString().toLowerCase()))
      && ((item.prenom || '').toString().toLowerCase().includes(formAgent.prenom.value.toString().toLowerCase()))
      && ((item.contactTel || '').toString().toLowerCase().includes(formAgent.telephone.value.toString().toLowerCase()))
      && ((item.contactEmail || '').toString().toLowerCase().includes(formAgent.email.value.toString().toLowerCase()))
      && ((item.sexe || '').toString().toLowerCase().includes(formAgent.sexe.value.toString().toLowerCase()))
      && ((item.idService || '').toString().toLowerCase().includes(formAgent.service.value.toString().toLowerCase()))
      && ((item.signataire || '').toString().toLowerCase().includes(formAgent.signataire.value.toString().toLowerCase()))
      && ((item.titreHonoSign || '').toString().toLowerCase().includes(formAgent.titreHonorifique.value.toString().toLowerCase()))  
      && ((item.actif === formAgent.actif.value))  
    })
    setFilteredFilteredAgents(results);
  }, [formAgent])

  useEffect( () => {
    getAgents();
    getDirectionServices();
  }, [])

  const getAgents = () => {
    AgentsDirectionServiceSDestinatairesViewService.getAll().then(data => {
      setAgents(data) 
    })
  }

  useEffect( () => {
    setFilteredFilteredAgents(agents)
  }, [agents])

  const getDirectionServices = () => {
    DirectionServiceService.getAll().then( data => setDirectionServiceResponseDtos(data));
  }

  const handleCloseModalSelectionnerAgent = () => {
    setShowModalSelectionnerAgent(false);
  }

  const handleShowModalSelectionnerAgent = () => {
    setShowModalSelectionnerAgent(true);
  }
  ///////////////// GESTION SELECTIONNER AGENT

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
  const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [pjSelectionneePourEtreRemplace, setPjSelectionneePourEtreRemplace] = useState<PJPourEngagement>(emptyPJPourEngagement);

  const tablePjSelectionneesColumns: GridColDef[] = [
    {
      field: 'pj',
      headerName: 'Piece justificative',
      type: 'string',
      editable: true,
      width: 350,
      headerClassName: 'header',
    },
    {
      field: 'numero',
      headerName: 'Numero',
      type: 'string',
      editable: true,
      width: 200,
      headerClassName: 'header',
    },
    {
      field: 'date',
      headerName: 'Date',
      type: 'date',
      editable: true,
      width: 100,
      headerClassName: 'header',
    },
    {
      field: 'montant',
      headerName: 'Montant',
      type: 'number',
      editable: true,
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
            icon={<Button variant="outline-primary" size="sm" title="PJ">PJ</Button>}
            label="PJ"
            onClick={handleRemplacerPjSelectionnee(params.row)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<Button variant="outline-danger" size="sm" title="Supprimer"><BsTrash /></Button>}
            label="Delete"
            onClick={handleDeletePjSelectionnee(params.row)}
            color="inherit"
          />,
        ];
      },
      headerClassName: 'header',
    } 
  ];

  const processRowUpdatePjSelectionnees = (newRow: GridRowModel, oldRow: GridRowModel): GridRowModel => {
    return new Promise<GridRowModel>((resolve, reject) => {
      // La nouvelle ligne
      const newObject: PJPourEngagement = {
        identifiant: newRow.identifiant,
        pj: newRow.pj,
        numero: newRow.numero,
        date: newRow.date,
        montant: newRow.montant,
        codLiq: null
      }
      // Remplacer l'ancienne ligne par la nouvelle ligne en utilisant l'index et en effectuant une copy d'abord
      const indexOfObject = pjSelectionnees.findIndex(item => item.identifiant === newObject.identifiant);
      const pjSelectionneesCopy = [...pjSelectionnees];
      pjSelectionneesCopy[indexOfObject] = newObject;
      // Envoi la copy dans l'origine avec les bonnes infos
      setPjSelectionnees(pjSelectionneesCopy)
      
      // Promesse resolue
      resolve(newRow);
    });
  }

  const handleProcessRowUpdateError = (error: Error) => {
    setSnackbar({ children: error.message, severity: 'error' });
  };

  const handleDeletePjSelectionnee = (row: any) => () => {
    Swal.fire({
      title: 'GesBud',
      text: "Supprimer cet enregistrement ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      allowOutsideClick: false,
      confirmButtonColor: '#007E33' 
    }).then((result) => {
      if (result.isConfirmed) {
        const indexOfObject = pjSelectionnees.findIndex(item => item.identifiant === row.identifiant);
        setPjSelectionnees(pjSelectionnees.filter((item, index) => index !== indexOfObject))
        okSuccessDialog("Ligne supprimée avec succès !")
      }
    })
  }

  const handleRemplacerPjSelectionnee = (row: any) => () => {
    // ICI ON AFFICHE LE MODAL POUR REMPLACER UNE PJ
    setPjSelectionneePourEtreRemplace(row);
    setOperationAjouterPj(false);
    handleShowModalAjouterUnePieceJustificative();
  }

  function EditToolbar() {
    return (
      <GridToolbarContainer>
        <ButtonGroup size="sm">
          <Button size='sm' variant="outline-success" title="Ajouter une pièce justificative" className='me-1' style={{width: "100px"}} onClick={() => handleAjouterPieceJustificativeButtonClick()} disabled={disableAjouterUnePieceJustificative}><BsPlusLg /></Button>
          <Button size='sm' variant="outline-success" title="Rappel pieces justificatifives" onClick={() => handleRappelPiecesJustificativesButtonClick()} disabled={disableRappelPiecesJustificatives}>Rappel Pieces Justificatifives</Button>
        </ButtonGroup>
      </GridToolbarContainer>
    );
  }

  const handleAjouterPieceJustificativeButtonClick= () => {
    // ICI ON AFFICHE LE MODAL POUR AJOUTER UNE PJ
    setOperationAjouterPj(true);
    handleShowModalAjouterUnePieceJustificative();
  }

  ///////////////// GESTION PIECES JUSTIFICATIVES SELECTIONNEES POUR L'ENGAGEMENT

  ///////////////// GESTION AJOUTER UNE PIECE JUSTIFICATIVE
  const [pjs, setPjs] = useState<any[]>([]);
  const [filteredPjs, setFilteredPjs] = useState<any[]>([]);
  const [termPj, setTermPj] = useState<string>('');
  const [showModalAjouterUnePieceJustificative, setShowModalAjouterUnePieceJustificative] = useState(false);
  const [operationAjouterPj, setOperationAjouterPj] = useState<boolean>(true);

  const tablePjColumns = [
    {
      name: "Pièce justificative",
      selector: (row: any) => row.pj,
      sortable: true
    },
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            {(operationAjouterPj === true) && <Button variant="outline-primary" title="Cliquez pour jouter" style={{maxHeight:'30px'}} onClick={() => handleAjouterPj(row)}>Ajouter</Button>}
            {(operationAjouterPj === false) && <Button variant="outline-primary" title="Cliquez pour remplacer" style={{maxHeight:'30px'}} onClick={() => handleRemplacerPj(row)}>Remplacer</Button>}
        </ButtonGroup>
      ),
      width: "130px",
    }
  ]

  const handleAjouterPj = (row: any) => {
    const newObject: PJPourEngagement = {
      identifiant: pjSelectionnees.length+1,
      pj: row.pj,
      numero: "S/N",
      date: new Date(),
      montant: (row.avecMontant)? removeNonNumeric(formEng.montant.value)  : "",
      codLiq: null
    }
    setPjSelectionnees([...pjSelectionnees, newObject]);
  }

  const handleRemplacerPj = (newPj: any) => {
    // La nouvelle ligne
    const newObject: PJPourEngagement = {
      identifiant: pjSelectionneePourEtreRemplace.identifiant,
      pj: newPj.pj,
      numero: pjSelectionneePourEtreRemplace.numero,
      date: pjSelectionneePourEtreRemplace.date,
      montant: (newPj.avecMontant)? removeNonNumeric(formEng.montant.value) : "",
      codLiq: null
    }
    // Remplacer l'ancienne ligne par la nouvelle ligne en utilisant l'index et en effectuant une copy d'abord
    const indexOfObject = pjSelectionnees.findIndex(item => item.identifiant === newObject.identifiant);
    const pjSelectionneesCopy = [...pjSelectionnees];
    pjSelectionneesCopy[indexOfObject] = newObject;
    // Envoi la copy dans l'origine avec les bonnes infos
    setPjSelectionnees(pjSelectionneesCopy)
    // Fermer le Modal
    handleCloseModalAjouterUnePieceJustificative();
  }

  useEffect(() => {
    getPjs();
  }, [])

  const getPjs = () => {
    PjService.getAll().then(data => {
      setPjs(data)
      setFilteredPjs(data)
    })
  }

  const handleSearchPjInputChange = (e: any): void => {
    const term = e.target.value.toLowerCase();
    setTermPj(term);

    if(!term) {
      setFilteredPjs(pjs);
    } else {
      const results = pjs.filter(item => {
        return Object.keys(item).some(key => {
          return item[key] && item[key].toString().toLowerCase().includes(term);
        })
      })
      setFilteredPjs(results);
    }
  }

  const handleCloseModalAjouterUnePieceJustificative = () => {
    setShowModalAjouterUnePieceJustificative(false);
  }

  const handleShowModalAjouterUnePieceJustificative = () => {
    setShowModalAjouterUnePieceJustificative(true);
  }
  ///////////////// GESTION AJOUTER UNE PIECE JUSTIFICATIVE

  ///////////////// GESTION RAPPEL PIECES JUSTIFICATIVES
  const [pjRDLs, setPjRDLs] = useState<any[]>([]);
  const [showModalRappelPiecesJustificatives, setShowModalRappelPiecesJustificatives] = useState(false);
  const [pjRDLCochees, setPjRDLCochees] = useState<any[]>([]);
  var _pjRDLCochees: any[] = [];

  const tablePjRDLColumns = [
    {
      name: "Pièce justificative",
      selector: (row: any) => row.pieceJustificative,
      sortable: true
    },
    {
      name: "Numero",
      selector: (row: any) => row.numero,
      width: "200px"
    },
    {
      name: "Date",
      selector: (row: any) => row.datePj && new Date(row.datePj).toLocaleDateString(),
      width: "100px"
    },
    {
      name: "Montant",
      selector: (row: any) => row.montant && Number(row.montant).toLocaleString(),
      width: "150px"
    }
  ]

  const handleOk = () => {
    setPjRDLCochees(_pjRDLCochees);
    const pjSelectionneesCopy = [...pjSelectionnees];
    _pjRDLCochees.forEach(item => {
      const newObject: PJPourEngagement = {
        identifiant: pjSelectionneesCopy.length+1,
        pj: item.pieceJustificative,
        numero: item.numero,
        date: new Date(item.datePj),
        montant: item.montant,
        codLiq: null
      }
      pjSelectionneesCopy.push(newObject);
    })
    
    setPjSelectionnees(pjSelectionneesCopy)
    handleCloseModalRappelPiecesJustificatives();
  }

  const getPjRDLs = (numBeRDL: number) => {
    PieceJustifService.getByNumBeOrderByPieceJustificative(formEng.numBeRDL.value).then(data => {
      setPjRDLs(data)
    })
  }

  const handleCloseModalRappelPiecesJustificatives = () => {
    setShowModalRappelPiecesJustificatives(false);
  }

  const handleShowModalRappelPiecesJustificatives = () => {
    setShowModalRappelPiecesJustificatives(true);
  }

  const handleRappelPiecesJustificativesButtonClick= () => {
    setPjSelectionnees([]);
    handleShowModalRappelPiecesJustificatives();
  }
  ///////////////// GESTION RAPPEL PIECES JUSTIFICATIVES

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
            <h6 className="shadow-sm text-primary text-center rounded">ENGAGEMENTS &gt; CREER UN ENGAGEMENT</h6>
            <Form onSubmit={(e) => handleSubmitFormEng(e)}>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <Form.Group as={Row}>
                    <InputGroup as={Col}>
                        <Form.Control name='' size='sm' value={"Engagement No :"} type="text" className='me-1' disabled />
                        <Form.Control name='' size='sm' value={gestionCourante} type="text" className='me-1' style={{maxWidth:"50px"}} disabled />
                        <Form.Control name='numBe' size='sm' value={String(formEng.benum.value).padStart(4, '0')} type="text" style={{maxWidth:"50px"}} disabled />
                    </InputGroup>
                    <Col>
                      <Form.Group controlId="dateCreation" as={Row}>
                        <Col xs={2}><Form.Label className="label2">du :</Form.Label></Col>
                        <Col><Form.Control name='dateCreation' size='sm' value={(formEng.dateCreation.value !== "")? formatDateWithHoursAndMinutes(new Date(formEng.dateCreation.value)) : ""} type="text" disabled /></Col>
                      </Form.Group>
                    </Col>
                    <ButtonGroup as={Col} size="sm" className='justify-content-end'>
                      <Button variant="outline-primary" title="Créer un nouveau engagment" className='me-1' style={{maxWidth:"100px", maxHeight:"30px"}} onClick={ () => handleAddEng()}><BsPlusLg /></Button>
                      <Button variant="outline-primary" type='submit' title="Enregistrer l'engagment" className='me-1' style={{maxWidth:"100px", maxHeight:"30px"}} disabled={disabledEnregistrer}><SaveRoundedIcon /></Button>
                      <Button variant="outline-primary" title="Editer la l'engagement" className='me-1' style={{maxWidth:"100px", maxHeight:"30px"}} onClick={ () => handleEditerEngagementButtonClick()} disabled={disableEditerEngagment}><LocalPrintshopIcon /></Button>
                      <Button variant="outline-primary" title="Editer la décision" style={{maxWidth:"100px", maxHeight:"30px"}} onClick={ () => handleEditerDecisionButtonClick()} disabled={disableEditerDecision}><LocalPrintshopOutlinedIcon /></Button>
                    </ButtonGroup>
                  </Form.Group>
                </Card.Body>
              </Card>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <Card.Title style={{fontSize:"0.8em"}}>
                    <Form.Check name='apartirDemandLiq' type="checkbox" inline label={"A partir du RDL N°" + ((formEng.numeroDemande.value ==="")? "_______________": formEng.numeroDemande.value) + " du " + ((formEng.dateLiq.value ==="")? "_______________": new Date(formEng.dateLiq.value).toLocaleDateString())} checked={formEng.apartirDemandLiq.value} onChange={(e: any) => handleCheckboxInputChangeFormEng(e)} disabled={disableApartirRDL} /><Button variant="outline-primary" title="Cliquez pour sélectionner le reçu de demande de liquidation" size="sm" style={{width:"30px", height:"30px", marginRight:"1px"}} onClick={() => handleSelectionnerRDLButtonClick()} disabled={disableSelectionnerRDL}><BsArrowDownCircleFill /></Button><Button variant="outline-primary" title="Cliquez pour générer le RDL" size="sm" className='me-1' onClick={() => handleGenererRDLButtonClick()} disabled={disableGenererRDL}>Générer RDL <BsPencilSquare /></Button>
                    <Button variant="outline-primary" title="Cliquez pour générer le changement d'imputation" size="sm" className='me-1' onClick={() => handleGenererCIButtonClick()} disabled={disableGenererCI}>Générer CI <BsPencilSquare /></Button>
                    <Button variant="outline-primary" title="Cliquez pour Sélectiontionner la ligne budgétaire" size="sm" onClick={handleSelectionnerLigneBudgetaireButtonClick} disabled={disableRenseignementLigneBudgetaire} style={{ borderColor: borderColorSelectionnerLigneBudgetaire}}>Renseignements ligne budgétaire <BsArrowDownCircleFill /></Button>
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
                              <td style={{backgroundColor:"#90EE90"}}>{(Number(formEng.dispoAvant.value)-removeNonNumeric(formEng.montant.value)).toLocaleString()}</td>
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
                        <Card.Title style={{fontSize:"0.8em", marginBottom:"0px"}}><Form.Check name='apartirContrat' type="checkbox" inline label="A partir d'un contrat" className='me-0' checked={formEng.apartirContrat.value} onChange={(e: any) => handleCheckboxInputChangeFormEng(e)} disabled={disableDunContrat} /><Button variant="outline-primary" title="Cliquez pour sélectionner le contrat" size="sm" style={{width:"30px", height:"30px"}} onClick={handleSelectionnerLeContratButtonClick} disabled={disableSelectionnerLeContrat}><BsArrowDownCircleFill /></Button></Card.Title>
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
                                <td>{formEng.montantContrat.value.toLocaleString()}</td>
                                <td>{formEng.engageContrat.value.toLocaleString()}</td>
                                <td>{formEng.resteAEngagerContrat.value.toLocaleString()}</td>
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
                          <Form.Check inline type="radio" label="Fournisseur ou Bénéficiaire /" name="auProfit" value="F" checked={formEng.auProfit.value === "F"} onChange={e => handleInputChangeFormEng(e)} disabled={disableAuProfit} />
                          <Form.Check inline type="radio" label="Agent" name="auProfit" value="A" checked={formEng.auProfit.value === "A"} onChange={e => handleInputChangeFormEng(e)} disabled={disableAuProfit} />
                          <Button variant="outline-primary" title="Cliquez pour sélectionner le bénéficiaire" size="sm" style={{width:"30px", height:"30px", borderColor: borderColorSelectionnerBeneficiaire}} onClick={handleSelectionnerLeBeneficiaireButtonClick} disabled={disableSelectionnerLeBeneficiare}><BsArrowDownCircleFill /></Button>
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
                          <Form.Check name='estOrdre' type="checkbox" label="Avec mandat d'ordre" inline checked={formEng.estOrdre.value} onChange={(e: any) => handleCheckboxInputChangeFormEng(e)} disabled={disableAvecMandatDOrdre} />
                          <Form.Check name='avecDecision' type="checkbox" label="Avec décision" inline checked={formEng.avecDecision.value} onChange={(e: any) => handleCheckboxInputChangeFormEng(e)} disabled={disableAvecDecision} />
                          <Button variant="outline-primary" title="Cliquez pour corriger la décision" size="sm" onClick={() => handleCorrigerLaDecisionButtonClick()} disabled={disableCorrigerLaDecision}>Corriger la décision <BsPencilSquare /></Button>
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
                                  <Form.Select name='proced' value={formEng.proced.value} size="sm" onChange={e => handleInputChangeFormEng(e)} style={{ borderColor: borderColorProced}} disabled={disableProceed}>
                                    <option value='EN01'>Normale</option>
                                    <option value='EN02'>Simplifiée</option>
                                  </Form.Select>
                                </Col>
                              </Form.Group>
                              <Form.Group controlId="montant" as={Row} className='mb-1'>
                                <Col xs={4}><Form.Label>Montant Engag :</Form.Label></Col>
                                <Col><Form.Control name='montant' value={formEng.montant.value} onChange={e => handleInputChangeFormEng(e)} size='sm' type="text" autoComplete="off" style={{ borderColor: borderColorMontant}} disabled={disableMontantEngagement} /></Col>
                              </Form.Group>
                            </Col>
                            <Col>
                              <Form.Group controlId="natDepense" as={Row} className='mb-1'>
                                <Col xs={4}><Form.Label>Object :</Form.Label></Col>
                                <Col><Form.Control as="textarea" autoComplete="off" rows={2} name='natDepense' value={formEng.natDepense.value} title={formEng.natDepense.value} size='sm' style={{ borderColor: borderColorObjet}} onChange={e => handleInputChangeFormEng(e)} disabled={disableNatDepense}/></Col>
                              </Form.Group>
                              <Form.Group controlId="" as={Row}>
                                <Col xs={4}><Form.Label>Au profit du compte :</Form.Label></Col>
                                <Col>
                                  <InputGroup size='sm'>
                                    <Form.Select name='compteFourn' value={formEng.compteFourn.value} size='sm' onChange={e => handleInputChangeFormEng(e)} disabled={disableAuProfitDuCompte}>
                                      {
                                        compteDestinataires.map( cd => (
                                          <option key={cd.id} value={cd.id}>{cd.abreviation + " " + cd.libelleAgence + " N°" + cd.codeBanque + " " + cd.codeAgence + " " + cd.numCompte + " " + cd.cleRib}</option>
                                        ))
                                      }
                                    </Form.Select>
                                    <Button variant="outline-danger" title="Cliquez pour éffacer le compte" size="sm" disabled={disableEffacerAuProfitDuCompte}><IoCloseOutline /></Button>
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
                      processRowUpdate={processRowUpdatePjSelectionnees}
                      onProcessRowUpdateError={handleProcessRowUpdateError}
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
                    {!!snackbar && (
                      <Snackbar
                        open
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        onClose={handleCloseSnackbar}
                        autoHideDuration={6000}
                      >
                        <Alert {...snackbar} onClose={handleCloseSnackbar} />
                      </Snackbar>
                    )}
                </Card.Body>                        
              </Card>
            </Form>
          </div>

          {/* GESTION SELECTIONNER RDL */}
          <Modal show={showModalSelectionnerRDL} onHide={handleCloseModalSelectionnerRDL} backdrop="static" keyboard={false} size="xl">
            <Modal.Header className='p-1'>
                <Modal.Title as="h6">Demande de liquidation { Number(gestionCourante) - 1 }</Modal.Title>
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
                      if (row.montant <= formEng.dispoAvant.value) {
                        contratDecoche();
                        formEng.apartirContrat.value = false;

                        formEng.dateLiq.value = row.dateLiq;
                        formEng.numeroDemande.value = row.numeroDemande;
                        formEng.codLiq.value = row.codLiq;
                        formEng.idContrat.value = row.idContrat;
                        formEng.montant.value = row.montant;
                        formEng.auProfit.value = row.ftype;
                        formEng.idFourn.value = row.idFourn;
                        formEng.ifuMle.value = row.ifumle;
                        formEng.nom.value = row.nom;
                        formEng.natDepense.value = row.objet;
                        formEng.numBeRDL.value = row.numBe;
                        getPjRDLs(row.numBe) // LES PIECES JUSTIFICATIVES
                        setDisableRappelPiecesJustificatives(false);
                        handleCloseModalSelectionnerRDL()
                      } else {
                        okWarnignDialog("Le montant disponible pour la ligne sélectionnée est inférieur au montant du RDL");
                      }
                    }}
                    subHeader
                    subHeaderComponent={
                      <Form.Control name="nom" value={formRRDL.nom.value} size='sm' type="text" placeholder='Nom du bénéficiaire' className='w-25' onChange={e => handleInputChangeFormRRDL(e)}/>
                    }
                    />
                </Card.Body>
              </Card>
            </Modal.Body>

            <Modal.Footer className='p-1'>
              <Button variant="outline-danger" size='sm' onClick={handleCloseModalSelectionnerRDL}>Fermer</Button>
            </Modal.Footer>
          </Modal>

          {/* GESTION SELECTIONNER LA LINGE BUDGETAIRE */}
          <Modal show={showModalSelectionnerLigneBudgetaire} onHide={handleCloseModalSelectionnerLigneBudgetaire} backdrop="static" keyboard={false} size="lg">
            <Modal.Header className='p-1'>
                <Modal.Title as="h6">Budget des dépenses { gestionCourante }</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2'>
              <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tableDepenseColumns}
                    data={filteredDepenses}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    fixedHeaderScrollHeight='450px'
                    highlightOnHover
                    responsive
                    striped
                    onRowClicked={ (row, e) => {
                      if (removeNonNumeric(formEng.montant.value) <= row.disponible) {
                        formEng.codBud.value = row.codBud;
                        formEng.intitule.value = row.intitule;
                        formEng.dotInitiale.value = row.dotInitiale;
                        formEng.totalEngag.value = row.totalEngag;
                        formEng.dotationCorrigee.value = row.dotationCorrigee;
                        formEng.dispoAvant.value = row.disponible;
                        formEng.chap.value = row.chap;
                        formEng.art.value = row.art;
                        formEng.parag.value = row.parag;
                        formEng.rub.value = row.rub;
                        formEng.nbreEngag.value = row.nbreEngag;
                        setDisabledEnregistrer(false);
                        setDisableRenseignementLigneBudgetaire(false);
                        setDisableAuProfit(false);
                        setDisableSelectionnerLeBeneficiare(false);
                        setDisableAvecMandatDOrdre(false);
                        setDisableProceed(false);
                        setDisableNatDepense(false);
                        setDisableAjouterUnePieceJustificative(false);
                        setDisableApartirRDL(false);
                        setDisableDunContrat(false);
                        setDisableMontantEngagement(false);
                        handleCloseModalSelectionnerLigneBudgetaire()
                      } else {
                        okWarnignDialog("Le montant disponible pour la ligne sélectionnée est inférieur au montant de l'engagement !");
                      }
                    }}
                    subHeader
                    subHeaderComponent={                       
                      <ButtonGroup as={Col} size="sm">
                        <Form.Control name="idPlan" value={formRCpteBudgetaireDepense.idPlan.value}  size='sm' type="number" placeholder='Compte' onChange={e => handleInputChangeFormRCpteBudgetaireDepense(e)} className='me-1' style={{width:"100px"}}/>
                        <Form.Control name="intitule" value={formRCpteBudgetaireDepense.intitule.value}  size='sm' type="text" placeholder='Intitulé' onChange={e => handleInputChangeFormRCpteBudgetaireDepense(e)} className='me-1' />
                      </ButtonGroup>
                    }
                    />
                </Card.Body>
              </Card>
            </Modal.Body>

            <Modal.Footer className='p-1'>
              <Button variant="outline-danger" size='sm' onClick={handleCloseModalSelectionnerLigneBudgetaire}>Fermer</Button>
            </Modal.Footer>
          </Modal>

          {/* GESTION SELECTIONNER LE CONTRAT */}
          <Modal show={showModalSelectionnerLeContrat} onHide={handleCloseModalSelectionnerLeContrat} backdrop="static" keyboard={false} size="xl">
            <Modal.Header className='p-1'>
                <Modal.Title as="h6">Contrats { gestionCourante }</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2'>
              <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tableContratColumns}
                    data={filteredContrats}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    fixedHeaderScrollHeight='450px'
                    highlightOnHover
                    responsive
                    striped
                    onRowClicked={ (row, e) => {
                    if (row.resteAEngager <= formEng.dispoAvant.value) {
                        RDLDecoche();
                        formEng.apartirDemandLiq.value = false;

                        formEng.idContrat.value = row.idContrat;
                        formEng.referenceContrat.value = row.reference;
                        formEng.dateSaisieContrat.value = row.dateSaisie;
                        formEng.montantContrat.value = row.montant;
                        formEng.engageContrat.value = row.engage;
                        formEng.resteAEngagerContrat.value = row.resteAEngager;
                        formEng.montant.value = row.resteAEngager.toLocaleString();
                        formEng.auProfit.value = 'F';
                        formEng.idFourn.value = row.idFourn;
                        formEng.ifuMle.value = row.ifumle;
                        formEng.nom.value = row.nom;
                        formEng.natDepense.value = row.objet;
                        getCompteDestinataires(row.idFourn)
                        handleCloseModalSelectionnerLeContrat()

                        // LE CONTRAT SELECTIONNE DOIT ETRE AJOUTE COMME UNE PIECES JUSTIF
                        const newObject: PJPourEngagement = {
                          identifiant: pjSelectionnees.length+1,
                          pj: "Marché",
                          numero: row.reference,
                          date: null,
                          montant: row.montant,
                          codLiq: null
                        }
                        setPjSelectionnees([...pjSelectionnees, newObject]);                        
                      } else {
                        okWarnignDialog("Le montant disponible pour ligne budgétaire sélectionnée est inférieur au montant restant du contrat !");
                      }
                    }}
                    subHeader
                    subHeaderComponent={                       
                      <ButtonGroup as={Col} size="sm">
                        <Form.Group controlId="type" as={Row} className="me-1">
                          <Col xs={4}><Form.Label className="label2">Type contrat :</Form.Label></Col>
                          <Col>
                            <Form.Select name='type' value={formRCContrat.type.value} size='sm' onChange={e => handleInputChangeFormRCContrat(e)}>
                              <option value=''>(tout)</option>
                              {
                                contratTypes.map( ct => (
                                  <option key={ct.typeContrat} value={ct.typeContrat}>{ct.libelle}</option>
                                ))
                              }
                            </Form.Select>
                          </Col>
                        </Form.Group>
                        <Form.Control name="nom" value={formRCContrat.nom.value} size='sm' type="text" placeholder='Prestataire' onChange={e => handleInputChangeFormRCContrat(e)}/>
                      </ButtonGroup>
                    }
                    />
                </Card.Body>
              </Card>
            </Modal.Body>

            <Modal.Footer className='p-1'>
              <Button variant="outline-danger" size='sm' onClick={handleCloseModalSelectionnerLeContrat}>Fermer</Button>
            </Modal.Footer>
          </Modal>

          {/* GESTION SELECTIONNER LE BENEFICIAIRE */}
          <Modal show={showModalSelectionnerLeBeneficiaire} onHide={handleCloseModalSelectionnerLeBeneficiaire} backdrop="static" keyboard={false} size="xl">
            <Modal.Header className='p-1'>
                <Modal.Title as="h6">Fournisseur et Beneficiaires</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2'>
              <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tableBeneficiaireColumns}
                    data={filteredBeneficiaires}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    fixedHeaderScrollHeight='450px'
                    highlightOnHover
                    responsive
                    striped
                    onRowClicked={ (row, e) => {
                      formEng.idFourn.value = row.idDest;
                      formEng.ifuMle.value = row.ifumle;
                      formEng.nom.value = row.nom;
                      getCompteDestinataires(row.idDest)
                      handleCloseModalSelectionnerLeBeneficiaire()
                    }}
                    subHeader
                    subHeaderComponent={                       
                      <ButtonGroup as={Col} size="sm">
                        <Col className='me-1'>
                          <Form.Group controlId="type" as={Row} size="sm">
                            <Col xs={2}><Form.Label className="label2">Type :</Form.Label></Col>
                            <Col>
                              <Form.Select name='type' value={formRBeneficiaire.type.value} size='sm' onChange={e => handleInputChangeFormRBeneficiaire(e)}>
                                <option value='autresTiers'>Autres tiers</option>
                                <option value='banques'>Banques</option>
                                <option value='caissesPopulaires'>Caisses populaires</option>
                              </Form.Select>
                            </Col>
                          </Form.Group>
                        </Col>
                        <Col xs={3} className='me-1'><Form.Control name="nom" value={formRBeneficiaire.nom.value} size='sm' type="text" placeholder='Nom' onChange={e => handleInputChangeFormRBeneficiaire(e)}/></Col>
                        <Col xs={3}><Form.Control name="ifumle" value={formRBeneficiaire.ifumle.value} size='sm' type="text" placeholder='Ifue/Mle' onChange={e => handleInputChangeFormRBeneficiaire(e)}/></Col>
                      </ButtonGroup>
                    }
                    />
                </Card.Body>
              </Card>
            </Modal.Body>

            <Modal.Footer className='p-1'>
              <Button variant="outline-danger" size='sm' onClick={handleCloseModalSelectionnerLeBeneficiaire}>Fermer</Button>
            </Modal.Footer>
          </Modal>

          {/* GESTION SELECTIONNER AGENT */}
          <Modal show={showModalSelectionnerAgent} onHide={handleCloseModalSelectionnerAgent} backdrop="static" keyboard={false} size="xl">
            <Modal.Header className='p-1'>
                <Modal.Title as="h6">Liste des agents</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2'>
              <Form onSubmit={(e) => handleSubmitFormAgent(e)} className='mb-1'>
                <Card className='mb-3'>
                  <Card.Header className='p-1'>
                    { libelleOperationAgent() }
                  </Card.Header>

                  <Card.Body className='p-1'>
                      <Row>
                        <Col>
                          <Form.Group controlId="ifumle" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Matricule :</Form.Label></Col>
                            <Col><Form.Control name='ifumle' size='sm' type="text" value={formAgent.ifumle.value} onChange={e => handleInputChangeFormAgent(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="nom" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Nom :</Form.Label></Col>
                            <Col><Form.Control name='nom' size='sm' type="text" value={formAgent.nom.value} onChange={e => handleInputChangeFormAgent(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="prenom" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Prénom :</Form.Label></Col>
                            <Col><Form.Control name='prenom' size='sm' type="text" value={formAgent.prenom.value} onChange={e => handleInputChangeFormAgent(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="telephone" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Téléphone :</Form.Label></Col>
                            <Col><Form.Control name='telephone' size='sm' type="text" value={formAgent.telephone.value} onChange={e => handleInputChangeFormAgent(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="email" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Email :</Form.Label></Col>
                            <Col><Form.Control name='email' size='sm' type="email" value={formAgent.email.value} onChange={e => handleInputChangeFormAgent(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="sexe" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Sexe :</Form.Label></Col>
                            <Col>
                              <Form.Select name='sexe' value={formAgent.sexe.value} size='sm' aria-label="Default select example" onChange={e => handleInputChangeFormAgent(e)}>
                                <option value=''></option>
                                <option value='M'>Masculin</option>
                                <option value='F'>Féminin</option>
                              </Form.Select>
                            </Col>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Check name='actif' type="checkbox" label="Toujours en service" className='label2' checked={formAgent.actif.value} onChange={(e: any) => handleCheckboxInputChangeFormAgent(e)} />
                          <Form.Group controlId="service">
                            <Form.Label className='label2 mb-1'>Service :</Form.Label>
                            <Form.Select name='service' value={formAgent.service.value} size='sm' aria-label="Default select example" onChange={e => handleInputChangeFormAgent(e)}>
                              <option value=''></option>
                              {
                                directionServiceResponseDtos.map( ds => (
                                  <option key={ds.idService} value={ds.idService}>{ds.libelle}</option>
                                ))
                              }
                            </Form.Select>
                          </Form.Group>
                          <Form.Group controlId="signataire">
                            <Form.Label className='label2 mb-1'>Fonction :</Form.Label>
                            <Form.Control name='signataire' size='sm' type="text" value={formAgent.signataire.value} onChange={e => handleInputChangeFormAgent(e)} />
                          </Form.Group>
                          <Form.Group controlId="titreHonorifique">
                            <Form.Label className='label2 mb-1'>Titre honorifique :</Form.Label>
                            <Form.Control name='titreHonorifique' size='sm' type="text" value={formAgent.titreHonorifique.value} onChange={e => handleInputChangeFormAgent(e)} />
                          </Form.Group>
                        </Col>
                      </Row>
                  </Card.Body>

                  <Card.Footer className='p-1'>
                    <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>{ libelleButtonSumbitAgent() }</Button>
                    <Button size='sm' variant="outline-success" title="Ajouter Nouveau" className='ms-1' style={{width: "100px"}} onClick={ () => handleAddAgent()}><BsPlusLg /></Button>
                  </Card.Footer>
                </Card>
              </Form>
              <Card className='mt-1'>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tableAgentColumns}
                    data={filteredAgents}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    fixedHeaderScrollHeight='200px'
                    highlightOnHover
                    responsive
                    striped
                    onRowClicked={ (row, e) => {
                      formEng.idFourn.value = row.mle;
                      formEng.ifuMle.value = row.ifumle;
                      formEng.nom.value = row.nom + " " + row.prenom;
                      getCompteDestinataires(row.mle)
                      handleCloseModalSelectionnerAgent()
                    }}
                    />
                </Card.Body>
              </Card>
            </Modal.Body>

            <Modal.Footer className='p-1'>
              <Button variant="outline-danger" size='sm' onClick={handleCloseModalSelectionnerAgent}>Fermer</Button>
            </Modal.Footer>
          </Modal>

          {/* GESTION CORRIGER LA DECISION */}
          <Modal show={showModalCorrigerLaDecision} onHide={handleCloseModalCorrigerLaDecision} backdrop="static" keyboard={false} size="xl">
            <Modal.Header className='p-1'>
                <Modal.Title as="h6">Corriger Décision N</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2'>
              
            </Modal.Body>

            <Modal.Footer className='p-1'>
              <Button variant="outline-danger" size='sm' onClick={handleCloseModalCorrigerLaDecision}>Fermer</Button>
            </Modal.Footer>
          </Modal>

          {/* GESTION AJOUTER UNE PIECES JUSTIFICATIVE */}
          <Modal show={showModalAjouterUnePieceJustificative} onHide={handleCloseModalAjouterUnePieceJustificative} backdrop="static" keyboard={false} size="lg">
            <Modal.Header className='p-1'>
                <Modal.Title as="h6">Pièce Justificatives</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2'>
              <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tablePjColumns}
                    data={filteredPjs}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    responsive
                    striped
                    fixedHeaderScrollHeight='180px'
                    highlightOnHover
                    subHeader
                    subHeaderComponent={
                      <Form.Control size='sm' type="text" placeholder="Recherche une pièces" value={termPj} className='w-25'  onChange={e => handleSearchPjInputChange(e)} />
                    }
                    />
                </Card.Body>
              </Card>
            </Modal.Body>

            <Modal.Footer className='p-1'>
              <Button variant="outline-danger" size='sm' onClick={handleCloseModalAjouterUnePieceJustificative}>Fermer</Button>
            </Modal.Footer>
          </Modal>

          {/* GESTION RAPPEL PIECES JUSTIFICATIVES */}
          <Modal show={showModalRappelPiecesJustificatives} onHide={handleCloseModalRappelPiecesJustificatives} backdrop="static" keyboard={false} size="lg">
            <Modal.Header className='p-1'>
                <Modal.Title as="h6">Pièce Justificatives RDL</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2'>
              <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tablePjRDLColumns}
                    data={pjRDLs}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    responsive
                    striped
                    fixedHeaderScrollHeight='180px'
                    highlightOnHover
                    subHeader
                    selectableRows
                    selectableRowSelected={row => (
                      pjRDLCochees.some((item) => {
                        return item.codPj === row.codPj;
                      })
                    )}
                    onSelectedRowsChange={ (selected) => {
                      _pjRDLCochees = selected.selectedRows;
                    }}
                    />
                </Card.Body>
              </Card>
            </Modal.Body>

            <Modal.Footer className='p-1'>
              <Button variant="outline-success" size='sm' onClick={handleOk}>OK</Button>
            </Modal.Footer>
          </Modal>

          { showPdfViewer && <PdfViewer blob={pdfBlob} name={pdfNameForDownload} />}


      </Container>
  );
};

export default EngagementsCreerUnEngagementForm;
