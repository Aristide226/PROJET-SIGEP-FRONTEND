import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import Swal from 'sweetalert2';
import DataTable  from 'react-data-table-component'; 
import { costumeStyles } from '../../helpers/costume-styles';
import { okSuccessDialog} from '../../helpers/dialogs';
import { BsPlusLg, BsTrash } from 'react-icons/bs';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowModel, GridRowParams, GridToolbarContainer } from '@mui/x-data-grid';
import { ConnectedUser, Gestion, IdBudget } from '../helpers/session-storage';
import Alert, { AlertProps } from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import PjService from '../services/pj-service';
import { emptyPJPourEngagement, PJPourEngagement } from '../models/pj-pour-engagment';
import PieceJustifService from '../services/piece-justif-service';
import { PieceJustifRequestDto } from '../models/piece-justif';
import { formatDateWithHoursAndMinutes } from '../../helpers/format-date';
import { removeNonNumeric } from '../../helpers/format';
import LiquidationViewService from '../services/liquidation-view-service';
import CompteDestinataireService from '../services/compte-destinataire-service';
import { emptyMandatRequestDto, MandatRequestDto } from '../models/mandat';
import MandatService from '../services/mandat-service';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ServerDateService from '../../shared/system/services/server-date-service';

// FORUMULAIRE LIQUIDATION
type FormLiquidation = {
  codBud: Field, // ENGAGEMENT
  numBe: Field, 
  benum: Field,
  dateCreation: Field,
  montantEngagement: Field,
  dejaLiquideEngagement: Field;
  resteALiquiderEngagement: Field,
  natDepense: Field,
  proced: Field,
  nombreLiq: Field,
  chap: Field,// NOMANCLATURED
  art: Field,
  parag: Field,
  rub: Field,
  intitule: Field,
  idContrat: Field, // CONTRAT
  montantContrat: Field,
  engageValidContrat: Field,
  mandateValidContrat: Field,
  referenceContrat: Field,
  dateSaisieContrat: Field,
  idFourn: Field, // FOURNISSEUR
  ifuMle: Field,
  nom: Field,
  codLiq: Field, // RECU
  gestion: Field,
  numBl: Field,
  dateLiq: Field,
  montant: Field,
  numeroDemande: Field,
  mandNum: Field, // MANDAT
  dateMand: Field, 
  compteFourn: Field,
  numBlMand: Field,
  bln: Field,
  mandatNumero: Field,
  auProfitDuCompte: Field // Utilisé pour stocker le compte
}

// CRITERES DE RECHERCHE LIQUIDATION
type FormRLiquidation = {
  benum: Field,
  numBlMand: Field,
  nom: Field,
}

