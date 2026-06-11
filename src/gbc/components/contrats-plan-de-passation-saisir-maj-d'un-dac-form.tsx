//Aristide
import { FunctionComponent,useState,useEffect } from "react";
import { Button,Container,Table, Dropdown, DropdownButton, ButtonGroup, Modal } from 'react-bootstrap';
import DataTable from "react-data-table-component";
import { PpmDacRequestDto,PpmDacResponseDto } from "../models/ppm-dac";
import { PpmResponseDto } from "../models/ppm";
import PpmDacService from "../services/ppm-dac-service";
import PpmService from '../services/ppm-service';
import SaveIcon from '@mui/icons-material/Save';
import { BsTrash } from "react-icons/bs";
import { costumeStyles } from "../../helpers/costume-styles";
import { IdBudget,Gestion,ConnectedUser } from '../helpers/session-storage';
import { okSuccessDialog, okWarnignDialog } from "../../helpers/dialogs";
import bcrypt from "bcryptjs-react";
import Swal from "sweetalert2";
import AccesCodeService from "../services/accesCodeService";


const ContratsPlanDePassationSaisirMajDacForm : FunctionComponent =()=> {
    /////////// DECLARATION DES TABLEAUX /////////////////
    const ppmDacCol = [
        {name:'Numéro', selector:(row:any)=> row.refPassation,
            cell : (row: any) => (
                <input
                    type="number"
                    value= {row.refPassation }
                    onChange={(e) => handleDacInputChange(row.idDac, 'refPassation', e.target.value)}
                    style={{ width: '100%', border: '1px solid #ced4da'}}
                    min="1"
                />
            )
        },
        {name:'Date', selector:(row:any)=> row.dateDac,
            cell : (row: any) => (
                <input
                    type="date"
                    value={formatDateForInput(row.dateDac)}
                    onChange={(e) => handleDacInputChange(row.idDac, 'dateDac', e.target.value)}
                    style={{ width:'100%', border: '1px solid #ced4da', padding:'4px', borderRadius:'4px'}}
                    min={formatDateForInput(row.dateLancement)}
                />
            )
        },
        {name:'Date de lancement', selector:(row:any)=> row.dateLancement,
            cell: (row:any) => (
                <input
                    type="date"
                    disabled
                    value={formatDateForInput(row.dateLancement)}
                    onChange={(e) => handleDacInputChange(row.idDac, 'dateLancement', e.target.value)}
                    style={{ width: '100%', border: '1px solid #ced4da', padding:'4px', borderRadius: '4px'}}
                />
            )
        },
        {name:'Ligne PPM', selector:(row:any)=> row.idPpm,
            cell: (row:any) => (
                row.idPpm ? (
                    <div className="d-flex align-items-center">
                        <span>{row.idPpm}</span>
                        <Button
                            variant="link"
                            size="sm"
                            onClick={()=> handleShowModalAfficherPpms(row.idDac)}
                            className="ms-2 p-0 text-decoration-none"
                            title="changer la ligne PPM associée"
                        >
                            [Modifier]
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleShowModalAfficherPpms(row.idDac)}
                        title="Sélectionner une ligne"
                    >
                        Choisir une ligne
                    </Button>
                )
            ) 
        },
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
    const [ppmDac,setPpmDac] = useState<PpmDacResponseDto[]>([]);
    const [gestionCourante, setGestionCourante] = useState<string>(Gestion() ?? '');
    const [ppms,setPpms] = useState<PpmResponseDto[]>([]);
    const [modalAfficherPpms,setModalAfficherPpms] = useState(false)
    const [idDacEnCoursDeModif,setIdDacEnCoursDeModif] = useState<any>(null);
    const [tempIdCounter,setTempIdCounter] = useState(1); //compteur des nouvelles lignes
    const [selectedDacId,setSelectedDacId] = useState<string|null>(null);
    const [idBudget] = useState <string> (() => { 
        const id = IdBudget();
        if (!id) return '';
        const num = parseInt(id);
        return num < 10 ? `0${num}` : `${num}`;
    })
    const username = ConnectedUser();

    ///////////DECLARATIONS DES FONCTIONS
    const handleCloseModalAfficherPpms =()=> {
        setModalAfficherPpms(false)
    }
    const handleShowModalAfficherPpms =(idDac:any)=> {
        setIdDacEnCoursDeModif(idDac)
        setModalAfficherPpms(true)
    }

    const handleSelectPPM = (ppmSelectionner : PpmResponseDto) => {
        setPpmDac(prev => prev.map(dac => {
            if (dac.idDac === idDacEnCoursDeModif) {
                return {
                    ...dac,
                    idPpm: ppmSelectionner.idPpm,
                    dateLancement: ppmSelectionner.dateLancement
                }
            }
            return dac;
        }))
        setIdDacEnCoursDeModif(null)
        handleCloseModalAfficherPpms()
    }

    const handleDacInputChange =(idDac: any, key: keyof PpmDacResponseDto, value: any) => {
        if (key === 'refPassation') {
            const numValue = Number(value);
            if(isNaN(numValue) || numValue <=0 || !Number.isInteger(numValue)) {
                if(value === '' || value === null) {

                } else {
                    okWarnignDialog("Le Numéro de passation doit être un nombre entier supérieur à zéro");
                    return;
                }
            }
        }
        if(key === 'dateDac' && value) {
            const currentDac = ppmDac.find(dac => dac.idDac === idDac);
            const dateLancementS = currentDac?.dateLancement;
            
            if (dateLancementS && dateLancementS.trim() !== "") {
                if(value < dateLancementS){
                    okWarnignDialog("La Date DAC doit être égale ou postérieure à la Date de lancement");
                    return;
                }
            } else {
                
            }
        }

        let shouldAddNewRow = false

        setPpmDac(prevDacs => {
            const updatedDacs = prevDacs.map(dac => {
                if(dac.idDac === idDac) {
                    const updatedDac = {
                        ...dac,
                        [key]: value
                    };
                    //verifier si ces la dernière ligne et si elle est rempli
                    const isLastRow = prevDacs[prevDacs.length - 1].idDac === idDac;
                    if(isLastRow && updatedDac.idDac && updatedDac.refPassation && updatedDac.dateDac && updatedDac.dateLancement ) {
                        shouldAddNewRow = true;
                    }
                    return updatedDac
                }
                return dac
            });

            if(shouldAddNewRow) {
                const newEmptyRow = getEmptyDacRow(tempIdCounter);
                setTempIdCounter(prev => prev + 1);
                return [...updatedDacs, newEmptyRow];
            }
            return updatedDacs;
        })
    }

    const formatDateForInput = (dateString : string) => {
        if(!dateString) return '';
        try {
            return dateString.substring(0, 10);
        } catch (error) {
            return dateString;
        }
    }

    const formatRefPassation = (numString : string) : string => {
        if(!numString) return '';
        const num = parseInt(numString, 10);
        if(isNaN(num) || num <= 0) return numString;

        return num.toString().padStart(2, '0');
    }

    //linge dac vide
    const getEmptyDacRow = (id : number) : PpmDacResponseDto => ({
        idDac : `temp-${id}`,
        refPassation: '',
        dateCreation: '',
        dateDac: '',
        dateLancement: '',
        idPpm: '',
    } as PpmDacResponseDto)

    const getAllPpmDac =()=> {
        if(gestionCourante) {
            PpmDacService.getAll()
            .then(data => {
                let loadedData: PpmDacResponseDto[] = data || [];
                const isLastRowEmpty = loadedData.length > 0 && loadedData[loadedData.length -1].idDac.toString().startsWith('temp-');

                if(!isLastRowEmpty) {
                    const newEmptyRow = getEmptyDacRow(tempIdCounter);
                    loadedData = [...loadedData, newEmptyRow];
                    setTempIdCounter(prev => prev + 1)
                }
            setPpmDac(loadedData)
            })
        } else {
            return []
        }
        
    }
    const getPpmByIdBudgetAndExercice =()=> {
        PpmService.getByIdBudgetAndExercice(idBudget,gestionCourante).then(data => {
            setPpms(data)
        })
    }

    const handleSave = async ()=> {
        const dacsToProcess = ppmDac.filter(dac => 
        (dac.idDac && dac.idDac.toString().startsWith('temp-') && dac.refPassation && dac.dateDac) ||
        (dac.idDac && !dac.idDac.toString().startsWith('temp-')) 
        );

        //verifier si une Date DAC est présente sans Date de Lancement
        for (const dac of dacsToProcess) {
           if (dac.dateDac && (!dac.dateLancement || dac.dateLancement.trim() === "")) {
            okWarnignDialog(`Erreur Ligne ${dac.refPassation}: Veuillez sélectionner une Ligne PPM avant de définir la Date DAC.`);
            return; 
            } 
            if (dac.dateDac && dac.dateLancement) {
            const cleanDateLancementS = dac.dateLancement.substring(0, 10);
            
            if (dac.dateDac < cleanDateLancementS) {
                okWarnignDialog(`Erreur ligne ${dac.refPassation}: La Date DAC (${dac.dateDac}) doit être égale ou postérieure à la Date de Lancement (${cleanDateLancementS}).`);
                return; 
            }
            }    
        }

        const newDacsToCreate = ppmDac.filter(dac => 
            dac.idDac && dac.idDac.toString().startsWith('temp-') &&
            dac.refPassation && dac.dateDac && dac.dateLancement
        );

        //lignes à modifier
        const existingDacsToUpdate = ppmDac.filter(dac => 
            dac.idDac && !dac.idDac.toString().startsWith('temp-') &&
            dac.refPassation && dac.dateDac && dac.dateLancement && dac.refPassation.trim() !==""
        );

        if (newDacsToCreate.length === 0 && existingDacsToUpdate.length === 0) {
            okWarnignDialog("Aucune nouvelle ligne valide à enregistrer.")
            return;
        }
        try {
            const promises: Promise<PpmDacResponseDto>[] = [];

            //traitement des nouvelles lignes
            newDacsToCreate.forEach((newDac) => {
                const requestDto: PpmDacRequestDto = {
                    refPassation: formatRefPassation(newDac.refPassation),
                    dateDac: newDac.dateDac,
                    dateLancement: newDac.dateLancement,
                    idPpm: newDac.idPpm ? newDac.idPpm  : null,
                };
                promises.push(PpmDacService.add(requestDto))
            })

            //traitement des lignes existantes
            existingDacsToUpdate.forEach((existingDac) => {
                const requestDto: PpmDacRequestDto = {
                    refPassation: formatRefPassation(existingDac.refPassation),
                    dateDac: existingDac.dateDac,
                    dateLancement: existingDac.dateLancement,
                    idPpm: existingDac.idPpm ? existingDac.idPpm : null,
                };
                promises.push(PpmDacService.edit(existingDac.idDac.toString(),requestDto))
            })
            await Promise.all(promises)
            okSuccessDialog("Données enregistrées avec succès")
            setTimeout(() => {window.location.reload()}, 2500);
        } catch (error) {
            okWarnignDialog("Une erreur est survenue lors de l'enregistrement")
        }
    }

    const handleDelete = async () => {
        if(!selectedDacId) {
            okWarnignDialog("Veuillez sélectionner une ligne à supprimer")
            return;
        }
        if(selectedDacId.startsWith('temp-')) {
            setPpmDac(prevDacs => prevDacs.filter(dac => dac.idDac !== selectedDacId));
            setSelectedDacId(null);
            okSuccessDialog("Ligne de saisie annulée" );
            return;
        }
        try {
          const confirm1 = await Swal.fire({
            title : 'GesBud',
            text : "Êtes-vous certain de vouloir supprimer cette ligne ?",
            icon : 'question',
            showCancelButton : true,
            confirmButtonText : 'Oui',
            cancelButtonText : 'Non',
            allowOutsideClick : false,
            confirmButtonColor : '#007E33'
          })
          if(!confirm1.isConfirmed) return;
          const {value : pwd} = await Swal.fire({
            title : 'GesBud',
            input : 'password',
            inputLabel : 'Entrez le mot de passe de connexion',
            inputAttributes : {
            autocapitalize : 'off',
            autocorrect : 'off',
            autocomplete: 'new-password'
          },
          showCancelButton : true,
          cancelButtonText : 'Annuler',
          confirmButtonText : 'Supprimer',
          inputValidator : (value) => {
            if(!value) {
              return 'Vous devez entrer votre mot de passe'
            }
          }
          });
          if (!pwd) return ;

        
          const acessCodeData = await AccesCodeService.get(username);
          const isValidPassWord = await bcrypt.compare(pwd,acessCodeData.motDePasse);
          if(!isValidPassWord) {
            okWarnignDialog("Mot de passe incorrect");
            return;
          }
          await PpmDacService.delete(selectedDacId).then(data => {
            okSuccessDialog('Ligne supprimée avec succès!')
            setTimeout(() => {window.location.reload()}, 3000);
          })
        
        } 
        catch (error) {
          okWarnignDialog("Une erreur est survenue lors de la supression ")
        }
    }

    useEffect (() => {
        getAllPpmDac()
        getPpmByIdBudgetAndExercice()
    },[gestionCourante])

    return (
        <Container>
            <div className="mt-1 p-1">
                <h6 className="shadows-sm rounded text-primary text-center rounded">CONTRATS &gt; PLAN DE PASSATION &gt; SAISIR / MAJ d'un DAC</h6>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <ButtonGroup>
                        <Button 
                            variant="outline-danger" 
                            title="Supprimer" 
                            className="ms-2"
                            onClick={handleDelete}
                        >
                            <BsTrash/>
                        </Button>
                        <Button 
                            variant="outline-primary" 
                            title= "Enregistrer les données"
                            onClick={handleSave} 
                        >
                            <SaveIcon/>
                        </Button>
                    </ButtonGroup>
                </div>

                <div>
                    <DataTable
                        columns={ppmDacCol}
                        data={ppmDac}
                        highlightOnHover
                        pointerOnHover
                        onRowClicked={(row:any) => setSelectedDacId(row.idDac)}
                        fixedHeader
                        conditionalRowStyles={[
                            {
                                when: (row: any) => row.idDac === selectedDacId,
                                style: {
                                    backgroundColor: 'rgba(0,0,0,0.08)'
                                }
                            }
                        ]}
                        noDataComponent = {
                            <div className="text-center py-5 text-muted"> <p className="mt-2">aucun enregistrement</p></div>
                        }
                        fixedHeaderScrollHeight="350px"
                        customStyles={costumeStyles}
                        responsive
        
                    />
                </div>
                {/* modal pour afficher lignes de ppms*/}
                <Modal show={modalAfficherPpms} onHide={handleCloseModalAfficherPpms} backdrop="static" keyboard={false} size="lg" centered>
                        <Modal.Header className="bg-light p-3">
                            <Modal.Title as="h6">Lignes de PPM</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="p-4">
                            <div>
                                <DataTable
                                    columns={elaborationDuPPMColonne}
                                    data={ppms}
                                    customStyles={costumeStyles}
                                    noDataComponent={"aucun enregistrement"}
                                    fixedHeader
                                    responsive
                                    pointerOnHover
                                    highlightOnHover
                                    fixedHeaderScrollHeight="150px"
                                    onRowClicked={handleSelectPPM}
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModalAfficherPpms}>Annuler</Button>
                        </Modal.Footer>
                </Modal>
            </div>
        </Container>
    )
}

export default ContratsPlanDePassationSaisirMajDacForm