import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import Swal from 'sweetalert2';
import DataTable  from 'react-data-table-component'; 
import { costumeStyles } from '../../helpers/costume-styles';
import { okSuccessDialog, okWarnignDialog } from '../../helpers/dialogs';
import { BsPlusLg, BsTrash } from 'react-icons/bs';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowModel, GridRowParams, GridToolbarContainer } from '@mui/x-data-grid';
import { ConnectedUser, Gestion, IdBudget } from '../helpers/session-storage';
import Alert, { AlertProps } from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import PjService from '../services/pj-service';
import { emptyPJPourEngagement, PJPourEngagement } from '../models/pj-pour-engagment';
import { emptyEngagementRequestDto, EngagementRequestDto } from '../models/engagement';
import EngagementService from '../services/engagement-service';
import PieceJustifService from '../services/piece-justif-service';
import { PieceJustifRequestDto } from '../models/piece-justif';
import { formatDateWithHoursAndMinutes } from '../../helpers/format-date';
import { addSepartor, removeNonNumeric } from '../../helpers/format';
import EngagementEN01ViewService from '../services/engagement-en01-view-service';
import ServerDateService from '../../shared/system/services/server-date-service';

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

const EngagementsCorrectionMontantModifierUnBonDAnnulationForm: FunctionComponent = () => {

  const [gestionCourante] = useState<string>(Gestion() ?? '');
  const [idBudget] = useState<string>(IdBudget() ?? '');
  const [utilisateurCourante] = useState<string>(ConnectedUser() ?? '');
  const [isGestionClose, setIsGestionClose] = useState<boolean>(false);   
  const [disabledEnregistrer, setDisabledEnregistrer] = useState<boolean>(true);
  const [disableEditerEngagment, setDisableEditerEngagment] = useState<boolean>(true);
  const [disableMontantNouveauEng, setDisableMontantNouveauEng] = useState<boolean>(true);
  const [disableNatDepenseNouveauEng, setDisableNatDepenseNouveauEng] = useState<boolean>(true);
  const [disableAjouterUnePieceJustificative, setDisableAjouterUnePieceJustificative] = useState<boolean>(true);

  useEffect(() => {
    // On recupere la date du server : si la gestion en cours est strictement inférieur à l'année de la date du serveur alors elle est close :
    ServerDateService.getServerDate().then(data => {
      if (Number(gestionCourante) < new Date(data).getFullYear()) setIsGestionClose(true); else setIsGestionClose(false)   
    }) 
  }, [])   

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

    setDisabledEnregistrer(true);
    setDisableEditerEngagment(true);
    setDisableMontantNouveauEng(true);
    setDisableNatDepenseNouveauEng(true);
  }
  
  const handleInputChangeFormEng = (e: any): void => {
    const fieldName: string = e.target.name;
    let fieldValue: string = e.target.value;

    if (fieldName ==="montantNouveauEng") {
      fieldValue = addSepartor(removeNonNumeric(fieldValue));
      formEng.natDepenseNouveauEng.value = "Dégagement de " + addSepartor(removeNonNumeric(fieldValue)) + " de l'engagement \u2116 " + formEng.gestion.value + "-" + String(formEng.benum.value).padStart(4, '0')
    
      if (fieldValue === "") {

      } else if (Number(removeNonNumeric(fieldValue)) === 0 || Number(removeNonNumeric(fieldValue)) > (engagementAModifier.montant)*(-1) + engagementParent.resteALiquider) {
        fieldValue = addSepartor(removeNonNumeric(engagementAModifier.montant));
        formEng.natDepenseNouveauEng.value = "Dégagement de " + addSepartor(removeNonNumeric(fieldValue)) + " de l'engagement \u2116 " + formEng.gestion.value + "-" + String(formEng.benum.value).padStart(4, '0')
        okWarnignDialog("Le montant doit etre supérieur à 0 et inférieur ou égal à " + addSepartor(engagementAModifier.montant*(-1) + engagementParent.resteALiquider));
      }
    }

    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormEng({ ...formEng, ...newField}); 
  }

  const validateFormEng = () => {
    let newForm: FormEng = formEng;

    // Montant nouveau engagement
    if(formEng.montantNouveauEng.value === "") {
      const errorMsg: string = 'Object obligatoire !';
      const newField: Field = { value: formEng.montantNouveauEng.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ montantNouveauEng: newField } };
    } else {
      const newField: Field = { value: formEng.montantNouveauEng.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ montantNouveauEng: newField } };
    }

    // Nature depense
    if(formEng.natDepenseNouveauEng.value === "") {
      const errorMsg: string = 'Object obligatoire !';
      const newField: Field = { value: formEng.natDepenseNouveauEng.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ natDepenseNouveauEng: newField } };
    } else {
      const newField: Field = { value: formEng.natDepenseNouveauEng.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ natDepenseNouveauEng: newField } };
    }

    setFormEng(newForm);
    return newForm.montantNouveauEng.isValid && newForm.natDepenseNouveauEng.isValid;
  }

  const handleSubmitFormEng = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormEng()) {
      Swal.fire({
        title: 'GesBud',
        text: "Veuillez renseigner les champs montant, object !",
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
          editEng();
        }
      });
    } else {
      editEng();
    }     

  }

  const editEng = () => {
    // MODIFICATION D'UN ENGAGEMENT EN PROCEDURE NORMALE
    let newEng: EngagementRequestDto = emptyEngagementRequestDto;
    newEng.dateCreation = engagementAModifier.dateCreation;
    newEng.natDepense = formEng.natDepenseNouveauEng.value;
    newEng.auProfit = engagementAModifier.auProfit;
    newEng.montant = Number(removeNonNumeric(formEng.montantNouveauEng.value))*(-1);
    newEng.dotInitiale = engagementAModifier.dotInitiale;
    newEng.dispoAvant = engagementAModifier.disponible;
    newEng.dateEtat = engagementAModifier.dateEtat;
    newEng.idUser = utilisateurCourante;
    newEng.avecDecision = engagementAModifier.avecDecision;
    newEng.apartirDemandLiq = engagementAModifier.apartirDemandLiq;
    newEng.grh = engagementAModifier.apartirDemandLiq;
    newEng.receptionne = engagementAModifier.grh;
    newEng.dateValid = engagementAModifier.dateValid;
    newEng.dateCreat = engagementAModifier.dateCreat;
    newEng.codLiq = engagementAModifier.codLiq;
    newEng.codBord = engagementAModifier.codBord;
    newEng.idContrat = engagementAModifier.idContrat;
    newEng.idEngParent = engagementAModifier.idEng;
    newEng.etat = engagementAModifier.etat;
    newEng.idEtatTrans = engagementAModifier.idEtatTrans;
    newEng.proced = engagementAModifier.proced;
    newEng.codBud = engagementAModifier.codBud;
    newEng.idBudget = idBudget;
    newEng.idFourn = engagementAModifier.idFourn;
    newEng.gestion = gestionCourante; 

    EngagementService.edit(engagementAModifier.numBe, newEng).then(engagement => {
      // ON ENREGISTRE LES PIECES JUSTIFICATIVES DANS PieceJustif
      let pieceJustifs: PieceJustifRequestDto[] = [];
      pjSelectionnees.forEach(item => {
        pieceJustifs.push({
          numBe: engagement.numBe,
          codLiq: engagement.codLiq,
          numMand: null,
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
          rechercherAfficherEngagement(engagement.benum); // Pour actu l'interface avec les nouvelles data
          getEngagements(); // Pour actu ls annulations modifiables
          setDisabledEnregistrer(true);
          setDisableEditerEngagment(false);
          okSuccessDialog("Modifié avec succès !");
        }
      })
    })    
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
          
          // ACTIVER A CHAQUE FOIS QUON A UN RESULTAT
          setDisabledEnregistrer(false);
          setDisableMontantNouveauEng(false);
          setDisableNatDepenseNouveauEng(false);
          setDisableAjouterUnePieceJustificative(false);

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
        </ButtonGroup>
      </GridToolbarContainer>
    );
  }

  const handleAjouterPieceJustificativeButtonClick= () => {
    // ICI ON AFFICHE LE MODAL POUR AJOUTER UNE PJ
    setOperationAjouterPj(true);
    handleShowModalAjouterUnePieceJustificative();
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
      montant: (row.avecMontant)? formEng.montant.value : "",
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
      montant: (newPj.avecMontant)? formEng.montant.value : "",
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
            <h6 className="shadow-sm text-primary text-center rounded">ENGAGEMENTS &gt; CORRECTION MONTANT &gt; MODIFICATION DE BON D'ANNULATION OU DE DEGAGEMENT</h6>
            <Form onSubmit={(e) => handleSubmitFormEng(e)}>
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
                      <Button variant="outline-primary" type='submit' title="Enregistrer" className='me-1' style={{maxWidth:"65px", maxHeight:"30px"}} disabled={disabledEnregistrer}><SaveRoundedIcon /></Button>
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
                          <Col><Form.Control name='montantNouveauEng' value={formEng.montantNouveauEng.value} onChange={e => handleInputChangeFormEng(e)} size='sm' type="text" disabled={disableMontantNouveauEng} /></Col>
                        </Form.Group>
                        <Form.Group controlId="natDepenseNouveauEng" as={Row} className='mb-1'>
                          <Col xs={4}><Form.Label>Object :</Form.Label></Col>
                          <Col><Form.Control as="textarea" rows={2} name='natDepenseNouveauEng' value={formEng.natDepenseNouveauEng.value} title={formEng.natDepenseNouveauEng.value} size='sm' onChange={e => handleInputChangeFormEng(e)} disabled={disableNatDepenseNouveauEng} /></Col>
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

export default EngagementsCorrectionMontantModifierUnBonDAnnulationForm;