const LiquidationModifierUneLiquidationForm: FunctionComponent = () => {

  const [gestionCourante] = useState<string>(Gestion() ?? '');
  const [idBudget] = useState<string>(IdBudget() ?? '');
  const [utilisateurCourante] = useState<string>(ConnectedUser() ?? '');
  const [isGestionClose, setIsGestionClose] = useState<boolean>(false);
  const dateEnregistrementPourGestionClose: Date = new Date(gestionCourante + '-12-31');
  const [disabledEnregistrer, setDisabledEnregistrer] = useState<boolean>(true);
  const [disableEditerLiquidation, setDisableEditerLiquidation] = useState<boolean>(true);
  const [disableNatDepense, setDisableNatDepense] = useState<boolean>(true);
  const [disableDateMand, setDisableDateMand] = useState<boolean>(true);
  const [disableAuProfitDuCompte, setDisableAuProfitDuCompte] = useState<boolean>(true);
  const [disableAjouterUnePieceJustificative, setDisableAjouterUnePieceJustificative] = useState<boolean>(true);
  const [borderColorObjet, setBorderColorObjet] = useState<string>("");
  const [borderColorDateMand, setBorderColorDateMand] = useState<string>("");

  useEffect(() => {
    // On recupere la date du server : si la gestion en cours est strictement inférieur à l'année de la date du serveur alors elle est close :
    ServerDateService.getServerDate().then(data => {
      if (Number(gestionCourante) < new Date(data).getFullYear()) setIsGestionClose(true); else setIsGestionClose(false)   
    }) 
  }, [])   
  
  ///////////////// GESTION LIQUIDATION
  const [compteDestinataires, setCompteDestinataires] = useState<any[]>([]);
  const dateDeCreationMinimm: Date = new Date(gestionCourante + '-01-01');
  const dateDeCreationMaximum: Date = new Date(gestionCourante + '-12-31');

  const [formLiquidation, setFormLiquidation] = useState<FormLiquidation>({
    codBud: { value: '' },
    numBe: { value: '' },
    benum: { value: '' },
    dateCreation: { value: '' },
    montantEngagement: { value: 0},
    dejaLiquideEngagement: { value: 0},
    resteALiquiderEngagement: { value: 0},
    natDepense: { value: '' },
    proced: { value: '' },
    nombreLiq: { value: '' },
    chap: { value: '' },
    art: { value: '' },
    parag: { value: '' },
    rub: { value: '' },
    intitule: { value: '' },
    idContrat: { value: '' },
    montantContrat: { value: 0 },
    engageValidContrat: { value: 0 },
    mandateValidContrat: { value: 0 },
    referenceContrat: { value: '' },
    dateSaisieContrat: { value: '' },
    idFourn: { value: '' },
    ifuMle: { value: '' },
    nom: { value: '' },
    codLiq: { value: '' },
    gestion: { value: '' },
    numBl: { value: '' },
    dateLiq: { value: "" },
    montant: { value: '' },
    numeroDemande: { value: ''},
    mandNum: { value: ''},
    dateMand: { value: ''},
    compteFourn: { value: ''},
    numBlMand: { value: ''},
    bln : { value: ''},
    mandatNumero : { value: ''},
    auProfitDuCompte : { value: ''}
  })

  const initFormLiquidation = () => {
    setFormLiquidation({
      codBud: { value: '' },
      numBe: { value: '' },
      benum: { value: '' },
      dateCreation: { value: '' },
      montantEngagement: { value: 0},
      dejaLiquideEngagement: { value: 0},
      resteALiquiderEngagement: { value: 0},
      natDepense: { value: '' },
      proced: { value: '' },
      nombreLiq: { value: '' },
      chap: { value: '' },
      art: { value: '' },
      parag: { value: '' },
      rub: { value: '' },
      intitule: { value: '' },
      idContrat: { value: '' },
      montantContrat: { value: 0 },
      engageValidContrat: { value: 0 },
      mandateValidContrat: { value: 0 },
      referenceContrat: { value: '' },
      dateSaisieContrat: { value: '' },
      idFourn: { value: '' },
      ifuMle: { value: '' },
      nom: { value: '' },
      codLiq: { value: '' },
      gestion: { value: '' },
      numBl: { value: '' },
      dateLiq: { value: "" },
      montant: { value: '' },
      numeroDemande: { value: ''},
      mandNum: { value: ''},
      dateMand: { value: ''},
      compteFourn: { value: ''},
      numBlMand: { value: ''},
      bln : { value: ''},
      mandatNumero : { value: ''},
      auProfitDuCompte : { value: ''}
    })

    setCompteDestinataires([])
    setPjSelectionnees([])
    setBenumPourRechercherLiquidation('');
    setNumBlMandPourRechercherLiquidation('');
    
    setDisabledEnregistrer(true);
    setDisableNatDepense(true);
    setDisableDateMand(true);
    setDisableAuProfitDuCompte(true)
    setDisableAjouterUnePieceJustificative(true)
  }
  
  const handleInputChangeFormLiquidation = (e: any): void => {
    const fieldName: string = e.target.name;
    let fieldValue: string = e.target.value;

    if (fieldName ==="compteFourn") {
      const result = compteDestinataires.find((item) => item.id === fieldValue);
      if(result) {
        formLiquidation.auProfitDuCompte.value = result.abreviation + " " + result.libelleAgence + " N°" + result.codeBanque + " " + result.codeAgence + " " + result.numCompte + " " + result.cleRib;
      } else {
        formLiquidation.auProfitDuCompte.value = "";
      }
    }

    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormLiquidation({ ...formLiquidation, ...newField}); 
  }

  const validateFormLiquidation = () => {
    let newForm: FormLiquidation = formLiquidation;

    // Date de création
    if(new Date(formLiquidation.dateMand.value) < dateDeCreationMinimm || new Date(formLiquidation.dateMand.value) > dateDeCreationMaximum) {
      const errorMsg: string = 'La date doit etre compris entre 01/01/'+ gestionCourante + ' et ' + '31/12/' + gestionCourante + ' !';
      const newField: Field = { value: formLiquidation.dateMand.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ dateMand: newField } };
      setBorderColorDateMand("red")
    } else {
      const newField: Field = { value: formLiquidation.dateMand.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ dateMand: newField } };
      setBorderColorDateMand("")
    }    

    // Objet
    if(formLiquidation.natDepense.value === "") {
      const errorMsg: string = 'Objet obligatoire !';
      const newField: Field = { value: formLiquidation.natDepense.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ natDepense: newField } };
      setBorderColorObjet("red");
    } else {
      const newField: Field = { value: formLiquidation.natDepense.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ natDepense: newField } };
      setBorderColorObjet("");
    }

    setFormLiquidation(newForm);
    return newForm.dateMand.isValid && newForm.natDepense.isValid;
  }

  const handleSubmitFormLiquidation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormLiquidation()) {
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
          editLiquidation();
        }
      });
    } else {
      editLiquidation();
    }    
  }

  const editLiquidation = () => {
    // MODIFIER UNE LIQUIDATION CONSISTE A MODIFIER LE MANDAT CORRESPONDANT
    let newMand: MandatRequestDto = emptyMandatRequestDto;
    newMand.dateMand = formLiquidation.dateMand.value;
    newMand.montant = liquidationAModifier.montant;
    newMand.dateEtat = (liquidationAModifier.etatMand ==="M3")? ((isGestionClose)? dateEnregistrementPourGestionClose : new Date()) : liquidationAModifier.dateEtatMand;
    newMand.datePaie = liquidationAModifier.datePaieMand;
    newMand.montantPaie = liquidationAModifier.montantPaieMand; 
    newMand.idCompte = liquidationAModifier.idCompteMand; 
    newMand.idUser = utilisateurCourante;
    newMand.datePosition = liquidationAModifier.datePositionMand;
    newMand.benum = liquidationAModifier.benum;
    newMand.objet = formLiquidation.natDepense.value;
    newMand.montEngage = liquidationAModifier.montEngage; 
    newMand.montDjaLiq = liquidationAModifier.montDjaLiq;
    newMand.dateEtatBl = (liquidationAModifier.etatMand ==="M3")? ((isGestionClose)? dateEnregistrementPourGestionClose : new Date()) : liquidationAModifier.dateEtatBlMand;
    newMand.datePec = liquidationAModifier.datePecMand;
    newMand.receptionne = liquidationAModifier.receptionneMand;
    newMand.genererOv = liquidationAModifier.genererOvMand;
    newMand.avecReversement = liquidationAModifier.avecReversementMand;
    newMand.precompte = liquidationAModifier.precompteMand;
    newMand.datePrecompte = liquidationAModifier.datePrecompteMand;
    newMand.userPrecompte = liquidationAModifier.userPrecompteMand;
    newMand.dateValid = liquidationAModifier.dateValidMand;
    newMand.idFiche = liquidationAModifier.idFicheMand;
    newMand.montantTotalPec = liquidationAModifier.montantTotalPecMand;
    newMand.estOrdre = liquidationAModifier.estOrdreMand;
    newMand.mandNumApresVisaCf = liquidationAModifier.mandNumApresVisaCf;
    newMand.idEtatTransL = (liquidationAModifier.etatMand ==="M3")? 0 : liquidationAModifier.idEtatTransLMand;
    newMand.idEtatTransM = (liquidationAModifier.etatMand ==="M3")? 0 : liquidationAModifier.idEtatTransMMand;
    newMand.idBordEmis = liquidationAModifier.idBordEmisMand;
    newMand.idBord = liquidationAModifier.idbordMand;
    newMand.codBud = liquidationAModifier.codBud;
    newMand.idBudget = liquidationAModifier.idBudget;
    newMand.compteFourn = (formLiquidation.compteFourn.value !=="")? formLiquidation.compteFourn.value: null;//
    newMand.idContrat = liquidationAModifier.idContrat;
    newMand.idFourn = liquidationAModifier.idFourn;
    newMand.gestion = liquidationAModifier.gestion;
    newMand.codLiq = liquidationAModifier.codLiq;
    newMand.idLettrage = liquidationAModifier.idLettrageMand;
    newMand.idModePaie = liquidationAModifier.idModePaieMand;
    newMand.numBe = liquidationAModifier.numBe;
    newMand.etat = (liquidationAModifier.etat ==="M3")? "M0" : liquidationAModifier.etatMandMand;
    newMand.etatBl = (liquidationAModifier.etat ==="M3")? "L0" : liquidationAModifier.etatBlMand;
    newMand.numMandParent = liquidationAModifier.numMandParent;  
    
    MandatService.edit(liquidationAModifier.numMand, newMand).then(mandat => {
      // ON ENREGISTRE LES PIECES JUSTIFICATIVES DANS PieceJustif
      let pieceJustifs: PieceJustifRequestDto[] = [];
      pjSelectionnees.forEach(item => {
        pieceJustifs.push({
          numBe: mandat.numBe,
          codLiq: item.codLiq,
          numMand: mandat.numMand,
          pieceJustificative: item.pj,
          numero: item.numero,
          datePj: item.date,
          montant: item.montant,
          idRetenu: null, // A demander
          idBord: null, // A demander
        });
      });
      PieceJustifService.addPiecesJustificativesLiquidation(mandat.numMand, pieceJustifs).then(res => {
        if (res) {
          setDisableEditerLiquidation(false);
          rechercherAfficherLiquidation(liquidationAModifier.benum, liquidationAModifier.numBlMand);
          setBorderColorDateMand("");
          okSuccessDialog("Liquidation modifiée avec succès !");
        }
      })          
    })
  } 

  const getCompteDestinataires = (idDest: number) => {
    CompteDestinataireService.getByDestinataires(idDest).then(data => {
      setCompteDestinataires(data);
    })
  } 
  ///////////////// GESTION LIQUIDATION
  
  ///////////////// GESTION RECHERCHE LIQUIDATION
  const [liquidations, setLiquidations] = useState<any[]>([]);
  const [liquidationAModifier, setLiquidationAModifier] = useState<any>({});
  const [filteredLiquidations, setFilteredLiquidations] = useState<any[]>([]);
  const [showModalSelectionnerLiquidation, setShowModalSelectionnerLiquidation] = useState(false);
  const [numBlMandPourRechercherLiquidation, setNumBlMandPourRechercherLiquidation] = useState<string>('');
  const [benumPourRechercherLiquidation, setBenumPourRechercherLiquidation] = useState<string>('');

  const tableLiquidationColumns = [
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
      name: "",
      selector: (row: any) => row.numBlMand,
      width: "50px",
      center: true
    },
    {
      name: "Montant",
      selector: (row: any) => Number(row.montant).toLocaleString(),
      width: "110px",
      right: true,
    },
    {
      name: "Bénéficiaire",
      selector: (row: any) => row.nom,
      wrap: true
    },
  ]

  const handleNumBlMandRechercherLiquidationInputChange = (e: any): void => {
    setNumBlMandPourRechercherLiquidation(e.target.value.toLowerCase());
  }

  const handleBenumRechercherLiquidationInputChange = (e: any): void => {
    setBenumPourRechercherLiquidation(e.target.value.toLowerCase());
  }

  const [formRLiquidation, setFormRLiquidation] = useState<FormRLiquidation>({
    benum: { value: ''},
    numBlMand: { value: ''},
    nom: { value: ''},
  })

  const handleInputChangeFormRLiquidation = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormRLiquidation({ ...formRLiquidation, ...newField})
  }

  useEffect( () => {
    const results = liquidations.filter(item => {
      return ((item.benum || '').toString().toLowerCase().includes(formRLiquidation.benum.value.toString().toLowerCase())
        && (item.numBlMand || '').toString().toLowerCase().includes(formRLiquidation.numBlMand.value.toString().toLowerCase())
        && (item.nom || '').toString().toLowerCase().includes(formRLiquidation.nom.value.toString().toLowerCase()))
    })
    setFilteredLiquidations(results);
  }, [formRLiquidation])  

  const getLiquidations = () => {
    LiquidationViewService.getLiquidationModifiables(Number(gestionCourante), Number(idBudget)).then(data => {
      setLiquidations(data) 
      if (formRLiquidation.benum.value !== "" || formRLiquidation.numBlMand.value !== "" || formRLiquidation.nom.value !== "") {
        const results = liquidations.filter(item => {
          return ((item.benum || '').toString().toLowerCase().includes(formRLiquidation.benum.value.toString().toLowerCase())
            && (item.numBlMand || '').toString().toLowerCase().includes(formRLiquidation.numBlMand.value.toString().toLowerCase())
            && (item.nom || '').toString().toLowerCase().includes(formRLiquidation.nom.value.toString().toLowerCase()))
        })
        setFilteredLiquidations(results);
      } else {
        setFilteredLiquidations(data)
      }
    })
  }
  
  const handleCloseModalSelectionnerLiquidation = () => {
    setShowModalSelectionnerLiquidation(false);
  }

  const handleShowModalSelectionnerLiquidation = () => {
    getLiquidations();
    setShowModalSelectionnerLiquidation(true);
  }
  
  const rechercherAfficherLiquidation = (benum: number, numBlMand: number) => {
    LiquidationViewService.getLiquidationModifiables(Number(gestionCourante), Number(idBudget)).then(data => {
      const result = data.filter(item => {
        return (item.benum === benum && item.numBlMand === numBlMand)
      })

      if (result.length !== 0) {
        // ACTIVER
        setDisabledEnregistrer(false);
        setDisableNatDepense(false);
        setDisableAuProfitDuCompte(false);
        setDisableDateMand(false);
        setDisableAjouterUnePieceJustificative(false);
        
        // LA LIQUIDATION A MODIFIER
        setLiquidationAModifier(result[0])
        setFormLiquidation({
          codBud: { value: result[0].codBud },
          numBe: { value: result[0].numBe },
          benum: { value: result[0].benum },
          dateCreation: { value: result[0].dateCreationEng },
          montantEngagement: { value: result[0].montantEng },
          dejaLiquideEngagement: { value: result[0].dejaLiquideReelEng },
          resteALiquiderEngagement: { value: result[0].resteALiquiderReelEng },
          natDepense: { value: result[0].objet },
          proced: { value: result[0].proced },
          nombreLiq: { value: result[0].nbreLiqReelEng },
          chap: { value: result[0].chap },
          art: { value: result[0].art },
          parag: { value: result[0].parag },
          rub: { value: result[0].rub },
          intitule: { value: result[0].intitule },
          idContrat: { value: result[0].idContrat },
          montantContrat: { value: result[0].montantContrat },
          engageValidContrat: { value: result[0].engageValidContrat },
          mandateValidContrat: { value: result[0].mandateValidContrat },
          referenceContrat: { value: result[0].referenceContrat },
          dateSaisieContrat: { value: result[0].dateSaisieContrat },
          idFourn: { value: result[0].idFourn },
          ifuMle: { value: result[0].ifumle },
          nom: { value: result[0].nom },
          codLiq: { value: result[0].codLiq },
          gestion: { value: result[0].gestion },
          numBl: { value: result[0].numBl },
          dateLiq: { value: result[0].dateLiq },
          montant: { value: result[0].montant },
          numeroDemande: { value: result[0].numeroDemande },
          mandNum: { value: result[0].mandNumb },
          dateMand: { value: result[0].dateMand},
          compteFourn: { value:result[0].compteFournMand },
          numBlMand: { value:result[0].numBlMand },
          bln : { value: result[0].gestion + "-" + String(result[0].benum).padStart(4, '0') + "-" + result[0].numBlMand },
          mandatNumero : { value: result[0].gestion + "-" + String(result[0].mandNumb).padStart(4, '0') },
          auProfitDuCompte: { value: (result[0].compteFournMand !== null)? result[0].abreviation + " " + result[0].libelleAgence + " N°" + result[0].codeBanque + " " + result[0].codeAgence + " " + result[0].numCompte + " " + result[0].cleRib : ""}
        })
        setNumBlMandPourRechercherLiquidation(result[0].numBlMand);
        setBenumPourRechercherLiquidation(result[0].benum);

        // RECUPERATION DES COMPTES COMPTES DESTINATAIRE DU BENEFICIAIRE
        getCompteDestinataires(result[0].idFourn);

        // RECUPERATION DES PIECES JUSTIFICATIVES
        getPjSelectionnees(result[0].numMand);
      } else {
        initFormLiquidation();
      }

    });
  }  

  const handleRechercheButtonClick = () => {
    if (benumPourRechercherLiquidation ==="" || numBlMandPourRechercherLiquidation === "") {
      handleShowModalSelectionnerLiquidation();
    } else {
      rechercherAfficherLiquidation(Number(benumPourRechercherLiquidation), Number(numBlMandPourRechercherLiquidation));
    }
  }   
  ///////////////// GESTION RECHERCHE LIQUIDATION

  ///////////////// GESTION EDITER LIQUIDATION
  const handleEditerLiquidationButtonClick = () => {
    
  }
  ///////////////// GESTION EDITER LIQUIDATION

  ///////////////// GESTION PIECES JUSTIFICATIVES SELECTIONNEES POUR LA LIQUIDATION
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
            disabled={params.row.codLiq !== 0}
          />,
          <GridActionsCellItem
            icon={<Button variant="outline-danger" size="sm" title="Supprimer"><BsTrash /></Button>}
            label="Delete"
            onClick={handleDeletePjSelectionnee(params.row)}
            color="inherit"
            disabled={params.row.codLiq !== 0}
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
        codLiq: 0
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
        </ButtonGroup>
      </GridToolbarContainer>
    );
  }

  const handleAjouterPieceJustificativeButtonClick= () => {
    // ICI ON AFFICHE LE MODAL POUR AJOUTER UNE PJ
    setOperationAjouterPj(true);
    handleShowModalAjouterUnePieceJustificative();
  }

  const getPjSelectionnees = (numMand: number) => {
    PieceJustifService.getByNumMandOrderByPieceJustificative(numMand).then(data => {
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
      montant: (row.avecMontant)? Number(removeNonNumeric(formLiquidation.montant.value)) : "",
      codLiq: 0
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
      montant: (newPj.avecMontant)? Number(removeNonNumeric(formLiquidation.montant.value)) : "",
      codLiq: 0
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
            <h6 className="shadow-sm text-primary text-center rounded">LIQUIDATION &gt; MODIFIER UNE LIQUIDATION</h6>
            <Form onSubmit={(e) => handleSubmitFormLiquidation(e)}>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <Form.Group as={Row}>
                    <InputGroup as={Col}>
                      <Form.Control name='' size='sm' value={"BL N° :"} type="text" className='me-1 text-end fw-bold text-primary' disabled />
                      <Form.Control name='' size='sm' value={gestionCourante} type="text" className='me-1 fw-bold' style={{maxWidth:"50px", maxHeight:"30px"}} disabled />
                      <Form.Control name='' size='sm' value={benumPourRechercherLiquidation} type="text" onChange={e => handleBenumRechercherLiquidationInputChange(e)} className='me-1 fw-bold' style={{maxWidth:"50px", maxHeight:"30px"}} />
                      <Form.Control name='' size='sm' value={numBlMandPourRechercherLiquidation} type="text" onChange={e => handleNumBlMandRechercherLiquidationInputChange(e)} className='fw-bold' style={{maxWidth:"50px", maxHeight:"30px"}} />
                      <Button variant="outline-warning" size='sm' title="Lancer la recherche" style={{maxHeight:"31px"}} onClick={ () => handleRechercheButtonClick()}><QuestionMarkOutlinedIcon /></Button>
                    </InputGroup>
                    <Col xs={5}>
                    </Col>
                    <ButtonGroup as={Col} xs={2} size="sm" className='justify-content-end'>
                      <Button variant="outline-primary" type='submit' title="Enregistrer la liquidation" className='me-1' style={{maxWidth:"65px", maxHeight:"30px"}} disabled={disabledEnregistrer}><SaveRoundedIcon /></Button>
                      <Button variant="outline-primary" title="Editer la liquidation" className='me-1' style={{maxWidth:"65px", maxHeight:"30px"}} onClick={ () => handleEditerLiquidationButtonClick()} disabled={disableEditerLiquidation}><LocalPrintshopIcon /></Button>
                    </ButtonGroup>
                  </Form.Group>
                </Card.Body>
              </Card>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <Card className="p-1 mb-1">
                    <Card.Title style={{fontSize:"0.8em"}}>
                      Reçu de demande de liquidation N° {(formLiquidation.numeroDemande.value !== "")? <span style={{ color:'#198754'}}>{formLiquidation.numeroDemande.value}</span> : "__________"} du {(formLiquidation.dateLiq.value !== "")? <span style={{ color:'#198754'}}>{formatDateWithHoursAndMinutes(new Date(formLiquidation.dateLiq.value))}</span>: "__________"} Montant : {(formLiquidation.montant.value !== "")? <span style={{ color:'#198754'}}>{formLiquidation.montant.value.toLocaleString()}</span> : "__________"} 
                    </Card.Title> 
                    <Table responsive striped bordered hover variant="" size="sm" style={{marginBottom:"0px"}}>
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
                        <tr style={{fontWeight:"bold", fontSize:"1.1em"}} className='text-center'>
                          <td>{formLiquidation.chap.value}</td>
                          <td>{formLiquidation.art.value}</td>
                          <td>{formLiquidation.parag.value}</td>
                          <td>{formLiquidation.rub.value}</td>
                          <td>{formLiquidation.intitule.value}</td>
                        </tr>
                      </tbody>
                    </Table>                   
                  </Card>                    
                  <div>
                    <Row className="">
                      <Col>
                        <Card>
                          <Card.Body className='p-1'>
                            <Card.Title style={{fontSize:"0.8em", marginBottom:"0px"}}>Engagement</Card.Title>
                              <tr style={{fontSize:"0.75em"}}>Numero {formLiquidation.numBe.value && <span style={{ color:'#198754'}}>{ gestionCourante + "-" + String(formLiquidation.benum.value).padStart(4, '0')}</span>} du { formLiquidation.dateCreation.value && <span style={{ color:'#198754'}}>{formatDateWithHoursAndMinutes(new Date(formLiquidation.dateCreation.value))}</span>}</tr>
                              <Table responsive striped bordered hover variant="" size="sm" style={{marginBottom:"0px"}}>
                                <thead>
                                  <tr>
                                    <th style={{width:"100px"}}>Montant engagé</th>
                                    <th style={{width:"100px"}}>Déja liquidé</th>
                                    <th style={{width:"100px"}}>Reste à liquider</th>
                                    <th style={{width:"70px"}}>Procédure</th>
                                    <th style={{width:"70px"}}>Nb Liq</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr style={{fontWeight:"bold", fontSize:"1.1em"}} className='text-center'>
                                    <td>{formLiquidation.montantEngagement.value.toLocaleString()}</td>
                                    <td>{formLiquidation.dejaLiquideEngagement.value.toLocaleString()}</td>
                                    <td>{formLiquidation.resteALiquiderEngagement.value.toLocaleString()}</td>
                                    <td>{formLiquidation.proced.value}</td>
                                    <td>{formLiquidation.nombreLiq.value}</td>
                                  </tr>
                                </tbody>
                              </Table>
                          </Card.Body>                        
                        </Card>
                      </Col>
                      <Col>
                        <Card>
                          <Card.Body className='p-1'>
                            <Card.Title style={{fontSize:"0.8em", marginBottom:"15px"}}>Fournisseur</Card.Title>
                            <Table responsive striped bordered hover variant="" size="sm" style={{marginBottom:"0px"}}>
                              <thead>
                                <tr>
                                  <th style={{width:"100px"}}>IFU/Mle</th>
                                  <th>Nom</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr style={{fontWeight:"bold", fontSize:"1.1em"}} className='text-center'>
                                  <td style={{height:"29px"}}>{formLiquidation.ifuMle.value}</td>
                                  <td style={{height:"29px"}}>{formLiquidation.nom.value}</td>
                                </tr>
                              </tbody>
                            </Table>
                          </Card.Body>                        
                        </Card>                                                
                      </Col>
                    </Row>
                  </div>
                </Card.Body>                        
              </Card>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <Row className="mb-1">
                    <Col> 
                      <Form.Group controlId="montant" as={Row} className='mb-1 label2'>
                        <Form.Label column xs={4}>Montant :</Form.Label>
                        <Col><Form.Control name='montant' value={formLiquidation.montant.value.toLocaleString()} size='sm' type="text" disabled /></Col>
                      </Form.Group> 
                      <Form.Group controlId="natDepense" as={Row} className='mb-1 label2'>
                        <Form.Label column xs={4}>Object :</Form.Label>
                        <Col><Form.Control as="textarea" rows={2} name='natDepense' value={formLiquidation.natDepense.value} title={formLiquidation.natDepense.value} size='sm' onChange={e => handleInputChangeFormLiquidation(e)} disabled={disableNatDepense} style={{borderColor: borderColorObjet}} /></Col>
                      </Form.Group>  
                      <Form.Group controlId="compteFourn" as={Row} className='label2'>
                        <Form.Label column xs={4}>Au profit du compte :</Form.Label>
                        <Col>
                          <InputGroup>
                            <Form.Select name='compteFourn' value={formLiquidation.compteFourn.value} title={formLiquidation.auProfitDuCompte.value} size='sm' onChange={e => handleInputChangeFormLiquidation(e)} disabled={disableAuProfitDuCompte}>
                              <option value=""></option>
                                {
                                  compteDestinataires.map( cd => (
                                    <option key={cd.id} value={cd.id}>{cd.abreviation + " " + cd.libelleAgence + " N°" + cd.codeBanque + " " + cd.codeAgence + " " + cd.numCompte + " " + cd.cleRib}</option>
                                  ))
                                }
                            </Form.Select>
                          </InputGroup>
                        </Col>
                      </Form.Group>                                                            
                    </Col>
                    <Col> 
                      <Form.Group controlId="dateMand" as={Row} className='mb-1 label2'>
                        <Form.Label column xs={4}>Date :</Form.Label>
                        <Col>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker 
                              value={dayjs(formLiquidation.dateMand.value)} 
                              onChange={(newValue) => formLiquidation.dateMand.value = newValue?.toISOString()} 
                              views={['year', 'month', 'day', 'hours', 'minutes']} 
                              viewRenderers={{hours: null, minutes: null }} 
                              format="DD/MM/YYYY HH:mm" 
                              disabled={disableDateMand}
                              sx={{ 
                                "& .MuiOutlinedInput-root": 
                                  { 
                                    fontSize: '1.18em', 
                                    height: 30, 
                                    padding: 1,
                                    border: '1px solid ' + borderColorDateMand,
                                  },
                                  '& .MuiInputBase-input': {
                                    textAlign: 'center',
                                  },
                                  width: '100%'
                              }}
                            />
                          </LocalizationProvider>                        
                        </Col>
                      </Form.Group> 
                      <Form.Group controlId="bln" as={Row} className='mb-1 label2'>
                        <Form.Label column xs={4}>BL N° :</Form.Label>
                        <Col><Form.Control name='bln' value={formLiquidation.bln.value} size='sm' type="text" className='text-center' disabled /></Col>
                      </Form.Group>
                      <Form.Group controlId="mandNum" as={Row} className='mb-1 label2'>
                        <Form.Label column xs={4}>Mandat N° :</Form.Label>
                        <Col><Form.Control name='mandNum' value={formLiquidation.mandatNumero.value} size='sm' type="text" className='text-center' disabled /></Col>
                      </Form.Group>                                                           
                    </Col>                    
                  </Row>
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
                      isRowSelectable={(params) => params.row.codLiq === 0}
                      processRowUpdate={processRowUpdatePjSelectionnees}
                      onProcessRowUpdateError={handleProcessRowUpdateError}
                      isCellEditable={(params) => params.row.codLiq === 0}
                      getRowClassName={(params) =>
                        params.row.codLiq === 0 ? 'active-row' : 'inactive-row'
                      }
                      slots={{
                        toolbar: EditToolbar,
                        noRowsOverlay: NoRowsOverlay,
                      }}
                      sx={{
                        '& .header': {
                          backgroundColor: '#fff',
                          marginTop:'2px',
                        },
                        '& .active-row': {
                          backgroundColor: '#fff',
                        },
                        '& .inactive-row': {
                          backgroundColor: '#F5F5F5',
                          opacity: '0.8'
                        },
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

          {/* GESTION RECHERCHE LIQUIDATION */}
          <Modal show={showModalSelectionnerLiquidation} onHide={handleCloseModalSelectionnerLiquidation} backdrop="static" keyboard={false} size="lg">
            <Modal.Header className='p-1'>
              <Modal.Title as="h6">Liste des BL</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2'>
              <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tableLiquidationColumns}
                    data={filteredLiquidations}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    fixedHeaderScrollHeight='450px'
                    highlightOnHover
                    responsive
                    striped
                    onRowClicked={ (row, e) => {
                      rechercherAfficherLiquidation(row.benum, row.numBlMand);
                      handleCloseModalSelectionnerLiquidation();
                    }}
                    subHeader
                    subHeaderComponent={
                      <ButtonGroup as={Col} size="sm">
                        <Form.Control name="benum" value={formRLiquidation.benum.value} size='sm' type="number" placeholder='Numero Eng' className='me-1' style={{width:"120px"}} onChange={e => handleInputChangeFormRLiquidation(e)}/>
                        <Form.Control name="numBlMand" value={formRLiquidation.numBlMand.value} size='sm' type="number" placeholder='Numero BL' className='me-1' style={{width:"120px"}} onChange={e => handleInputChangeFormRLiquidation(e)}/>
                        <Form.Control name="nom" value={formRLiquidation.nom.value} size='sm' type="text" placeholder='Nom du bénéficiaire' className='w-25' onChange={e => handleInputChangeFormRLiquidation(e)}/>
                      </ButtonGroup> 
                    }
                    />
                </Card.Body>
              </Card>
            </Modal.Body>

            <Modal.Footer className='p-1'>
              <Button variant="outline-danger" size='sm' onClick={handleCloseModalSelectionnerLiquidation}>Fermer</Button>
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

      </Container>
  );
};

export default LiquidationModifierUneLiquidationForm;
