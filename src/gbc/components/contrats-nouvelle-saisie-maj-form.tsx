import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import { DataGrid, GridColDef, GridRowId, GridRowSelectionModel, GridToolbarContainer, GridValueFormatterParams } from '@mui/x-data-grid';
import { ConnectedUser, Gestion, IdBudget } from '../helpers/session-storage';
import Stack from '@mui/material/Stack';
import { okSuccessDialog, okWarnignDialog } from '../../helpers/dialogs';
import { formatDateWithHoursAndMinutes } from '../../helpers/format-date';
import GestionService from '../services/gestion-service';
import ContratsViewService from '../services/contrats-view-service';
import { BsArrowDownCircleFill, BsPencilSquare, BsPlusLg } from 'react-icons/bs';
import DeleteIcon from '@mui/icons-material/Delete';
import ContratTypeService from '../services/contrat-type-service';
import { GestionResponseDto } from '../models/gestion';
import DataTable from 'react-data-table-component';
import { costumeStyles, costumeStyles_2 } from '../../helpers/costume-styles';
import PpmDacService from '../services/ppm-dac-service';
import CodEntiteContractService from '../services/cod-entite-contract-service';
import CodNatContratService from '../services/cod-nat-contrat-service';
import CodSourceFinService from '../services/cod-source-fin-service';
import CodModPassService from '../services/cod-mod-service';
import { emptyEnteteStructureResponseDto, EnteteStructureResponseDto } from '../models/entete-structure';
import EnteteStructureService from '../services/entete-structure-service';
import DestinataireService from '../services/destinataire-service';
import CompteDestinataireService from '../services/compte-destinataire-service';
import Swal from 'sweetalert2';
import TypeMarcheService from '../services/type-marche-service';
import IdentiteExecutionService from '../services/identite-execution-service';
import { ContratsRequestDto, emptyContratsRequestDto } from '../models/contrats';
import PpmExecBudgViewService from '../services/ppm-exec-budg-view-service';
import { addSepartor, removeNonNumeric } from '../../helpers/format';
import ContratsService from '../services/contrats-service';
import AccesCodeDto, { emptyAccesCodeDto } from '../models/accesCodeDto';
import AccesCodeService from '../services/accesCodeService';
import bcrypt from 'bcryptjs-react';
import ServerDateService from '../../shared/system/services/server-date-service';

// FORUMULAIRE CONTRAT
type FormContrat = {
  idContrat: Field,//OK
  cod1: Field, //OK
	cod2: Field, //OK
	cod3: Field, //OK
	cod4: Field, //OK
	cod5: Field, //OK
	annee: Field, //OK
	objet: Field, //OK
	reference: Field, // REFERENCE MANUELLE OK
	delaiNbre: Field, //OK
	delaiText: Field, //OK
	dateSaisie: Field, //OK
	dateApprob: Field, //OK
	acteRef: Field,
	refNotif: Field,
	dateNotif: Field,
	dateDemmar: Field,
	mleAuto: Field, //OK
	refPassation: Field, // OK
	refArt: Field, // ?
	tauxappli: Field, // ?
	suspens: Field, // ?
	idLogin: Field, 
	idcompte: Field, // OK
	montantMaxHtva: Field,//OK
	montantMinHtva: Field,//OK
	montantMaxTtc: Field,//OK
	montantMinTtc: Field,//OK
	avecTva: Field,//OK
	avecMiniMax: Field,//OK
	delaiAn: Field,//OK
	delaiMois: Field,//OK
	delaiSemaine: Field,//OK
	delaiJours: Field,//OK
	dateCreate: Field,
	userUpdate: Field,
  dateUpdate: Field,
	idContratParent: Field,
	abrevEpe: Field,
	dateAttribution: Field, //OK
  codTypeMarche: Field, //OK
  codIdentiteExecution: Field,//OK
  idPpmExe: Field,//OK
  idLot: Field,//OK
  codBud: Field,//OK
  idSrceFin: Field,//OK
  montantEstime: Field,
	idBudget: Field,
	typeContrat: Field, //OK
	idFourn: Field,//OK
  ifumle: Field, // POUR AFFICHAGE OK
  nom: Field, // POUR AFFICHAGE OK
	idDac: Field, //OK
  referencesDePassationDAC: Field, // POUR AFFICHAGE OK
  referencesPpmExecBudg: Field, // POUR AFFICHAGE OK
  delaiDExecution: Field, // POUR AFFICHAGE DELAI
}

// CRITERES DE RECHERCHE CONTRAT
type FormRContrat = {
  anneee: Field,
  type: Field,
  nom: Field,
  montant: Field
}

// CRITERES DE RECHERCHE PPMDAC
type FormRPpmExecBudg = {
  num: Field,
  nom: Field,
  libelleLongMp: Field,
  montantEstime: Field,
}

// CRITERES DE RECHERCHE PPMDAC
type FormRPpmDac = {
  refPassation: Field,
}

// CRITERES DE RECHERCHE BENEFICIAIRE
type FormRBeneficiaire = {
  type: Field,
  nom: Field,
  ifumle: Field,
}

