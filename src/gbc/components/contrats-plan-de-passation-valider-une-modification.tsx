import { FunctionComponent,useState,useEffect } from 'react';
import { Button, Container} from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import bcrypt from 'bcryptjs-react';
import { ppmActeRequestDto } from '../models/ppm-acte';
import { ConnectedUser, GestionProchaine, Gestion,IdBudget } from '../helpers/session-storage';
import { PpmResponseDto } from '../models/ppm';
import PpmActeService from '../services/ppm-acte-service';
import PpmService from '../services/ppm-service';
import AccesCodeService from '../services/accesCodeService';
import {costumeStyles} from '../../helpers/costume-styles';
import { okSuccessDialog, okWarnignDialog } from '../../helpers/dialogs';

const ValiderUneModificationForm : FunctionComponent =()=>{
    ///////DECLARATION DE TABLEAUX
    const ValiderUneModificationTab = [
        {name:'Date',selector: (row:any)=> formateDate(row.dateCreate),grow:2},
        {name:'Quantième',selector:(row:any)=>row.quantieme,grow:2},
        {name:'Motif',selector:(row:any)=> row.motifModif,grow:3},
        {name:'Valider',cell:(row:any)=>{
            return (
                <Button size='sm' name='Valider' variant={"primary"} onClick={()=> handleValidation(row.idPpmM)}>Valider</Button>
            )
        }}
    ]
    const elaborationDuPPMColonne =[
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
        {name:'Date butoire', selector:(row:any)=> row.dateButoire},
        {name:'Date Effect Lancement', selector:(row:any)=> row.dateEffectLance, grow:0},
        {name:'Date Attribution', selector:(row:any)=> row.dateAttribution, grow:0},
        {name:'Montant attribution', selector:(row:any)=> row.montantPasse},
    ]

    ////////DECLARATION DES STATES
    const [ppmActe,setppmActe] = useState<ppmActeRequestDto[]>([]);
    const [gestionProchaine,setGestionProchaine] = useState<string>(GestionProchaine() ?? '');
    const [gestionCourante,setGestionCourante] = useState<string>(Gestion() ?? '');
    const acteNonValider = ppmActe.filter(act => !act.valide);
    const [ppms,setPpms]= useState<PpmResponseDto[]>([]);
    const [idBudget] = useState <string> (() => { 
        const id = IdBudget();
        if (!id) return '';
        const num = parseInt(id);
        return num < 10 ? `0${num}` : `${num}`;
    })


    ///////DECLARATIONS DES FONCTIONS
    const getByGestion =()=> {
        PpmActeService.getByGestionAndIdBudget(gestionCourante,idBudget).then(data => {
            setppmActe(data)
        })
    }
    const getPpmByIdBudgetAndExercice =()=> {
        PpmService.getByIdBudgetAndExercice(idBudget,gestionCourante).then(data => {
            setPpms(data)
        })
    }
    const username = ConnectedUser();
    const formateDate = (d:string) => {
        const date = new Date(d);
        const jour = date.getDate().toString().padStart(2,'0');
        const mois = (date.getMonth()+1).toString().padStart(2,'0');
        const annee = date.getFullYear();
        return `${jour}/${mois}/${annee}`
    }
    const handleValidation = async(idPpmM:string) => {
      const confirm1 = await Swal.fire({
        title:'GesBud',
        text: 'Êtes-vous sûr de vouloir valider ce projet ? (1/3)',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33'
      })
      if(!confirm1.isConfirmed) return
      const confirm2 = await Swal.fire({
        title:'GesBud',
        text: 'Cette action est irréversible. Confirmez-vous la validation?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33'
      }) 
      if(!confirm2.isConfirmed) return
      const {value:pwd} = await Swal.fire({
        title: 'GesBud',
        input: 'password',
        inputLabel: 'Entrez votre mot de passe pour confirmer',
        inputPlaceholder: 'Votre mot de passe',
        inputAttributes: {
            autocapitalize: 'off',
            autocorrect: 'off',
            autocomplete: 'new-password'
        },
        showCancelButton: true,
        confirmButtonText: 'Valider définitivement',
        cancelButtonText: 'Annuler',
        inputValidator: (value)=> {
            if(!value){
                return 'Vous devez entrer votre mot de passe!';
            }
        }
      });
      if (!pwd) return;

      try {
        const acessCodeData = await AccesCodeService.get(username);
        const isValidPassWord = await bcrypt.compare(pwd,acessCodeData.motDePasse);
        if(!isValidPassWord) {
            okWarnignDialog('Mot de passe incorrect');
            return;
        }
        await validateActe(idPpmM)
        okSuccessDialog('Modification valider avec succès');
      }
      catch (error) {
        okWarnignDialog('Une erreur est survenue lors de la validation');
      }
    }
    const validateActe = async (idPpmM:string) => {
        try {
            const acteAValider = ppmActe.find(item => item.idPpmM === idPpmM);
            if(acteAValider){
                const updatedActe = {
                    ...acteAValider,
                    valide: true,
                    dateUpdate: new Date().toISOString(),
                    userValide: username,
                    dateValide: new Date().toISOString(),
                };
                await PpmActeService.edit(idPpmM,updatedActe);
                setppmActe(prev => 
                    prev.map(item => item.idPpmM === idPpmM ? updatedActe : item),
                )
            } 
        }
        catch (error) {

        }
    }
    const num = ppms.length;
    const montantTotal = ppms.reduce((sum,item) => sum + item.creditDispo,0)

    const handleImpression =(type : any) => {
    }

    useEffect (()=> {
        getByGestion()
        getPpmByIdBudgetAndExercice()
    },[])
    
    return (
        <Container>
            <div className="mt-1 p-1">
            <h6 className='shadow-sm rounded  text-primary text-center rounded'>CONTRATS &gt; PLAN DE PASSATION &gt;  VALIDER UNE MODIFICATION</h6>
               <div style={{width:'100%',maxWidth:'1050px',overflow:'auto' }}>
                    <DataTable
                    columns={ValiderUneModificationTab}
                    data={acteNonValider}
                    customStyles={costumeStyles}
                    noDataComponent={"aucun enregistrement"}
                    fixedHeader
                    fixedHeaderScrollHeight='150px'
                    highlightOnHover
                    responsive
                    striped
                    />
                </div> 
            </div>
        </Container>
    )
}

export default ValiderUneModificationForm;