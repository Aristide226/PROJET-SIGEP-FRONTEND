import { FunctionComponent,useState,useEffect } from 'react';
import { Button,Container,Table, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { ppmActeRequestDto} from '../models/ppm-acte';
import PpmActeService from '../services/ppm-acte-service';
import PpmService from '../services/ppm-service';
import { costumeStyles } from '../../helpers/costume-styles';
import { ConnectedUser,GestionProchaine, IdBudget} from '../helpers/session-storage';
import Swal from 'sweetalert2';
import { okSuccessDialog, okWarnignDialog } from '../../helpers/dialogs';
import bcrypt from 'bcryptjs-react';
import {PpmResponseDto} from '../models/ppm';
import AccesCodeService from '../services/accesCodeService';


const MettreEnPlaceLeLeProjetDePpmForm: FunctionComponent =()=> {
    //////////DECLARATIONS DE TABLEAUX
    const validationDuProjetDePpmCol = [
        {name: 'Date', selector: (row:any)=> formateDate(row.dateCreate),grow:2},
        {name: 'Quantième ', selector: (row:any)=> row.quantieme,grow:2},
        {name: 'Motif', selector: (row:any)=> row.motifModif,grow:3},
        {name: 'Valider', cell: (row:any)=> {
            return (
                <Button size="sm" name="Valider" variant={ "primary"} onClick={()=>handleValidation(row.idPpmM)}>Valider</Button>
            )
        },grow:0
       
        }
    ]
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
        {name:'Date butoire', selector:(row:any)=> row.dateButoire},
        {name:'Date Effect Lancement', selector:(row:any)=> row.dateEffectLance, grow:0},
        {name:'Date Attribution', selector:(row:any)=> row.dateAttribution, grow:0},
        {name:'Montant attribution', selector:(row:any)=> row.montantPasse},
    ]

    //////////DECLARATIONS STATES
    const [ppmActe,setppmActe] = useState <ppmActeRequestDto[]>([]);
    const acteEnCours = ppmActe.find(item => item.valide === false);
    const [gestionProchaine, setGestionProchaine] = useState<string>(GestionProchaine() ?? '');
    const [ppms,setPpms]= useState<PpmResponseDto[]>([]);
    const [idBudget] = useState <string> (() => { 
        const id = IdBudget();
        if (!id) return '';
        const num = parseInt(id);
        return num < 10 ? `0${num}` : `${num}`;
    })
    const ppmsDeLActeEnCours = acteEnCours 
    ? ppms.filter(ppm => ppm.idPpmM === acteEnCours.idPpmM)
    : [];
    const [showPdfModal,setShowPdfModal] = useState(false);
    const [pdfUrl,setPdfUrl] = useState('');

    //////////DECLARATIONS DES FONCTIONS
    const getPpmActeByGestionAndIdBudget =()=> {
        PpmActeService.getByGestionAndIdBudget(gestionProchaine,idBudget).then(data => {
            setppmActe(data)
        })
    }
    const getPpmByIdBudgetAndExercice =()=> {
        PpmService.getByIdBudgetAndExercice(idBudget,gestionProchaine).then(data => {
            setPpms(data)
        })
    }
    const username = ConnectedUser();
    const formateDate = ( d : string) => {
        const date = new Date(d);
        const jour = date.getDate().toString().padStart(2, '0');
        const mois = (date.getMonth() + 1).toString().padStart(2, '0');
        const annee = date.getFullYear();
        return `${jour}/${mois}/${annee}`
    }
    const handleValidation = async(idPpmM:string)=> {
        const confirm1 = await Swal.fire({
            title: 'GesBud',
            text: "Êtes-vous sûr de vouloir valider cet projet ? (1/3)",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
            allowOutsideClick: false,
            confirmButtonColor: '#007E33' 
            })
        if(!confirm1.isConfirmed) return
        const confirm2 = await Swal.fire({
            title: 'GesBud',
            text: "Cette action est irréversible. Confirmez-vous la validation?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
            allowOutsideClick: false,
            confirmButtonColor: '#007E33' 
            })
        if(!confirm2.isConfirmed) return
        //dernière étape avant la validation
        const { value: pwd } = await Swal.fire({
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
            inputValidator: (value) => {
                if (!value) {
                    return 'Vous devez entrer votre mot de passe!';
                }
            }
        });
        if (!pwd) return;

        try{
            const accesCodeData = await AccesCodeService.get(username);
            const isValidPassWord = await bcrypt.compare(pwd,accesCodeData.motDePasse);
            if(!isValidPassWord) {
                okWarnignDialog("Mot de passe incorrect");
                return;
            }
            await validateActe(idPpmM)
            okSuccessDialog("Projet validé avec succès");
        }
        catch(error){
            okWarnignDialog("Une erreur est survenue lors de la validation");
        }
    }
    const validateActe = async (idPpmM:string) => {
        try{
            const acteAValider = ppmActe.find(item => item.idPpmM === idPpmM);
            if(acteAValider){
                const updatedActe = {
                    ...acteAValider,
                    valide: true,
                    dateUpdate: new Date().toISOString(),
                    userValide:username ,
                    dateValide: new Date().toISOString()
                };
                await PpmActeService.edit(idPpmM,updatedActe);
                setppmActe(prev => 
                    prev.map(item => item.idPpmM === idPpmM ? updatedActe : item)
                )
            }
        }
        catch(error){
    
        }
    }

    const handleClosePdfModal =()=> {
        if(pdfUrl) {
            window.URL.revokeObjectURL(pdfUrl);
        }
        setPdfUrl('')
        setShowPdfModal(false)
    }
    const num = ppmsDeLActeEnCours.length
    const montantTotal = ppmsDeLActeEnCours.reduce((sum,item) => sum + item.creditDispo ,0)

    const handleImpression = async(type : any) => {
        if (type === 'prevision') {
            handleClosePdfModal();
            try {
                const pdfBlob = await PpmService.downloadPpmReport(parseInt(gestionProchaine));
                const url = window.URL.createObjectURL(pdfBlob);
                setPdfUrl(url);
                setShowPdfModal(true);
            } catch {
                okWarnignDialog("Erreur lors de l'impression du PPM");
            }
        } else if (type === 'execution') {
      
        }
    };

    useEffect(()=> {
        getPpmActeByGestionAndIdBudget()
        getPpmByIdBudgetAndExercice()
    },[])

    return (
        <Container>
            <div className="mt-1 p-1">
            <h6 className='shadow-sm rounded  text-primary text-center rounded'>CONTRATS &gt; PLAN DE PASSATION &gt;  METTRE EN PLACE LE PROJET DE PPM DE {gestionProchaine}</h6>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <DropdownButton
                        variant="outline-primary"
                        title={<><i className="bi bi-printer-fill" ></i> Imprimer</>}
                        className="ms-2"
                        disabled={ppmActe.every(item => item.valide === true)}
                        >
                        <Dropdown.Item onClick={() => handleImpression('prevision')} >PPM Prévision</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleImpression('execution')} >PPM Exécution</Dropdown.Item>
                    </DropdownButton>
                    
                </div>
                <div style={{width:'100%',maxWidth:'1050px',overflow:'auto' }}>
                    <DataTable
                    columns={validationDuProjetDePpmCol}
                    data={acteEnCours ? [acteEnCours] : []}
                    customStyles={costumeStyles}
                    noDataComponent={""}
                    fixedHeader
                    fixedHeaderScrollHeight='150px'
                    highlightOnHover
                    responsive
                    striped
                    />
                    <DataTable
                    columns={elaborationDuPPMColonne}
                    data={ppmsDeLActeEnCours}
                    customStyles={costumeStyles}
                    fixedHeader
                    noDataComponent= {
                      <div className="text-center py-5 text-muted" > 
                        <p className='mt-2'>aucun enregistrement </p>
                      </div>
                    }
                    fixedHeaderScrollHeight='250px'                  
                    responsive
                    highlightOnHover
                    />
                </div>
                {acteEnCours ? (
                    <div style={{width:'100%',maxWidth:'1050px',overflow:'auto' }}>
                    <Table>
                        <tbody>
                            <tr>
                                <td>
                                    <h6>
                                        Nombre de lignes: <span style={{color:'blue'}}>{num}</span>
                                        <span style={{margin: '0 20px'}}></span> 
                                        Montant total: <span style={{color:'blue'}}>{montantTotal.toLocaleString()}</span>
                                    </h6>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                ) : ([]) 
                }
                {/**Modal de visualisation du pdf */}
                <Modal show={showPdfModal} onHide={handleClosePdfModal} backdrop="static" keyboard= {false} size='xl' centered>
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body style={{ height:'80vh', padding: 0}}>
                        {pdfUrl && (
                            <iframe 
                                src={pdfUrl}
                                style={{ width:'100%', height: '100%', border: 'none'}}
                                title="Aperçu du PPM"
                            >
                                Votre navigateur ne supporte pas l'affichage PDF intégré
                            </iframe>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant ='success'
                            onClick={() => {
                                const link = document.createElement('a');
                                link.href = pdfUrl;
                                link.setAttribute('download', `PPM_${gestionProchaine}.pdf`);
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
    )
}

export default MettreEnPlaceLeLeProjetDePpmForm;