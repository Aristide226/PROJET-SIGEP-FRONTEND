import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import Swal from 'sweetalert2';
import DataTable  from 'react-data-table-component'; 
import { costumeStyles } from '../../helpers/costume-styles';
import { okSuccessDialog, okWarnignDialog } from '../../helpers/dialogs';
import { BsArrowDownCircleFill, BsPlusLg, BsTrash } from 'react-icons/bs';
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
import { addSepartor, removeNonNumeric } from '../../helpers/format';
import { emptyLiquidationRequestDto, LiquidationRequestDto } from '../models/liquidation';
import LiquidationService from '../services/liquidation-service';
import EngagementEN01ViewService from '../services/engagement-en01-view-service';
import ServerDateService from '../../shared/system/services/server-date-service';


// FORUMULAIRE RECU DE DEMANDE DE LIQUIDATION
type FormReçuDemandeDeLiquidation = {
  numBe: Field,
  benum: Field,
  dateCreation: Field,
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

// CRITERES DE RECHERCHE ENGAGEMENT
type FormREngagement = {
  nom: Field,
}

const LiquidationDemandeDeLiquidationCreerRecuForm: FunctionComponent = () => {

  const [gestionCourante] = useState<string>(Gestion() ?? '');
  const [idBudget] = useState<string>(IdBudget() ?? '');
  const [utilisateurCourante] = useState<string>(ConnectedUser() ?? '');
  const [isGestionClose, setIsGestionClose] = useState<boolean>(false);
  const dateEnregistrementPourGestionClose: Date = new Date(gestionCourante + '-12-31');
  const [disabledEnregistrer, setDisabledEnregistrer] = useState<boolean>(true);
  const [disableEditerLeReçu, setDisableEditerLeReçu] = useState<boolean>(true);
  const [disableSelectionnerEngagement, setDisableSelectionnerEngagement] = useState<boolean>(true);
  const [disableMontant, setDisableMontant] = useState<boolean>(true);
  const [disableNatDepense, setDisableNatDepense] = useState<boolean>(true);
  const [disableAjouterUnePieceJustificative, setDisableAjouterUnePieceJustificative] = useState<boolean>(true);
  const [disableRappelPiecesJustificatives, setDisableRappelPiecesJustificatives] = useState<boolean>(true);
  const [borderColorSelectionnerEngagement, setBorderColorSelectionnerEngagement] = useState<string>("");
  const [borderColorMontant, setBorderColorMontant] = useState<string>("");
  const [borderColorObjet, setBorderColorObjet] = useState<string>("");
  const [borderColorPieceJustificatives, setBorderColorPieceJustificatives] = useState<string>("");
  
  useEffect(() => {
    // On recupere la date du server : si la gestion en cours est strictement inférieur à l'année de la date du serveur alors elle est close :
    ServerDateService.getServerDate().then(data => {
      if (Number(gestionCourante) < new Date(data).getFullYear()) setIsGestionClose(true); else setIsGestionClose(false)   
    }) 
  }, [])   

  ///////////////// GESTION RECU DE DEMANDE DE LIQUIDATION
  const [formReçuDemandeDeLiquidation, setFormReçuDemandeDeLiquidation] = useState<FormReçuDemandeDeLiquidation>({
    numBe: { value: '' },
    benum: { value: '' },
    dateCreation: { value: '' },
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
  
  const handleInputChangeFormReçuDemandeDeLiquidation = (e: any): void => {
    const fieldName: string = e.target.name;
    let fieldValue: string = e.target.value;

    if (fieldName === "montant") {
      fieldValue = addSepartor(removeNonNumeric(fieldValue));
    }

    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormReçuDemandeDeLiquidation({ ...formReçuDemandeDeLiquidation, ...newField}); 
  }

  const validateFormReçuDemandeDeLiquidation = () => {
    let newForm: FormReçuDemandeDeLiquidation = formReçuDemandeDeLiquidation;

    // Engagement
    if(formReçuDemandeDeLiquidation.numBe.value === "") {
      const errorMsg: string = 'Engagement obligatoire !';
      const newField: Field = { value: formReçuDemandeDeLiquidation.numBe.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ numBe: newField } };
      setBorderColorSelectionnerEngagement("red");
    } else {
      const newField: Field = { value: formReçuDemandeDeLiquidation.numBe.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ numBe: newField } };
      setBorderColorSelectionnerEngagement("");
    }

    // Montant Reçu
    if(formReçuDemandeDeLiquidation.montant.value === "" || formReçuDemandeDeLiquidation.montant.value <= 0) {
      const errorMsg: string = 'Montant obligatoire !';
      const newField: Field = { value: formReçuDemandeDeLiquidation.montant.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ montant: newField } };
      setBorderColorMontant("red");
    } else {
      const newField: Field = { value: formReçuDemandeDeLiquidation.montant.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ montant: newField } };
      setBorderColorMontant("");
    }

    // Objet
    if(formReçuDemandeDeLiquidation.natDepense.value === "") {
      const errorMsg: string = 'Objet obligatoire !';
      const newField: Field = { value: formReçuDemandeDeLiquidation.natDepense.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ natDepense: newField } };
      setBorderColorObjet("red");
    } else {
      const newField: Field = { value: formReçuDemandeDeLiquidation.natDepense.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ natDepense: newField } };
      setBorderColorObjet("");
    }

    // Nombre Pj
    if(formReçuDemandeDeLiquidation.nombrePj.value === 0) {
      const errorMsg: string = 'Pj obligatoire !';
      const newField: Field = { value: formReçuDemandeDeLiquidation.nombrePj.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ nombrePj: newField } };
      setBorderColorPieceJustificatives("red");
    } else {
      const newField: Field = { value: formReçuDemandeDeLiquidation.nombrePj.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ nombrePj: newField } };
      setBorderColorPieceJustificatives("");
    }

    setFormReçuDemandeDeLiquidation(newForm);
    return newForm.numBe.isValid && newForm.montant.isValid && newForm.natDepense.isValid && newForm.nombrePj.isValid;
  }

  const handleSubmitFormReçuDemandeDeLiquidation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormReçuDemandeDeLiquidation()) {
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

    if (removeNonNumeric(formReçuDemandeDeLiquidation.montant.value) > formReçuDemandeDeLiquidation.resteALiquiderEngagement.value) {
      okWarnignDialog("Montant du reçu doit etre inférieur ou égal au reste à liquider del'engagement concerné !")
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
          addReçu();
        }
      });
    } else {
      addReçu();
    }     
  }

  const addReçu = () => {
    // CREATION D'UN RECU
    let newReçu: LiquidationRequestDto = emptyLiquidationRequestDto;
    newReçu.gestion = gestionCourante;
    newReçu.dateLiq = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
    newReçu.objet = formReçuDemandeDeLiquidation.natDepense.value;
    newReçu.montant = removeNonNumeric(formReçuDemandeDeLiquidation.montant.value);
    newReçu.montEngage = formReçuDemandeDeLiquidation.montantEngagement.value;
    newReçu.montDjaLiq = formReçuDemandeDeLiquidation.dejaLiquideEngagement.value; // ??? valid ??
    newReçu.modifiable = true;
    newReçu.idUser = utilisateurCourante;
    newReçu.dateModif = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
    newReçu.actif = true;
    newReçu.idBudget = idBudget;
    newReçu.compteFourn = null;
    newReçu.idContrat = formReçuDemandeDeLiquidation.idContrat.value;
    newReçu.numBe = formReçuDemandeDeLiquidation.numBe.value;
    newReçu.idFourn = formReçuDemandeDeLiquidation.idFourn.value;
    
    LiquidationService.add(newReçu).then(reçu => {
      // ON ENREGISTRE LES PIECES JUSTIFICATIVES DANS PieceJustif
      let pieceJustifs: PieceJustifRequestDto[] = [];
      pjSelectionnees.forEach(item => {
        pieceJustifs.push({
          numBe: reçu.numBe,
          codLiq: reçu.codLiq,
          numMand: null,
          pieceJustificative: item.pj,
          numero: item.numero,
          datePj: item.date,
          montant: item.montant,
          idRetenu: null, // A demander
          idBord: null, // A demander
        });
      });
      PieceJustifService.addPiecesJustificativesRDL(reçu.codLiq, pieceJustifs).then(res => {
        if (res) {
          formReçuDemandeDeLiquidation.numBl.value = reçu.numBl;
          formReçuDemandeDeLiquidation.dateLiq.value = reçu.dateLiq;
          setDisabledEnregistrer(true);
          setDisableEditerLeReçu(false);
          setDisableSelectionnerEngagement(true);
          setDisableMontant(true);
          setDisableNatDepense(true);
          setDisableAjouterUnePieceJustificative(true);
          setDisableRappelPiecesJustificatives(true);
          okSuccessDialog("Reçu crée avec succès !");
        }
      })
    });
  }

  const handleAddReçuDemandeDeLiquidation = () => {
    setFormReçuDemandeDeLiquidation({
      numBe: { value: '' },
      benum: { value: '' },
      dateCreation: { value: '' },
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

    setDisabledEnregistrer(false);
    setDisableSelectionnerEngagement(false);
    setDisableMontant(false);
    setDisableNatDepense(false);
    setDisableAjouterUnePieceJustificative(false);
    setDisableRappelPiecesJustificatives(true);
  }
  ///////////////// GESTION RECU DE DEMANDE DE LIQUIDATION

  ///////////////// GESTION EDITER RECU
  const handleEditerLeReçuButtonClick = () => {
    
  }
  ///////////////// GESTION EDITER RECU

  ///////////////// GESTION SELECTIONNER ENGAGEMENT
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
      name: "Fournisseur",
      selector: (row: any) => row.nom,
      wrap: true
    },
    {
      name: "Montant",
      selector: (row: any) => Number(row.montant).toLocaleString(),
      width: "110px",
      right: true,
    },
    {
      name: "Reste à liquider",
      selector: (row: any) => Number(row.resteALiquider).toLocaleString(),
      width: "120px",
      right: true,
    },
  ]

  const [formREngagement, setFormREngagement] = useState<FormREngagement>({
    nom: { value: ''},
  })
  
  const handleInputChangeFormREngagement = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormREngagement({ ...formREngagement, ...newField})
  }
  
  useEffect( () => {
    const results = engagements.filter(item => {
      return ((item.nom || '').toString().toLowerCase().includes(formREngagement.nom.value.toString().toLowerCase()))
    })
    setFilteredEngagements(results);
  }, [formREngagement])

  useEffect( () => {
    getEngagements()
  }, [])
  
  const getEngagements = () => {
    EngagementEN01ViewService.getEngagementEN01ValideAE2EtTransmisEtPartiellementLiquides(Number(gestionCourante), Number(idBudget)).then(data => {
      setEngagements(data) 
      if (formREngagement.nom.value !== "") {
        const results = engagements.filter(item => {
          return ((item.nom || '').toString().toLowerCase().includes(formREngagement.nom.value.toString().toLowerCase()))
        })
        setFilteredEngagements(results);
      } else {
        setFilteredEngagements(data)
      }
    })
  }

  const handleCloseModalSelectionnerEngagement = () => {
    setShowModalSelectionnerEngagement(false);
  }

  const handleShowModalSelectionnerEngagement = () => {
    getEngagements();
    setShowModalSelectionnerEngagement(true);
  }  
  ///////////////// GESTION SELECTIONNER ENGAGEMENT

  ///////////////// GESTION PIECES JUSTIFICATIVES SELECTIONNEES POUR LE RDL
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
        formReçuDemandeDeLiquidation.nombrePj.value = Number(formReçuDemandeDeLiquidation.nombrePj.value) - 1; // Juste pour compter le nombre de pj
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
      montant: (row.avecMontant)? Number(removeNonNumeric(formReçuDemandeDeLiquidation.montant.value)) : "",
      codLiq: null
    }
    setPjSelectionnees([...pjSelectionnees, newObject]);
    formReçuDemandeDeLiquidation.nombrePj.value = Number(formReçuDemandeDeLiquidation.nombrePj.value) + 1; // Juste pour compter le nombre de pj
  }

  const handleRemplacerPj = (newPj: any) => {
    // La nouvelle ligne
    const newObject: PJPourEngagement = {
      identifiant: pjSelectionneePourEtreRemplace.identifiant,
      pj: newPj.pj,
      numero: pjSelectionneePourEtreRemplace.numero,
      date: pjSelectionneePourEtreRemplace.date,
      montant: (newPj.avecMontant)? Number(removeNonNumeric(formReçuDemandeDeLiquidation.montant.value)) : "",
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
  const [pjEngSelectionnes, setPjEngSelectionnes] = useState<any[]>([]);
  const [showModalRappelPiecesJustificatives, setShowModalRappelPiecesJustificatives] = useState(false);
  const [pjEngCochees, setPjEngCochees] = useState<any[]>([]);
  var _pjEngCochees: any[] = [];

  const tablePjEngColumns = [
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
    setPjEngCochees(_pjEngCochees);
    const pjSelectionneesCopy = [...pjSelectionnees];
    _pjEngCochees.forEach(item => {
      const newObject: PJPourEngagement = {
        identifiant: pjSelectionneesCopy.length+1,
        pj: item.pieceJustificative,
        numero: item.numero,
        date: new Date(item.datePj),
        montant: item.montant,
        codLiq: null
      }
      pjSelectionneesCopy.push(newObject);
      formReçuDemandeDeLiquidation.nombrePj.value = Number(formReçuDemandeDeLiquidation.nombrePj.value) + 1; // Juste pour compter le nombre de pj
    })
    
    setPjSelectionnees(pjSelectionneesCopy)
    handleCloseModalRappelPiecesJustificatives();
  }

  const getPjEngagementSelectionnes = (numBe: number) => {
    PieceJustifService.getByNumBeOrderByPieceJustificative(numBe).then(data => {
      setPjEngSelectionnes(data)
    })
  }

  const handleCloseModalRappelPiecesJustificatives = () => {
    setShowModalRappelPiecesJustificatives(false);
  }

  const handleShowModalRappelPiecesJustificatives = () => {
    setShowModalRappelPiecesJustificatives(true);
  }

  const handleRappelPiecesJustificativesButtonClick= () => {
    getPjEngagementSelectionnes(formReçuDemandeDeLiquidation.numBe.value);
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
            <h6 className="shadow-sm text-primary text-center rounded">LIQUIDATION &gt; DEMANDE DE LIQUIDATION &gt; CREATION DU RE&Ccedil;U DE DEMANDE DE LIQUIDATION</h6>
            <Form onSubmit={(e) => handleSubmitFormReçuDemandeDeLiquidation(e)}>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <Form.Group as={Row}>
                    <InputGroup as={Col}>
                      <Form.Control name='' size='sm' value={"Référence Reçu :"} type="text" className='me-1' disabled />
                      <Form.Control name='' size='sm' value={gestionCourante} type="text" className='me-1' style={{maxWidth:"50px", maxHeight:"30px"}} disabled />
                      <Form.Control name='' size='sm' value={String(formReçuDemandeDeLiquidation.numBl.value).padStart(4, '0')} type="text" style={{maxWidth:"50px", maxHeight:"30px"}} disabled />
                    </InputGroup>
                    <Col xs={5}>
                      <Form.Group controlId="" as={Row}>
                        <Col xs={5}><Form.Label className="label2">Date de réception :</Form.Label></Col>
                        <Col><Form.Control name='' size='sm' value={(formReçuDemandeDeLiquidation.dateLiq.value === "") ? "": formatDateWithHoursAndMinutes(new Date(formReçuDemandeDeLiquidation.dateLiq.value))} type="text" disabled /></Col>
                      </Form.Group>
                    </Col>
                    <ButtonGroup as={Col} xs={3} size="sm" className='justify-content-end'>
                      <Button variant="outline-primary" title="Créer un nouveau reçu de demande de liquidation" className='me-1' style={{maxWidth:"65px", maxHeight:"30px"}} onClick={ () => handleAddReçuDemandeDeLiquidation()}><BsPlusLg /></Button>
                      <Button variant="outline-primary" type='submit' title="Enregistrer le reçu de demande de liquidation" className='me-1' style={{maxWidth:"65px", maxHeight:"30px"}} disabled={disabledEnregistrer}><SaveRoundedIcon /></Button>
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
                            <Card.Title style={{fontSize:"0.8em", marginBottom:"0px"}}>Engagement<Button variant="outline-primary" title="Cliquez pour sélectionner un engagement" size="sm" style={{width:"30px", height:"30px", borderColor: borderColorSelectionnerEngagement}} onClick={handleShowModalSelectionnerEngagement} disabled={disableSelectionnerEngagement}><BsArrowDownCircleFill /></Button></Card.Title>
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
                                    <td>{formReçuDemandeDeLiquidation.montantContrat.value.toLocaleString()}</td>
                                    <td>{formReçuDemandeDeLiquidation.engageValidContrat.value.toLocaleString()}</td>
                                    <td>{formReçuDemandeDeLiquidation.mandateValidContrat.value.toLocaleString()}</td>
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
                                <Col><Form.Control name='montant' value={formReçuDemandeDeLiquidation.montant.value} onChange={e => handleInputChangeFormReçuDemandeDeLiquidation(e)} size='sm' type="text" disabled={disableMontant} style={{borderColor: borderColorMontant}} /></Col>
                              </Form.Group>
                              <Form.Group controlId="natDepense" as={Row} className='label2'>
                                <Col xs={3}><Form.Label>Object :</Form.Label></Col>
                                <Col><Form.Control as="textarea" rows={2} name='natDepense' value={formReçuDemandeDeLiquidation.natDepense.value} title={formReçuDemandeDeLiquidation.natDepense.value} size='sm' onChange={e => handleInputChangeFormReçuDemandeDeLiquidation(e)} disabled={disableNatDepense} style={{borderColor: borderColorObjet}}  /></Col>
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
                        },
                        borderColor: borderColorPieceJustificatives
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

          {/* GESTION SELECTIONNER ENGAGEMENT */}
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
                      formReçuDemandeDeLiquidation.gestion.value = row.gestion;
                      formReçuDemandeDeLiquidation.numBe.value = row.numBe;
                      formReçuDemandeDeLiquidation.benum.value = row.benum;
                      formReçuDemandeDeLiquidation.dateCreation.value = row.dateCreation;
                      formReçuDemandeDeLiquidation.montantEngagement.value = row.montant;
                      formReçuDemandeDeLiquidation.dejaLiquideEngagement.value = row.dejaLiquide;
                      formReçuDemandeDeLiquidation.resteALiquiderEngagement.value = row.resteALiquider;
                      formReçuDemandeDeLiquidation.natDepense.value = row.natDepense;
                      formReçuDemandeDeLiquidation.idContrat.value = row.idContrat;
                      formReçuDemandeDeLiquidation.montantContrat.value = row.montantContrat;
                      formReçuDemandeDeLiquidation.engageValidContrat.value = row.engageValidContrat;
                      formReçuDemandeDeLiquidation.mandateValidContrat.value = row.mandateValidContrat;
                      formReçuDemandeDeLiquidation.referenceContrat.value = row.referenceContrat;
                      formReçuDemandeDeLiquidation.dateSaisieContrat.value = row.dateSaisieContrat;
                      formReçuDemandeDeLiquidation.idFourn.value = row.idFourn;
                      formReçuDemandeDeLiquidation.ifuMle.value = row.ifumle;
                      formReçuDemandeDeLiquidation.nom.value = row.nom;
                      formReçuDemandeDeLiquidation.montant.value = Number(row.resteALiquider).toLocaleString();
                      setDisableRappelPiecesJustificatives(false);

                      handleCloseModalSelectionnerEngagement();
                    }}
                    subHeader
                    subHeaderComponent={
                      <Form.Control name="nom" value={formREngagement.nom.value} size='sm' type="text" placeholder="Non fournisseur" className='w-25' onChange={e => handleInputChangeFormREngagement(e)} />
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

          {/* GESTION RAPPEL PIECES JUSTIFICATIVES */}
          <Modal show={showModalRappelPiecesJustificatives} onHide={handleCloseModalRappelPiecesJustificatives} backdrop="static" keyboard={false} size="lg">
            <Modal.Header className='p-1'>
                <Modal.Title as="h6">Pièce Justificatives ENGAGEMENT</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2'>
              <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tablePjEngColumns}
                    data={pjEngSelectionnes}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    responsive
                    striped
                    fixedHeaderScrollHeight='180px'
                    highlightOnHover
                    subHeader
                    selectableRows
                    selectableRowSelected={row => (
                      pjEngCochees.some((item) => {
                        return item.codPj === row.codPj;
                      })
                    )}
                    onSelectedRowsChange={ (selected) => {
                      _pjEngCochees = selected.selectedRows;
                    }}
                    />
                </Card.Body>
              </Card>
            </Modal.Body>

            <Modal.Footer className='p-1'>
              <Button variant="outline-success" size='sm' onClick={handleOk}>OK</Button>
            </Modal.Footer>
          </Modal>


      </Container>
  );
};

export default LiquidationDemandeDeLiquidationCreerRecuForm;
