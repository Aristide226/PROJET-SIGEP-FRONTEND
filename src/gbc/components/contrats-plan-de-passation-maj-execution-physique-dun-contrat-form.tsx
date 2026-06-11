//Aristide
import { FunctionComponent,useState,useEffect } from "react";
import { Button,Container,Table, Dropdown, Form, DropdownButton, ButtonGroup, Modal, Card } from 'react-bootstrap';
import DataTable from "react-data-table-component";
import { emptyPpmRequestDto, PpmRequestDto, PpmResponseDto } from "../models/ppm";
import PpmService from "../services/ppm-service";
import { IdBudget, Gestion } from "../helpers/session-storage";
import { Field } from "../../helpers/types";
import { BsPencilSquare, BsPlusLg, BsTrash } from "react-icons/bs";
import { costumeStyles } from "../../helpers/costume-styles";
import { emptyPpmExecRequestDto,  PpmExecRequestDto,PpmExecResponseDto } from "../models/ppm-exec";
import { okSuccessDialog, okWarnignDialog } from "../../helpers/dialogs";
import PpmExecService from "../services/ppm-exec-service";
import {Col,Row} from "react-bootstrap";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { CodSourceFinRequestDto } from "../models/cod-source-fin";
import CodSourceFinService from "../services/cod-source-fin-service";
import PpmBudgService from "../services/ppm-budg-service";
import { emptyPpmExecBudgRequestDto, PpmExecBudgRequestDto } from "../models/ppm-exec-budg";
import PpmExecBudgService from "../services/ppm-exec-budg-service";
import { error } from "console";
import DestinataireService from "../services/destinataire-service";
import { DestinataireResponseDto } from "../models/destinataire";
import { PpmBudgResponseDto } from "../models/ppm-budget";