const ContratsNouvelleSaisieMajForm: FunctionComponent = () => {

  const [gestionCourante] = useState<string>(Gestion() ?? '');
  const [idBudget] = useState<string>(IdBudget() ?? '');
  const [utilisateurCourante] = useState<string>(ConnectedUser() ?? '');
  const [isGestionClose, setIsGestionClose] = useState<boolean>(false);
  const dateEnregistrementPourGestionClose: Date = new Date(gestionCourante + '-12-31');   
  const [disableValiderEngagment, setDisableValiderEngagment] = useState<boolean>(true);

  useEffect(() => {
    // On recupere la date du server : si la gestion en cours est strictement inférieur à l'année de la date du serveur alors elle est close :
    ServerDateService.getServerDate().then(data => {
      if (Number(gestionCourante) < new Date(data).getFullYear()) setIsGestionClose(true); else setIsGestionClose(false)   
    }) 
  }, [])   

  ///////////////// GESTION CONTRATS
  const [contrats, setContrats] = useState<any[]>([]);
  const [filteredContrats, setFilteredContrats] = useState<any[]>([]);
  const [loaderContrats, setLoaderContrats] = useState<boolean>(true);

  const tableContratColumns: GridColDef[] = [
    {
      field: 'annee',
      headerName: 'Année',
      type: 'string',
      width: 100,
      align: "center",
      headerClassName: 'header',
    },
    {
      field: 'type',
      headerName: 'Type',
      type: 'string',
      width: 100,
      align: "center",
      headerClassName: 'header',
    },
    {
      field: 'reference',
      headerName: 'N°',
      type: 'string',
      width: 200,
      headerClassName: 'header',
      headerAlign: 'center'
    },
    {
      field: 'objet',
      headerName: 'Objet',
      type: 'string',
      width: 200,
      headerClassName: 'header',
      headerAlign: 'center'
    },
    {
      field: 'nom',
      headerName: 'Titulaire',
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
      headerAlign: 'center',
    },
    {
      field: 'avecTva',
      headerName: 'Avec TVA',
      type: 'boolean',
      width: 100,
      headerClassName: 'header',
      headerAlign: 'center',
      valueFormatter: (params : GridValueFormatterParams<any>) => {
        return params.value === 1;
      },
    },
    {
      field: 'avecMiniMax',
      headerName: 'Avec MiniMax',
      type: 'boolean',
      width: 100,
      headerClassName: 'header',
      headerAlign: 'center',
      valueFormatter: (params : GridValueFormatterParams<any>) => {
        return params.value === 1;
      },
    },
    {
      field: 'dateSaisie',
      headerName: 'Date Saisie',
      type: 'Date',
      width: 100,
      align: "center",
      valueFormatter: (params : GridValueFormatterParams<any>) => {
        return (new Date(params.value)).toLocaleDateString();
      },
      headerClassName: 'header',
    },
    {
      field: 'dateApprob',
      headerName: 'Date Approbation',
      type: 'Date',
      width: 100,
      align: "center",
      valueFormatter: (params : GridValueFormatterParams<any>) => {
        return params.value && (new Date(params.value)).toLocaleDateString();
      },
      headerClassName: 'header',
    },
    {
      field: 'delaiNbre',
      headerName: 'Délai Nbre',
      type: 'string',
      width: 100,
      align: "center",
      headerClassName: 'header',
      headerAlign: 'center'
    },
    {
      field: 'delaiText',
      headerName: 'Délai Texte',
      type: 'string',
      width: 100,
      align: "center",
      headerClassName: 'header',
      headerAlign: 'center'
    },
    {
      field: 'montantMinHtva',
      headerName: 'Montant Min HTVA',
      type: 'number',
      width: 140,
      headerClassName: 'header',
      headerAlign: 'center',
    },
    {
      field: 'montantMaxHtva',
      headerName: 'Montant Max HTVA',
      type: 'number',
      width: 140,
      headerClassName: 'header',
      headerAlign: 'center',
    },
    {
      field: 'montantMinTtc',
      headerName: 'Montant Min TTC',
      type: 'number',
      width: 140,
      headerClassName: 'header',
      headerAlign: 'center',
    },
    {
      field: 'montantMaxTtc',
      headerName: 'Montant Max TTC',
      type: 'number',
      width: 140,
      headerClassName: 'header',
      headerAlign: 'center',
    },
    {
      field: 'refPassation',
      headerName: 'Références passation',
      type: 'string',
      width: 200,
      headerClassName: 'header',
      headerAlign: 'center'
    },
  ];

  useEffect(() => {
    getContrats();
  }, [])
  
  const getContrats = () => {
    ContratsViewService.getByIdBudget(Number(idBudget)).then(data => {
      const results = data.filter(item => {
        return item.annee === Number(gestionCourante)
      })
      setContrats(data) 
      setFilteredContrats(results); 
      setLoaderContrats(false)
    })
  }

  function Toolbar() {
    return (
      <GridToolbarContainer className='justify-content-start mb-1'>
        <ButtonGroup size="sm">
          <Button variant="outline-success" title="Ajouter un contrat" className='me-1' style={{minWidth:"140px", maxWidth:"150px", maxHeight:"30px"}} onClick={() => handleAjouterUnContratButtonClick()}>Ajouter <BsPlusLg /></Button>
          <Button variant="outline-warning" title="Modifier le contrat sélectionné" className='me-1' style={{minWidth:"140px", maxWidth:"150px", maxHeight:"30px"}} onClick={() => handleModifierUnContratButtonClick(contratSelectionne)} disabled={disabledModifierContrat}>Modifier <BsPencilSquare /></Button>
          <Button variant="outline-danger" title="Supprimer le contrat sélectionné" className='' style={{minWidth:"140px", maxWidth:"150px", maxHeight:"30px"}} onClick={() => handleSupprimerUnContratButtonClick(contratSelectionne)} disabled={disabledSupprimerContrat}>Supprimer <DeleteIcon /></Button>
        </ButtonGroup>
      </GridToolbarContainer>
    );
  }
  ///////////////// GESTION CONTRATS

  ///////////////// GESTION AJOUTER OU MODIFIER UN CONTRAT
  const [contratSelectionne, setContratSelectionne] = useState<any>(null);
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);
  const [showModalAjouterOuModifierUnContrat, setShowModalAjouterOuModifierUnContrat] = useState(false);
  const [operationAjouterOuModifierUnContrat, setOperationAjouterOuModifierUnContrat] = useState<string>('add');
  const [es, setEs] = useState<EnteteStructureResponseDto>(emptyEnteteStructureResponseDto);
  const [typeMarches, setTypeMarches] = useState<any[]>([]);
  const [identiteExecutuions, setIdentiteExecutions] = useState<any[]>([]);
  const [codEntiteContracts, setCodEntiteContracts] = useState<any[]>([]);
  const [codNatContrats, setCodNatContrats] = useState<any[]>([]);
  const [codModPass, setCodModPass] = useState<any[]>([]);
  const [codSourceFins, setCodSourceFins] = useState<any[]>([]);
  const [disableReferenceManuelle, setDisableReferenceManuelle] = useState<boolean>(true);
  const [disableMontantMinHtva, setDisableMontantMinHtva] = useState<boolean>(true);
  const [disableMontantMinTtc, setDisableMontantMinTtc] = useState<boolean>(true);
  const [disableMontantMaxTtc, setDisableMontantMaxTtc] = useState<boolean>(true);
  const [montantMaxHtvaLabel, setMontantMaxHtvaLabel] = useState<string>("HTVA :");
  const [montantMaxTtcLabel, setMontantMaxTtcLabel] = useState<string>("TTC :");
  const [borderColorDateAttribution, setBorderColorDateAttribution] = useState<string>("");
  const [borderColorReference, setBorderColorReference] = useState<string>("");
  const [borderColorTypeDeMarche, setBorderColorTypeDeMarche] = useState<string>("");
  const [borderColorIdentiteExecution, setBorderColorIdentiteExecution] = useState<string>("");
  const [borderColorNiveauContractant, setBorderColorNiveauContractant] = useState<string>("");
  const [borderColorNatureDuContrat, setBorderColorNatureDuContrat] = useState<string>("");
  const [borderColorModeDePassation, setBorderColorModeDePassation] = useState<string>("");
  const [borderColorSourceDeFinancement, setBorderColorSourceDeFinancement] = useState<string>("");
  const [borderColorTypeDeContrat, setBorderColorTypeDeContrat] = useState<string>("");
  const [borderColorDelaiNbre, setBorderColorDelaiNbre] = useState<string>("");
  const [borderColorDelaiText, setBorderColorDelaiText] = useState<string>("");
  const [borderColorDelaiDExecution, setBorderColorDelaiDExecution] = useState<string>("");
  const [borderColorTitulaire, setBorderColorTitulaire] = useState<string>("");
  const [borderColorCompteBancaire, setBorderColorCompteBancaire] = useState<string>("");
  const [borderColorObjet, setBorderColorObjet] = useState<string>("");
  const [borderColorMontantMaxHtva, setBorderColorMontantMaxHtva] = useState<string>("");
  const [borderColorMontantMinHtva, setBorderColorMontantMinHtva] = useState<string>("");
  const [borderColorMontantMaxTtc, setBorderColorMontantMaxTtc] = useState<string>("");
  const [borderColorMontantMinTtc, setBorderColorMontantMinTtc] = useState<string>("");
  const [disabledEnregistrer, setDisabledEnregistrer] = useState<boolean>(false);
  const [disabledModifierContrat, setDisabledModifierContrat] = useState<boolean>(false);
  const [disabledSupprimerContrat, setDisabledSupprimerContrat] = useState<boolean>(false);

  const [formContrat, setFormContrat] = useState<FormContrat>({
    idContrat: {value : ''},
    cod1: {value : es.section},
    cod2: { value: '' },
    cod3: { value: '' },
    cod4: { value: '' },
    cod5: { value: '' },
    annee: { value: gestionCourante },
    objet: { value: '' },
    reference: { value: '' },
    delaiNbre: { value: 0 },
    delaiText: { value: '' },
    dateSaisie: { value: (isGestionClose)? dateEnregistrementPourGestionClose.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10) },
    dateApprob: { value: '' },
    acteRef: { value: '' },
    refNotif: { value: '' },
    dateNotif: { value: '' },
    dateDemmar: { value: '' },
    mleAuto: { value: 1 },
    refPassation: { value: '' },
    refArt: { value: '' },
    tauxappli: { value: '' },
    suspens: { value: '' },
    idLogin: { value: '' },
    idcompte: { value: '' },
    montantMaxHtva: { value: 0 },
    montantMinHtva: { value: 0 },
    montantMaxTtc: { value: 0 },
    montantMinTtc: { value: 0 },
    avecTva: { value: true },
    avecMiniMax: { value: false },
    delaiAn: { value: 0 },
    delaiMois: { value: 0 },
    delaiJours: { value: 0 },
    delaiSemaine: { value: 0 },
    dateCreate: { value: '' },
    userUpdate: { value: '' },
    dateUpdate: { value: '' },
    idContratParent: { value: '' },
    abrevEpe: { value: '' },
    dateAttribution: { value: '' },
    codTypeMarche: { value: '' },
    codIdentiteExecution: { value: '' },
    idPpmExe: { value: '' },
    idLot: { value: '' },
    codBud: { value: '' },
    idSrceFin: { value: '' },
    montantEstime: { value: 0 },
    idBudget: { value: '' },
    typeContrat: { value: '' },
    idFourn: { value: '' },
    ifumle: { value: '' },
    nom: { value: '' },
    idDac: { value: '' },
    referencesDePassationDAC: { value: '' },
    referencesPpmExecBudg: { value: '' },
    delaiDExecution: { value: 0 },
  })

  const initFormContrat = () => {    
    setFormContrat({
      idContrat: {value : ''},
      cod1: {value : es.section},
      cod2: { value: '' },
      cod3: { value: '' },
      cod4: { value: '' },
      cod5: { value: '' },
      annee: { value: gestionCourante },
      objet: { value: '' },
      reference: { value: '' },
      delaiNbre: { value: 0 },
      delaiText: { value: '' },
      dateSaisie: { value: (isGestionClose)? dateEnregistrementPourGestionClose.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10) },
      dateApprob: { value: '' },
      acteRef: { value: '' },
      refNotif: { value: '' },
      dateNotif: { value: '' },
      dateDemmar: { value: '' },
      mleAuto: { value: 1 },
      refPassation: { value: '' },
      refArt: { value: '' },
      tauxappli: { value: '' },
      suspens: { value: '' },
      idLogin: { value: '' },
      idcompte: { value: '' },
      montantMaxHtva: { value: 0 },
      montantMinHtva: { value: 0 },
      montantMaxTtc: { value: 0 },
      montantMinTtc: { value: 0 },
      avecTva: { value: true },
      avecMiniMax: { value: false },
      delaiAn: { value: 0 },
      delaiMois: { value: 0 },
      delaiJours: { value: 0 },
      delaiSemaine: { value: 0 },
      dateCreate: { value: '' },
      userUpdate: { value: '' },
      dateUpdate: { value: '' },
      idContratParent: { value: '' },
      abrevEpe: { value: '' },
      dateAttribution: { value: '' },
      codTypeMarche: { value: '' },
      codIdentiteExecution: { value: '' },
      idPpmExe: { value: '' },
      idLot: { value: '' },
      codBud: { value: '' },
      idSrceFin: { value: '' },
      montantEstime: { value: 0 },
      idBudget: { value: '' },
      typeContrat: { value: '' },
      idFourn: { value: '' },
      ifumle: { value: '' },
      nom: { value: '' },
      idDac: { value: '' },
      referencesDePassationDAC: { value: '' },
      referencesPpmExecBudg: { value: '' },
      delaiDExecution: { value: 0 },
    })

    setDisableReferenceManuelle(true);
    setDisabledEnregistrer(false);
    resetBorderColor();

    setDisableMontantMaxTtc(false);
    setDisableMontantMinHtva(true);
    setDisableMontantMinTtc(true);

    setMontantMaxHtvaLabel("HTVA :");
    setMontantMaxTtcLabel("TTC :");

    setCompteDestinataires([]);
  }
  
  const handleInputChangeFormContrat = (e: any): void => {
    const fieldName: string = e.target.name;
    let fieldValue: string = e.target.value;

    if (fieldName === "mleAuto") if (Number(fieldValue) === 1) setDisableReferenceManuelle(true); else setDisableReferenceManuelle(false);

    if (fieldName === "delaiNbre") if (Number(fieldValue) < 0) fieldValue = '0';

    if (fieldName === "delaiAn") {
      if (Number(fieldValue) < 0) fieldValue = '0'
      formContrat.delaiDExecution.value = Number(fieldValue)*365 + Number(formContrat.delaiMois.value)*30 + Number(formContrat.delaiSemaine.value)*7 + Number(formContrat.delaiJours.value)
    }

    if (fieldName === "delaiMois") {
      if (Number(fieldValue) < 0) fieldValue = '0'
      formContrat.delaiDExecution.value = Number(formContrat.delaiAn.value)*365 + Number(fieldValue)*30 + Number(formContrat.delaiSemaine.value)*7 + Number(formContrat.delaiJours.value)
    }

    if (fieldName === "delaiSemaine") {
      if (Number(fieldValue) < 0) fieldValue = '0'
      formContrat.delaiDExecution.value = Number(formContrat.delaiAn.value)*365  + Number(formContrat.delaiMois.value)*30 + Number(fieldValue)*7 + Number(formContrat.delaiJours.value)
    }

    if (fieldName === "delaiJours") {
      if (Number(fieldValue) < 0) fieldValue = '0'
      formContrat.delaiDExecution.value = Number(formContrat.delaiAn.value)*365 + Number(formContrat.delaiMois.value)*30 + Number(formContrat.delaiSemaine.value)*7 + Number(fieldValue)
    }

    if (fieldName === "montantMaxHtva") {
      const montantMaxHtva: number = Number(removeNonNumeric(fieldValue));
      fieldValue = addSepartor(removeNonNumeric(montantMaxHtva));
      formContrat.montantMaxTtc.value = addSepartor((montantMaxHtva + montantMaxHtva*0.18).toFixed(0));
    }

    if (fieldName === "montantMinHtva") {
      const montantMinHtva: number = Number(removeNonNumeric(fieldValue));
      fieldValue = addSepartor(removeNonNumeric(montantMinHtva));
      formContrat.montantMinTtc.value = addSepartor((montantMinHtva + montantMinHtva*0.18).toFixed(0));
    }

    if (fieldName === "montantMaxTtc") {
      const montantMaxTtc: number = Number(removeNonNumeric(fieldValue));
      fieldValue = addSepartor(removeNonNumeric(montantMaxTtc));
      formContrat.montantMaxHtva.value = addSepartor((montantMaxTtc / (1 + 0.18)).toFixed(0));
    }

    if (fieldName === "montantMinTtc") {
      const montantMinTtc: number = Number(removeNonNumeric(fieldValue));
      fieldValue = addSepartor(removeNonNumeric(montantMinTtc));
      formContrat.montantMinHtva.value = addSepartor((montantMinTtc / (1 + 0.18)).toFixed(0));
    }
    
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormContrat({ ...formContrat, ...newField}); 
  }

  const handleCheckboxInputChangeFormContrat = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: boolean = e.target.checked;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormContrat({ ...formContrat, ...newField});

    if (fieldName ==="avecTva") {
      if (fieldValue === true && formContrat.avecMiniMax.value === false) {
        setDisableMontantMaxTtc(false);
        setDisableMontantMinHtva(true);formContrat.montantMinHtva.value = 0;
        setDisableMontantMinTtc(true);

        setMontantMaxHtvaLabel("HTVA :");
        setMontantMaxTtcLabel("TTC :");
      }

      if (fieldValue === false && formContrat.avecMiniMax.value === true) {
        setDisableMontantMaxTtc(true);formContrat.montantMaxTtc.value = 0;
        setDisableMontantMinHtva(false);
        setDisableMontantMinTtc(true);formContrat.montantMinTtc.value = 0;

        setMontantMaxHtvaLabel("Maximum HTVA :");
      }
      
      if (fieldValue === false && formContrat.avecMiniMax.value === false) {
        setDisableMontantMaxTtc(true);formContrat.montantMaxTtc.value = 0;
        setDisableMontantMinHtva(true);formContrat.montantMinHtva.value = 0;
        setDisableMontantMinTtc(true);formContrat.montantMinTtc.value = 0;

        setMontantMaxHtvaLabel("HTVA :");
      }

      if (fieldValue === true && formContrat.avecMiniMax.value === true) {
        setDisableMontantMaxTtc(false);
        setDisableMontantMinHtva(false);
        setDisableMontantMinTtc(false);

        setMontantMaxHtvaLabel("Maximum HTVA :");
        setMontantMaxTtcLabel("Maximum TTC :");
      }
    }

    if (fieldName ==="avecMiniMax") {
      if (fieldValue === true && formContrat.avecTva.value === false) {
        setDisableMontantMaxTtc(true);formContrat.montantMaxTtc.value = 0;
        setDisableMontantMinHtva(false);
        setDisableMontantMinTtc(true);formContrat.montantMinTtc.value = 0;

        setMontantMaxHtvaLabel("Maximum HTVA :");
      }

      if (fieldValue === false && formContrat.avecTva.value === true) {
        setDisableMontantMaxTtc(false);
        setDisableMontantMinHtva(true);formContrat.montantMinHtva.value = 0;
        setDisableMontantMinTtc(true);formContrat.montantMinTtc.value = 0;

        setMontantMaxHtvaLabel("HTVA :");
        setMontantMaxTtcLabel("TTC :");
      }

      if (fieldValue === false && formContrat.avecTva.value === false) {
        setDisableMontantMaxTtc(true);formContrat.montantMaxTtc.value = 0;
        setDisableMontantMinHtva(true);formContrat.montantMinHtva.value = 0;
        setDisableMontantMinTtc(true);formContrat.montantMinTtc.value = 0;

        setMontantMaxHtvaLabel("HTVA :");
      }

      if (fieldValue === true && formContrat.avecTva.value === true) {
        setDisableMontantMaxTtc(false);
        setDisableMontantMinHtva(false);
        setDisableMontantMinTtc(false);

        setMontantMaxHtvaLabel("Maximum HTVA :");
        setMontantMaxTtcLabel("Maximum TTC :");
      }
    } 
  }

  const validateFormContrat = () => {
    let newForm: FormContrat = formContrat;

    // dateAttribution
    if(formContrat.dateAttribution.value === "") {
      const errorMsg: string = 'Date attribution obligatoire !';
      const newField: Field = { value: formContrat.dateAttribution.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ dateAttribution: newField } };
      setBorderColorDateAttribution("red")
    } else {
      const newField: Field = { value: formContrat.dateAttribution.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ dateAttribution: newField } };
      setBorderColorDateAttribution("")
    }

    // Reference
    if(Number(formContrat.mleAuto.value) === 0 && formContrat.reference.value === "") {
      const errorMsg: string = 'Reference obligatoire !';
      const newField: Field = { value: formContrat.reference.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ reference: newField } };
      setBorderColorReference("red")
    } else {
      const newField: Field = { value: formContrat.reference.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ reference: newField } };
      setBorderColorReference("")
    }

    // Type de marché
    if(Number(formContrat.mleAuto.value) === 1 && formContrat.codTypeMarche.value === "") {
      const errorMsg: string = 'Type de marché obligatoire !';
      const newField: Field = { value: formContrat.codTypeMarche.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ codTypeMarche: newField } };
      setBorderColorTypeDeMarche("red")
    } else {
      const newField: Field = { value: formContrat.codTypeMarche.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ codTypeMarche: newField } };
      setBorderColorTypeDeMarche("")
    }

    // Identité Exécution
    if(Number(formContrat.mleAuto.value) === 1 && formContrat.codIdentiteExecution.value === "") {
      const errorMsg: string = 'Identité exécution obligatoire !';
      const newField: Field = { value: formContrat.codIdentiteExecution.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ codIdentiteExecution: newField } };
      setBorderColorIdentiteExecution("red")
    } else {
      const newField: Field = { value: formContrat.codIdentiteExecution.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ codIdentiteExecution: newField } };
      setBorderColorIdentiteExecution("")
    }

    // Niveau contractant
    if(Number(formContrat.mleAuto.value) === 1  && formContrat.cod2.value === "") {
      const errorMsg: string = 'Niveau contractant obligatoire !';
      const newField: Field = { value: formContrat.cod2.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ cod2: newField } };
      setBorderColorNiveauContractant("red")
    } else {
      const newField: Field = { value: formContrat.cod2.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ cod2: newField } };
      setBorderColorNiveauContractant("")
    }

    // Nature du contrat
    if(Number(formContrat.mleAuto.value) === 1  && formContrat.cod3.value === "") {
      const errorMsg: string = 'Nature du contrat obligatoire !';
      const newField: Field = { value: formContrat.cod3.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ cod3: newField } };
      setBorderColorNatureDuContrat("red")
    } else {
      const newField: Field = { value: formContrat.cod3.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ cod3: newField } };
      setBorderColorNatureDuContrat("")
    }

    // Mode de passation
    if(Number(formContrat.mleAuto.value) === 1  && formContrat.cod4.value === "") {
      const errorMsg: string = 'Mode de passation obligatoire !';
      const newField: Field = { value: formContrat.cod4.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ cod4: newField } };
      setBorderColorModeDePassation("red")
    } else {
      const newField: Field = { value: formContrat.cod4.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ cod4: newField } };
      setBorderColorModeDePassation("")
    }

    // Source de financement
    if(Number(formContrat.mleAuto.value) === 1  && formContrat.cod5.value === "") {
      const errorMsg: string = 'Source de financement obligatoire !';
      const newField: Field = { value: formContrat.cod5.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ cod5: newField } };
      setBorderColorSourceDeFinancement("red")
    } else {
      const newField: Field = { value: formContrat.cod5.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ cod5: newField } };
      setBorderColorSourceDeFinancement("")
    }

    // Type de contrat
    if(formContrat.typeContrat.value === "") {
      const errorMsg: string = 'Type decontrat obligatoire !';
      const newField: Field = { value: formContrat.typeContrat.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ typeContrat: newField } };
      setBorderColorTypeDeContrat("red")
    } else {
      const newField: Field = { value: formContrat.typeContrat.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ typeContrat: newField } };
      setBorderColorTypeDeContrat("")
    }

    // delaiNbre
    if(formContrat.delaiNbre.value === "" || Number(formContrat.delaiNbre.value) === 0) {
      const errorMsg: string = 'delaiNbre obligatoire !';
      const newField: Field = { value: formContrat.delaiNbre.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ delaiNbre: newField } };
      setBorderColorDelaiNbre("red")
    } else {
      const newField: Field = { value: formContrat.delaiNbre.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ delaiNbre: newField } };
      setBorderColorDelaiNbre("")
    }

    // delaiText
    if(formContrat.delaiText.value === "") {
      const errorMsg: string = 'delaiText obligatoire !';
      const newField: Field = { value: formContrat.delaiText.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ delaiText: newField } };
      setBorderColorDelaiText("red")
    } else {
      const newField: Field = { value: formContrat.delaiText.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ delaiText: newField } };
      setBorderColorDelaiText("")
    }

    // delai d'éxécution 
    if(formContrat.delaiDExecution.value < 1) {
      const errorMsg: string = "delai d'éxécution obligatoire !";
      const newField: Field = { value: formContrat.delaiDExecution.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ delaiDExecution: newField } };
      setBorderColorDelaiDExecution("red")
    } else {
      const newField: Field = { value: formContrat.delaiDExecution.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ delaiDExecution: newField } };
      setBorderColorDelaiDExecution("")
    }

    // Titulaire
    if(formContrat.idFourn.value === "") {
      const errorMsg: string = "Titulaire obligatoire !";
      const newField: Field = { value: formContrat.idFourn.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ idFourn: newField } };
      setBorderColorTitulaire("red")
    } else {
      const newField: Field = { value: formContrat.idFourn.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ idFourn: newField } };
      setBorderColorTitulaire("")
    }

    // Compte Bancaire
    if(formContrat.idcompte.value === "") {
      const errorMsg: string = "Compte obligatoire !";
      const newField: Field = { value: formContrat.idcompte.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ idcompte: newField } };
      setBorderColorCompteBancaire("red")
    } else {
      const newField: Field = { value: formContrat.idcompte.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ idcompte: newField } };
      setBorderColorCompteBancaire("")
    }    

    // Objet
    if(formContrat.objet.value === "") {
      const errorMsg: string = "objet obligatoire !";
      const newField: Field = { value: formContrat.objet.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ objet: newField } };
      setBorderColorObjet("red")
    } else {
      const newField: Field = { value: formContrat.objet.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ objet: newField } };
      setBorderColorObjet("")
    }

    // montantMaxHtva
    if(Number(removeNonNumeric(formContrat.montantMaxHtva.value)) === 0) {
      const errorMsg: string = "montantMaxHtva obligatoire !";
      const newField: Field = { value: formContrat.montantMaxHtva.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ montantMaxHtva: newField } };
      setBorderColorMontantMaxHtva("red")
    } else {
      const newField: Field = { value: formContrat.montantMaxHtva.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ montantMaxHtva: newField } };
      setBorderColorMontantMaxHtva("")
    }

    // montantMinHtva
    if(disableMontantMinHtva === false && Number(removeNonNumeric(formContrat.montantMinHtva.value)) === 0) {
      const errorMsg: string = "montantMinHtva obligatoire !";
      const newField: Field = { value: formContrat.montantMinHtva.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ montantMinHtva: newField } };
      setBorderColorMontantMinHtva("red")
    } else {
      const newField: Field = { value: formContrat.montantMinHtva.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ montantMinHtva: newField } };
      setBorderColorMontantMinHtva("")
    }

    // montantMaxTtc
    if((disableMontantMaxTtc === false && Number(removeNonNumeric(formContrat.montantMaxTtc.value)) === 0) || (disableMontantMaxTtc === false && formContrat.montantEstime.value !== 0 && Number(removeNonNumeric(formContrat.montantMaxTtc.value)) > Number(formContrat.montantEstime.value))) {
      const errorMsg: string = "montantMaxTtc obligatoire !";
      const newField: Field = { value: formContrat.montantMaxTtc.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ montantMaxTtc: newField } };
      setBorderColorMontantMaxTtc("red")
    } else {
      const newField: Field = { value: formContrat.montantMaxTtc.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ montantMaxTtc: newField } };
      setBorderColorMontantMaxTtc("")
    }

    // montantMinTtc
    if(disableMontantMinTtc === false && Number(removeNonNumeric(formContrat.montantMinTtc.value)) === 0) {
      const errorMsg: string = "montantMinTtc obligatoire !";
      const newField: Field = { value: formContrat.montantMinTtc.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ montantMinTtc: newField } };
      setBorderColorMontantMinTtc("red")
    } else {
      const newField: Field = { value: formContrat.montantMinTtc.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ montantMinTtc: newField } };
      setBorderColorMontantMinTtc("")
    }

    setFormContrat(newForm);
    return newForm.dateAttribution.isValid && newForm.reference.isValid && newForm.codTypeMarche.isValid && newForm.codIdentiteExecution.isValid && newForm.cod2.isValid && newForm.cod3.isValid && newForm.cod4.isValid && newForm.cod5.isValid && newForm.typeContrat.isValid 
    && newForm.delaiNbre.isValid && newForm.delaiText.isValid && newForm.delaiDExecution.isValid && newForm.idFourn.isValid && newForm.idcompte.isValid && newForm.objet.isValid && newForm.montantMaxHtva.isValid && newForm.montantMinHtva.isValid
    && newForm.montantMaxHtva.isValid && newForm.montantMinTtc.isValid;
  } 
  
  const handleSubmitFormContrat = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormContrat()) {
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
          if (operationAjouterOuModifierUnContrat === 'add') addContrat();
          if (operationAjouterOuModifierUnContrat === 'edit') editContrat();
        }
      });
    } else {
      if (operationAjouterOuModifierUnContrat === 'add') addContrat();
      if (operationAjouterOuModifierUnContrat === 'edit') editContrat();
    }     
  } 
  
  const addContrat = () => {
    // CREATION D'UN CONTRAT
    let newContrat: ContratsRequestDto = emptyContratsRequestDto;
    newContrat.cod1 = formContrat.cod1.value;
    newContrat.cod2 = formContrat.cod2.value;
    newContrat.cod3 = formContrat.cod3.value;
    newContrat.cod4 = formContrat.cod4.value;
    newContrat.cod5 = formContrat.cod5.value;
    newContrat.annee = formContrat.annee.value;
    newContrat.objet = formContrat.objet.value;
    newContrat.reference = (Number(formContrat.mleAuto.value) === 1)? "": formContrat.reference.value;
    newContrat.delaiNbre = formContrat.delaiNbre.value;
    newContrat.delaiText = formContrat.delaiText.value;
    newContrat.dateSaisie = formContrat.dateSaisie.value;
    newContrat.dateApprob = formContrat.dateApprob.value;
    newContrat.acteRef = formContrat.acteRef.value;//?
    newContrat.refNotif = formContrat.refNotif.value;//?
    newContrat.dateNotif = formContrat.dateNotif.value;//?
    newContrat.dateDemmar = formContrat.dateDemmar.value;//?
    newContrat.mleAuto = (Number(formContrat.mleAuto.value) === 1)? true : false;
    newContrat.refPassation = formContrat.refPassation.value;//?
    newContrat.refArt = formContrat.refArt.value;//?
    newContrat.tauxappli = formContrat.tauxappli.value;//?
    newContrat.suspens = formContrat.suspens.value;//?
    newContrat.idLogin = utilisateurCourante;
    newContrat.idcompte = (formContrat.idcompte.value ==="")? null : formContrat.idcompte.value;
    newContrat.montantMaxHtva = removeNonNumeric(formContrat.montantMaxHtva.value);
    newContrat.montantMinHtva = removeNonNumeric(formContrat.montantMinHtva.value);
    newContrat.montantMaxTtc = removeNonNumeric(formContrat.montantMaxTtc.value);
    newContrat.montantMinTtc = removeNonNumeric(formContrat.montantMinTtc.value);
    newContrat.avecTva = formContrat.avecTva.value;
    newContrat.avecMiniMax = formContrat.avecMiniMax.value;
    newContrat.delaiAn = formContrat.delaiAn.value;
    newContrat.delaiMois = formContrat.delaiMois.value;
    newContrat.delaiSemaine = formContrat.delaiSemaine.value;
    newContrat.delaiJours = formContrat.delaiJours.value;
    newContrat.dateCreate = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
    newContrat.userUpdate = utilisateurCourante;
    newContrat.dateUpdate = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
    newContrat.idContratParent = formContrat.idContratParent.value;
    newContrat.abrevEpe = es.abrevEpe;
    newContrat.dateAttribution = formContrat.dateAttribution.value;
    newContrat.codTypeMarche = formContrat.codTypeMarche.value;
    newContrat.codIdentiteExecution = formContrat.codIdentiteExecution.value;
    newContrat.idPpmExe = formContrat.idPpmExe.value;
    newContrat.idLot = formContrat.idLot.value;
    newContrat.codBud = formContrat.codBud.value;
    newContrat.idSrceFin = formContrat.idSrceFin.value;
    newContrat.idBudget = idBudget;
    newContrat.type = formContrat.typeContrat.value;
    newContrat.idFourn = formContrat.idFourn.value;
    newContrat.idDac = null;

    ContratsService.add(newContrat).then(contrat => {
      setFormContrat({ ...formContrat, reference: {...formContrat.reference, value:contrat.reference}});
      getContrats();
      setDisabledEnregistrer(true);
      okSuccessDialog("Contrat ajouté avec succès !");
    });    
  }

  const editContrat = () => {
    // MODIFICTION D'UN CONTRAT
    let newContrat: ContratsRequestDto = emptyContratsRequestDto;
    newContrat.cod1 = formContrat.cod1.value;
    newContrat.cod2 = formContrat.cod2.value;
    newContrat.cod3 = formContrat.cod3.value;
    newContrat.cod4 = formContrat.cod4.value;
    newContrat.cod5 = formContrat.cod5.value;
    newContrat.annee = formContrat.annee.value;
    newContrat.objet = formContrat.objet.value;
    newContrat.reference = (Number(formContrat.mleAuto.value) === 1)? "": formContrat.reference.value;
    newContrat.delaiNbre = formContrat.delaiNbre.value;
    newContrat.delaiText = formContrat.delaiText.value;
    newContrat.dateSaisie = formContrat.dateSaisie.value;
    newContrat.dateApprob = formContrat.dateApprob.value;
    newContrat.acteRef = formContrat.acteRef.value;//?
    newContrat.refNotif = formContrat.refNotif.value;//?
    newContrat.dateNotif = formContrat.dateNotif.value;//?
    newContrat.dateDemmar = formContrat.dateDemmar.value;//?
    newContrat.mleAuto = (Number(formContrat.mleAuto.value) === 1)? true : false;
    newContrat.refPassation = formContrat.refPassation.value;//?
    newContrat.refArt = formContrat.refArt.value;//?
    newContrat.tauxappli = formContrat.tauxappli.value;//?
    newContrat.suspens = formContrat.suspens.value;//?
    newContrat.idLogin = utilisateurCourante;
    newContrat.idcompte = (formContrat.idcompte.value ==="")? null : formContrat.idcompte.value;
    newContrat.montantMaxHtva = removeNonNumeric(formContrat.montantMaxHtva.value);
    newContrat.montantMinHtva = removeNonNumeric(formContrat.montantMinHtva.value);
    newContrat.montantMaxTtc = removeNonNumeric(formContrat.montantMaxTtc.value);
    newContrat.montantMinTtc = removeNonNumeric(formContrat.montantMinTtc.value);
    newContrat.avecTva = formContrat.avecTva.value;
    newContrat.avecMiniMax = formContrat.avecMiniMax.value;
    newContrat.delaiAn = formContrat.delaiAn.value;
    newContrat.delaiMois = formContrat.delaiMois.value;
    newContrat.delaiSemaine = formContrat.delaiSemaine.value;
    newContrat.delaiJours = formContrat.delaiJours.value;
    newContrat.dateCreate = (isGestionClose)? dateEnregistrementPourGestionClose : new Date(); // ???
    newContrat.userUpdate = utilisateurCourante;
    newContrat.dateUpdate = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
    newContrat.idContratParent = formContrat.idContratParent.value;
    newContrat.abrevEpe = es.abrevEpe;
    newContrat.dateAttribution = formContrat.dateAttribution.value;
    newContrat.codTypeMarche = formContrat.codTypeMarche.value;
    newContrat.codIdentiteExecution = formContrat.codIdentiteExecution.value;
    newContrat.idPpmExe = formContrat.idPpmExe.value;
    newContrat.idLot = formContrat.idLot.value;
    newContrat.codBud = formContrat.codBud.value;
    newContrat.idSrceFin = formContrat.idSrceFin.value;
    newContrat.idBudget = idBudget;
    newContrat.type = formContrat.typeContrat.value;
    newContrat.idFourn = formContrat.idFourn.value;
    newContrat.idDac = null;
    
    ContratsService.edit(formContrat.idContrat.value, newContrat).then(contrat => {
      setContratSelectionne(contrat);
      setFormContrat({ ...formContrat, reference: {...formContrat.reference, value:contrat.reference}});
      getContrats();
      okSuccessDialog("Contrat modifié avec succès !");
    });    
  } 

  useEffect(() => {
    getEss();
  }, [])
  
  const getEss = () => {
    EnteteStructureService.getAll().then(data => {
      setEs(data[0])
    })
  } 
  
  const getTypeMarches = () => {
    TypeMarcheService.getAll().then(data => {
      setTypeMarches(data);
    })
  } 

  const getIdentiteExecutions = () => {
    IdentiteExecutionService.getAll().then(data => {
      setIdentiteExecutions(data);
    })
  } 

  const getCodEntiteContracts = () => {
    CodEntiteContractService.getAll().then(data => {
      setCodEntiteContracts(data);
    })
  } 
  
  const getCodNatContrats = () => {
    CodNatContratService.getAll().then(data => {
      setCodNatContrats(data);
    })
  } 

  const getCodModPass = () => {
    CodModPassService.getAll().then(data => {
      setCodModPass(data);
    })
  }

  const getCodSourceFins = () => {
    CodSourceFinService.getAll().then(data => {
      setCodSourceFins(data);
    })
  }  

  const handleCloseModalAjouterOuModifierUnContrat = () => {
    setShowModalAjouterOuModifierUnContrat(false);
  }

  const handleShowModalAjouterOuModifierUnContrat = () => {
    getTypeMarches();
    getIdentiteExecutions();
    getCodEntiteContracts();
    getCodNatContrats();
    getCodModPass();
    getCodSourceFins();
    getContratTypes();
    setShowModalAjouterOuModifierUnContrat(true);
  }

  const handleAjouterUnContratButtonClick = () => {
    initFormContrat()
    setOperationAjouterOuModifierUnContrat('add');
    handleShowModalAjouterOuModifierUnContrat();
  }
  
  const handleModifierUnContratButtonClick = (row: any) => {
    if (selectedRowId) {
      setOperationAjouterOuModifierUnContrat('edit');

      setDisabledEnregistrer(false);
      if (row.mleAuto === true) setDisableReferenceManuelle(true); else setDisableReferenceManuelle(false);
      resetBorderColor();

      setFormContrat({
        idContrat: {value : row.idContrat},
        cod1: {value : row.cod1},
        cod2: { value: row.cod2 },
        cod3: { value: row.cod3 },
        cod4: { value: row.cod4 },
        cod5: { value: row.cod5 },
        annee: { value: row.annee },
        objet: { value: row.objet },
        reference: { value: row.reference },
        delaiNbre: { value: row.delaiNbre },
        delaiText: { value: row.delaiText },
        dateSaisie: { value: new Date(row.dateSaisie).toISOString().slice(0, 10) },
        dateApprob: { value: row.dateApprob && new Date(row.dateApprob).toISOString().slice(0, 10) },
        acteRef: { value: '' },
        refNotif: { value: '' },
        dateNotif: { value: '' },
        dateDemmar: { value: '' },
        mleAuto: { value: row.mleAuto },
        refPassation: { value: '' },
        refArt: { value: '' },
        tauxappli: { value: '' },
        suspens: { value: '' },
        idLogin: { value: row.idLogin },
        idcompte: { value: row.idcompte },
        montantMaxHtva: { value: Number(row.montantMaxHtva).toLocaleString() },
        montantMinHtva: { value: Number(row.montantMinHtva).toLocaleString() },
        montantMaxTtc: { value: Number(row.montantMaxTtc).toLocaleString() },
        montantMinTtc: { value: Number(row.montantMinTtc).toLocaleString() },
        avecTva: { value: row.avecTva },
        avecMiniMax: { value: row.avecMiniMax },
        delaiAn: { value: row.delaiAn },
        delaiMois: { value: row.delaiMois },
        delaiJours: { value: row.delaiJours },
        delaiSemaine: { value: row.delaiSemaine },
        dateCreate: { value: row.dateCreate },
        userUpdate: { value: row.userUpdate },
        dateUpdate: { value: row.dateUpdate },
        idContratParent: { value: row.idContratParent },
        abrevEpe: { value: row.abrevEpe },
        dateAttribution: { value: row.dateAttribution },
        codTypeMarche: { value: row.codTypeMarche },
        codIdentiteExecution: { value: row.codIdentiteExecution },
        idPpmExe: { value: row.idPpmExe },
        idLot: { value: row.idLot },
        codBud: { value: row.codBud },
        idSrceFin: { value: row.idSrceFin },
        montantEstime: { value: row.montantEstime },
        idBudget: { value: row.idBudget },
        typeContrat: { value: row.type },
        idFourn: { value: row.idFourn },
        ifumle: { value: row.ifumle },
        nom: { value: row.nom },
        idDac: { value: '' },
        referencesDePassationDAC: { value: '' },
        referencesPpmExecBudg: { value: row.idPpm },
        delaiDExecution: { value: row.delaiAn*365 + row.delaiMois*30 + row.delaiSemaine*7 + row.delaiJours},
      })      

      // COMPTE DESTINATAIRES
      getCompteDestinataires(row.idcompte);

      // AVEC TVA
      if (row.avecTva === true && row.avecMiniMax === false) {
        setDisableMontantMaxTtc(false);
        setDisableMontantMinHtva(true);formContrat.montantMinHtva.value = 0;
        setDisableMontantMinTtc(true);formContrat.montantMinTtc.value = 0;

        setMontantMaxHtvaLabel("HTVA :");
        setMontantMaxTtcLabel("TTC :");
      }

      if (row.avecTva === false && row.avecMiniMax  === true) {
        setDisableMontantMaxTtc(true);formContrat.montantMaxTtc.value = 0;
        setDisableMontantMinHtva(false);
        setDisableMontantMinTtc(true);formContrat.montantMinTtc.value = 0;

        setMontantMaxHtvaLabel("Maximum HTVA :");
      }
      
      if (row.avecTva=== false && row.avecMiniMax  === false) {
        setDisableMontantMaxTtc(true);formContrat.montantMaxTtc.value = 0;
        setDisableMontantMinHtva(true);formContrat.montantMinHtva.value = 0;
        setDisableMontantMinTtc(true);formContrat.montantMinTtc.value = 0;

        setMontantMaxHtvaLabel("HTVA :");
      }

      if (row.avecTva === true && row.avecMiniMax  === true) {
        setDisableMontantMaxTtc(false);
        setDisableMontantMinHtva(false);
        setDisableMontantMinTtc(false);

        setMontantMaxHtvaLabel("Maximum HTVA :");
        setMontantMaxTtcLabel("Maximum TTC :");
      }      

      // AVEC MINIMAX
      if (row.avecMiniMax  === true && row.avecTva === false) {
        setDisableMontantMaxTtc(true);formContrat.montantMaxTtc.value = 0;
        setDisableMontantMinHtva(false);
        setDisableMontantMinTtc(true);formContrat.montantMinTtc.value = 0;

        setMontantMaxHtvaLabel("Maximum HTVA :");
      }

      if (row.avecMiniMax  === false && row.avecTva === true) {
        setDisableMontantMaxTtc(false);
        setDisableMontantMinHtva(true);formContrat.montantMinHtva.value = 0;
        setDisableMontantMinTtc(true);formContrat.montantMinTtc.value = 0;

        setMontantMaxHtvaLabel("HTVA :");
        setMontantMaxTtcLabel("TTC :");
      }

      if (row.avecMiniMax  === false && row.avecTva === false) {
        setDisableMontantMaxTtc(true);formContrat.montantMaxTtc.value = 0;
        setDisableMontantMinHtva(true);formContrat.montantMinHtva.value = 0;
        setDisableMontantMinTtc(true);formContrat.montantMinTtc.value = 0;

        setMontantMaxHtvaLabel("HTVA :");
      }

      if (row.avecMiniMax === true && row.avecTva === true) {
        setDisableMontantMaxTtc(false);
        setDisableMontantMinHtva(false);
        setDisableMontantMinTtc(false);

        setMontantMaxHtvaLabel("Maximum HTVA :");
        setMontantMaxTtcLabel("Maximum TTC :");
      } 

      handleShowModalAjouterOuModifierUnContrat();
    } else {
      okWarnignDialog("Veuillez sélectionner le contrat à modifier !")
    }
  }

  const resetBorderColor = () => {
    setBorderColorDateAttribution("");
    setBorderColorNiveauContractant("");
    setBorderColorTypeDeMarche("");
    setBorderColorIdentiteExecution("");
    setBorderColorNatureDuContrat("");
    setBorderColorModeDePassation("");
    setBorderColorSourceDeFinancement("");
    setBorderColorTypeDeContrat("");
    setBorderColorDelaiNbre("");
    setBorderColorDelaiText("");
    setBorderColorDelaiDExecution("");
    setBorderColorTitulaire("");
    setBorderColorObjet("");
    setBorderColorMontantMaxHtva("");
    setBorderColorMontantMaxTtc("");
    setBorderColorMontantMinHtva("");
    setBorderColorMontantMinTtc("");
  }
  ///////////////// GESTION AJOUTER OU MODIFIER UN CONTRAT

  ///////////////// GESTION SUPPRIMER CONTRAT
  const handleSupprimerUnContratButtonClick = (row: any) => {
    if (selectedRowId) {
      handleShowModalMotDePasseDeConnexion();
    } else {
      okWarnignDialog("Veuillez sélectionner le contrat à supprimer !")
    }
  }

  const supprimerContrat = () => {
    Swal.fire({
      title: 'GesBud',
      text: "Etes-vous certain de vouloir supprimer cet contrat ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      allowOutsideClick: false,
      confirmButtonColor: '#007E33' 
    }).then( (result) => {
      if (result.isConfirmed) {
        ContratsService.delete(contratSelectionne.idContrat).then(res => {
          setSelectedRowId(null);
          setContratSelectionne(null);
          getContrats();
          okSuccessDialog("Contrat supprimé avec succès !");
        });        
      }
    });
  }  
  ///////////////// GESTION SUPPRIMER CONTRAT

  ///////////////// GESTION SELECTIONNER PPM EXEC BUDG
  const [ppmExecBudgs, setPpmExecBudgs] = useState<any[]>([]);
  const [filteredPpmExecBudgs, setFilteredPpmExecBudgs] = useState<any[]>([]);
  const [showModalSelectionnerPpmExecBudg, setShowModalSelectionnerPpmExecBudg] = useState(false);

  const tablePpmExecBudgColumns = [
    {
      name: "PPM",
      selector: (row: any) => row.idPpm,
      width: "100px",
      center: true,
      sortable: true,
    },
    {
      name: "Compte",
      selector: (row: any) => row.idPlan,
      width: "100px",
      center: true,
      sortable: true,
    },
    {
      name: "Fournisseur",
      selector: (row: any) => row.nom,
      width: "200px",
      sortable: true,
      wrap: true
    },
    {
      name: "Mode de passation",
      selector: (row: any) => row.libelleLongMp,
      width: "200px",
      wrap: true,
      sortable: true,
    },
    {
      name: "Objet",
      selector: (row: any) => row.objetLot,
      wrap: true,
      sortable: true,
    },
    {
      name: "Montant estimé",
      selector: (row: any) => Number(row.montantEstime).toLocaleString(),
      width: "120px",
      right: true,
      sortable: true,
    },
  ]

  const [formRPpmExecBudg, setFormRPpmExecBudg] = useState<FormRPpmExecBudg>({
    num: { value: ''},
    nom: { value: ''},
    libelleLongMp: { value: ''},
    montantEstime: { value: ''}
  })

  const handleInputChangeFormRPpmExecBudg = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormRPpmExecBudg({ ...formRPpmExecBudg, ...newField})
  }

  useEffect( () => {
    const results = ppmExecBudgs.filter(item => {
      return ((item.num || '').toString().startsWith(formRPpmExecBudg.num.value)
        && (item.nom || '').toString().toLowerCase().includes(formRPpmExecBudg.nom.value.toString().toLowerCase())
        && (item.libelleLongMp || '').toString().toLowerCase().includes(formRPpmExecBudg.libelleLongMp.value.toString().toLowerCase())
        && (item.montantEstime || '').toString().toLowerCase().startsWith(formRPpmExecBudg.montantEstime.value.toString().toLowerCase()))
    })
    setFilteredPpmExecBudgs(results);
  }, [formRPpmExecBudg])

  const getPpmExecBudgs = () => {
    PpmExecBudgViewService.getByExerciceAndIdBudget(Number(gestionCourante), Number(idBudget)).then(data => {
      setPpmExecBudgs(data)  
      if (formRPpmExecBudg.num.value !== "" || formRPpmExecBudg.nom.value !== "" || formRPpmExecBudg.libelleLongMp.value !== "" || formRPpmExecBudg.montantEstime.value !== "") {
        const results = ppmExecBudgs.filter(item => {
          return ((item.num || '').toString().toLowerCase().startsWith(formRPpmExecBudg.num.value.toString().toLowerCase())
            && (item.nom || '').toString().toLowerCase().includes(formRPpmExecBudg.nom.value.toString().toLowerCase())
            && (item.libelleLongMp || '').toString().toLowerCase().includes(formRPpmExecBudg.libelleLongMp.value.toString().toLowerCase())
            && (item.montantEstime || '').toString().toLowerCase().startsWith(formRPpmExecBudg.montantEstime.value.toString().toLowerCase()))
        })        
        setFilteredPpmExecBudgs(results);
      } else {
        setFilteredPpmExecBudgs(data)
      }
    })
  }  

  const handleCloseModalSelectionnerPpmExecBudg = () => {
    setShowModalSelectionnerPpmExecBudg (false);
  }

  const handleShowModalSelectionnerPpmExecBudg = () => {
    getPpmExecBudgs();
    setShowModalSelectionnerPpmExecBudg(true);
  }

  const handleSelectionnerPpmExecBudgButtonClick = () => {
    handleShowModalSelectionnerPpmExecBudg();
  }  
  ///////////////// GESTION SELECTIONNER PPM EXEC BUDG  

  ///////////////// GESTION SELECTIONNER PPMDAC
  const [ppmDacs, setPpmDacs] = useState<any[]>([]);
  const [filteredPpmDacs, setFilteredPpmDacs] = useState<any[]>([]);
  const [showModalSelectionnerPpmDac, setShowModalSelectionnerPpmDac] = useState(false);

  const tablePpmDacColumns = [
    {
      name: "Numero",
      selector: (row: any) => row.refPassation,
      width: "100px",
      center: true,
    },
    {
      name: "Date",
      selector: (row: any) => (new Date(row.dateDac)).toLocaleDateString(),
      width: "100px",
      right: true,
    },
    {
      name: "Date de lancement",
      selector: (row: any) => (new Date(row.dateLancement)).toLocaleDateString(),
      width: "150px",
      right: true,
    },
    {
      name: "Ligne PPM",
      selector: (row: any) => row.idPpm, 
    }
  ]

  const [formRPpmDac, setFormRPpmDaC] = useState<FormRPpmDac>({
    refPassation: { value: ''},
  })

  const handleInputChangeFormRPpmDac = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormRPpmDaC({ ...formRPpmDac, ...newField})
  }

  useEffect( () => {
    const results = ppmDacs.filter(item => {
      return ((item.refPassation || '').toString().startsWith(formRPpmDac.refPassation.value))
    })
    setFilteredPpmDacs(results);
  }, [formRPpmDac])

  const getppmDacs = () => {
    PpmDacService.getAll().then(data => {
      setPpmDacs(data)  
      if (formRPpmDac.refPassation.value !== "") {
        const results = ppmDacs.filter(item => {
          return ((item.refPassation || '').toString().toLowerCase().startsWith(formRPpmDac.refPassation.value.toString().toLowerCase()))
        })
        setFilteredPpmDacs(results);
      } else {
        setFilteredPpmDacs(data)
      }
    })
  }  

  const handleCloseModalSelectionnerPpmDac = () => {
    setShowModalSelectionnerPpmDac(false);
  }

  const handleShowModalSelectionnerPpmDac = () => {
    getppmDacs();
    setShowModalSelectionnerPpmDac(true);
  }

  const handleSelectionnerPpmDacButtonClick= () => {
    handleShowModalSelectionnerPpmDac();
  }  
  ///////////////// GESTION SELECTIONNER PPMDAC

  ///////////////// GESTION SELECTIONNER LE BENEFICIAIRE
  const [beneficiaires, setBeneficiaires] = useState<any[]>([]);
  const [filteredBeneficiaires, setFilteredBeneficiaires] = useState<any[]>([]);
  const [showModalSelectionnerLeBeneficiaire, setShowModalSelectionnerLeBeneficiaire] = useState(false);
  const [compteDestinataires, setCompteDestinataires] = useState<any[]>([]);

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
    handleShowModalSelectionnerLeBeneficiaire(); 
  }

  const getCompteDestinataires = (idDest: number) => {
    CompteDestinataireService.getByDestinataires(idDest).then(data => {
      if (data.length !== 0) {
        formContrat.idcompte.value = data[0].id;
      } else {
        formContrat.idcompte.value = '';
      }
      setCompteDestinataires(data);
    })
  }  
  ///////////////// GESTION SELECTIONNER LE BENEFICIAIR

  ///////////////// GESTION RECHERCHE CONTRATS
  const [contratTypes, setContratTypes] = useState<any[]>([]);
  const [gestions, setGestions] = useState<GestionResponseDto[]>([]);

  const [formRContrat, setFormRContrat] = useState<FormRContrat>({
    anneee: { value: gestionCourante },
    type: { value: '' },
    nom: { value: '' },
    montant: { value: '' },
  })

  const handleInputChangeFormRContrat = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormRContrat({ ...formRContrat, ...newField})
  }

  useEffect( () => {
    const results = contrats.filter(item => {
      return ((item.annee || '').toString().toLowerCase().includes(formRContrat.anneee.value.toString().toLowerCase()))
      && ((item.type || '').toString().toLowerCase().includes(formRContrat.type.value.toString().toLowerCase()))
      && ((item.nom || '').toString().toLowerCase().includes(formRContrat.nom.value.toString().toLowerCase()))
      && ((item.montant || '').toString().toLowerCase().includes(formRContrat.montant.value.toString().toLowerCase()))
    })
    setFilteredContrats(results);
  }, [formRContrat])  

  useEffect( () => {
    getContratTypes()
    getGestions()
  }, [])  

  const getContratTypes = () => {
    ContratTypeService.getAll().then(data => {
      setContratTypes(data)
    })
  } 
  
 const getGestions = () => {
    GestionService.getAllByEtatOrderByCouranteDesc("ACTIF").then(data => {
      setGestions(data);
    })
  }  
  ///////////////// GESTION RECHERCHE CONTRATS

  //////////////// GESTION MOT DE PASSE CONNEXION
  const [accesCodeCourante, setAccesCodeCourante] = useState<AccesCodeDto>(emptyAccesCodeDto);
  const [showModalMotDePasseDeConnexion, setShowModalMotDePasseDeConnexion] = useState(false);
  const [motDePasseDeConnexion, setMotDePasseDeConnexion] = useState("");

  useEffect(() => {
    getAccesCodeCourante();
  }, [])

  const getAccesCodeCourante = () => {
    AccesCodeService.get(ConnectedUser()).then( data => {
      setAccesCodeCourante(data)
    });
  }

  const handleMotDePasseDeConnexionInputChange = (e: any): void => {
    setMotDePasseDeConnexion(e.target.value);
  }

  const handleOk = () => {
    bcrypt.compare(motDePasseDeConnexion, accesCodeCourante.motDePasse).then( res => {
      if (!res) {
        okWarnignDialog("Mot de passe incorrect !")
      } else {
        supprimerContrat();
        handleCloseModalMotDePasseDeConnexion();
      }
    })
  }

  const handleCloseModalMotDePasseDeConnexion = () => {
    setContratSelectionne(null); /// A VOIR
    setMotDePasseDeConnexion("");
    setShowModalMotDePasseDeConnexion(false);
  }

  const handleShowModalMotDePasseDeConnexion = () => {
    setShowModalMotDePasseDeConnexion(true)
  }
  //////////////// GESTION MOT DE PASSE CONNEXION  

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
            <h6 className="shadow-sm text-primary text-center rounded">CONTRATS &gt; NOUVELLE SAISIE / MISE A JOUR</h6>
            <Form>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <Row>
                    <Col xs={3}>
                      <Form.Group controlId="anneee" as={Row} className="me-1">
                        <Col xs={4}><Form.Label className="label2">Année :</Form.Label></Col>
                        <Col>
                          <Form.Select name='anneee' value={formRContrat.anneee.value} size='sm' onChange={e => handleInputChangeFormRContrat(e)}>
                            {
                              gestions.map( g => (
                                <option key={g.courante} value={g.courante}><b>{g.courante}</b></option>
                              ))
                            }
                          </Form.Select>
                        </Col>
                      </Form.Group>                    
                    </Col>
                    <Col xs={4}>
                      <Form.Group controlId="type" as={Row} className="me-1">
                        <Col xs={4}><Form.Label className="label2">Type contrat :</Form.Label></Col>
                        <Col>
                          <Form.Select name='type' value={formRContrat.type.value} size='sm' onChange={e => handleInputChangeFormRContrat(e)}>
                            <option value=''>(tout)</option>
                            {
                              contratTypes.map( ct => (
                                <option key={ct.typeContrat} value={ct.typeContrat}>{ct.libelle}</option>
                              ))
                            }
                          </Form.Select>
                        </Col>
                      </Form.Group>                     
                    </Col>
                    <Col xs={5}>
                      <InputGroup>
                        <Form.Control name='nom' value={formRContrat.nom.value} size='sm' type="text" placeholder='Titulaire' onChange={e => handleInputChangeFormRContrat(e)} className='me-1' />                  
                        <Form.Control name='montant' value={formRContrat.montant.value} size='sm' type="number" placeholder='Montant' onChange={e => handleInputChangeFormRContrat(e)} className='' style={{minWidth:"150px", maxWidth:"150px"}} />
                      </InputGroup>                    
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card className="">
                <Card.Body className='p-1' style={{height: "450px"}}>
                  <DataGrid
                      rows={filteredContrats}
                      loading={loaderContrats}
                      getRowId={(row) => row.idContrat}
                      columns={tableContratColumns}
                      columnHeaderHeight={50}
                      hideFooter={true}
                      rowHeight={25}
                      rowSelectionModel={selectedRowId ? [selectedRowId] : []}
                      onRowSelectionModelChange={(ids) => {
                        setSelectedRowId(ids[0]);
                        if (ids.length > 0) {
                          const rowData = contrats.find((row) => row.idContrat === ids[0]);
                          setContratSelectionne(rowData);

                          // SI LE CONTRAT EST DEJA ENGAGEMENT, ON NE PEUT PLUS LE MODIFIER OU SUPPRIMER
                          if (rowData.nombreEng === 0) {
                            setDisabledModifierContrat(false);
                            setDisabledSupprimerContrat(false);
                          } else {
                            setDisabledModifierContrat(true);
                            setDisabledSupprimerContrat(true);
                          }
                        } else {
                          setContratSelectionne(null); // No row selected
                        }
                      }}
                      slots={{
                        toolbar: Toolbar,
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

          {/* GESTION AJOUTER OU MODIFIER UN CONTRAT */}
          <Modal show={showModalAjouterOuModifierUnContrat} onHide={handleCloseModalAjouterOuModifierUnContrat} backdrop="static" keyboard={false} size="xl">
            <Form onSubmit={(e) => handleSubmitFormContrat(e)}>
              <Modal.Header className='p-1'>
                <Modal.Title as="h6">Ajout / Modification de contrat</Modal.Title>
              </Modal.Header>

              <Modal.Body className='p-2'>
                  <Card className='mb-1'>
                    <Card.Body className='p-1'>
                      <Row className='mb-1'>
                        <Col>
                          <Form.Group controlId="referencesDePassationDAC" as={Row}>
                            <Col><Form.Label className="label2">References :</Form.Label></Col>
                            <Col xs={9}>
                              <InputGroup size='sm'>
                                <Form.Control name='referencesPpmExecBudg' value={formContrat.referencesPpmExecBudg.value} type="text" disabled />
                                <Button variant="outline-primary" title="Cliquez pour sélectionner le ?"  onClick={handleSelectionnerPpmExecBudgButtonClick}><BsArrowDownCircleFill /></Button>
                              </InputGroup>
                            </Col>
                          </Form.Group>                      
                        </Col>
                        <Col xs={3}>
                          <Form.Group controlId="dateAttribution" as={Row}>
                            <Col><Form.Label className="label2">Attribué le :</Form.Label></Col>
                            <Col><Form.Control name="dateAttribution" value={formContrat.dateAttribution.value} size='sm' type="date" onChange={e => handleInputChangeFormContrat(e)} style={{borderColor: borderColorDateAttribution}} /></Col>
                          </Form.Group> 
                        </Col>
                      </Row>
                      <Form.Group controlId="" as={Row} className='mb-1'>
                        <Col xs={4}>
                          <Form.Label className="label2 me-4">Immatriculation :</Form.Label>
                          <Form.Check inline type="radio" label="Selon la règlement /" name="mleAuto" value={1} checked={Number(formContrat.mleAuto.value) === 1} onChange={e => handleInputChangeFormContrat(e)} className='label2' />
                          <Form.Check inline type="radio" label="Manuelle" name="mleAuto" value={0} checked={Number(formContrat.mleAuto.value) === 0} onChange={e => handleInputChangeFormContrat(e)} className='label2' />
                        </Col>
                        <Col><Form.Control name="reference" value={formContrat.reference.value} size='sm' type="text" autoComplete="off" onChange={e => handleInputChangeFormContrat(e)} style={{borderColor: borderColorReference}} disabled={disableReferenceManuelle} /></Col>
                      </Form.Group>
                      <Row>
                        <Table responsive striped bordered hover variant="" size="sm" style={{marginBottom:"0px"}}>
                          <thead className='bg-danger'>
                            <tr>
                              <th style={{width:"100px"}}>Ministère</th>
                              <th style={{width:"100px"}}>Niveau contractant</th>
                              <th style={{width:"100px"}}>Forme de commande</th>
                              <th style={{width:"100px"}}>Identite Exéc</th>
                              <th style={{width:"100px"}}>Nature du contrat</th>
                              <th style={{width:"100px"}}>Mode de passation</th>
                              <th style={{width:"100px"}}>Source de financement</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr style={{fontWeight:"bold", fontSize:"1.1em"}} className='text-center'>
                              <td style={{width:"100px"}}>
                                <Form.Control name='cod1' value={formContrat.cod1.value} size='sm' type="text" disabled />
                              </td>
                              <td>
                                <Form.Select name='cod2' value={formContrat.cod2.value} size='sm' onChange={e => handleInputChangeFormContrat(e)} style={{borderColor: borderColorNiveauContractant}} >
                                  <option value=''></option>
                                  {
                                    codEntiteContracts.map( item => (
                                      <option key={item.cod2} value={item.cod2}>{item.intitule}</option>
                                    ))
                                  }                                
                                </Form.Select>                              
                              </td>
                              <td>
                                <Form.Select name='codTypeMarche' value={formContrat.codTypeMarche.value} size='sm' onChange={e => handleInputChangeFormContrat(e)} style={{borderColor: borderColorTypeDeMarche}} >
                                  <option value=''></option>
                                  {
                                    typeMarches.map( item => (
                                      <option key={item.codTypeMarche} value={item.codTypeMarche}>{item.intitule}</option>
                                    ))
                                  }                                
                                </Form.Select>                              
                              </td>
                              <td>
                                <Form.Select name='codIdentiteExecution' value={formContrat.codIdentiteExecution.value} size='sm' onChange={e => handleInputChangeFormContrat(e)} style={{borderColor: borderColorIdentiteExecution}} >
                                  <option value=''></option>
                                  {
                                    identiteExecutuions.map( item => (
                                      <option key={item.codIdentiteExecution} value={item.codIdentiteExecution}>{item.intitule}</option>
                                    ))
                                  }                                
                                </Form.Select>                              
                              </td>
                              <td>
                                <Form.Select name='cod3' value={formContrat.cod3.value} size='sm' onChange={e => handleInputChangeFormContrat(e)} style={{borderColor: borderColorNatureDuContrat}}>
                                  <option value=''></option>
                                  {
                                    codNatContrats.map( item => (
                                      <option key={item.cod3} value={item.cod3}>{item.intitule}</option>
                                    ))
                                  }                                
                                </Form.Select>                              
                              </td>
                              <td>
                                <Form.Select name='cod4' value={formContrat.cod4.value} size='sm' onChange={e => handleInputChangeFormContrat(e)} style={{borderColor: borderColorModeDePassation}}>
                                  <option value=''></option>
                                  {
                                    codModPass.map( item => (
                                      <option key={item.cod4} value={item.cod4}>{item.intitule}</option>
                                    ))
                                  }                                
                                </Form.Select>                              
                              </td>
                              <td>
                                <Form.Select name='cod5' value={formContrat.cod5.value} size='sm' onChange={e => handleInputChangeFormContrat(e)} style={{borderColor: borderColorSourceDeFinancement}}>
                                  <option value=''></option>
                                  {
                                    codSourceFins.map( item => (
                                      <option key={item.cod5} value={item.cod5}>{item.intituleCourt}</option>
                                    ))
                                  }                                
                                </Form.Select>                              
                              </td>
                            </tr>
                          </tbody>
                        </Table>                      
                      </Row>                   
                    </Card.Body>
                  </Card> {/*FIN PREMIER CARD*/}
                  <Card className='mb-1'>
                    <Card.Body className='p-1'>
                      <Row className='mb-1'>
                        <Col>
                          <Form.Group controlId="annee">
                            <Form.Label className="label2 mb-0">Année :</Form.Label>
                            <Form.Control name="annee" value={formContrat.annee.value} size='sm' type="number" onChange={e => handleInputChangeFormContrat(e)} disabled={operationAjouterOuModifierUnContrat ==="edit"} />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="typeContrat">
                            <Form.Label className="label2 mb-0">Type de contrat :</Form.Label>
                            <Form.Select name="typeContrat" value={formContrat.typeContrat.value} size='sm' onChange={e => handleInputChangeFormContrat(e)} style={{borderColor: borderColorTypeDeContrat}}>
                              <option value=''></option>
                                {
                                  contratTypes.map( item => (
                                    <option key={item.typeContrat} value={item.typeContrat}>{item.libelle}</option>
                                  ))
                                }                                
                            </Form.Select>                           
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="delaiNbre">
                            <Form.Label className="label2 mb-0">Délai de validité :</Form.Label>
                            <InputGroup size='sm'>
                              <Form.Control name="delaiNbre" value={formContrat.delaiNbre.value} type="number" onChange={e => handleInputChangeFormContrat(e)} style={{borderColor: borderColorDelaiNbre}}/>
                              <Form.Select name="delaiText" value={formContrat.delaiText.value} size='sm' onChange={e => handleInputChangeFormContrat(e)} style={{borderColor: borderColorDelaiText}}>
                                <option value=""></option>
                                <option value="jour">Jour</option>
                                <option value="jours">Jours</option> 
                                <option value="semaine">Semaine</option>
                                <option value="semaines">Semaines</option>  
                                <option value="mois">Mois</option>
                                <option value="annee">Année</option>    
                                <option value="annees">Années</option>                          
                            </Form.Select>
                            </InputGroup>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="dateSaisie">
                            <Form.Label className="label2 mb-0">Date de saisie :</Form.Label>
                            <Form.Control name="dateSaisie" value={formContrat.dateSaisie.value} size='sm' type="date" onChange={e => handleInputChangeFormContrat(e)} />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="dateApprob">
                            <Form.Label className="label2 mb-0">Approuvé le :</Form.Label>
                            <Form.Control name="dateApprob" value={formContrat.dateApprob.value} size='sm' type="date" onChange={e => handleInputChangeFormContrat(e)} />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className=''>
                        <Col>
                          <tr className="label2">Délai d'éxécution : {(formContrat.delaiDExecution.value !== 0)? formContrat.delaiDExecution.value + " jour(s)" : ""}</tr>
                          <Table responsive striped bordered hover variant="" size="sm" style={{marginBottom:"0px", borderColor: borderColorDelaiDExecution}}>
                            <thead>
                              <tr>
                                <th style={{width:"40px"}}>An(s)</th>
                                <th style={{width:"40px"}}>Mois</th>
                                <th style={{width:"40px"}}>Semaine(s)</th>
                                <th style={{width:"40px"}}>Jour(s)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{fontWeight:"bold", fontSize:"1.1em"}} className='text-center'>
                                <td><Form.Control name="delaiAn" value={formContrat.delaiAn.value} size='sm' type="number" onChange={e => handleInputChangeFormContrat(e)} /></td>
                                <td><Form.Control name="delaiMois" value={formContrat.delaiMois.value} size='sm' type="number" onChange={e => handleInputChangeFormContrat(e)} /></td>
                                <td><Form.Control name="delaiSemaine" value={formContrat.delaiSemaine.value} size='sm' type="number" onChange={e => handleInputChangeFormContrat(e)} /></td>
                                <td><Form.Control name="delaiJours" value={formContrat.delaiJours.value} size='sm' type="number" onChange={e => handleInputChangeFormContrat(e)} /></td>
                              </tr>
                            </tbody>
                          </Table>                      
                        </Col>
                        <Col>
                          <Form.Group controlId="nom" className='mb-1'>
                            <Form.Label className="label2 mb-0">Titulaire :</Form.Label>
                            <InputGroup size='sm' >
                              <Form.Control name='nom' value={formContrat.nom.value} title={formContrat.nom.value} type="text" placeholder="Nom" disabled />
                              <Form.Control name='ifumle' value={formContrat.ifumle.value} title={formContrat.ifumle.value} type="text" placeholder="Ifu" disabled />
                              <Button variant="outline-primary" title="Cliquez pour sélectionner le titulaire" onClick={handleSelectionnerLeBeneficiaireButtonClick} style={{borderColor: borderColorTitulaire}}><BsArrowDownCircleFill /></Button>                          
                            </InputGroup>                                                    
                          </Form.Group>
                          <Form.Group controlId="idcompte" as={Row}>
                            <Col xs={3}><Form.Label className='label2'>Compte bancaire :</Form.Label></Col>
                            <Col>
                              <Form.Select name='idcompte' value={formContrat.idcompte.value} size='sm' onChange={e => handleInputChangeFormContrat(e)} style={{borderColor: borderColorCompteBancaire}}>
                                <option value=""></option>
                                {
                                  compteDestinataires.map( item => (
                                    <option key={item.id} value={item.id}>{item.abreviation + " " + item.libelleAgence + " N°" + item.codeBanque + " " + item.codeAgence + " " + item.numCompte + " " + item.cleRib}</option>
                                  ))
                                }
                              </Form.Select>
                            </Col>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group controlId="objet">
                        <Form.Label className="label2 mb-0">Objet :</Form.Label>
                        <Form.Control as="textarea" rows={2} name='objet' value={formContrat.objet.value} size='sm' type="text" onChange={e => handleInputChangeFormContrat(e)} style={{borderColor: borderColorObjet}} />
                      </Form.Group>
                    </Card.Body>
                  </Card>  {/*FIN DEUXIEME CARD*/}  
                  <Card className='mb-1'>
                    <Card.Body className='p-1'>
                      <Card.Title style={{fontSize:"0.72em", marginBottom:"0px"}}>
                        <span className='me-4'>Montant : </span>
                        <Form.Check name="avecTva" inline type="checkbox" label="Avec TVA" checked={formContrat.avecTva.value} onChange={(e: any) => handleCheckboxInputChangeFormContrat(e)} />
                        <Form.Check name="avecMiniMax" inline type="checkbox" label="Avec minimum et maximum" checked={formContrat.avecMiniMax.value} onChange={(e: any) => handleCheckboxInputChangeFormContrat(e)} />
                      </Card.Title>
                      <Row>
                        <Col>
                          { disableMontantMinHtva === false &&
                            <Form.Group controlId="montantMinHtva" as={Row} className='mb-1'>
                              <Col xs={3}><Form.Label className='label2'>Minimum HTVA :</Form.Label></Col>
                              <Col><Form.Control name='montantMinHtva' value={formContrat.montantMinHtva.value} size='sm' type="text" onChange={e => handleInputChangeFormContrat(e)} style={{borderColor: borderColorMontantMinHtva}} /></Col>
                            </Form.Group>
                          }
                          <Form.Group controlId="montantMaxHtva" as={Row}>
                            <Col xs={3}><Form.Label className='label2'>{montantMaxHtvaLabel}</Form.Label></Col>
                            <Col><Form.Control name='montantMaxHtva' value={formContrat.montantMaxHtva.value} size='sm' type="text" onChange={e => handleInputChangeFormContrat(e)} style={{borderColor: borderColorMontantMaxHtva}} /></Col>
                          </Form.Group>
                        </Col>
                        <Col>
                          { disableMontantMinTtc === false &&
                            <Form.Group controlId="montantMinTtc" as={Row} className='mb-1'>
                              <Col xs={3}><Form.Label className='label2'>Minimum TTC :</Form.Label></Col>
                              <Col><Form.Control name='montantMinTtc' value={formContrat.montantMinTtc.value} size='sm' type="text" onChange={e => handleInputChangeFormContrat(e)} style={{borderColor: borderColorMontantMinTtc}} /></Col>
                            </Form.Group>
                          }
                          { disableMontantMaxTtc === false &&
                            <Form.Group controlId="montantMaxTtc" as={Row}>
                              <Col xs={3}><Form.Label className='label2'>{montantMaxTtcLabel}</Form.Label></Col>
                              <Col><Form.Control name='montantMaxTtc' value={formContrat.montantMaxTtc.value} size='sm' type="text" onChange={e => handleInputChangeFormContrat(e)} style={{borderColor: borderColorMontantMaxTtc}} /></Col>
                            </Form.Group>
                          }
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                
              </Modal.Body>

              <Modal.Footer className='p-1'>
                <Button variant="outline-primary" title="Ajouter un contrat" size='sm' className='me-0' onClick={() => handleAjouterUnContratButtonClick()} style={{minWidth:"140px", maxWidth:"150px", maxHeight:"30px"}}>Ajouter <BsPlusLg /></Button>
                <Button variant="outline-primary" type='submit' size='sm' className='me-0' disabled={disabledEnregistrer} style={{minWidth:"140px", maxWidth:"150px", maxHeight:"30px"}}>Enregister</Button>
                <Button variant="outline-danger" size='sm' onClick={handleCloseModalAjouterOuModifierUnContrat} style={{minWidth:"140px", maxWidth:"150px", maxHeight:"30px"}}>Fermer</Button>
              </Modal.Footer>
            </Form>
          </Modal> 

          {/* GESTION SELECTIONNER PPM EXEC BUDG */}
          <Modal show={showModalSelectionnerPpmExecBudg} onHide={handleCloseModalSelectionnerPpmExecBudg} backdrop="static" keyboard={false} size="xl" className='mt-4'>
            <Modal.Header className='p-1 bg-primary' closeButton>
                <Modal.Title as="h6">Liste des PPM EXEC BUDG</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2 bg-primary'>
              <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles_2}
                    columns={tablePpmExecBudgColumns}
                    data={filteredPpmExecBudgs}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    fixedHeaderScrollHeight='450px'
                    highlightOnHover
                    responsive
                    striped
                    onRowClicked={ (row, e) => {
                      formContrat.idPpmExe.value = row.idPpmExe;
                      formContrat.idLot.value = row.idLot;
                      formContrat.codBud.value = row.codBud;
                      formContrat.idSrceFin.value = row.idSrceFin;
                      formContrat.montantEstime.value = row.montantEstime;
                      formContrat.referencesPpmExecBudg.value = "PPM : " + row.idPpm + "     Compte : " + row.idPlan + "     Montant : " + Number(row.montantEstime).toLocaleString();

                      formContrat.cod4.value = row.cod4;
                      formContrat.cod5.value = row.idSrceFin;
                      formContrat.annee.value = row.exercice;
                      formContrat.objet.value = row.objetLot;
                      formContrat.montantMaxHtva.value = row.montantMaxHtva.toLocaleString();
                      formContrat.montantMinHtva.value = row.montantMinHtva.toLocaleString();
                      formContrat.montantMaxTtc.value = row.montantMaxTtc.toLocaleString();
                      formContrat.montantMinTtc.value = row.montantMinTtc.toLocaleString();
                      formContrat.avecTva.value = row.avecTva;
                      formContrat.avecMiniMax.value = row.avecMiniMax;

                      formContrat.idFourn.value = row.idFourn;
                      formContrat.ifumle.value = row.ifumle;
                      formContrat.nom.value = row.nom;
                      getCompteDestinataires(row.idFourn);

                      // POUR DETERMINER SI C'EST AVEC TVA ET OU AVECMINIMAX
                      if (row.montantMaxTtc !== 0 || row.montantMinTtc !== 0) formContrat.avecTva.value = true; else formContrat.avecTva.value = false;
                      if (row.montantMinHtva !== 0 || row.montantMinTtc !== 0) formContrat.avecMiniMax.value = true; else formContrat.avecMiniMax.value = false;

                      // AVEC TVA
                      if (formContrat.avecTva.value === true && formContrat.avecMiniMax.value === false) {
                        setDisableMontantMaxTtc(false);
                        setDisableMontantMinHtva(true);formContrat.montantMinHtva.value = 0;
                        setDisableMontantMinTtc(true);formContrat.montantMinTtc.value = 0;

                        setMontantMaxHtvaLabel("HTVA :");
                        setMontantMaxTtcLabel("TTC :");
                      }

                      if (formContrat.avecTva.value === false && formContrat.avecMiniMax.value  === true) {
                        setDisableMontantMaxTtc(true);formContrat.montantMaxTtc.value = 0;
                        setDisableMontantMinHtva(false);
                        setDisableMontantMinTtc(true);formContrat.montantMinTtc.value = 0;

                        setMontantMaxHtvaLabel("Maximum HTVA :");
                      }
                        
                      if (formContrat.avecTva.value === false && formContrat.avecMiniMax.value  === false) {
                        setDisableMontantMaxTtc(true);formContrat.montantMaxTtc.value = 0;
                        setDisableMontantMinHtva(true);formContrat.montantMinHtva.value = 0;
                        setDisableMontantMinTtc(true);formContrat.montantMinTtc.value = 0;

                        setMontantMaxHtvaLabel("HTVA :");
                      }

                      if (formContrat.avecTva.value === true && formContrat.avecMiniMax.value === true) {
                        setDisableMontantMaxTtc(false);
                        setDisableMontantMinHtva(false);
                        setDisableMontantMinTtc(false);

                        setMontantMaxHtvaLabel("Maximum HTVA :");
                        setMontantMaxTtcLabel("Maximum TTC :");
                      }      

                      // AVEC MINIMAX
                      if (formContrat.avecMiniMax.value  === true && formContrat.avecTva.value === false) {
                        setDisableMontantMaxTtc(true);formContrat.montantMaxTtc.value = 0;
                        setDisableMontantMinHtva(false);
                        setDisableMontantMinTtc(true);formContrat.montantMinTtc.value = 0;

                        setMontantMaxHtvaLabel("Maximum HTVA :");
                      }

                      if (formContrat.avecMiniMax.value  === false && formContrat.avecTva.value === true) {
                        setDisableMontantMaxTtc(false);
                        setDisableMontantMinHtva(true);formContrat.montantMinHtva.value = 0;
                        setDisableMontantMinTtc(true);formContrat.montantMinHtva.value = 0;

                        setMontantMaxHtvaLabel("HTVA :");
                        setMontantMaxTtcLabel("TTC :");
                      }

                      if (formContrat.avecMiniMax.value  === false && formContrat.avecTva.value === false) {
                        setDisableMontantMaxTtc(true);formContrat.montantMaxTtc.value = 0;
                        setDisableMontantMinHtva(true);formContrat.montantMinHtva.value = 0;
                        setDisableMontantMinTtc(true);formContrat.montantMinTtc.value = 0;

                        setMontantMaxHtvaLabel("HTVA :");
                      }

                      if (formContrat.avecMiniMax.value === true && formContrat.avecTva.value === true) {
                        setDisableMontantMaxTtc(false);
                        setDisableMontantMinHtva(false);
                        setDisableMontantMinTtc(false);

                        setMontantMaxHtvaLabel("Maximum HTVA :");
                        setMontantMaxTtcLabel("Maximum TTC :");
                      }                      
                      
                      handleCloseModalSelectionnerPpmExecBudg();
                    }}
                    subHeader
                    subHeaderComponent={                       
                      <ButtonGroup as={Col} size="sm">
                        <Form.Control name="num" value={formRPpmExecBudg.num.value} size='sm' type="number" placeholder='Numero PPM' onChange={e => handleInputChangeFormRPpmExecBudg(e)} className='me-1' style={{width:"120px"}}/>
                        <Form.Control name="nom" value={formRPpmExecBudg.nom.value} size='sm' type="text" placeholder='Fournisseur' onChange={e => handleInputChangeFormRPpmExecBudg(e)} className='w-25 me-1'/>
                        <Form.Control name="libelleLongMp" value={formRPpmExecBudg.libelleLongMp.value} size='sm' type="text" placeholder='Mode de passation' onChange={e => handleInputChangeFormRPpmExecBudg(e)} className=' w-25 me-1'/>
                        <Form.Control name="montantEstime" value={formRPpmExecBudg.montantEstime.value} size='sm' type="number" placeholder='Montant' className='w-25' onChange={e => handleInputChangeFormRPpmExecBudg(e)} />
                      </ButtonGroup>
                    }
                    />
                </Card.Body>
              </Card>
            </Modal.Body>

            <Modal.Footer className='p-1 bg-primary'>
              <Button variant="outline-danger" className='text-black' size='sm' onClick={handleCloseModalSelectionnerPpmExecBudg}>Fermer</Button>
            </Modal.Footer>
          </Modal>          

          {/* GESTION SELECTIONNER PPMDAC */}
          <Modal show={showModalSelectionnerPpmDac} onHide={handleCloseModalSelectionnerPpmDac} backdrop="static" keyboard={false} size="lg" className='mt-4'>
            <Modal.Header className='p-1 bg-primary' closeButton>
                <Modal.Title as="h6">Liste des PPM DAC</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2 bg-primary'>
              <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles_2}
                    columns={tablePpmDacColumns}
                    data={filteredPpmDacs}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    fixedHeaderScrollHeight='450px'
                    highlightOnHover
                    responsive
                    striped
                    onRowClicked={ (row, e) => {
                      formContrat.idDac.value = row.idDac;
                      formContrat.refPassation.value = row.refPassation;
                      formContrat.referencesDePassationDAC.value = row.refPassation + " du " + formatDateWithHoursAndMinutes(new Date(row.dateDac));
                      handleCloseModalSelectionnerPpmDac();
                    }}
                    subHeader
                    subHeaderComponent={                       
                      <ButtonGroup as={Col} size="sm">
                        <Form.Control name="refPassation" value={formRPpmDac.refPassation.value}  size='sm' type="number" placeholder='Numero' onChange={e => handleInputChangeFormRPpmDac(e)} className='me-1' style={{width:"120px"}}/>
                      </ButtonGroup>
                    }
                    />
                </Card.Body>
              </Card>
            </Modal.Body>

            <Modal.Footer className='p-1 bg-primary'>
              <Button variant="outline-primary" className='text-black' size='sm' onClick={handleCloseModalSelectionnerPpmDac}>Fermer</Button>
            </Modal.Footer>
          </Modal> 

          {/* GESTION SELECTIONNER LE BENEFICIAIRE */}
          <Modal show={showModalSelectionnerLeBeneficiaire} onHide={handleCloseModalSelectionnerLeBeneficiaire} backdrop="static" keyboard={false} size="xl" className='mt-4'>
            <Modal.Header className='p-1 bg-primary' closeButton>
                <Modal.Title as="h6">Fournisseur et Beneficiaires</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2 bg-primary'>
              <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles_2}
                    columns={tableBeneficiaireColumns}
                    data={filteredBeneficiaires}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    fixedHeaderScrollHeight='400px'
                    highlightOnHover
                    responsive
                    striped
                    onRowClicked={ (row, e) => {
                      formContrat.idFourn.value = row.idDest;
                      formContrat.ifumle.value = row.ifumle;
                      formContrat.nom.value = row.nom;
                      getCompteDestinataires(row.idDest)
                      handleCloseModalSelectionnerLeBeneficiaire()
                    }}
                    subHeader
                    subHeaderComponent={                       
                      <ButtonGroup as={Col} size="sm">
                        <Col className='me-1'>
                          <Form.Group controlId="type" as={Row} size="sm">
                            <Col xs={3}><Form.Label className="label2">Type :</Form.Label></Col>
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
                        <Col xs={3} className='me-1'><Form.Control name="ifumle" value={formRBeneficiaire.ifumle.value} size='sm' type="text" placeholder='Ifue/Mle' onChange={e => handleInputChangeFormRBeneficiaire(e)}/></Col>
                      </ButtonGroup>
                    }
                    />
                </Card.Body>
              </Card>
            </Modal.Body>

            <Modal.Footer className='p-1 bg-primary'>
              <Button variant="outline-danger" className='text-black' size='sm' onClick={handleCloseModalSelectionnerLeBeneficiaire}>Fermer</Button>
            </Modal.Footer>
          </Modal> 
          
          {/* MOT DE PASSE DE CONNEXION */}
          <Modal show={showModalMotDePasseDeConnexion} onHide={handleCloseModalMotDePasseDeConnexion} backdrop="static" keyboard={false}>
            <Modal.Header className='p-1'>
              <Modal.Title as="h6">Mot de passe de connexion</Modal.Title>
            </Modal.Header>
          
            <Modal.Body className='p-2'>
              <Form.Group className="" controlId="motDePasseDeConnexion">
                <Form.Label className="label2">Mot de passe de connexion</Form.Label>
                <Form.Control name="motDePasseDeConnexion" size='sm' type="password" value={motDePasseDeConnexion} onChange={e => handleMotDePasseDeConnexionInputChange(e)} autoFocus />
              </Form.Group>
            </Modal.Body>
          
            <Modal.Footer className='p-1'>
              <Button variant="outline-success" size='sm' onClick={handleOk}>Ok</Button>
              <Button variant="outline-secondary" size='sm' onClick={handleCloseModalMotDePasseDeConnexion}>Fermer</Button>
            </Modal.Footer>
          </Modal>                                      
      </Container>
  );
};

export default ContratsNouvelleSaisieMajForm;
