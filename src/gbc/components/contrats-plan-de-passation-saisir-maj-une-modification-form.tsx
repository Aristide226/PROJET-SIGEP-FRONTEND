//Aristide
import  { FunctionComponent, useEffect, useState } from 'react';
import { IdBudget,GestionProchaine,Gestion,ConnectedUser } from '../helpers/session-storage';
import { Button, ButtonGroup, Container, Form, Modal,Row,Col } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import PpmService from '../services/ppm-service';
import PpmBudgetService from '../services/ppm-budg-service';
import PpmModePassationService from '../services/ppm-mod-pass-service';
import PpmActeService from '../services/ppm-acte-service';
import DepensesPourPpmBudgetViewService from '../services/depenses-pour-ppm-budget-view-service';
import DepensesLignesBudgetaireEnFonctionDePpmViewService from '../services/depenses-lignes-budgetaire-en-fonction-de-ppm-view-service';
import { ppmActeRequestDto,ppmActeResponseDto,emptyPpmActeResponseDto} from "../models/ppm-acte";
import {PpmRequestDto, PpmResponseDto, emptyPpmRequestDto} from '../models/ppm';
import { PpmModPassRequestDto } from '../models/ppm-mod-pass';
import { CodSourceFinRequestDto } from '../models/cod-source-fin';
import CodSourceFinService from '../services/cod-source-fin-service';
import { BsInfoCircle, BsPencilSquare, BsPlusLg, BsTrash } from 'react-icons/bs';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import { Field } from '../../helpers/types';
import { costumeStyles } from '../../helpers/costume-styles';
import Swal from 'sweetalert2';
import { okSuccessDialog, okWarnignDialog } from '../../helpers/dialogs';
import FormattedInput from '../../helpers/formattedInput';
import bcrypt from 'bcryptjs-react';
import AccesCodeService from '../services/accesCodeService';
import { emptyPpmBudgRequestDto, PpmBudgRequestDto } from '../models/ppm-budget';