type FormulairePpmExec = {
    idPpm : Field,	
    idPpmExec : Field,	
	idBudget : Field,	
	exercice : Field,	
	nbLot : Field,	
	num : Field,	
    montantEstime : Field,	
	montDepEngNonLiq : Field,	
	creditDispo : Field,	
	natPrestation : Field,	
	dateCreation : Field,	
	dateButoire : Field,	
	execution : Field,	
	montantTtc : Field,	
	montantHtva : Field,	
	montantMaxTtc : Field,	
	montantMaxHtva : Field,	
	montantMinTtc : Field,	
	montantMinHtva : Field,	
	abrevMp : Field,	

	idLot: Field,	
	objetLot : Field,	
	idFourn : Field,	
	montantAttrib : Field,	
	dateNotificationProvisoire : Field,	
	dateApprobContrat : Field,	
	niveauMiseEnOeuvreEtObservation : Field,	
	dateReception : Field,	
	dateLancementMarchePrevisionnel : Field,	
	dateLanceEffect : Field,	
	nbJoursRetardLancement : Field,
    dateRemiseEtOuvertureDesPlis : Field
}
// FORUMULAIRE CONTRAT
type FormContrat = {
	montantMaxHtva: Field,//OK
	montantMinHtva: Field,//OK
	montantMaxTtc: Field,//OK
	montantMinTtc: Field,//OK
	avecTva: Field,//OK
	avecMiniMax: Field,//OK
}
const ContratsPlanDePassationMajExecutionPhysiqueContratForm : FunctionComponent = ()=> {
    //////////DECLARATION DES TABLEAUX
    const executionDuPpmCol = [
        {name: 'Code', selector: (row:any) => row.idPpm},
        {name: 'Montant estimé', selector: (row:any) => row.montantEstime},
        {name: 'Mont Dep. Eng Non Liq', selector: (row:any) => row.montDepEngNonLiq},
        {name: 'Crédit Disponible', selector: (row:any) => row.creditDispo},
        {name: 'Nature prestation', selector: (row:any) => row.natPrestation, grow:2, wrap:true},
        {name: 'Nb lot', selector: (row:any) => row.nbLot},
        {name: 'Mode passation', selector: (row:any) => row.abrevMp},
        {name: 'Date de lancement', selector: (row:any) => row.dateLancement},
        {name: 'Date remise offres', selector: (row:any) => row.dateRemiseOffre},
        {name: 'Temps évaluation (jrs)', selector: (row:any) => row.nbJrsEvaluation},
        {name: 'Date prob. démar.', selector: (row:any) => row.dateProbDemar},
        {name: 'Délai Exécut° en jrs', selector: (row:any) => row.delaiExecJrs},
        {name: 'Date butoire', selector: (row:any) => row.dateButoire},
        {name: 'Date Effect Lancement', selector: (row:any) => row.dateEffectLance, grow:0},
        {name: 'Date Attribution', selector: (row:any) => row.dateAttribution, grow:0},
        {name: 'Montant attribution', selector: (row:any) => row.montantPasse},
    ]
    const ppmsDejaExecuterCol = [
        {name : 'IdPPMExe', selector: (row:any) => row.idPpmExec},
        {name : 'IdPPM', selector: (row:any) => row.idPpm},
        {name : 'IdLot', selector: (row:any) => row.idLot},
        {name : 'IdBudget', selector: (row:any) => row.idBudget},
        {name : 'Exercice', selector: (row:any) => row.exercice},
        {name : 'NbLot', selector: (row:any) => row.nbLot},
        {name : 'Num', selector: (row:any) => row.num},
        {name : 'MontantEstime', selector: (row:any) => row.montantEstime},
        {name : 'MontDepEngNonLiq', selector: (row:any) => row.montDepEngNonLiq, grow: 2, wrap:true},
        {name : 'CreditDispo', selector: (row:any) => row.creditDispo},
        {name : 'NatPrestation', selector: (row:any) => row.natPrestation, grow: 3, wrap:true},
        {name : 'ObjetLot', selector: (row:any) => row.objetLot, grow: 3, wrap:true},
        {name : 'DateLanceEffect', selector: (row:any) => row.dateLanceEffect, grow: 2, wrap:true},
        {name : 'DateButoire', selector: (row:any) => row.dateButoire},
        {name : 'IdFourn', selector: (row:any) => row.idFourn},
        {name : 'MontantAttrib', selector: (row:any) => row.montantAttrib},
        {name : 'MontantMaxTTC', selector: (row:any) => row.montantMaxTtc},
        {name : 'MontantMaxHTVA', selector: (row:any) => row.montantMaxHtva},
        {name : 'MontantMinTTC', selector: (row:any) => row.montantMinTtc},
        {name : 'MontantMinHTVA', selector: (row:any) => row.montantMinHtva},
        {name : 'IdModPassation', selector: (row:any) => row.abrevMp},
        {name : 'NiveauMiseEnOeuvreEtObservation', selector: (row:any) => row.niveauMiseEnOeuvreEtObservation, grow: 3, wrap:true},
        {name : 'NbJoursRetardLancement', selector: (row:any) => row.nbJoursRetardLancement, grow: 2, wrap:true},
    ]
    const tableauDeLigneBudgetaireColonne=  [
        {name : 'IdPPM', selector:(row:any) => row.idPpm},
        {name : 'CodBud', selector:(row:any) => row.codBud, grow:2},
        {name : 'IdSrceFin', selector:(row:any) => row.idSrceFin},
        {name : 'montant Estimé', selector:(row:any) => row.montantEstime},
        {name:"Présente saisie",  
          cell:(row:any) => (
              <input type='text'  value={formatNombre(row.presenteSaisi)} onChange={(e) => gererPresenteSaisi(e,row)}  style={{width:'150px'}}  />
          ), format:(row:any) => `${row.presenteSaisi.toLocaleString()}`
        },
        {name: "Action",
            cell: (row:any) =>(
              <Button variant='outline-danger' title='supprimer la ligne sélectionnée' size='sm' className='me-1' onClick={() => retirerUneLigneBudgetaire(row)}>
                <BsTrash/>
              </Button>
            )
        }  
      ];
    const tableauPourChoisirLigneBudgetaireColonne = [
        {name : 'IdPPM', selector:(row:any) => row.idPpm},
        {name : 'CodBud', selector:(row:any) => row.codBud, grow:2},
        {name : 'IdSrceFin', selector:(row:any) => row.idSrceFin},
        {name : 'Montant Estime', selector:(row:any) => row.montantEstime},
        {name:"Action", grow:1,
            cell:(row:any)=> {
                const isDisabled = stokerIdppmAndCodBudAndIdSrceFin.includes(row.codBud);
                return (
                <Button size="sm" name="ajouterLigneBudgetaire"   onClick={()=>ajouterUneLigneBudgetaire(row)} disabled={isDisabled}>Ajouter</Button>
                );
            }   
        }
    ]
    const tableauPourChoisirFournisseurColonne = [
        {name : 'ID', selector:(row:any) => row.idDest},
        {name : 'Nom', selector:(row:any) => row.nom},
        {name : 'IFUMLE', selector:(row:any) => row.ifumle},
        {name : 'Action',
            cell: (row : any) => (
                <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => selectionnerFournisseur(row)}
                >
                    Sélectionner
                </Button>
            )
        }
    ]
    //////////DECLARATIONS STATES
    const [ppms,setPpms] = useState<PpmResponseDto[]>([]);
    const [ppmExecs, setPpmExecs] = useState<PpmExecResponseDto[]>([]);
    const [selectedPpm, setSelectedPpm] = useState<PpmResponseDto | null> (null);
    const [selectedPpmExec, setSelectedPpmExec] = useState<PpmExecResponseDto | null> (null);
    const [formulairePourExecuterLeContrat,setFormulairePourExecuterLeContrat] = useState<FormulairePpmExec>({
    idPpm : {value:''},
    idPpmExec : {value:''},
	idBudget : {value:''},
	exercice : {value:''},
	nbLot : {value:''},
	num : {value:''},
    montantEstime : {value:''},
	montDepEngNonLiq : {value:''},
	creditDispo : {value:''},
	natPrestation : {value:''},
	dateCreation : {value:''},
	dateButoire : {value:''},
	execution : {value:''},
	montantTtc : {value:''},
	montantHtva : {value:''},
	montantMaxTtc : {value:''},
	montantMaxHtva : {value:''},
	montantMinTtc : {value:''},
	montantMinHtva : {value:''},
	abrevMp : {value:''},

	idLot: {value:''},
	objetLot : {value:''},
	idFourn : {value:''},
	montantAttrib : {value:''},
	dateNotificationProvisoire : {value:''},
	dateApprobContrat : {value:''},
	niveauMiseEnOeuvreEtObservation : {value:''},
	dateReception : {value:''},
	dateLancementMarchePrevisionnel : {value:''},
	dateLanceEffect : {value:''},
	nbJoursRetardLancement : {value:''}, 
    dateRemiseEtOuvertureDesPlis: {value: ''}
    });
    const [lignePpmAExecuter,setLignePpmAExecuter] = useState<PpmRequestDto|null>(null);
    const [rechercherUnPpm, setRechercherUnPpm] = useState<string>('');
    const [stokerCodSourceFin, setStokerCodSourceFin] = useState <CodSourceFinRequestDto[]> ([]);
    const [loading,setLoading] = useState(false);
    const [idBudget] = useState <string> (() => {
        const id = IdBudget();
        if (!id) return '';
        const num = parseInt(id);
        return num < 10 ? `${num}` : `${num}`;
    });
    const [gestionCourante, setGestionCourante] = useState<string>(Gestion() ?? '');
    const [stokerLigneBudgetaires, setStokerLigneBudgetaires] = useState<PpmBudgResponseDto[]>([]);
    const [stokerIdppmAndCodBudAndIdSrceFin,setStokerIdppmAndCodBudAndIdSrceFin]= useState<any>([]);
    const [montantEstimeTotalPourLesLignesBudgetaires, setMontantEstimeTotalPourLesLignesBudgetaires] = useState<number>(0);
    const [showModalExecuterUnContrat,setShowModalExecuterUnContrat] = useState(false);
    const [estEnModeModification,setEstEnModeModification] = useState (false);
    const [showModalPpmDejaExecuter,setShowModalPpmDejaExecuter] = useState(false);
    const [fournisseurs, setFournisseurs] = useState<DestinataireResponseDto[]>([]);
    const [showModalAjoutDuneLigneBudgetaire, setShowModalAjoutDuneLigneBudgetaire] = useState(false);
    const [showModalChoisirUnFournisseur,setShowModalChoisirUnFournisseur] = useState(false);
    const [disableMontantMinHtva, setDisableMontantMinHtva] = useState<boolean>(true);
    const [disableMontantMinTtc, setDisableMontantMinTtc] = useState<boolean>(true);
    const [disableMontantMaxTtc, setDisableMontantMaxTtc] = useState<boolean>(true);
    const [montantMaxHtvaLabel, setMontantMaxHtvaLabel] = useState<string>("HTVA :");
    const [montantMaxTtcLabel, setMontantMaxTtcLabel] = useState<string>("TTC :");
    const [formContrat, setFormContrat] = useState<FormContrat>({
        montantMaxHtva: { value: 0 },
        montantMinHtva: { value: 0 },
        montantMaxTtc: { value: 0 },
        montantMinTtc: { value: 0 },
        avecTva: { value: true },
        avecMiniMax: { value: false },
    })
    const [rechercheFournisseur, setRechercheFournisseur] = useState<string>('');
    const [fournisseurSelectionneNom, setFournisseurSelectionneNom] = useState<string>('');

    //////////DECLARATIONS FONCTIONS
    //initialisation lors de la selection
    const calculateDateDifferenceInDays = (date1: string, date2: string): number | null => {
        if (!date1 || !date2) {
            return null;
        }
        const d1 = new Date(date1);
        const d2 = new Date(date2);
    
        // Assurez-vous que les dates sont valides
        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
            return null;
        }

        // Calcul de la différence en millisecondes
        const diffTime = d1.getTime() - d2.getTime();
    
        // Conversion en jours : 1 jour = 24 * 60 * 60 * 1000 millisecondes
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
        return diffDays;
    };
   
    const handleExecuterUnPpm =()=> {
        if(!lignePpmAExecuter){
            okWarnignDialog('Veuillez sélectionner une ligne');
            return;
        } else {
            setEstEnModeModification(false);
            intitFormulairePourExecuterLeContrat();
            handleShowModalExecuterUnContrat();
        }   
    }
    const handleCloseModalExecuterUnContrat = () => {
        setShowModalExecuterUnContrat(false);
        setSelectedPpm(null);
        setLigneBudgetaireSelectionnee([])
    }
    const handleInputChange = (e:any):void => {
        const name: string = e.target.name;
        const value: string = e.target.value;
        const newField: Field = {[name]: {value: value}, error:'', isValid:true};
        setFormulairePourExecuterLeContrat({...formulairePourExecuterLeContrat,...newField});

        const taux_tva = 0.18;

        // Calcul si l'utilisateur saisit Montant Max HTVA
        if (name === 'montantMaxHtva' && value !== null) {
        const montantMaxTtc = parseFloat(value) * (1 + taux_tva);
            setFormulairePourExecuterLeContrat( prev=> ({
                ...prev, ...newField, montantMaxTtc:{value: montantMaxTtc}
            }))
        } else if (name === 'montantMaxHtva' && value === null) {
            setFormulairePourExecuterLeContrat( prev=> ({
                ...prev, ...newField, montantMaxTtc:{value: null}
            }))
        }

        // Calcul si l'utilisateur saisit Montant Min HTVA
        if (name === 'montantMinHtva' && value !== null) {
            const montantMinTtc = parseFloat(value) * (1 + taux_tva);
            setFormulairePourExecuterLeContrat( prev=> ({
                ...prev, ...newField, montantMinTtc:{value: montantMinTtc}
            }))
        } else if (name === 'montantMinHtva' && value === null) {
            setFormulairePourExecuterLeContrat( prev=> ({
                ...prev, ...newField,montantMinTtc:{value: null}
            }))
        }

        if (name === 'montantMinHtva' || name === 'montantMaxHtva') {
            const maxHtva = (name === 'montantMaxHtva') ? value : parseFloat(formulairePourExecuterLeContrat.montantMaxHtva.value);
            const minHtva = (name === 'montantMinHtva') ? value : parseFloat(formulairePourExecuterLeContrat.montantMinHtva.value);
        
            if (minHtva !== null && maxHtva !== null && minHtva > maxHtva) {
            okWarnignDialog("Le Montant Minimum HTVA ne peut pas être supérieur au Montant Maximum HTVA.");
            }
        }
    }

    const initFormContrat = () => {    
    setFormContrat({
      montantMaxHtva: { value: 0 },
      montantMinHtva: { value: 0 },
      montantMaxTtc: { value: 0 },
      montantMinTtc: { value: 0 },
      avecTva: { value: true },
      avecMiniMax: { value: false },
    })
    setDisableMontantMaxTtc(false);
    setDisableMontantMinHtva(true);
    setDisableMontantMinTtc(true);

    setMontantMaxHtvaLabel("HTVA :");
    setMontantMaxTtcLabel("TTC :");
    }

    const extractNumber = (val: any): number => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        const strVal = val.toString().replace(/[^\d]/g, '');
        return parseFloat(strVal) || 0;
    };

    const handleInputChangeFormContrat = (e: any): void => {
    const fieldName: string = e.target.name;
    let fieldValue: string = e.target.value;
    
    const removeNonNumeric = (value: string | number): string => {
        const str = value.toString();
        return str.replace(/[^\d]/g, '');
    };
    
    const addSepartor = (value: string | number): string => {
        const numStr = removeNonNumeric(value);
        const num = parseFloat(numStr) || 0;
        return num.toLocaleString('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };

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

    // POUR AFFICHER LES CHAMPS EN FONCTION DE avecTva et miniMax
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
    
    const handleAddPpmExec = async(e: React.FormEvent) => {
        e.preventDefault();
        if(estEnModeModification || !lignePpmAExecuter?.idPpm) return ;

        setLoading(true);
        const retard = calculateDateDifferenceInDays( formulairePourExecuterLeContrat.dateLanceEffect.value as string, formulairePourExecuterLeContrat.dateLancementMarchePrevisionnel.value as string);

        try {
            const newPpmExec : PpmExecRequestDto = emptyPpmExecRequestDto;
            newPpmExec.idPpm = formulairePourExecuterLeContrat.idPpm.value; 
	        newPpmExec.idBudget = formulairePourExecuterLeContrat.idBudget.value; 
	        newPpmExec.exercice = formulairePourExecuterLeContrat.exercice.value; 
	        newPpmExec.nbLot = formulairePourExecuterLeContrat.nbLot.value; 
	        newPpmExec.num = formulairePourExecuterLeContrat.num.value; 
            newPpmExec.montantEstime = formulairePourExecuterLeContrat.montantEstime.value; 
	        newPpmExec.montDepEngNonLiq = formulairePourExecuterLeContrat.montDepEngNonLiq.value; 
	        newPpmExec.creditDispo = formulairePourExecuterLeContrat.creditDispo.value; 
	        newPpmExec.natPrestation = formulairePourExecuterLeContrat.natPrestation.value; 
	        newPpmExec.dateCreation = new Date().toISOString().substring(0, 10); 
	        newPpmExec.dateButoire = formulairePourExecuterLeContrat.dateButoire.value; 
	        newPpmExec.execution = true; 
	        newPpmExec.montantTtc = formulairePourExecuterLeContrat.montantTtc.value; 
	        newPpmExec.montantHtva = formulairePourExecuterLeContrat.montantHtva.value; 
	        newPpmExec.montantMaxTtc = extractNumber(formContrat.montantMaxTtc.value); 
	        newPpmExec.montantMaxHtva = extractNumber(formContrat.montantMaxHtva.value); 
	        newPpmExec.montantMinTtc = extractNumber(formContrat.montantMinTtc.value); 
	        newPpmExec.montantMinHtva = extractNumber(formContrat.montantMinHtva.value); 
	        newPpmExec.abrevMp = lignePpmAExecuter.abrevMp;
	
	        newPpmExec.objetLot = formulairePourExecuterLeContrat.objetLot.value; 
	        newPpmExec.idFourn = formulairePourExecuterLeContrat.idFourn.value; 
	        newPpmExec.montantAttrib = formulairePourExecuterLeContrat.montantAttrib.value; 
	        newPpmExec.dateNotificationProvisoire = formulairePourExecuterLeContrat.dateNotificationProvisoire.value; 
	        newPpmExec.dateApprobContrat = formulairePourExecuterLeContrat.dateApprobContrat.value; 
	        newPpmExec.niveauMiseEnOeuvreEtObservation = formulairePourExecuterLeContrat.niveauMiseEnOeuvreEtObservation.value; 
	        newPpmExec.dateReception = null; 
	        newPpmExec.dateLancementMarchePrevisionnel = lignePpmAExecuter?.dateLancement; 
	        newPpmExec.dateLanceEffect = formulairePourExecuterLeContrat.dateLanceEffect.value; 
            newPpmExec.nbJoursRetardLancement = retard; 
            newPpmExec.dateRemiseEtOuvertureDesPlis = formulairePourExecuterLeContrat.dateRemiseEtOuvertureDesPlis.value;

            const lignesPpmExecBudg : PpmExecBudgRequestDto[] = ligneBudgetaireSelectionnee.map(
                (ligne : any) => {
                    return {
                        idPpmExe : formulairePourExecuterLeContrat.idPpmExec.value,
                        idLot : formulairePourExecuterLeContrat.idLot.value,
                        idBudget : formulairePourExecuterLeContrat.idBudget.value,
                        exercice : formulairePourExecuterLeContrat.exercice.value,
                        codBud : ligne.codBud,
                        idSrceFin : ligne.idSrceFin,
                        montantEstime: ligne.presenteSaisi,

                        
                        montantMaxHtva : extractNumber(formContrat.montantMaxHtva.value),
                        montantMinHtva : extractNumber(formContrat.montantMinHtva.value),
                        montantMaxTtc : extractNumber(formContrat.montantMaxTtc.value),
                        montantMinTtc : extractNumber(formContrat.montantMinTtc.value),
                        avecTVA : formContrat.avecTva.value,
                        avecMiniMax : formContrat.avecMiniMax.value,
                    } as PpmExecBudgRequestDto;
                }
            )
            const finalPpmExecDto : PpmExecRequestDto = {
                ...newPpmExec,
                lignesBudgetaires : lignesPpmExecBudg
            } 
            await PpmExecService.add(finalPpmExecDto); 
            okSuccessDialog("Données enregistrées avec succès ");
            setTimeout(() => {window.location.reload()}, 2500); 
            
        } catch(e){
            okWarnignDialog("Erreur de soumission de l'exécution")
            console.error(e)
        } finally {
            setLoading(false)
        }
    }
    const handleEdit  =async ()=> {
        if(!selectedPpmExec){
            okWarnignDialog('Veuillez selectionner une ligne')
            return;
        }
        setEstEnModeModification(true);

        const { idPpmExec, idLot } = selectedPpmExec;
        if (!idPpmExec || !idLot ) {
         okWarnignDialog('Impossible de récupérer les identifiants complets du lot sélectionné.');
         return;
        }
        setLoading(true);
        try {
            const updatedPpmExec : PpmExecResponseDto  = await PpmExecService.get(idPpmExec,idLot,parseFloat(idBudget),parseFloat(gestionCourante));
            const lignesBudgResponse = await PpmExecBudgService.getLignesByLot(idPpmExec,idLot,parseFloat(idBudget),parseFloat(gestionCourante));
            const lignesBudgExistantes: any[] = lignesBudgResponse.data;

            const formatWithSeparator = (value: any): string => {
            if (!value && value !== 0) return '';
            const num = typeof value === 'string' 
                ? parseFloat(value.replace(/[^\d]/g, '')) 
                : Number(value);
            return isNaN(num) ? '' : num.toLocaleString('fr-FR');
            };


            setFormulairePourExecuterLeContrat({
                idPpm : {value: updatedPpmExec.idPpm},
                idPpmExec : {value: updatedPpmExec.idPpmExec},
                idBudget : {value: updatedPpmExec.idBudget},
                exercice : {value: updatedPpmExec.exercice},
                nbLot : {value: updatedPpmExec.nbLot},
                num : {value: updatedPpmExec.num},
                montantEstime : {value: updatedPpmExec.montantEstime},
                montDepEngNonLiq : {value: updatedPpmExec.montDepEngNonLiq},
                creditDispo : {value: updatedPpmExec.creditDispo},
                natPrestation : {value: updatedPpmExec.natPrestation},
                dateCreation : {value: updatedPpmExec.dateCreation},
                dateButoire : {value: updatedPpmExec.dateButoire},
                execution : {value: updatedPpmExec.execution},
                montantTtc : {value:updatedPpmExec.montantTtc},
                montantHtva : {value:updatedPpmExec.montantHtva},
                montantMaxTtc : {value:updatedPpmExec.montantMaxTtc},
                montantMaxHtva : {value:updatedPpmExec.montantMaxHtva},
                montantMinTtc : {value:updatedPpmExec.montantMinTtc},
                montantMinHtva : {value:updatedPpmExec.montantMinHtva},
                abrevMp : {value:updatedPpmExec.abrevMp},
            
                idLot: {value:updatedPpmExec.idLot},
                objetLot : {value:updatedPpmExec.objetLot},
                idFourn : {value:updatedPpmExec.idFourn},
                montantAttrib : {value:updatedPpmExec.montantAttrib},
                dateNotificationProvisoire : {value:updatedPpmExec.dateNotificationProvisoire},
                dateApprobContrat : {value:updatedPpmExec.dateApprobContrat},
                niveauMiseEnOeuvreEtObservation : {value:updatedPpmExec.niveauMiseEnOeuvreEtObservation},
                dateReception : {value:updatedPpmExec.dateReception},
                dateLancementMarchePrevisionnel : {value: updatedPpmExec.dateLancementMarchePrevisionnel},
                dateLanceEffect : {value:updatedPpmExec.dateLanceEffect},
                nbJoursRetardLancement : {value:updatedPpmExec.nbJoursRetardLancement},
                dateRemiseEtOuvertureDesPlis : {value: updatedPpmExec.dateRemiseEtOuvertureDesPlis}
            })

            const hasMinMax = updatedPpmExec.montantMinHtva > 0 || updatedPpmExec.montantMinTtc > 0;
            const hasTva = updatedPpmExec.montantMaxTtc > 0 && updatedPpmExec.montantMaxHtva > 0;
            setFormContrat({
            montantMaxHtva: { value: formatWithSeparator(updatedPpmExec.montantMaxHtva) },
            montantMinHtva: { value: formatWithSeparator(updatedPpmExec.montantMinHtva) },
            montantMaxTtc: { value: formatWithSeparator(updatedPpmExec.montantMaxTtc) },
            montantMinTtc: { value: formatWithSeparator(updatedPpmExec.montantMinTtc) },
            avecTva: { value: hasTva },
            avecMiniMax: { value: hasMinMax }
            });
            
            if (hasTva && !hasMinMax) {
            setDisableMontantMaxTtc(false);
            setDisableMontantMinHtva(true);
            setDisableMontantMinTtc(true);
            setMontantMaxHtvaLabel("HTVA :");
            setMontantMaxTtcLabel("TTC :");
            } else if (!hasTva && hasMinMax) {
            setDisableMontantMaxTtc(true);
            setDisableMontantMinHtva(false);
            setDisableMontantMinTtc(true);
            setMontantMaxHtvaLabel("Maximum HTVA :");
            } else if (hasTva && hasMinMax) {
            setDisableMontantMaxTtc(false);
            setDisableMontantMinHtva(false);
            setDisableMontantMinTtc(false);
            setMontantMaxHtvaLabel("Maximum HTVA :");
            setMontantMaxTtcLabel("Maximum TTC :");
            } else {
            setDisableMontantMaxTtc(true);
            setDisableMontantMinHtva(true);
            setDisableMontantMinTtc(true);
            setMontantMaxHtvaLabel("HTVA :");
            }

            const lignesASelectionner : any[] = lignesBudgExistantes.map(ligne => ({
                idPpmExe: ligne.idPpmExe, 
                idLot: ligne.idLot,
                idBudget: ligne.idBudget,
                exercice: ligne.exercice,
                codBud: ligne.codBud,
                idSrceFin: ligne.idSrceFin,
                montantEstime: ligne.montantEstime,
                idPpm: updatedPpmExec.idPpm,
                presenteSaisi: ligne.montantEstime,
            }))
            setLigneBudgetaireSelectionnee(lignesASelectionner)
            handleCloseModalPpmDejaExecuter();
            handleShowModalExecuterUnContrat();
        } catch (error) {
            okWarnignDialog('Erreur lors du chargement des données d\'exécution pour la modification.');
        }
        finally {
            setLoading(false);
        }
    }
    const handleEditPpmExecSubmit = async () => {
        if (!estEnModeModification ) {
        okWarnignDialog("Le formulaire n'est pas en mode modification");
        return;
        }

        const maxHtva = extractNumber(formContrat.montantMaxHtva.value);
        const minHtva = extractNumber(formContrat.montantMinHtva.value);

        if (minHtva > 0 && maxHtva > 0 && minHtva > maxHtva) {
        okWarnignDialog("Le Montant Minimum HTVA ne peut pas être supérieur au Montant Maximum HTVA");
        return;
        }
    
        setLoading(true); 

        const retard = calculateDateDifferenceInDays( 
            formulairePourExecuterLeContrat.dateLanceEffect.value as string, 
            formulairePourExecuterLeContrat.dateLancementMarchePrevisionnel.value as string
        );
        
        try {
            const newPpmExec : PpmExecRequestDto = emptyPpmExecRequestDto;
            newPpmExec.idPpm = formulairePourExecuterLeContrat.idPpm.value; 
	        newPpmExec.idBudget = formulairePourExecuterLeContrat.idBudget.value; 
	        newPpmExec.exercice = formulairePourExecuterLeContrat.exercice.value; 
	        newPpmExec.nbLot = formulairePourExecuterLeContrat.nbLot.value; 
	        newPpmExec.num = formulairePourExecuterLeContrat.num.value; 
            newPpmExec.montantEstime = formulairePourExecuterLeContrat.montantEstime.value; 
	        newPpmExec.montDepEngNonLiq = formulairePourExecuterLeContrat.montDepEngNonLiq.value; 
	        newPpmExec.creditDispo = formulairePourExecuterLeContrat.creditDispo.value; 
	        newPpmExec.natPrestation = formulairePourExecuterLeContrat.natPrestation.value; 
	        newPpmExec.dateButoire = formulairePourExecuterLeContrat.dateButoire.value; 
	        newPpmExec.execution = true; 
	        newPpmExec.montantTtc = formulairePourExecuterLeContrat.montantTtc.value; 
	        newPpmExec.montantHtva = formulairePourExecuterLeContrat.montantHtva.value; 
	        newPpmExec.montantMaxTtc = extractNumber(formContrat.montantMaxTtc.value); 
	        newPpmExec.montantMaxHtva = extractNumber(formContrat.montantMaxHtva.value); 
	        newPpmExec.montantMinTtc = extractNumber(formContrat.montantMinTtc.value); 
	        newPpmExec.montantMinHtva = extractNumber(formContrat.montantMinHtva.value); 
	
	        newPpmExec.objetLot = formulairePourExecuterLeContrat.objetLot.value; 
	        newPpmExec.idFourn = formulairePourExecuterLeContrat.idFourn.value; 
	        newPpmExec.montantAttrib = formulairePourExecuterLeContrat.montantAttrib.value; 
	        newPpmExec.dateNotificationProvisoire = formulairePourExecuterLeContrat.dateNotificationProvisoire.value; 
	        newPpmExec.dateApprobContrat = formulairePourExecuterLeContrat.dateApprobContrat.value; 
	        newPpmExec.niveauMiseEnOeuvreEtObservation = formulairePourExecuterLeContrat.niveauMiseEnOeuvreEtObservation.value; 
	        newPpmExec.dateReception = null; 
            newPpmExec.dateCreation = formulairePourExecuterLeContrat.dateCreation.value;
	        newPpmExec.dateLancementMarchePrevisionnel = formulairePourExecuterLeContrat.dateLancementMarchePrevisionnel.value; 
	        newPpmExec.dateLanceEffect = formulairePourExecuterLeContrat.dateLanceEffect.value; 
            newPpmExec.nbJoursRetardLancement = retard;
            newPpmExec.abrevMp = formulairePourExecuterLeContrat.abrevMp.value;
            newPpmExec.dateRemiseEtOuvertureDesPlis = formulairePourExecuterLeContrat.dateRemiseEtOuvertureDesPlis.value;
            const lignesPourSoumission : PpmExecBudgRequestDto[] = ligneBudgetaireSelectionnee.map(
                (ligne: any) => {
                    return {
                        idPpmExe: formulairePourExecuterLeContrat.idPpmExec.value, 
                        idLot: formulairePourExecuterLeContrat.idLot.value,
                        idBudget: formulairePourExecuterLeContrat.idBudget.value,
                        exercice: formulairePourExecuterLeContrat.exercice.value,
    
                        codBud: ligne.codBud,
                        idSrceFin: ligne.idSrceFin,
                        montantEstime: ligne.presenteSaisi,

                        montantMaxTtc : extractNumber(formContrat.montantMaxTtc.value), 
	                    montantMaxHtva : extractNumber(formContrat.montantMaxHtva.value), 
	                    montantMinTtc : extractNumber(formContrat.montantMinTtc.value), 
	                    montantMinHtva : extractNumber(formContrat.montantMinHtva.value),
                        avecTVA: formContrat.avecTva.value,
                        avecMiniMax: formContrat.avecMiniMax.value,
                    } as PpmExecBudgRequestDto;
                }
            );

            const finalPpmExecDto: PpmExecRequestDto = {
                ...newPpmExec,
                lignesBudgetaires : lignesPourSoumission
            };

            const idPpmExec = selectedPpmExec?.idPpmExec;
            const idLot = selectedPpmExec?.idLot;
            if (!idLot || !idBudget || !gestionCourante) {
            okWarnignDialog("Impossible d'identifier le lot");
            setLoading(false);
            return;
            }

            await PpmExecService.edit(idPpmExec,idLot,parseFloat(idBudget),parseFloat(gestionCourante), finalPpmExecDto);
            okSuccessDialog("Modification enregistrée avec succès");
            setTimeout(() => { window.location.reload() }, 2500); 
        } catch(e){
            okWarnignDialog("Erreur de soumission de la modification");
        } finally {
            setLoading(false);
        }
    }
    const getPpmByIdBudgetAndExercice = () => {
        PpmService.getByIdBudgetAndExercice(idBudget,gestionCourante).then(data => {setPpms(data)})
    }
    const getAllPpmExec =()=> {
        PpmExecService.getAll().then(data => { setPpmExecs(data)})
    }
    const getFournisseurs =()=> {
        DestinataireService.getAllFournisseurs().then(data => {
            setFournisseurs(data)
        })
    }
    const getAllCodSourceFin =()=> { 
        CodSourceFinService.getAll().then(data => setStokerCodSourceFin(data))
    }
    const getLigneBudgetaire =()=> {
        if(estEnModeModification){
            if(selectedPpmExec?.idPpm){
                PpmBudgService.getByIdPpm(selectedPpmExec?.idPpm).then(data => {
                    setStokerLigneBudgetaires(data)
                })
            } else {
                setStokerLigneBudgetaires([])
            }
        } else {
            if (lignePpmAExecuter?.idPpm) {
                PpmBudgService.getByIdPpm(lignePpmAExecuter?.idPpm).then(data => {
                    setStokerLigneBudgetaires(data)
                })
            } else {
                setStokerLigneBudgetaires([]);
            }
        }
        
    }
    const filterPpm = () : PpmResponseDto[] => {
        if (!rechercherUnPpm) {
            return ppms; 
        }
        return ppms.filter(ppm =>
            ppm.idPpm.toLowerCase().includes(rechercherUnPpm.toLowerCase())
        );
    }

    const intitFormulairePourExecuterLeContrat = () => {
    setFormulairePourExecuterLeContrat({
        idPpm : {value: lignePpmAExecuter?.idPpm},
        idPpmExec : {value: ''},
        idBudget : {value: lignePpmAExecuter?.idBudget},
        exercice : {value: lignePpmAExecuter?.exercice},
        nbLot : {value: lignePpmAExecuter?.nbLot},
        num : {value: lignePpmAExecuter?.num},
        montantEstime : {value: lignePpmAExecuter?.montantEstime},
        montDepEngNonLiq : {value: lignePpmAExecuter?.montDepEngNonLiq},
        creditDispo : {value: lignePpmAExecuter?.creditDispo},
        natPrestation : {value: lignePpmAExecuter?.natPrestation},
        dateCreation : {value: ''},
        dateButoire : {value: lignePpmAExecuter?.dateButoire},
        execution : {value:''},
        montantTtc : {value:''},
        montantHtva : {value:''},
        montantMaxTtc : {value:''},
        montantMaxHtva : {value:''},
        montantMinTtc : {value:''},
        montantMinHtva : {value:''},
        abrevMp : {value:''},
    
        idLot: {value:''},
        objetLot : {value:''},
        idFourn : {value:''},
        montantAttrib : {value:''},
        dateNotificationProvisoire : {value:''},
        dateApprobContrat : {value:''},
        niveauMiseEnOeuvreEtObservation : {value:''},
        dateReception : {value:''},
        dateLancementMarchePrevisionnel : {value: lignePpmAExecuter?.dateLancement},
        dateLanceEffect : {value:''},
        nbJoursRetardLancement : {value:''},
        dateRemiseEtOuvertureDesPlis: {value:''},
        })
    }
      
    const handleShowModalExecuterUnContrat = () => {
        setShowModalExecuterUnContrat(true);
    }
    const handleShowModalPpmDejaExecuter =()=> {setShowModalPpmDejaExecuter(true)};
    const handleCloseModalPpmDejaExecuter =()=> {setShowModalPpmDejaExecuter(false)};
    const handleShowModalAjoutDuneLigneBudgetaire =()=> {
        getLigneBudgetaire()
        setShowModalAjoutDuneLigneBudgetaire(true)
    };
    const handleCloseModalAjoutDuneLigneBudgetaire =()=> {setShowModalAjoutDuneLigneBudgetaire(false)};
    const handleShowModalChoisirUnFournisseur =()=> {setShowModalChoisirUnFournisseur(true)};
    const handleCloseModalChoisirUnFournisseur =()=> {setShowModalChoisirUnFournisseur(false)};
    const [ligneBudgetaireSelectionnee, setLigneBudgetaireSelectionnee ] = useState<any[]> ([]);
    const ajouterUneLigneBudgetaire =(row:any) =>{
        if(stokerIdppmAndCodBudAndIdSrceFin.includes(row.codBud)){
            okWarnignDialog("Cette ligne est déja sélectionner");
        }
        setLigneBudgetaireSelectionnee(prev => [
            ...prev,
            {
                idPpm : row.idPpm,
                codBud : row.codBud,
                idSrceFin : row.idSrceFin,
                montantEstime : parseFloat(row.montantEstime),
                presenteSaisi : parseFloat(row.montantEstime),
            }
        ])
        setStokerIdppmAndCodBudAndIdSrceFin((prev:any) => [...prev,row.codBud])
    }
    const retirerUneLigneBudgetaire =(row:any)=>{
        const retirerLigne = ligneBudgetaireSelectionnee.filter((item:any) =>  item.codBud !== row.codBud );
        //reactiver la ligne dans le premier tableau
        setStokerIdppmAndCodBudAndIdSrceFin((prev:any) => prev.filter((id:any) => id !== row.codBud));
        const newMontantEstime = retirerLigne.reduce((total,ligne) => total + ligne.presenteSaisi,0);
        setLigneBudgetaireSelectionnee(retirerLigne);
    }
    const gererPresenteSaisi =(e: React.ChangeEvent<HTMLInputElement>, row:any)=> {
        const saisieTexte = e.target.value;
        const valeurNumerique = parseFloat(saisieTexte.replace(/\s/g, ''));
        const ligneActuelle = ligneBudgetaireSelectionnee.find(item => item.codBud === row.codBud);
        if(ligneActuelle){
            const montantEstimeGlobal = parseFloat(ligneActuelle.montantEstime);
            if(valeurNumerique > montantEstimeGlobal){
                okWarnignDialog("La présente saisie doit être inférieur ou égale au montant estimé");
                return;
            }
            const updatedLines = ligneBudgetaireSelectionnee.map(item => 
                item.codBud === row.codBud ? {...item, presenteSaisi: valeurNumerique} : item
            )
            const nouveauMontantEstime = updatedLines.reduce((total,ligne) => total + (ligne.presenteSaisi ||0),0);
            setLigneBudgetaireSelectionnee(updatedLines)
            setMontantEstimeTotalPourLesLignesBudgetaires(nouveauMontantEstime);

            setFormulairePourExecuterLeContrat ((prev) => ({
                ...prev,
                montantAttrib : nouveauMontantEstime
            }))
            
        }
    }
    const formatNombre = (val: number | string): string => {
        const num = Number(String(val).replace(/\s/g, ''));
        return isNaN(num) ? '' : num.toLocaleString('fr-FR');
      };
    const validatePpmExecForm = async(isEditMode: boolean, currentPpmExecData: FormulairePpmExec, allExistingLots:PpmExecResponseDto[]) => {
        const montantEstimeGlobal = currentPpmExecData.montantEstime.value;
        const montantAttribPourCeLot = currentPpmExecData.montantAttrib.value;
        const nbLotPrevu = currentPpmExecData.nbLot.value;
        if(!isEditMode) {
            const lotsEnregistres = allExistingLots.length;
            if (lotsEnregistres >= nbLotPrevu){
                okWarnignDialog("Le nombre maximum de lots prévus a été atteint pour ce PPM");
                return false;
            }
        }
        // En mode édition, on exclut l'ancien montant du lot en cours de modification
        let lotsToSum = allExistingLots;
        if(isEditMode && selectedPpmExec) {
            const currentLotId = selectedPpmExec.idLot;
            lotsToSum = allExistingLots.filter(lot => lot.idLot !== currentLotId)
        }
        const montantAttribubCumuleDesAutresLots = lotsToSum.reduce((acc,lot) => {
            return acc + parseFloat(lot.montantAttrib as any|| 0);
        },0)

        const montantAttribActuel = parseFloat(montantAttribPourCeLot as any || 0);
        const nouveauMontantAttribTotal = montantAttribubCumuleDesAutresLots +montantAttribActuel;
        // Vérification de la contrainte : Total Attribué <= Montant Estime
        if(nouveauMontantAttribTotal > (montantEstimeGlobal as any)) {
            const montantRestantDisponible = (montantEstimeGlobal as any) - montantAttribubCumuleDesAutresLots;
            okWarnignDialog(`Le montant attribué cumulé (${nouveauMontantAttribTotal.toFixed(2)}) dépasse le montant estimé (${montantEstimeGlobal}). Montant maximum autorisé pour ce lot : ${montantRestantDisponible.toFixed(2)}`);
            return false;
        }
        return true;
    }
    const handleSubmitForm = async(e: React.FormEvent) => {
        e.preventDefault();
        
        const isEditMode = estEnModeModification;
        const idPpmKey = formulairePourExecuterLeContrat.idPpm.value; 

        if(!idPpmKey) {
            okWarnignDialog("idPPM manquant");
            return;
        }
        let allExistingLots: PpmExecResponseDto[] = [];
        try {
            allExistingLots = await PpmExecService.getAllLotsByIdPpmAndIdBudgetAndExercice(idPpmKey, parseFloat(idBudget), parseFloat(gestionCourante));
        } catch (error) {
            okWarnignDialog("Erreur lors de la récupération des lots existants pour la validation.");
            return;
        }

        const isValid = await validatePpmExecForm(isEditMode,formulairePourExecuterLeContrat,allExistingLots);
        if(!isValid) {
            return;
        }

        if (isEditMode) {
            await handleEditPpmExecSubmit();
        } else {
            await handleAddPpmExec(e);
        }
    };
    const handleDelete = async ()=> {
         if(!selectedPpmExec){
            okWarnignDialog('Veuillez selectionner une ligne')
            return;
        }
        const idPpmExec = selectedPpmExec?.idPpmExec;
        const idLot = selectedPpmExec?.idLot ;
        const exercice = selectedPpmExec?.exercice;

        try {
            if (!idPpmExec || !idLot) {
                okWarnignDialog('Impossible de récupérer les identifiants du lot sélectionné.');
                return;
            }

            await PpmExecService.delete(idPpmExec, idLot, parseFloat(idBudget), exercice);
            okSuccessDialog('Suppression effectuée');
            setTimeout(() => {
                getAllPpmExec();
                handleCloseModalPpmDejaExecuter();
            }, 500);
        } catch(error){

        }
    }
    const isDataReady = estEnModeModification ? selectedPpmExec : lignePpmAExecuter;
    
    const selectionnerFournisseur = (fournisseur : DestinataireResponseDto) => {
        setFormulairePourExecuterLeContrat(prev => ({
            ...prev,
            idFourn : {value: fournisseur.idDest}
        }))
        setFournisseurSelectionneNom(`${fournisseur.nom} (${fournisseur.ifumle})`);
        handleCloseModalChoisirUnFournisseur();
    }
    const filtrerFournisseurs =() : DestinataireResponseDto[] => {
        if(!rechercheFournisseur){
            return fournisseurs;
        }
        const termeRecherche = rechercheFournisseur.toLocaleLowerCase();
        return fournisseurs.filter(fournisseur => 
            fournisseur.nom.toLowerCase().includes(termeRecherche) || fournisseur.ifumle.toLowerCase().includes(termeRecherche) || fournisseur.idDest.toString().includes(termeRecherche)
        )
    }

    useEffect(()=> {
        getPpmByIdBudgetAndExercice()
        getAllPpmExec()
        getFournisseurs()
        getAllCodSourceFin()
        getLigneBudgetaire()
    },[])

    return (
        <Container>
            <div className="mt-1 p-1">
                <h6 className='shadow-sm rounded  text-primary text-center rounded'>CONTRATS &gt; PLAN DE PASSATION &gt;  MAJ / EXECUTION PHYSIQUE D'UN CONTRAT</h6>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <ButtonGroup>
                        <Button variant="outline-primary" title="Executer le PPM sélectionné" className="ms-2" onClick={() => handleExecuterUnPpm()} ><BsPencilSquare/>Exécuter</Button>
                        <Button variant="outline-primary" title="Voir déjà PPM exécuté " className="ms-2" onClick={handleShowModalPpmDejaExecuter}><RemoveRedEyeIcon/></Button>
                    </ButtonGroup>
                    <Form.Group controlId="searchPpm" style={{ width: '200px' }}>
                    <Form.Control
                        type="text"
                        placeholder="Filtrer par Code (idPPM)"
                        value={rechercherUnPpm}
                        onChange={(e) => setRechercherUnPpm(e.target.value)}
                    />
                    </Form.Group>
                </div>
                <div style={{width:'100%',maxWidth:'1050px',overflow:'auto' }}>
                    <DataTable
                        columns={executionDuPpmCol}
                        data={filterPpm()}
                        onRowClicked={(row:any)=> {
                            setLignePpmAExecuter(row)
                            }
                        }
                        fixedHeader
                        noDataComponent= {
                            <div className="text-center py-5 text-muted" > <p className='mt-2'>aucun enregistrement</p></div>
                        }
                        conditionalRowStyles={[
                            {
                                when: (row: PpmResponseDto) => row.idPpm === lignePpmAExecuter?.idPpm,
                                style: {
                                backgroundColor: '#ffc107', 
                                color: 'black',            
                                fontWeight: 'bold',         
                                '&:hover': {               
                                cursor: 'pointer',
                                backgroundColor: '#e0a800',
                                },
                                },
                            },
                        ]}
                        fixedHeaderScrollHeight="500px"
                        customStyles={costumeStyles}
                        highlightOnHover responsive
                    />
                </div>
            </div>
            {/** Modal pour execution du contrat */}
            <Modal show={showModalExecuterUnContrat} onHide={handleCloseModalExecuterUnContrat} backdrop="static" keyboard={false} size="xl" centered>
                <Modal.Header className='bg-light p-3' closeButton>
                </Modal.Header>
                <Form onSubmit={handleSubmitForm}>
                    <Modal.Body className="bg-light">
                        {isDataReady && (
                            <Card className="shadow-sm">
                                <Card.Body >
                                    <h6 className="fw-bold mb-3 text-primary">{estEnModeModification ? 'Modification de la ligne' : 'Exécution'} du PPM {estEnModeModification? selectedPpmExec?.idPpmExec : selectedPpm?.idPpm} </h6>
                                    <Row className="g-3">
                                        <Col md={2}>
                                            <Form.Group style={{fontSize:"0.80em"}}>
                                                <Form.Label>ID PPM</Form.Label>
                                                <Form.Control type="text" name="idPpm" value={formulairePourExecuterLeContrat.idPpm.value || ''}   disabled className="bg-light"/>   
                                            </Form.Group>
                                        </Col>
                                        <Col md={2}>
                                            <Form.Group style={{fontSize:"0.80em"}}>
                                                <Form.Label>Exercice</Form.Label>
                                                <Form.Control type="number" name="exercice" value={formulairePourExecuterLeContrat.exercice.value || ''} disabled className="bg-light"/>
                                            </Form.Group>
                                        </Col>
                                        <Col md={2}>
                                            <Form.Group style={{fontSize:"0.80em"}}>
                                                <Form.Label>Nombre de lots</Form.Label>
                                                <Form.Control type="number" name="nbLot" value={formulairePourExecuterLeContrat.nbLot.value}  disabled className="bg-light"/>
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group style={{fontSize:"0.80em"}}>
                                                <Form.Label>Nature de prestation</Form.Label>
                                                <Form.Control type="text" name="natPrestation" value={formulairePourExecuterLeContrat.natPrestation.value} disabled className="bg-light"/>
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group style={{fontSize:"0.80em"}}>
                                                <Form.Label>Montant Estimé</Form.Label>
                                                <Form.Control type="number" name="montantEstime" value={formulairePourExecuterLeContrat.montantEstime.value} disabled className="bg-light"/>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="g-3 mt-2">
                                        <Col md={3}>
                                            <Form.Group style={{fontSize:"0.80em"}}>
                                                <Form.Label>Date Butoire</Form.Label>
                                                <Form.Control type="date" name="dateButoire" value={formulairePourExecuterLeContrat.dateButoire.value} disabled className="bg-light"/>
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group style={{fontSize:"0.80em"}}>
                                                <Form.Label>ID Fournisseur</Form.Label>
                                                <div className="d-flex align-items-center">
                                                    <Form.Control
                                                        type="text"
                                                        value={fournisseurSelectionneNom || formulairePourExecuterLeContrat.idFourn.value}
                                                        readOnly
                                                        placeholder="Cliquez pour choisir un fournisseur"
                                                        onClick={handleShowModalChoisirUnFournisseur}
                                                        style={{cursor : 'pointer'}}
                                                        className="me-2"
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name="idFourn"
                                                        value={formulairePourExecuterLeContrat.idFourn.value}
                                                        readOnly
                                                    />
                                                </div>
                                                {/* <Form.Select
                                                name="idFourn"
                                                value={formulairePourExecuterLeContrat.idFourn.value || ''}
                                                onChange={handleInputChange}
                                                required
                                                >
                                                <option value="">
                                                    Sélectionner un fournisseur
                                                </option>
                                                {fournisseurs.map((fourn) => (
                                                    <option
                                                        key={fourn.idDest}
                                                        value={fourn.idDest.toString()}
                                                    >
                                                        {fourn.nom} ({fourn.ifumle})
                                                    </option>
                                                ))}
                                                </Form.Select> */}
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group style={{fontSize:"0.80em"}}>
                                                <Form.Label>Objet du lot</Form.Label>
                                                <Form.Control  type="text" name="objetLot" value={formulairePourExecuterLeContrat.objetLot.value || ''}  onChange={handleInputChange} required/>
                                            </Form.Group>
                                        </Col>
                                        <Col md={2}>
                                            <Form.Group style={{fontSize:"0.80em"}}>
                                                <Form.Label>Montant Attribué</Form.Label>
                                                <Form.Control type="number" name="montantAttrib" value={montantEstimeTotalPourLesLignesBudgetaires || ''} onChange={handleInputChange} readOnly disabled/>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* DATES */}
                                    <Row className="g-3 mt-2">
                                        <Col md={3}>
                                            <Form.Group style={{fontSize:"0.80em"}}>
                                                <Form.Label>Date Lancement Effective</Form.Label>
                                                <Form.Control 
                                                    type="date" 
                                                    name="dateLanceEffect" 
                                                    value={formulairePourExecuterLeContrat.dateLanceEffect.value || ''}
                                                    onChange={handleInputChange} required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group style={{fontSize:"0.80em"}}>
                                                <Form.Label>Date Approbation Contrat</Form.Label>
                                                <Form.Control 
                                                    type="date"
                                                    name="dateApprobContrat"
                                                    value={formulairePourExecuterLeContrat.dateApprobContrat.value || ''}
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group style={{fontSize:"0.80em"}}>
                                                <Form.Label>Date Notification Provisoire</Form.Label>
                                                <Form.Control 
                                                    type="date"
                                                    name="dateNotificationProvisoire"
                                                    value={formulairePourExecuterLeContrat.dateNotificationProvisoire.value || ''}
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group style={{fontSize:"0.80em"}}>
                                                <Form.Label>Date remise & ouverture des plis</Form.Label>
                                                <Form.Control 
                                                    type="date"
                                                    name="dateRemiseEtOuvertureDesPlis"
                                                    value={formulairePourExecuterLeContrat.dateRemiseEtOuvertureDesPlis.value || ''}
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    {/**lignes budgetaires */}
                                    <Card className="mt-4">
                                        <Card.Header className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold text-primary">Ligne Budgétaire</span>
                                        <Button variant="outline-success" title='Ajouter une  ligne budgétaire' size="sm" className='me-1' onClick={handleShowModalAjoutDuneLigneBudgetaire}>
                                            <BsPlusLg/>
                                        </Button>
                                        </Card.Header>
                                        <Card.Body className="p-1">
                                           <DataTable
                                                columns={tableauDeLigneBudgetaireColonne}
                                                data = {ligneBudgetaireSelectionnee}
                                                responsive
                                                customStyles={costumeStyles}
                                                noDataComponent={"Aucune ligne budgétaire sélectionnée "}
                                                fixedHeader
                                                fixedHeaderScrollHeight='150px' 
                                            /> 
                                        </Card.Body>
                                    </Card>
                                    <Row className="mt-3">
                                        <Col md={12}>
                                            <Form.Group style={{fontSize:"0.80em"}}>
                                                <Form.Label className="fw-bold">Niveau d'Exécution / Observations</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    name="niveauMiseEnOeuvreEtObservation"
                                                    value={formulairePourExecuterLeContrat.niveauMiseEnOeuvreEtObservation.value || ''}
                                                    onChange={handleInputChange} required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Card.Title style={{fontSize:"0.72em", marginBottom:"0px"}}>
                                        <span className="me-4">Montant :</span>
                                        <Form.Check name="avecTva" inline type="checkbox" label="AVEC TVA" checked={formContrat.avecTva.value} onChange={(e:any) => handleCheckboxInputChangeFormContrat(e)}></Form.Check>
                                        <Form.Check name="avecMiniMax" inline type="checkbox" label="Avec minimum et maximum" checked={formContrat.avecMiniMax.value} onChange={(e:any) => handleCheckboxInputChangeFormContrat(e)}></Form.Check>
                                    </Card.Title>
                                    <Row>
                                        <Col>
                                            { disableMontantMinHtva === false &&
                                            <Form.Group controlId="montantMinHtva" as={Row} className='mb-1'>
                                            <Col xs={3}><Form.Label className='label2'>Minimum HTVA :</Form.Label></Col>
                                            <Col><Form.Control name='montantMinHtva' value={formContrat.montantMinHtva.value} size='sm' type="text" onChange={e => handleInputChangeFormContrat(e)} /></Col>
                                            </Form.Group>
                                            }
                                            <Form.Group controlId="montantMaxHtva" as={Row}>
                                            <Col xs={3}><Form.Label className='label2'>{montantMaxHtvaLabel}</Form.Label></Col>
                                            <Col><Form.Control name='montantMaxHtva' value={formContrat.montantMaxHtva.value} size='sm' type="text" onChange={e => handleInputChangeFormContrat(e)} /></Col>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            { disableMontantMinTtc === false &&
                                            <Form.Group controlId="montantMinTtc" as={Row} className='mb-1'>
                                            <Col xs={3}><Form.Label className='label2'>Minimum TTC :</Form.Label></Col>
                                            <Col><Form.Control name='montantMinTtc' value={formContrat.montantMinTtc.value} size='sm' type="text" onChange={e => handleInputChangeFormContrat(e)} /></Col>
                                            </Form.Group>
                                            }
                                            { disableMontantMaxTtc === false &&
                                            <Form.Group controlId="montantMaxTtc" as={Row}>
                                            <Col xs={3}><Form.Label className='label2'>{montantMaxTtcLabel}</Form.Label></Col>
                                            <Col><Form.Control name='montantMaxTtc' value={formContrat.montantMaxTtc.value} size='sm' type="text" onChange={e => handleInputChangeFormContrat(e)} /></Col>
                                            </Form.Group>
                                            }
                                        </Col>
                                    </Row>
                            </Card.Body>
                            </Card>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="p-1">
                        <ButtonGroup>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Traitement...' : estEnModeModification ? 'Enregistrer la modification' : 'Exécuter'}
                            </Button>
                            <Button variant="secondary" onClick={estEnModeModification ? handleShowModalPpmDejaExecuter : handleCloseModalExecuterUnContrat} disabled={loading}>Annuler</Button>
                        </ButtonGroup>
                    </Modal.Footer>
                </Form>
                
                
            </Modal>
            {/** Modal pour afficher Ppm deja executer */}
            <Modal show={showModalPpmDejaExecuter} onHide={handleCloseModalPpmDejaExecuter} backdrop="static" keyboard={false} size="xl" centered>
                <Modal.Header className='bg-light p-3' closeButton>

                </Modal.Header>
                <Modal.Body>
                        <ButtonGroup>
                            <Button variant="outline-warning" title="Modifier" onClick={handleEdit} disabled={!selectedPpmExec}><BsPencilSquare/>Modifier</Button>
                            <Button variant="outline-danger" title="Supprimer" onClick={handleDelete}><BsTrash/></Button>
                        </ButtonGroup>
                        <div style={{width:'100%',maxWidth:'1050px',overflow:'auto' }}>
                            <DataTable
                                columns={ppmsDejaExecuterCol}
                                data={ppmExecs}
                                onRowClicked={(row: PpmExecResponseDto)=> setSelectedPpmExec(row)}
                                conditionalRowStyles={[
                                {
                                    when: (row: PpmExecResponseDto) => row.idPpmExec === selectedPpmExec?.idPpmExec,
                                    style: {
                                    backgroundColor: '#ffc107', 
                                    color: 'black',            
                                    fontWeight: 'bold',         
                                    '&:hover': {               
                                    cursor: 'pointer',
                                    backgroundColor: '#e0a800',
                                    },
                                    },
                                },
                                ]}
                                customStyles={costumeStyles}
                                noDataComponent= {
                                <div className="text-center py-5 text-muted" > <p className='mt-2'>aucun enregistrement</p></div>
                                }
                            />
                        </div>
                </Modal.Body>
                <Modal.Footer>
                    
                    <Button variant="secondary" onClick={handleCloseModalPpmDejaExecuter}>Fermer</Button>
                </Modal.Footer>
            </Modal>
            {/** modal pour choisir une ligne budgétaire */}
            <Modal show={showModalAjoutDuneLigneBudgetaire} onHide={handleCloseModalAjoutDuneLigneBudgetaire}  backdrop="static" keyboard={false} size="lg" centered>
                <Modal.Header className="bg-light p-3" closeButton>
                    <h6 className="m-0">Lignes budgétaires</h6>
                </Modal.Header>
                <Modal.Body>
                    <DataTable
                        columns={tableauPourChoisirLigneBudgetaireColonne}
                        data={stokerLigneBudgetaires}
                        customStyles={costumeStyles}
                        noDataComponent= {
                        <div className="text-center py-5 text-muted">
                            <i className="bi bi-exclamation-octagon fs-3"></i>
                            <p className="mt-2">Aucune ligne budgétaire disponible</p>
                        </div>
                        }
                        responsive 
                    />
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>
            {/** Modal pour afficher fournisseur */}
            <Modal show={showModalChoisirUnFournisseur} onHide={handleCloseModalChoisirUnFournisseur} backdrop="static" keyboard={false} size="lg" centered>
                <Modal.Header className="bg-light p-3" closeButton>
                    <h6 className="m-0">Sélectionner un fournisseur</h6>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Rechercher par nom,IFUMLE ou ID"
                            value={rechercheFournisseur}
                            onChange={(e) => setRechercheFournisseur(e.target.value)}
                            className="mb-3"
                        />
                    </Form.Group>
                    <div style={{  maxHeight: '400px', overflowY: 'auto' }}>
                        <DataTable
                            columns={tableauPourChoisirFournisseurColonne}
                            data={filtrerFournisseurs()}
                            customStyles={costumeStyles}
                            noDataComponent = {
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-exclamation-octagon fs-3"></i>
                                    <p className="mt-2">
                                    {rechercheFournisseur ? `Aucun fournisseur trouvé pour "${rechercheFournisseur}"`: "Aucun fournisseur disponible"}</p>
                                </div>    
                            }
                            responsive
                            highlightOnHover
                            pointerOnHover
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>
        </Container>
    )
}
export default ContratsPlanDePassationMajExecutionPhysiqueContratForm;