type FormulaireDuPPM= {
    code:any,
    natPrestation: Field,
    nblot:Field,
    modPassation: Field,
    dateLancement:  Field,
    dateRemise:  Field,
    tempNecessaireEva: Field,
    DateDemarrage:  Field,
    delaiExecution:  Field,
    dateButoire:  Field,
    financement:  Field,
    ligneCredit: Field,
    montantBudgetise:  Field,
    dispoaSaisir:  Field,
    presenteSaisi:  Field,
    montantEstime:  Field,
    depEngNonLiq: Field,
    creditDispo:  Field,  
    ream : Field
}
type FormulairePPMActe = {
  idPpmM: Field,
  gestion: Field ,
  quantieme: Field,
  dateModif: Field,
  motifModif: Field,
  acteAutorisation: Field,
  dateCreate: Field,
  userCreate: Field,
  dateUpdate: Field,
  userUpdate: Field,
  valide: Field,
  userValide: Field,
  dateValide: Field,
  idPpmMMP: Field,
  idBudget: Field,
  ppmOldIds: Field,
  ppmBudgOldIds: Field,
  idPpmMs: Field,
  idPpms: Field
}
const ContratsPlanDePassationSaisirMajUneModificationForm : FunctionComponent =()=>{
      /////////// DECLARATION DES TABLEAUX /////////////////
      const elaborationDuPPMColonne = [
        {name:'Code', selector:(row:any)=>row.idPpm },
        {name:'Montant estimé', selector:(row:any)=> row.montantEstime, format:(row:any)=>`${row.montantEstime.toLocaleString()} `},
        {name:'Mont Dep. Eng Non Liq', selector:(row:any)=> row.montDepEngNonLiq, format:(row:any) => `${row.montDepEngNonLiq.toLocaleString()} `},
        {name:'Crédit Disponible', selector:(row:any)=> row.creditDispo, format:(row:any)=> `${row.creditDispo.toLocaleString()} `},
        {name:'Nature prestation', selector:(row:any)=> row.natPrestation, grow:2, wrap:true},
        {name:'Nb lot', selector:(row:any)=> row.nbLot},
        {name:'Mode passation', selector:(row:any)=> row.abrevMp},
        {name:'Date de lancement', selector:(row:any)=> row.dateLancement},
        {name:'Date remise offres', selector:(row:any)=> row.dateRemiseOffre},
        {name:'Temps évaluation (jrs)', selector:(row:any)=> row.nbJrsEvaluation},
        {name:'Date prob. démar.', selector:(row:any)=> row.dateProbDemar},
        {name:'Délai Exécut° en jrs', selector:(row:any)=> row.delaiExecJrs},
        {name:'Date Effect Lancement', selector:(row:any)=> row.dateEffectLance, grow:0},
        {name:'Date Attribution', selector:(row:any)=> row.dateAttribution, grow:0},
        {name:'Montant attribution', selector:(row:any)=> row.montantPasse},
        {name:'Date butoire', selector:(row:any)=> row.dateButoire},
      ]
        
      const elaborationDuPPMLigneBudgetaireColonne = [
        {name: "Financement", selector: (row:any) => row.intituleCourt},
        {name:"Activité", selector:(row:any) => row.idPlan},
        {name: "Montant budgétisé", selector:(row:any) => `${row.disponible.toLocaleString()}`},
        {name: "Dispo à saisir", selector:(row:any) => `${row.disponibleASaisir.toLocaleString()}`},
        {name: "Présente saisie", selector:(row:any) => `${row.dejaSaisi.toLocaleString()}`}
      ]
        
      //tableau des lignes budgétaire
        const tableauDeLigneBudgetaireColonne =  [
        {name:"Financement", selector: (row:any )=> row.financement, 
          grow:1.5,
          cell: (row:any) => (
            <select className="form-select form-select-sm"
             aria-label="Small select example" 
             value={row.financement }
             style={{fontWeight:'bold'}}
             onChange={(e) => {
              const updated = ligneBudgetaireSelectionnee.map(l => 
                l.ligneCredit === row.ligneCredit ? {...l, financement: e.target.value} : l
              );
              setLigneBudgetaireSelectionnee(updated);
              }}
             >
              {stokerCodSourceFin.map(item => (
                <option value={item.cod5} key={item.cod5}> {item.intituleCourt} </option>
              ))}
            </select>
            )  
          },
        {name:"Ligne de crédits" , selector:(row:any) => row.ligneCredit},
        {name:"Montant budgétisé", selector:(row:any) => row.disponible, format:(row:any)=>`${row.disponible?.toLocaleString() }`},
        {name:"Disponible à saisir", selector:(row:any) => row.disponibleASaisir, format:(row:any)=> `${row.disponibleASaisir.toLocaleString()}` },
        {name:"Présente saisie",  
          cell:(row:any) => (
              <input type='text'  value={formatNombre(row.presenteSaisi)} onChange={(e)=>gererPresenteSaisi(e,row)} disabled={!isChampEditable('presenteSaisi',row)} style={{width:'150px'}}  />
          ), format:(row:any) => `${row.presenteSaisi.toLocaleString()}`
        },
        {name: "A annuler ", 
          cell:(row:any) => (
            <input type='text' value= {formatNombre(row.annulation)} onChange={(e) => gererAnnulation(e,row)} disabled={!isChampEditable('annulation',row)} style={{width:'150px'}}/>
          ), format:(row:any) => `${row.annulation.toLocaleString()}`
        },
        {name: "A ajouter",
          cell:(row:any) => (
            <input type='text' value={formatNombre(row.ajout)} onChange={(e) => gererAjout(e,row)} disabled={!isChampEditable('ajout',row)} style={{width:'150px'}}/>
          ), format:(row:any) => `${row.ajout.toLocaleString()}`},
        {name: "Action",
            cell: (row:any) =>(
              <Button variant='outline-danger' title='supprimer la ligne sélectionnée' size='sm' className='me-1'  onClick={()=>retirerLigneBudgetaire(row)}>
                <BsTrash/>
              </Button>
            )
        }  
      ];
      
      // tableau pour choisir les lignes budgétaires
      let tableauPourChoisirLigneBudgetaireColonne= [
        {name:"Cpte", selector: (row:any) => row.idPlan ,grow:0},
        {name:"Intitulé", selector: (row:any)=> row.intitule, grow:3, wrap:true},
        {name:"Montant budgétisé", selector:(row:any)=> row.disponible,grow:1, format:(row:any)=> `${row.disponible.toLocaleString()}`},
        {name:"Déjà saisie", selector:(row:any)=> row.dejaSaisi,grow:1, format:(row:any)=> `${row.dejaSaisi.toLocaleString()}`},
        {name:"Disponible à saisir", selector:(row:any)=> row.disponibleASaisir,grow:1, format:(row:any)=> `${row.disponibleASaisir.toLocaleString()}` },
        {name:"Action", grow:1,
          cell:(row:any)=> {
            const isDisabled = idPlanDesLignesSelectionne.includes(row.idPlan); //desactive la ligne après selection
            return (
              <Button size="sm" name="ajouterLigneBudgetaire"   onClick={()=>ajouterUneLigneBudgetaire(row)  } disabled={isDisabled} >Ajouter</Button>
            );
          } 
        }
      ] 
        
      //////////DECLARATIONS STATES 
      const [ppms,setPpms]= useState<PpmResponseDto[]>([]);
      const [depensesLignesBudgetaireEnFonctionDePpmView,setDepensesLignesBudgetaireEnFonctionDePpmView] = useState<any[]>([]);
      const [selectedPpmId, setSelectedPpmId] = useState<string > ();
      const [gestionCourante, setGestionCourante] = useState<string>(Gestion() ?? '');
      const [idBudget] = useState <string> (() => {
        const id = IdBudget();
        if (!id) return '';
        const num = parseInt(id);
        return num < 10 ? `0${num}` : `${num}`;
      })
      const [showModalAjoutDuneLigneDePPM,setShowModalAjoutDuneLigneDePPM] = useState(false)
      const [showModalAjoutDuneLigneBudgetaire, setShowModalAjoutDuneLigneBudgetaire] = useState(false);
      const [showModalSaisirModification, setShowModalSaisirModification] = useState(false);    
      const [ajouterUneLigneDePPM, setAjouterUneLigneDePPM]= useState<FormulaireDuPPM> ({
        code:{value:''},
        natPrestation:{value:''},
        nblot:{value:''},
        modPassation: {value:''},
        dateLancement:{value:''},
        dateRemise: {value:''},
        tempNecessaireEva:{value:''},
        DateDemarrage: {value:''},
        delaiExecution: {value:''},
        dateButoire: {value:''},
    
        financement: {value:''},
        ligneCredit: {value:''},
        montantBudgetise:{value:''},
        dispoaSaisir: {value:''},
        presenteSaisi: {value:''},
        montantEstime:{value:0},
        depEngNonLiq: {value:0},
        creditDispo: {value:0},
        ream: {value:0}
      })
      const [modPassation, setModPassation] = useState<PpmModPassRequestDto[]>([]);
      const [stokerCodSourceFin, setStokerCodSourceFin] = useState <CodSourceFinRequestDto[]> ([]);
      const [depensesPourPpmBudgetView,setDepensesPourPpmBudgetView] = useState<any[]> ([])
      const [idPlanDesLignesSelectionne, setIdPlanDesLignesSelectionne] = useState<Number[]> ([]);
      const [ligneBudgetaireSelectionnee, setLigneBudgetaireSelectionnee ] = useState<any[]> ([]);
      const [estEnModeModification,setEstEnModeModification] = useState (false);
      const [ppmActe, setPpmActe] = useState<ppmActeRequestDto[]> ([]);
      let  idPpmMToSaveInEditingMode : string ;
      const ppmActeValide = ppmActe.every(item => item.valide === true)
      const isDisabled = ppmActeValide;
      const [budget, setBudget] = useState<Array<{idPlan:any, codBud:string}>> ([]);
      const afficherLigneBudgEnFonctionDePpm = [
        {
          when: (row: any) => row.idPpm === selectedPpmId,
          style: {
            backgroundColor: '#d0f0fd',
            color: '#000',
            fontWeight: 'bold',
            boxShadow: '0 0 5px rgba(0, 123, 255, 0.5)',
          },
        },
      ];
      const username = ConnectedUser();
      const [ppmActeForm,setPpmActeForm] = useState<FormulairePPMActe> ({
        idPpmM: {value: ''},
        gestion: {value: ''} ,
        quantieme: {value: ''},
        dateModif: {value: ''},
        motifModif: {value: ''},
        acteAutorisation: {value: ''},
        dateCreate: {value: ''},
        userCreate: {value: ''},
        dateUpdate: {value: ''},
        userUpdate: {value: ''},
        valide: {value: ''},
        userValide: {value: ''},
        dateValide: {value: ''},
        idPpmMMP: {value: ''},
        idBudget: {value: ''},
        ppmOldIds: {value: ''},
        ppmBudgOldIds: {value: ''},
        idPpmMs: {value: ''},
        idPpms: {value: ''}
      })
      const [showPdfModal, setShowPdfModal] = useState(false);
      const [pdfUrl,setPdfUrl] = useState('')
     
      ///////////DECLARATIONS DES FONCTIONS
      const formateDateCreate = (d : string) : string => {
        const date = new Date(d);
        const jour = date.getDate().toString().padStart(2,'0');
        const mois = (date.getMonth() + 1).toString().padStart(2,'0');
        const annee = date.getFullYear();
        const heures = date.getHours().toString().padStart(2,'0');
        const minutes = date.getMinutes().toString().padStart(2,'0');
        return `${annee}-${mois}-${jour} ${heures}:${minutes}`;
      }
      const formateDateModif =(d:string): string => {
        const date = new Date(d);
        const jour = date.getDate().toString().padStart(2, '0');
        const mois = (date.getMonth() + 1).toString().padStart(2, '0');
        const annee = date.getFullYear();
        return `${annee}-${mois}-${jour}`
      }
      
      const initAjouterUneLigneDePPM= ()=>{
        setAjouterUneLigneDePPM({
          code:{value:''},
          natPrestation:{value:''},
          nblot:{value:''},
          modPassation: {value:''},
          dateLancement:{value:''},
          dateRemise: {value:''},
          tempNecessaireEva: {value: ''},
          DateDemarrage: {value:''},
          delaiExecution: {value:''},
          dateButoire: {value: `${gestionCourante}-12-31`},
          financement: {value:''},
          ligneCredit: {value:''},
          montantBudgetise:{value:''},
          dispoaSaisir: {value:''},
          presenteSaisi: {value:''},
          montantEstime:{value:0},
          depEngNonLiq: {value:0},
          creditDispo: {value:0},
          ream:{value:0}
        })
      }
      const initLigneBudgetaireSelectionner =()=> {
        setLigneBudgetaireSelectionnee([])
      }
      const initModifierPpmActe =()=> {
        setPpmActeForm({
          idPpmM: {value: ''},
          gestion: {value: ''} ,
          quantieme: {value: ``},
          dateModif: {value: ``},
          motifModif: {value: ``},
          acteAutorisation: {value: ''},
          dateCreate: {value: ``},
          userCreate: {value: ''},
          dateUpdate: {value: ''},
          userUpdate: {value: ''},
          valide: {value: ''},
          userValide: {value: ''},
          dateValide: {value: ''},
          idPpmMMP: {value: ''},
          idBudget: {value: ''},
          ppmOldIds: {value: ''},
          ppmBudgOldIds: {value: ''},
          idPpmMs: {value: ''},
          idPpms: {value: ''}
        })
      }
      //gerer les entrées du formulaire
      const handleInputChangeAjouterUneLigneDePPM = (e:any):void =>{
        const fieldName: string= e.target.name;
        const fieldValue: string= e.target.value;
        const newField: Field= {[fieldName]: {value: fieldValue}, error:'', isValid:true};
        setAjouterUneLigneDePPM({...ajouterUneLigneDePPM,...newField} );

        //Si le champ modifié est modPassation
        if(fieldName==='modPassation'){
          const selectedMode = modPassation.find(item => item.abrevMp === fieldValue);
          
          //mettre à jour le formulaire avec le temps nécessaire
          setAjouterUneLigneDePPM(prev =>({
            ...prev,
            ...newField,//met à jour le champ modPassation
            tempNecessaireEva :{value: selectedMode?.jrsNecessaireEvalua || '', error:'', isValid:true}
          }))
        }
        //mettre à jours le formulaire avec la date de remise
        else if(fieldName==='dateLancement'){
          const selectedMode = modPassation.find(item => item.abrevMp === ajouterUneLigneDePPM.modPassation.value);
            if(fieldValue && selectedMode){
              const dateLancement = new Date(fieldValue);
              const dateRemise = new Date(dateLancement);

              dateRemise.setDate(dateLancement.getDate() + selectedMode.jrsLancemtRemisO);

              setAjouterUneLigneDePPM( prev=>({
                ...prev, ...newField, dateRemise:{value: dateRemise.toISOString().split('T')[0]} , error:'', isValid:true 
              }))
            } else{
              setAjouterUneLigneDePPM (prev =>({
                ...prev, ...newField
              }))
            }   
        }
          else{
          setAjouterUneLigneDePPM(prev => ({
            ...prev,
            ...newField
          }));
        }
 
      }
      const handleInputChangeModifierPpmActe = (e:any):void =>{
        const fieldName: string = e.target.name;
        const fieldValue: string = e.target.value;
        const newField : Field = {[fieldName]: {value: fieldValue}, error: '', isValid:true};
        setPpmActeForm({...ppmActeForm,...newField});
      }
      
      const boutonPourAjoutDuneLigneDePpm = async ()=>{
        setEstEnModeModification(false)
        initAjouterUneLigneDePPM()
        creerActe() 
        handleShowModalAjoutDuneLigneDePPM() 
      }
      const creerActe = async()=> {
        const list = await PpmActeService.getByGestionAndIdBudget(gestionCourante,idBudget);
        const aDesActes = list.length > 0;
        const tousValides = list.every(item => item.valide === true);
        
        if( !aDesActes || tousValides){
          handleCloseModalAjoutDuneLigneDePPM()
          Swal.fire({
            title: 'GesBud',
            html: "Aucune modifiaction n'est en cours.<br>Voulez-vous en créer ?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
            allowOutsideClick: false,
            confirmButtonColor: '#007E33' 
          }).then((result) => {
            if(result.isConfirmed){
              const newActe:ppmActeResponseDto = emptyPpmActeResponseDto;
              newActe.gestion = gestionCourante;
              newActe.quantieme = `${Math.max(...list.map(p => p.quantieme)) + 1}`;
              newActe.dateModif = new Date().toISOString().split('T')[0];
              newActe.motifModif = "(A SAISIR)";
              newActe.acteAutorisation= "";
              newActe.dateCreate= new Date();
              newActe.userCreate = username;
              newActe.dateUpdate = new Date();
              newActe.userUpdate = username;
              newActe.valide = false;
              newActe.userValide = null;
              newActe.dateValide= new Date();
              newActe.idPpmMMP = null;
              newActe.idBudget = IdBudget();
              newActe.ppmOldIds = [];
              newActe.ppmBudgOldIds = [];
              newActe.idPpmMs = [];
              newActe.idPpms = [];
              PpmActeService.add(newActe).then((data)=> {
                window.location.reload()
              });  
            }
          });
        }else {
          const acteInvalide = list.find(item => item.valide === false);
          if(acteInvalide){
            setPpmActeForm({
              ...ppmActeForm,
              quantieme: {value: acteInvalide.quantieme},
              dateModif: {value: formateDateModif(acteInvalide.dateModif)},
              motifModif: {value:acteInvalide.motifModif},
              dateCreate: {value: formateDateCreate(acteInvalide.dateCreate)},
            })
          } 
        }
      }
      const handleCloseModalAjoutDuneLigneDePPM=()=>{ 
        initLigneBudgetaireSelectionner();
        setShowModalAjoutDuneLigneDePPM(false)
      }; 
      const handleShowModalAjoutDuneLigneDePPM=()=>{ setShowModalAjoutDuneLigneDePPM(true) };  
      const handleShowModalAjoutDuneLigneBudgetaire =()=> { setShowModalAjoutDuneLigneBudgetaire(true)};
      const handleCloseModalAjoutDuneLigneBudgetaire =()=> {setShowModalAjoutDuneLigneBudgetaire(false)}; 
      const handleShowModalSaisirModification =() => {setShowModalSaisirModification(true)};
      const handleCloseModalSaisirModification= () => {setShowModalSaisirModification(false)}
      const validateForm =():boolean =>{
        let isValid = true

        //natPrestation
        if (ajouterUneLigneDePPM.natPrestation.value===""){
            const errorMsg:string = "Nature prestation obligatoire";
            const newField:Field = {value: ajouterUneLigneDePPM.natPrestation.value, error:errorMsg, isValid:false};
            setAjouterUneLigneDePPM(prev=>({...prev, natPrestation:newField}))
            isValid =false;
        }
        //nblot
        if(ajouterUneLigneDePPM.nblot.value===''){
          const errorMsg:string = "nombre de lots obligatoire";
          const newField: Field = {value:ajouterUneLigneDePPM.nblot.value , error:errorMsg, isValid:false};
          setAjouterUneLigneDePPM (prev => ({...prev, nblot:newField}));
          isValid = false;
    
        }
        //modPassation
        if(ajouterUneLigneDePPM.modPassation.value===""){
          const errorMsg: string= " Mode de passation obligatoire";
          const newField:Field = {value: ajouterUneLigneDePPM.modPassation.value, error:errorMsg, isValid:false};
          setAjouterUneLigneDePPM(prev=> ({...prev, modPassation:newField}));
          isValid= false;
        }
        //dateLancement
        if (ajouterUneLigneDePPM.dateLancement.value=== ""){
          const errorMsg : string = "date de lancement obligatoire";
          const newField:Field = {value: ajouterUneLigneDePPM.dateLancement.value, error: errorMsg, isValid:false};
          setAjouterUneLigneDePPM(prev=>({...prev, dateLancement:newField}));
          isValid = false;

        }
        //dateRemise
        if(ajouterUneLigneDePPM.dateRemise.value===''){
          const errorMsg: string = "date de remise obligatoire";
          const newField: Field = {value:ajouterUneLigneDePPM.dateRemise.value, error:errorMsg, isValid:false};
          setAjouterUneLigneDePPM(prev=>({...prev, dateRemise:newField}));
          isValid = false;
         
        }   
        //tempNecessaireEva
        if(ajouterUneLigneDePPM.tempNecessaireEva.value===''){
          const errorMsg:string = "temps nécéssaire à l'évaluation obligatoire";
          const newField:Field = {value:ajouterUneLigneDePPM.tempNecessaireEva.value, error:errorMsg, isValid:false};
          setAjouterUneLigneDePPM(prev=>({...prev, tempNecessaireEva:newField}));
          isValid = false;
        } 
        //DateDemarrage
        if(ajouterUneLigneDePPM.DateDemarrage.value===''){
          const errorMsg:string = "date de démarrage obligatoire";
          const newField: Field = {value: ajouterUneLigneDePPM.DateDemarrage.value, error:errorMsg, isValid:false};
          setAjouterUneLigneDePPM(prev=>({...prev, DateDemarrage:newField}));
          isValid = false;
        } 
        //delaiExecution
        if(ajouterUneLigneDePPM.delaiExecution.value===''){
          const errorMsg: string = " delai d'exécution obligatoire ";
          const newField :Field = {value: ajouterUneLigneDePPM.delaiExecution.value, error:errorMsg, isValid: false };
          setAjouterUneLigneDePPM(prev=>({...prev, delaiExecution:newField}));
          isValid = false;
        }
        //dateButoire
        if(ajouterUneLigneDePPM.dateButoire.value=== ''){
          const errorMsg: string = "date butoire obligatoire";
          const newField : Field= {value:ajouterUneLigneDePPM.dateButoire.value, error:errorMsg, isValid:false};
          setAjouterUneLigneDePPM(prev=>({...prev, dateButoire:newField}));
          isValid = false;
        } 
        //creditDispo
        if(ajouterUneLigneDePPM.creditDispo.value <0){
          const errorMsg: string = "crediDispo doit être positif";
          const newField : Field= {value:ajouterUneLigneDePPM.creditDispo.value, error:errorMsg, isValid:false};
          setAjouterUneLigneDePPM(prev=>({...prev, creditDispo:newField}));
          isValid = false;
        } 

        //montantEstime
        if(ajouterUneLigneDePPM.montantEstime.value === ''){
          const errorMsg: string = "montant estime obligatoire";
          const newField : Field = {value:ajouterUneLigneDePPM.montantEstime.value, error:errorMsg,isValid:false};
          setAjouterUneLigneDePPM(prev=> ({...prev, montantEstime:newField}));
          isValid = false;
        }

        return isValid;

      }
      const formatNombre = (val: number | string): string => {
        const num = Number(String(val).replace(/\s/g, ''));
        return isNaN(num) ? '' : num.toLocaleString('fr-FR');
      };

      const ajouterUneLigneBudgetaire = (row : any) => {

        const ligneBudgetaire = budget.find(item => item.idPlan === row.idPlan);
        const codBud = ligneBudgetaire?.codBud;

        setLigneBudgetaireSelectionnee(prev => [
          ...prev,
          {
            financement : row.financement,
            ligneCredit : row.idPlan,
            disponible : parseFloat(row.disponible),
            disponibleASaisir : parseFloat(row.disponibleASaisir),
            presenteSaisi : parseFloat(row.disponibleASaisir),
            codBud : codBud,
            annulation : parseFloat(row.annulation),
            ajout : parseFloat(row.ajout)
          }
        ])
        //désactiver la ligne dans le premier tableau
        setIdPlanDesLignesSelectionne(prev => [...prev, row.idPlan])
        setAjouterUneLigneDePPM((prev) => ({
          ...prev,
          montantEstime : {value : prev.montantEstime.value + parseFloat(row.disponibleASaisir)},
          depEngNonLiq : {value : prev.depEngNonLiq.value},
          creditDispo : {value : prev.montantEstime.value + parseFloat(row.disponibleASaisir)}
        }))
      }
      
      const retirerLigneBudgetaire = (row : any) => {
        const retirerLigne = ligneBudgetaireSelectionnee.filter(item => item.ligneCredit !== row.ligneCredit);
        //réactiver la ligne dans le deuxième tableau
        setIdPlanDesLignesSelectionne(prev => prev.filter(id => id !== row.ligneCredit));
        const newMontantEstime = retirerLigne.reduce((total,ligne) => total + ligne.presenteSaisi,0);
        setLigneBudgetaireSelectionnee(retirerLigne);
        setAjouterUneLigneDePPM((prev) => ({
          ...prev,
          montantEstime : {value : newMontantEstime},
          depEngNonLiq : {value : 0},
          creditDispo: {value: newMontantEstime}
        }))
      }
      
      const mettreAJourLigneBudgetaire = (ligneCredit : string, champ : string, valeur : number) => {
        return ligneBudgetaireSelectionnee.map(item => 
          item.ligneCredit === ligneCredit ? { ...item, [champ] : valeur } : item
        )
      }

      const recalculerTotauxPPM = (lignes: any[]) => {
        const totalPresenteSaisi = lignes.reduce((total, ligne) => total + (ligne.presenteSaisi || 0), 0);
        const totalAjout = lignes.reduce((total, ligne) => total + (ligne.ajout || 0), 0);
        const totalAnnulation = lignes.reduce((total, ligne) => total + (ligne.annulation || 0), 0);

        return {
          montantEstime: totalPresenteSaisi + totalAjout - totalAnnulation,
          creditDispo: totalPresenteSaisi + totalAjout - totalAnnulation,
          ream: totalAjout > 0 ? totalAjout : -totalAnnulation,
        }
      }

      const gererPresenteSaisi = (e: React.ChangeEvent<HTMLInputElement>, row: any) => {
        const valeur = parseFloat(e.target.value.replace(/\s/g, ''));
        const ligne = ligneBudgetaireSelectionnee.find(l => l.ligneCredit === row.ligneCredit);
      
        if (!ligne) return;
      
        const disponibleASaisir = parseFloat(ligne.disponibleASaisir);
        if (valeur > disponibleASaisir) {
          okWarnignDialog('La présente saisie doit être inférieure ou égale au disponible à saisir');
          return;
        }
      
        const lignesMaj = mettreAJourLigneBudgetaire(row.ligneCredit, 'presenteSaisi', valeur);
        const totaux = recalculerTotauxPPM(lignesMaj);
      
        setLigneBudgetaireSelectionnee(lignesMaj);
        setAjouterUneLigneDePPM(prev => ({
          ...prev,
          montantEstime: { value: totaux.montantEstime },
          depEngNonLiq: { value: 0 },
          creditDispo: { value: totaux.creditDispo }
        }));
      };

      const gererAnnulation = (e: React.ChangeEvent<HTMLInputElement>, row : any) => {
        const valeur = parseFloat(e.target.value.replace(/\s/g, ''));
        const ligne = ligneBudgetaireSelectionnee.find(l => l.ligneCredit === row.ligneCredit);
        if (!ligne) return;

        const presenteSaisi = parseFloat(ligne.presenteSaisi);
        if(valeur > presenteSaisi) {
          okWarnignDialog("L'annulation doit être inférieure ou égale à la présente saisie");
          return;
        }

        const lignesMaj = mettreAJourLigneBudgetaire(row.ligneCredit, 'annulation', valeur);
        const totaux = recalculerTotauxPPM(lignesMaj);

        setLigneBudgetaireSelectionnee(lignesMaj);
        setAjouterUneLigneDePPM(prev => ({
          ...prev,
          montantEstime : { value : totaux.montantEstime},
          depEngNonLiq : { value : 0},
          ream : { value : -valeur},
          creditDispo : { value : totaux.creditDispo }
        }))
      }

      const gererAjout = (e: React.ChangeEvent<HTMLInputElement>, row: any) => {
        const valeur = parseFloat(e.target.value.replace(/\s/g, ''));
        const ligne = ligneBudgetaireSelectionnee.find(l => l.ligneCredit === row.ligneCredit);
        if (!ligne) return;
      
        const reste = parseFloat(ligne.disponibleASaisir) - parseFloat(ligne.presenteSaisi);
        if (valeur > reste) {
          okWarnignDialog("L'ajout doit être inférieur ou égal au disponible à saisir");
          return;
        }
      
        const lignesMaj = mettreAJourLigneBudgetaire(row.ligneCredit, 'ajout', valeur);
        const totaux = recalculerTotauxPPM(lignesMaj);

        setLigneBudgetaireSelectionnee(lignesMaj);
        setAjouterUneLigneDePPM(prev => ({
          ...prev,
          montantEstime: { value: totaux.montantEstime },
          depEngNonLiq: { value: 0 },
          ream: { value: valeur },
          creditDispo: { value: totaux.creditDispo }
        }));
      };

      const isChampEditable = (champ: 'presenteSaisi' | 'ajout' | 'annulation', ligne: any):boolean => {
        if(!estEnModeModification) {
          return champ === 'presenteSaisi'
        }
        if(estEnModeModification && ligne.estNouvelleLigneBudgetaire) {
          return champ === 'presenteSaisi'
        }
        return champ === 'ajout' || champ === 'annulation'
      }

      /////fonction pour recuperer les lignes budgétaires en fonction des ppms
      const getLigneBudgetaireEnFonctionDePpm = () => {
        if(selectedPpmId){
          DepensesLignesBudgetaireEnFonctionDePpmViewService.getByGestionAndIdBudgetAndIdPpm(gestionCourante,idBudget,selectedPpmId)
          .then(data => {
            setDepensesLignesBudgetaireEnFonctionDePpmView(data)
          })
        }
      }

      const getByIdBudgetAndExercice =()=> {
        PpmService.getByIdBudgetAndExercice(idBudget,gestionCourante).then(data => {
          setPpms(data)
        })
      }
      const getAllPpmModPass =()=> {
        PpmModePassationService.getAll().then(data => setModPassation(data))
      }
      const getAllCodSourceFin =()=> { 
        CodSourceFinService.getAll().then(data => setStokerCodSourceFin(data))
      }
      const getPpmActe =()=> {
        PpmActeService.getByGestionAndIdBudget(gestionCourante,idBudget).then((data => {
          setPpmActe(data)
        }))
      }
      const getLigneBudgetaire =()=> {
        DepensesPourPpmBudgetViewService.getByGestionAndIdBudget(gestionCourante,idBudget)
        .then(data => {
          const formattedData = data.map((item) => {
            return {
              ...item,
              dejaSaisi: item.dejaSaisi,
              dispoASaisir: item.disponibleASaisir,
              isVisible: item.disponibleASaisir > 0
            }
          }).filter(x => x.isVisible);
          setDepensesPourPpmBudgetView(formattedData);
          setBudget(data);
          setIdPlanDesLignesSelectionne([])
        })
      } 

      const handleClosePdfModal =()=> {
        if(pdfUrl) {
          window.URL.revokeObjectURL(pdfUrl)
        }
        setPdfUrl('');
        setShowPdfModal(false)
      }
      //fonction pour générer le code
      const genererCode = (idBudget: string, gestionCourante: string, compteur: number): string => {
        return `${idBudget}.${gestionCourante}.${compteur.toString().padStart(2, '0')}`;
      }

      const enregistrerUneLigneDePpm = async(e : React.FormEvent)=> {
        e.preventDefault();
        if(!validateForm()){
          okWarnignDialog('Veuillez remplir tous les champs')
          return
        };
        if(!ligneBudgetaireSelectionnee || ligneBudgetaireSelectionnee.length === 0) {
          okWarnignDialog("Veuillez sélectionner au moins une ligne budgétaire");
          return;
        }
        const list = await PpmActeService.getByGestionAndIdBudget(gestionCourante,idBudget);
        const acteInvalide = list.find(item => item.valide === false);
        
        if (!acteInvalide) {
          okWarnignDialog('Ce PPM est déjà validé et ne peut pas être modifié')
        } else {
        try {
          const nextNum = await PpmService.getNextNum(
            parseInt(idBudget),
            parseInt(gestionCourante)
          )
          const code = genererCode(idBudget,gestionCourante,nextNum)
          setAjouterUneLigneDePPM((prev) => ({
          ...prev,
          code: {value:code}
          }))
  
          const newPpm : PpmRequestDto = emptyPpmRequestDto;
          newPpm.idPpm = code;
          newPpm.idBudget = parseInt(idBudget);
          newPpm.exercice = parseInt(gestionCourante);
          newPpm.num = nextNum;
          newPpm.montantEstime = ajouterUneLigneDePPM.montantEstime.value;
          newPpm.montDepEngNonLiq = ajouterUneLigneDePPM.depEngNonLiq.value;
          newPpm.creditDispo = ajouterUneLigneDePPM.creditDispo.value;
          newPpm.natPrestation = ajouterUneLigneDePPM.natPrestation.value;
          newPpm.nbLot = ajouterUneLigneDePPM.nblot.value;
          newPpm.abrevMp = ajouterUneLigneDePPM.modPassation.value;
          newPpm.dateLancement = ajouterUneLigneDePPM.dateLancement.value;
          newPpm.dateRemiseOffre = ajouterUneLigneDePPM.dateRemise.value;
          newPpm.nbJrsEvaluation = ajouterUneLigneDePPM.tempNecessaireEva.value;
          newPpm.dateProbDemar = ajouterUneLigneDePPM.DateDemarrage.value;
          newPpm.delaiExecJrs = ajouterUneLigneDePPM.delaiExecution.value;
          newPpm.dateButoire = ajouterUneLigneDePPM.dateButoire.value;
          newPpm.dateEffectLance = null;
          newPpm.dateAttribution = null;
          newPpm.montantPasse = 0;
          newPpm.idPpmM = acteInvalide.idPpmM;
          newPpm.ream = ajouterUneLigneDePPM.montantEstime.value;
          await PpmService.addReam(newPpm).then(data => {
          })
          //enregistrement de lignes budgétaires une par une
          for(const ligne of ligneBudgetaireSelectionnee){
            const newLine : PpmBudgRequestDto = emptyPpmBudgRequestDto;
            newLine.idPpm = code;
            newLine.codBud = ligne.codBud;
            newLine.idSrceFin = (ligne.financement || '00').toString().padStart(2, '0');
            newLine.montantEstime = ligne.presenteSaisi;
            newLine.ream = true;
            await PpmBudgetService.addReam(newLine).then(data => {
            })
          }
          setLigneBudgetaireSelectionnee([]);
          setIdPlanDesLignesSelectionne([]);
          initAjouterUneLigneDePPM();
          initModifierPpmActe();
          okSuccessDialog('Données enregistrées avec succès')
          setTimeout(() => {
            window.location.reload() 
          }, 2500);    
        }
        catch(error){
          okWarnignDialog("Impossible d'envoyer les données, Veuillez réessayer")
        }    
      }
      }
      const modifierUneLigneDePpm = async (idPpm:any) => {
        if(!selectedPpmId || selectedPpmId === ''){
          okWarnignDialog('Veuillez selectionner une ligne')
          return;
        }
        try{
          setEstEnModeModification(true);
          const ppmData = await PpmService.get(idPpm);
          idPpmMToSaveInEditingMode = ppmData.idPpmM;
          setAjouterUneLigneDePPM({
            code: {value: ppmData.idPpm},
            natPrestation:{value: ppmData.natPrestation},
            nblot:{value: ppmData.nbLot},
            modPassation: {value: ppmData.abrevMp},
            dateLancement:{value:ppmData.dateLancement},
            dateRemise: {value:ppmData.dateRemiseOffre},
            tempNecessaireEva: {value: ppmData.nbJrsEvaluation},
            DateDemarrage: {value:ppmData.dateProbDemar},
            delaiExecution: {value:ppmData.delaiExecJrs},
            dateButoire: {value:ppmData.dateButoire},
        
            financement: {value:ppmData.financement},
            ligneCredit: {value:ppmData.idPlan},
            montantBudgetise:{value:ppmData.disponible},
            dispoaSaisir: {value:ppmData.disponibleASaisir},
            presenteSaisi: {value:ppmData.disponibleASaisir},
            montantEstime:{value:ppmData.montantEstime},
            depEngNonLiq: {value:ppmData.montDepEngNonLiq},
            creditDispo: {value:ppmData.creditDispo},
            ream: {value: ppmData.ream}
          });

          const depensesLignesBudgetaireEnFonctionDePpmView = await DepensesLignesBudgetaireEnFonctionDePpmViewService.getByGestionAndIdBudgetAndIdPpm(gestionCourante,idBudget,idPpm)
            const data = depensesLignesBudgetaireEnFonctionDePpmView.map((item) => {
            return {
              financement : item.cod5,
              ligneCredit : item.idPlan,
              disponible : item.disponible,
              disponibleASaisir : item.disponibleASaisir,
              presenteSaisi : item.dejaSaisi,
              codBud : item.codBud,
              annulation: 0,
              ajout: 0,
              estNouvelleLigneBudgetaire: false
              }
            })
          setLigneBudgetaireSelectionnee(data)
          setIdPlanDesLignesSelectionne(data.map((l:any) => l.ligneCredit))
          setShowModalAjoutDuneLigneDePPM(true);
          setEstEnModeModification(true);
        } 
        catch(error){
          okWarnignDialog('Une erreur est survenue, Veuillez réessayer ')
        }
      }
      
      const modifierUneLigneDePpmSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!validateForm()){
          okWarnignDialog('Veuillez remplir tous les champs')
          return
        };
        
        const code = ajouterUneLigneDePPM.code.value.split('.');
        const existingNum = parseInt(code[2]);
        const list = await PpmActeService.getByGestion(gestionCourante);
        if(!ligneBudgetaireSelectionnee || ligneBudgetaireSelectionnee.length === 0) {
          okWarnignDialog("Veuillez sélectionner au moins une ligne budgétaire");
          return;
        }
        try {
          const newPpm: PpmRequestDto = { ...emptyPpmRequestDto };
          newPpm.idBudget = parseInt(idBudget);
          newPpm.exercice = parseInt(gestionCourante);
          newPpm.num = existingNum;
          newPpm.montantEstime = ajouterUneLigneDePPM.montantEstime.value;
          newPpm.montDepEngNonLiq = ajouterUneLigneDePPM.depEngNonLiq.value;
          newPpm.creditDispo = ajouterUneLigneDePPM.creditDispo.value;
          newPpm.natPrestation = ajouterUneLigneDePPM.natPrestation.value;
          newPpm.nbLot = ajouterUneLigneDePPM.nblot.value;
          newPpm.abrevMp = ajouterUneLigneDePPM.modPassation.value;
          newPpm.dateLancement = ajouterUneLigneDePPM.dateLancement.value;
          newPpm.dateRemiseOffre = ajouterUneLigneDePPM.dateRemise.value;
          newPpm.nbJrsEvaluation = ajouterUneLigneDePPM.tempNecessaireEva.value;
          newPpm.dateProbDemar = ajouterUneLigneDePPM.DateDemarrage.value;
          newPpm.delaiExecJrs = ajouterUneLigneDePPM.delaiExecution.value;
          newPpm.dateButoire = ajouterUneLigneDePPM.dateButoire.value;
          newPpm.dateEffectLance = null;
          newPpm.dateAttribution = null;
          newPpm.montantPasse = 0;
          newPpm.idPpmM = idPpmMToSaveInEditingMode;
          newPpm.ream = ajouterUneLigneDePPM.ream.value;
      
          await PpmService.editReam(ajouterUneLigneDePPM.code.value, newPpm);
      
          const existingLines = await PpmBudgetService.getByIdPpm(ajouterUneLigneDePPM.code.value);
          
          // Traitement de chaque ligne modifiée
          for (const ligne of ligneBudgetaireSelectionnee) {
          const presente = parseFloat(ligne.presenteSaisi) || 0;
          const ajout = parseFloat(ligne.ajout) || 0;
          const annulation = parseFloat(ligne.annulation) || 0;
          
          const newLine : PpmBudgRequestDto = emptyPpmBudgRequestDto;
          newLine.idPpm = ajouterUneLigneDePPM.code.value;
          newLine.codBud = ligne.codBud;
          newLine.idSrceFin= (ligne.financement || '00').toString().padStart(2, '0');
          newLine.montantEstime = presente + ajout - annulation;
                
          // Vérifie si la ligne existe déjà
          const existingLine = existingLines.find(
          (l: any) => l.codBud === ligne.codBud && l.idSrceFin === newLine.idSrceFin
            );
            if (existingLine) {
              await PpmBudgetService.edit(
                newLine.idPpm,
                newLine.codBud,
                newLine.idSrceFin,
                newLine
              )
              } else {
                PpmBudgetService.addReam(newLine)
            }
          }    
          // Suppression des lignes qui ont été enlevées
          const currentLineIds = ligneBudgetaireSelectionnee.map(l => `${l.codBud}-${l.financement}`);
          for (const existingLine of existingLines) {
          const lineId = `${existingLine.codBud}-${existingLine.idSrceFin}`;
          if (!currentLineIds.includes(lineId)) {
            await PpmBudgetService.delete(
              ajouterUneLigneDePPM.code.value,
              existingLine.codBud,
              existingLine.idSrceFin
            )
          }
          }
          okSuccessDialog('Données mises à jour avec succès');
          setTimeout(() => {window.location.reload() }, 2500);    
          setShowModalAjoutDuneLigneDePPM(false);
        } catch (error) {
          okWarnignDialog('Une erreur est survenue, Veuillez réessayer');
        }
      };
      
      const editActe = async() =>{
        const list = await PpmActeService.getByGestion(gestionCourante);
        const acteInvalide = list.find(item => item.valide === false);
        if(acteInvalide){
          const updatedActe = {
            ...acteInvalide,
            quantieme : ppmActeForm.quantieme.value,
            dateModif : ppmActeForm.dateModif.value,
            motifModif : ppmActeForm.motifModif.value
          }
          PpmActeService.edit(acteInvalide?.idPpmM,updatedActe).then(
            (data) => okSuccessDialog("Données mis à jour avec succès")
          )
        }    
      }
      const deleteActe = async()=> {
        const list = await PpmActeService.getByGestion(gestionCourante);
        const acteInvalide = list.find(item => item.valide === false);
        if(acteInvalide){
          await Swal.fire({
            title: 'GesBud',
            html: "Êtes-vous certain de vouloir supprimer <br>toute la modification du PPM ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
            allowOutsideClick: false,
            confirmButtonColor: '#007E33' 
          }).then((result) => {
            if(result.isConfirmed){
              PpmActeService.delete(acteInvalide.idPpmM)
              .then((data) => {
                okSuccessDialog("Données supprimées avec succès")
                handleCloseModalAjoutDuneLigneDePPM()
              } )
            }
          })
        }
      } 

      const supprimerUneLigneDePpm = async (idPpm : any) => {
        // Fermer d'abord le modal bootstrap
        handleCloseModalSaisirModification();

        // Petite pause pour laisser le dom se mettre à jour
        await new Promise(resolve => setTimeout(resolve, 300));
        if(!selectedPpmId || selectedPpmId === ''){
          okWarnignDialog('Veuillez selectionner une ligne')
          return;
        }
        const confirm = await Swal.fire({
          title : 'GesBud',
          text : "Êtes-vous certain de vouloir supprimer cette ligne ?",
          icon : "question",
          showCancelButton : true,
          cancelButtonText : 'Non',
          confirmButtonText : 'Oui',
          allowOutsideClick : false,
          confirmButtonColor : '#007E33',
        })
        if(!confirm.isConfirmed) return
        const {value : pwd} = await Swal.fire({
          title : 'GesBud',
          input : 'password',
          inputLabel : 'Entrez le mot de passe de connexion',
          backdrop: false,
          inputAttributes : {
            autocapitalize : 'off',
            autocorrect : 'off',
            autocomplete: 'new-password'
          },
          showCancelButton : true,
          confirmButtonText : 'Supprimer',
          cancelButtonText : 'Annuler',
          inputValidator : (value) => {
            if(!value) {
              return 'Vous devez entrer votre mot de passe'
            }
          }
        });
        if(!pwd) return;

        try {
          const acessCodeData = await AccesCodeService.get(username);
          const isValidPassWord = await bcrypt.compare(pwd,acessCodeData.motDePasse);
          if(!isValidPassWord) {
          okWarnignDialog("Mot de passe incorrect");
            return;
          }        
          await PpmService.delete(idPpm).then(data => {
          okSuccessDialog('Le ppm à été supprimé avec succès !')
          setTimeout(() => {window.location.reload()}, 3000);
          })
        }
        catch (error) {
          okWarnignDialog("Une erreur est survenue lors de la supression ")
        }
      }

      const handleImpression = async()=> {
        handleClosePdfModal();
        try {
          const pdfBlob = await PpmService.downloadPpmReport(parseInt(gestionCourante));
          const url = window.URL.createObjectURL(pdfBlob);
          setPdfUrl(url);
          setShowPdfModal(true);
        } catch {
          okWarnignDialog("Erreur lors de l'impression du PPM");
        }
      }

    useEffect (()=>{
      getByIdBudgetAndExercice()
      getAllPpmModPass()
      getAllCodSourceFin()
      getPpmActe()
      getLigneBudgetaire()
      creerActe()
      if (selectedPpmId) {
        getLigneBudgetaireEnFonctionDePpm();
      }
    },[selectedPpmId])

    return (
        <Container>
          <div className="mt-1 p-1">
            <h6 className='shadow-sm rounded  text-primary text-center rounded'>CONTRATS &gt; PLAN DE PASSATION &gt;  SAISIR/ MAJ UNE MODIFICATION du PPM de {gestionCourante}</h6>
            <div style={{width:'100%',maxWidth:'1050px' }}>
            <div className='bg-warning'>
            <p className=" fw-bold mb-2">Informations de la modification</p>
            <Form>
              <Row className="align-items-center">
                <Col xs="auto">
                  <label htmlFor='quantieme' className="form-label fw-bold">Quantième modification:</label>
                  <input
                  type="number"
                  id="quantieme"
                  name="quantieme"
                  style={{ width: '60px' }}
                  value={ppmActeForm.quantieme.value }
                  onChange={(e)=>handleInputChangeModifierPpmActe(e)} readOnly
                  />
                </Col>
                <Col xs="auto">
                  <label htmlFor='dateModif' className="form-label fw-bold ">En date du:</label>
                  <input
                  type="date"
                  id="dateModif"
                  name="dateModif"
                  style={{ width: '120px' }}
                  value={ppmActeForm.dateModif.value}
                  onChange={(e)=>handleInputChangeModifierPpmActe(e)}
                  />
                </Col>
                <Col xs="auto">
                  <label htmlFor='dateCreate' className="form-label fw-bold ">Date saisie:</label>
                  <input
                  type="datetime-local"
                  id="dateCreate"
                  name="dateCreate"
                  style={{ width: '160px' }}
                  value={ppmActeForm.dateCreate.value}
                  readOnly className="fw-bold text-dark"
                  />
                </Col>
                <Col xs="auto" className="d-flex align-items-end ms-auto">
                  <Button variant="outline-primary" title= "Enregistrer les données" onClick={()=> editActe()} ><SaveIcon/></Button>
                  <Button variant="outline-danger" title="Supprimer toute la modification" className="ms-2" onClick={()=> deleteActe()} ><BsTrash /></Button>
                </Col>
              </Row>
              <div >
              <label htmlFor='motifModif' className="form-label fw-bold ">Motif:</label>
              <input
              type="text"
              id="motifModif"
              name="motifModif"
              style={{ width: '700px' }}
              value={ppmActeForm.motifModif.value}
              onChange={(e)=>handleInputChangeModifierPpmActe(e)}
              className="fw-bold text-dark"
              />
              </div>
            </Form>
          </div>
         
          <Row className="mt-5">
            <Col className="shadow-lg rounded m-auto  text-center">
              <div className="p-4 d-flex justify-content-center">
                <Button  size="lg" className="m-1 px-5 py-3 outline-primary fw-bold text-dark" onClick={handleShowModalSaisirModification}>
                    SAISIR/ MAJ UNE MODIFICATION du PPM de {gestionCourante}
                </Button>
              </div>
            </Col>
          </Row> 
          </div> 
          
          {/*Saisir une modification */}     
         <Modal show={showModalSaisirModification} onHide={handleCloseModalSaisirModification} backdrop="static"  keyboard={false} size='xl' >
            <Modal.Header closeButton>
              <Modal.Title as='h6' >SAISIR UNE MODIFICATION</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <ButtonGroup>
                  <Button variant="outline-success" title='Ajouter une nouvelle ligne de PPM' className='ms-2' onClick={() => boutonPourAjoutDuneLigneDePpm()}  ><BsPlusLg className="ms-2"  /></Button>
                  <Button variant="outline-warning" title="Modifier" className='ms-2'  onClick={()=>modifierUneLigneDePpm(selectedPpmId)} disabled={isDisabled}  ><BsPencilSquare /></Button>
                  <Button variant="outline-danger" title="Supprimer" className='ms-2' onClick= {()=> supprimerUneLigneDePpm (selectedPpmId)} disabled={isDisabled} ><BsTrash /></Button>
                  <Button variant='outline-primary' title='Imprimer le PPM' className='ms-2' onClick={handleImpression} ><PrintIcon/></Button>
                </ButtonGroup>
              </div>
              
              <DataTable
              columns={elaborationDuPPMColonne}
              data={ppms}
              fixedHeader
              noDataComponent= {
              <div className="text-center py-5 text-muted" > 
                <BsInfoCircle size = {50}/>
                <p className='mt-2'>Il n'y à pas d'enregistrement à afficher</p>
              </div>
              }
              fixedHeaderScrollHeight='250px' 
              customStyles={costumeStyles}
              responsive
              highlightOnHover
              conditionalRowStyles={afficherLigneBudgEnFonctionDePpm}
              onRowClicked={(row:any)=> {
                setSelectedPpmId(row.idPpm);
              }}
              />
              {/*BANNIÈRE  */}
              <div style={{
                marginTop: '20px',
                marginBottom: '15px',
                padding: '10px 15px',
                backgroundColor: '#e6f7ff',
                border: '1px solid #91d5ff',
                borderRadius: '4px',
                color: '#333',
                fontSize: '1.1em',
                fontWeight: 'bold'
                }}>
                {(() => {
                const count = depensesLignesBudgetaireEnFonctionDePpmView.length;
                const s = count > 1 ? 's' : ''; 
                const suffixeAdjectif = count > 1 ? 'ées' : 'ée';

                if (count === 0) {
                    return selectedPpmId ?
                        `Aucune ligne budgétaire associée au PPM : ${selectedPpmId}` :
                        `Cliquer sur une ligne de PPM pour voir les détails`;
                } else {
                    return selectedPpmId ?
                        `${count} ligne${s} budgétaire${s} associ${suffixeAdjectif} au PPM : ${selectedPpmId}` :
                        `${count} ligne${s} budgétaire${s} trouv${suffixeAdjectif} pour tous les PPMs affichés`;
                }
                })()}
              </div>
              <DataTable
                columns={elaborationDuPPMLigneBudgetaireColonne}
                data={depensesLignesBudgetaireEnFonctionDePpmView}
                fixedHeader
                fixedHeaderScrollHeight='200px'
                noDataComponent= {""}
                responsive
                customStyles={costumeStyles}
                highlightOnHover
                />
            </Modal.Body>
         </Modal>
         {/*Ajouter une nouvelle ligne de PPM*/ }
         <Modal show={showModalAjoutDuneLigneDePPM} onHide={handleCloseModalAjoutDuneLigneDePPM} backdrop="static" keyboard={false} size="xl" centered>
         <Modal.Header className='bg-light p-3'>
             <Modal.Title as="h6" > {estEnModeModification ? "Modification d'une ligne de PPM": "Ajout d'une ligne de PPM"}</Modal.Title>
         </Modal.Header>
         <Modal.Body className="p-4">
           <Form  >
             <div >
               <label htmlFor='code' className="form-label fw-bold text-primary">Code:</label>
               <input 
                  type='text' 
                  id='code' 
                  style={{width: "96%"}} 
                  name='code' 
                  value={ajouterUneLigneDePPM.code.value} 
                  onChange={(e) =>handleInputChangeAjouterUneLigneDePPM(e)}
                  disabled
                />
             </div>

               <div className='row' >
                 <div className='col-12 col-sm-9 col-md-10'>
                   <label htmlFor='natPrestation' className="form-label fw-bold text-primary">Nature prestation:</label>
                   <input 
                      type='text' 
                      id='natPrestation' 
                       style={{width:'80%'}}  
                      name='natPrestation' 
                      value={ajouterUneLigneDePPM.natPrestation.value} 
                      onChange={(e) => handleInputChangeAjouterUneLigneDePPM(e)} 
                    />
                 </div>
                 <div className='col-12 col-sm-3 col-md-2'>
                   <label htmlFor='nblot' className="form-label fw-bold text-primary">Nb de lot:</label>
                   <input type='number' 
                      id='nblot' 
                      style={{width:'84px'}} 
                      name='nblot' 
                      value={ ajouterUneLigneDePPM.nblot.value > 100 ? setAjouterUneLigneDePPM(prev => ({...prev,nblot:{value:100}})) : ajouterUneLigneDePPM.nblot.value >= 0 ? ajouterUneLigneDePPM.nblot.value : okWarnignDialog('Nb lot doit être positif') } 
                      onChange={(e) => handleInputChangeAjouterUneLigneDePPM(e)}
                      
                    />
                 </div>
               </div> 

               <div className="row align-items-center mb-3">
                 <div className="col-12 col-md-1">
                  <label className="form-label fw-bold text-primary">Mode de passation:</label>
                 </div>

                 <div className="col-12 col-md-10">
                  <select 
                    className="form-select" 
                    name='modPassation' 
                    value={ajouterUneLigneDePPM.modPassation.value}  
                    onChange={(e)=> handleInputChangeAjouterUneLigneDePPM(e)}
                    style={{cursor:'pointer',fontWeight:'bold'}} 
                  >
                    <option disabled></option>
                     {modPassation.map(item=> (
                       <option key={item.abrevMp} value={item.abrevMp} style={{fontWeight:'bold'}}>{item.abrevMp} - {item.libelleLongMp} </option>
                    ))}
                  </select>
                 </div>
               </div>
                 
             <div className='row mb-3' >
               <div className='col'>
                 <label htmlFor='dateLancement' className="form-label fw-bold text-primary">Date de lancement:</label>
                 <input 
                   type='date' 
                   id='dateLancement'  
                   name='dateLancement' 
                   value={ajouterUneLigneDePPM.dateLancement.value} 
                   onChange={(e) => handleInputChangeAjouterUneLigneDePPM(e)}
                 />
               </div>
               <div className='col'>
                 <label htmlFor='dateRemise' className="form-label fw-bold text-primary">Date de remise des offres:</label>
                 <input 
                   type='date' 
                   id='dateRemise'  
                   name='dateRemise' 
                   value={ajouterUneLigneDePPM.dateRemise.value} 
                   onChange={(e) => handleInputChangeAjouterUneLigneDePPM(e)} 
                 />
               </div>
               <div className='col-4'>
                 <label htmlFor='tempNecessaireEva' className="form-label fw-bold text-primary">Temps nécessaire à l'évalut°:</label>
                 <input 
                   type='number' 
                   id='tempNecessaireEva' 
                   style={{width:'80px'}} 
                   name='tempNecessaireEva' 
                   value={ajouterUneLigneDePPM.tempNecessaireEva.value >=0 ? ajouterUneLigneDePPM.tempNecessaireEva.value : okWarnignDialog("Temps nécessaire à l'évalut° doit être positif") } 
                   onChange={(e) => handleInputChangeAjouterUneLigneDePPM(e)}
                   />
               </div>
             </div>
             
               <div className='row mb-3'>
                 <div className='col'>
                   <label htmlFor='DateDemarrage' className="form-label fw-bold text-primary">Date de démarrage:</label>
                   <input
                     type='date' 
                     id='DateDemarrage' 
                     name='DateDemarrage' 
                     value={ajouterUneLigneDePPM.DateDemarrage.value} 
                     onChange={(e) => handleInputChangeAjouterUneLigneDePPM(e)}
                   />
                 </div>
                 <div className='col'>
                   <label htmlFor='delaiExecution' className="form-label fw-bold text-primary">Délai d'exécution prévu (jours):</label>
                   <input
                     type='number' 
                     id='delaiExecution' 
                     style={{width:'80px'}} 
                     name='delaiExecution' 
                     value={ajouterUneLigneDePPM.delaiExecution.value >=0 ? ajouterUneLigneDePPM.delaiExecution.value : okWarnignDialog("Délai d'exécution prévu (jours) doit être positif") } 
                     onChange={(e) => handleInputChangeAjouterUneLigneDePPM(e)}
                   />
                 </div>
                 <div className='col-3'>
                   <label htmlFor='dateButoire' className="form-label fw-bold text-primary" >Date buttoire:</label>
                   <input
                     type='date' 
                     id='dateButoire' 
                     name='dateButoire' 
                     value={ajouterUneLigneDePPM.dateButoire.value} 
                     onChange={(e) => handleInputChangeAjouterUneLigneDePPM(e)} 
                   />
                 </div>
               </div> 
               
              {/*ajouter  une ligne budgétaire */}
             <div className='row border'>
               <div className='col border'>
                 <label className="form-label fw-bold text-primary">Ligne Budgétaire</label>
                 <Button  variant="outline-success" title='Ajouter une  ligne budgétaire' size="sm" className='me-1'  onClick={handleShowModalAjoutDuneLigneBudgetaire} ><BsPlusLg /> </Button>
               </div >
             </div> 
             
              <div>
                <DataTable
                  columns={tableauDeLigneBudgetaireColonne}
                  data={ligneBudgetaireSelectionnee}
                  responsive
                  customStyles={costumeStyles}
                  noDataComponent={"Aucune ligne budgétaire sélectionnée "}
                  fixedHeader
                  fixedHeaderScrollHeight='150px' 
                />
              </div>

            <div className="container">
              <div className="row justify-content-end mb-2" >
               <div className="col-auto d-flex align-items-center">
                 <label htmlFor='montantEstimeTotal' className="form-label fw-bold text-primary me-2">Montant Estimé total:</label>
                  <FormattedInput
                  id="montantEstimeTotal"
                  name="montantEstimeTotal"
                  value={ajouterUneLigneDePPM.montantEstime.value}
                  readOnly
                  />
                </div>
              </div>

              <div className="row justify-content-end mb-2">
               <div className="col-auto d-flex align-items-center">
                 <label htmlFor='depEngNonLiq' className="form-label fw-bold text-primary me-2">Dépense engagée non liquidée:</label>
                   <FormattedInput 
                     id='depEngNonLiq' 
                     name='depEngNonLiq' 
                     value={ajouterUneLigneDePPM.depEngNonLiq.value}  
                     onChange={(newValue) =>{
                        newValue >= 0 ?
                        setAjouterUneLigneDePPM((prev) => ({
                          ...prev,
                          depEngNonLiq: {value: newValue},
                          creditDispo: {value: (prev.montantEstime.value ||0) - newValue}
                        }))
                        : okWarnignDialog('Dépense engagée non liquidée doit être positif') 
                      }}
                    />
               </div>
              </div>

              <div className="row justify-content-end"> 
               <div className="col-auto d-flex align-items-center">
                 <label htmlFor='creditDispo' className="form-label fw-bold text-primary me-2">Crédit Disponible:</label>
                  <FormattedInput 
                    id='creditDispo'  
                    name='creditDispo' 
                    value={ajouterUneLigneDePPM.creditDispo.value >=0 ? ajouterUneLigneDePPM.creditDispo.value : okWarnignDialog('Le crédit disponible doit être positif') }  readOnly
                  />
                </div>
              </div> 
            </div>     
           </Form>
         </Modal.Body>

         <Modal.Footer className='p-1'>
            <ButtonGroup >
              <Button variant="primary" size='lg'  onClick={estEnModeModification ?  modifierUneLigneDePpmSubmit  : enregistrerUneLigneDePpm}> {estEnModeModification ? "Enregistrer les modifications": "Enregistrer"} </Button>
              <Button variant="outline-danger" size='lg'  onClick={handleCloseModalAjoutDuneLigneDePPM}>Annuler</Button>
            </ButtonGroup>
         </Modal.Footer>
       </Modal>

        {/*modal pour choisir une ligne budgétaire */}   
        <Modal show={showModalAjoutDuneLigneBudgetaire} onHide={handleCloseModalAjoutDuneLigneBudgetaire}  backdrop="static" keyboard={false} size="lg" centered>
          <Modal.Header className="bg-light p-3" closeButton> 
            <h6 className="m-0">Lignes budgétaires</h6>
          </Modal.Header>
              
          <Modal.Body >
            <DataTable
              columns={tableauPourChoisirLigneBudgetaireColonne}
              data={depensesPourPpmBudgetView}
              customStyles={costumeStyles}
              noDataComponent = {
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-exclamation-octagon fs-3"></i>
                  <p className="mt-2">Aucune ligne budgétaire disponible</p>
                </div>
              }
              responsive 
            />
          </Modal.Body>
          <Modal.Footer> </Modal.Footer>            
        </Modal>

        {/** Modal de visualisation du pdf */}
        <Modal show={showPdfModal} onHide={handleClosePdfModal} backdrop="static" keyboard={false} size="xl" centered>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body style={{ height: '80vh', padding: 0}}>
              {pdfUrl && (
                <iframe
                  src= {pdfUrl}
                  style={{width: '100%', height: '100%', border: 'none'}}
                  title="Aperçu du PPM"
                >
                  Votre navigateur ne supporte pas l'affichage PDF intégré
                </iframe>
              )

              }
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='success'
              onClick={() => {
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.setAttribute('download',`PPM_${gestionCourante}.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Télécharger
            </Button>
            <Button variant='secondary' onClick={handleClosePdfModal}>Fermer</Button>
          </Modal.Footer>
        </Modal>
        </div>
      </Container>

    ); }

export default ContratsPlanDePassationSaisirMajUneModificationForm;

