//Aristide

import { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { DirectionsRequestDto, DirectionsResponseDto, emptyDirectionsRequestDto, emptyDirectionsResponseDto } from "../models/directions";
import { emptyServiceRequestDto, emptyServiceResponseDto, ServiceRequestDto, ServiceResponseDto } from "../models/service";
import DirectionsService from "../services/directions-services";
import ServiceService from "../services/service-service";
import DataTable from "react-data-table-component";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveSharpIcon from '@mui/icons-material/SaveSharp';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import { okSuccessDialog, okWarnignDialog } from "../../helpers/dialogs";
import Swal from "sweetalert2";
import { style } from "@mui/system";

type FormulaireDirection = {
    codeDir:any,
    nomDirection:any,
    abrev:any
}
type FormulaireService = {
    nomService:any,
    abrevService:any,
    codDirect:any
}
const ParametresSaisieMiseAjourStructuresAdministrativesForm =()=> {

    //////////ETATS//////////
    const[allDirections,setAllDirections] = useState<DirectionsResponseDto[]>([]);
    const[allServicesRataches,setAllServicesRataches] = useState<ServiceResponseDto[]>([]);
    const[ajouterDirectionForm,setAjouterDirectionForm] = useState<FormulaireDirection> ({
        codeDir: {value: ''},
        nomDirection:{value: ''},
        abrev: {value: ''}
    })
    const[ajouterServiceRatacheForm,setAjouterServiceRatacheForm] = useState<FormulaireService> ({
        nomService: {value: ''},
        abrevService: {value: ''},
        codDirect: {value: ''}
    })
    const ID_NOUVELLE_LIGNE_CODE_DIR = 'NOUVELLE_LIGNE_CODE_DIR';
    const ID_NOUVELLE_LIGNE_service_RATACHES = 455577416781254554455545252;
    const[enModeAjoutDirection,setEnModeAjoutDirection] = useState<boolean>(false);
    const[enModeAjoutService,setEnModeAjoutService] = useState<boolean>(false);
    const[sectionCibleePourAjout,setSectionCibleePourAjout] = useState<'direction'|'service'>('direction');
    const[ligneDirectionSelectionnee,setLigneDirectionSelectionnee] = useState<DirectionsResponseDto>(emptyDirectionsResponseDto);
    const[ligneServiceRatacheSelectionnee,setLigneServiceRatacheSelectionnee] = useState<ServiceResponseDto>(emptyServiceResponseDto);

    //////////FONCTIONS//////////
    const initDirectionForm =()=> {
        setAjouterDirectionForm({
            codeDir: {value: ''},
            nomDirection:{value: ''},
            abrev: {value: ''}
        })
    }
    const initServiceRatacheForm =()=> {
        setAjouterServiceRatacheForm({
            nomService: {value: ''},
            abrevService: {value: ''},
            codDirect: {value: ''}
        })
    }
    const donneesFinalaAfficherPourDirection = useMemo(() => {
        if(enModeAjoutDirection) {
            return [
                {codeDir : ID_NOUVELLE_LIGNE_CODE_DIR, nomDirection: '', abrev : '', codDirect:''},
                ...allDirections
            ]
        }
        return allDirections;
    },[enModeAjoutDirection,allDirections])
    const filtrerEtAfficherServiceRataches = useMemo(() => {
        let resultat = allServicesRataches;
        if(ligneDirectionSelectionnee) {
            resultat = resultat.filter((item:any) => item.codDirect === ligneDirectionSelectionnee.codDirect);
        }
        return resultat;
    },[allServicesRataches,ligneDirectionSelectionnee])
    const donneesFinalaAfficherPourServicesRataches =useMemo(() => {
        if(enModeAjoutService) {
            return [
                {
                    codServ : ID_NOUVELLE_LIGNE_service_RATACHES,
                    nomService : "",
                    abrevService : "",
                    idService : "", 
                    codDirect : ""
                },
                ...filtrerEtAfficherServiceRataches
            ]
        }
        return filtrerEtAfficherServiceRataches
    },[enModeAjoutService,filtrerEtAfficherServiceRataches])

    const handleAjouterUneDirection =async()=> {
        setEnModeAjoutDirection(true);
    }
    const handleEnregistrerUneDirection =async()=> {
        
        if(enModeAjoutDirection === true) {
            const data : DirectionsRequestDto = emptyDirectionsRequestDto;
            data.codeDir = ajouterDirectionForm.codeDir.value;
            data.nomDirection = ajouterDirectionForm.nomDirection.value;
            data.abrev = ajouterDirectionForm.abrev.value;
            try{
                await DirectionsService.add(data);
                okSuccessDialog('Données enregistrées avec succès');
                getAllDirections();
                initDirectionForm();
                setEnModeAjoutDirection(false);
            }
            catch(error) {
                okWarnignDialog("Une erreur est survenue lors de l'enrégistrment");
            }
        }
        if(enModeAjoutDirection === false) {
            if(!ligneDirectionSelectionnee) {
                okWarnignDialog("Veuillez d'abord choisir une ligne");
                return;
            }
            const data : DirectionsRequestDto = emptyDirectionsRequestDto;
            data.codeDir = ajouterDirectionForm.codeDir.value;
            data.nomDirection = ajouterDirectionForm.nomDirection.value;
            data.abrev = ajouterDirectionForm.abrev.value;
            try {
                await DirectionsService.edit(ligneDirectionSelectionnee.codDirect,data)
                okSuccessDialog("Données enrégistrées avec succès");
                getAllDirections();
                initDirectionForm();
            }
            catch(error) {
                okWarnignDialog("Une erreur est survenue lors de l'enrégistrment");
            }
        }
    }
    const handleAnnulerAjoutDirection =()=> {
        setEnModeAjoutDirection(false);
        initDirectionForm();
    }
    const handleAnnulerEditionDirection =()=> {
        setLigneDirectionSelectionnee(emptyDirectionsResponseDto);
        initDirectionForm();
    }
    const handleSupprimerDirection =async()=> {
        if(!ligneDirectionSelectionnee) return;
        Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Vous ne pourrez plus revenir en arrière",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor : "#3085d6",
            cancelButtonColor : "#d33",
            confirmButtonText : "Oui, supprimer",
            cancelButtonText: "Annuler"
        }).then(async(result) => {
            if(result.isConfirmed) {
                try{
                    await DirectionsService.delete(ligneDirectionSelectionnee.codDirect);
                    okSuccessDialog("Données supprimées avec succès");
                    setLigneDirectionSelectionnee(emptyDirectionsResponseDto);
                    getAllDirections();
                } catch(error){
                    okWarnignDialog("Une erreur est survenue lors de la suppression");
                }
            }
        })
    }
    const handleAjouterUnService =async()=> {
        setEnModeAjoutService(true)
    }
    const handleAnnulerAjoutService =async()=> {
        setEnModeAjoutService(false)
        initServiceRatacheForm();
    }
    const handleAnnulerEditionService =async()=> {
        setLigneServiceRatacheSelectionnee(emptyServiceResponseDto);
        initServiceRatacheForm();
    }
    const handleEnregistrerUnService =async()=> {
        if(enModeAjoutService === true) {
            const data : ServiceRequestDto = emptyServiceRequestDto;
            data.nomService = ajouterServiceRatacheForm.nomService.value;
            data.abrevService = ajouterServiceRatacheForm.abrevService.value;
            data.codDirect = ligneDirectionSelectionnee.codDirect;
            try{
                await ServiceService.add(data);
                okSuccessDialog('Données enregistrées avec succès');
                getAllServicesRataches();
                initServiceRatacheForm();
                setEnModeAjoutService(false)
            }catch(erreur){
                okWarnignDialog("Une erreur est survenue lors de l'enrégistrment");
            }
        }
        if(enModeAjoutService === false) {
            const data : ServiceRequestDto = emptyServiceRequestDto;
            data.nomService = ajouterServiceRatacheForm.nomService.value;
            data.abrevService = ajouterServiceRatacheForm.abrevService.value;
            data.codDirect = ligneDirectionSelectionnee.codDirect;
            try{
                await ServiceService.edit(ligneServiceRatacheSelectionnee.idService,data);
                okSuccessDialog('Données enregistrées avec succès');
                getAllServicesRataches();
                initServiceRatacheForm();
            }catch(erreur){
                okWarnignDialog("Une erreur est survenue lors de l'enrégistrment");
            }
        }
    }
    const handleSupprimerService =async()=> {
        if(!ligneServiceRatacheSelectionnee) return;
        Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Vous ne pourrez plus revenir en arrière",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor : "#3085d6",
            cancelButtonColor : "#d33",
            confirmButtonText : "Oui, supprimer",
            cancelButtonText: "Annuler"
        }).then(async(result) => {
            try{
                await ServiceService.delete(ligneServiceRatacheSelectionnee.idService);
                okSuccessDialog("Données supprimées avec succès");
                setLigneServiceRatacheSelectionnee(emptyServiceResponseDto);
                getAllServicesRataches();
            }catch(erreur) {
                okWarnignDialog("Erreur lors de la suppression");
            }
        })
    }
    const handleEnregistrer =async()=> {
        if(sectionCibleePourAjout === 'service'){
            return handleEnregistrerUnService();
        }
        handleEnregistrerUneDirection();
    }
    const handleSupprimer =async()=> {
        if(sectionCibleePourAjout === 'service') {
            return handleSupprimerService();
        }
        handleSupprimerDirection();
    }

    //////////APPELS SERVICES//////////
    const getAllDirections =async()=> {
        await DirectionsService.getAll()
        .then((data) => {
            setAllDirections(data);
            console.table(data)
        })
    }
    const getAllServicesRataches =async()=> {
        await ServiceService.getAll()
        .then((data) => {
            setAllServicesRataches(data);
            console.table(data)
        })
    }

    //////////TABLEAUX//////////
    const directionsColumn = [
        {
            name: 'Code',
            width: '10%',
            selector: (row:any) => row.codeDir,
            cell : (row:any) => {
                if(row.codeDir === ID_NOUVELLE_LIGNE_CODE_DIR ) {
                    return (
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={ajouterDirectionForm.codeDir.value}
                            onChange={(e) => setAjouterDirectionForm({...ajouterDirectionForm, codeDir : {value: e.target.value}})}
                        />
                    )
                }
                return (
                    <span style={{ opacity: enModeAjoutDirection ? 0.5 : 1}}>
                        {row.codeDir}
                    </span>
                )
            }
        },
        {
            name: 'Nom',
            selector: (row:any) => row.nomDirection,
            cell : (row:any) => {
                if(row.codeDir === ID_NOUVELLE_LIGNE_CODE_DIR) {
                    return (
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={ajouterDirectionForm.nomDirection.value}
                            onChange={(e) => setAjouterDirectionForm({...ajouterDirectionForm, nomDirection : {value:e.target.value}})}
                        />
                    )
                }
                if(ligneDirectionSelectionnee.codeDir === row.codeDir) {
                    return (
                        <div className="d-flex align-items-center gap-2" style={{ width:'100%'}}>
                            <Form.Control
                                size="sm"
                                type="text"
                                autoFocus
                                value={ajouterDirectionForm.nomDirection.value}
                                onChange={(e) => setAjouterDirectionForm({...ajouterDirectionForm, nomDirection : {value:e.target.value}})}
                            />
                        </div>
                    )
                }
                return (
                    <span 
                        style={{
                            cursor: enModeAjoutDirection ? 'not-allowed' : 'text',
                            opacity: enModeAjoutDirection ? 0.5 : 1,
                            width: '100%',
                            display: 'block'
                        }}
                    >
                        {row.nomDirection}
                    </span>
                )
            }
        },
        {
            name: 'Abréviation',
            selector: (row:any) => row.abrev,
            cell : (row:any) => {
                if(row.codeDir === ID_NOUVELLE_LIGNE_CODE_DIR) {
                    return (
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={ajouterDirectionForm.abrev.value}
                            onChange={(e) => setAjouterDirectionForm({...ajouterDirectionForm, abrev : {value:e.target.value}})}
                        />
                    )
                }
                if(ligneDirectionSelectionnee.codeDir === row.codeDir) {
                    return (
                        <div className="d-flex align-items-center gap-2" style={{ width:'100%'}}>
                            <Form.Control
                                size="sm"
                                type="text"
                                autoFocus
                                value={ajouterDirectionForm.abrev.value}
                                onChange={(e) => setAjouterDirectionForm({...ajouterDirectionForm, abrev : {value:e.target.value}})}
                            />
                        </div>
                    )
                }
                return (
                    <span 
                        style={{
                            cursor: enModeAjoutDirection ? 'not-allowed' : 'text',
                            opacity: enModeAjoutDirection ? 0.5 : 1,
                            width: '100%',
                            display: 'block'
                        }}
                    >
                        {row.abrev}
                    </span>
                )
            }
        }
    ]

    const servicesRatachesColomn = [
        {
            name: 'Rang',
            width: '10%',
            selector: (row:any) => row.codServ,
            cell:(row:any) => {
                if(row.codServ === ID_NOUVELLE_LIGNE_service_RATACHES) {
                    return (
                        <span></span>
                    )
                }
                return (
                    <span>{row.codServ}</span>
                )
            }
        },
        {
            name: 'Nom service',
            selector: (row:any) => row.nomService,
            cell: (row:any) => {
                if(row.codServ === ID_NOUVELLE_LIGNE_service_RATACHES) {
                    return (
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={ajouterServiceRatacheForm.nomService.value}
                            onChange={(e) => setAjouterServiceRatacheForm({...ajouterServiceRatacheForm, nomService : {value:e.target.value}})}
                        />
                    )
                }
                if(ligneServiceRatacheSelectionnee.idService === row.idService) {
                    return (
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={ajouterServiceRatacheForm.nomService.value}
                            onChange={(e) => setAjouterServiceRatacheForm({...ajouterServiceRatacheForm, nomService : {value:e.target.value}})}
                        />
                    )
                }
                return (
                    <span 
                    style={{
                        cursor: enModeAjoutService ? 'not-allowed' : 'text',
                        opacity: enModeAjoutService ? 0.5 : 1,
                        width: '100%',
                        display: 'block'
                    }}
                    >
                    {row.nomService}
                    </span>
                )
            } 
        },
        {
            name: 'Abréviation',
            selector: (row:any) => row.abrevService,
            cell:(row:any) => {
                if(row.codServ === ID_NOUVELLE_LIGNE_service_RATACHES) {
                    return (
                        <div className="d-flex align-items gap-2" style={{width:'100%'}}>
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={ajouterServiceRatacheForm.abrevService.value}
                            onChange={(e) => setAjouterServiceRatacheForm({...ajouterServiceRatacheForm, abrevService:{value:e.target.value}})}
                        />
                        <Button size="sm" variant="secondary" onClick={handleAnnulerAjoutService} title="Annuler l'ajout du service">✕</Button> 
                        </div>
                    )
                }
                if(ligneServiceRatacheSelectionnee.idService === row.idService) {
                    return (
                        <div className="d-flex align-items gap-2" style={{width:'100%'}}>
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={ajouterServiceRatacheForm.abrevService.value}
                            onChange={(e) => setAjouterServiceRatacheForm({...ajouterServiceRatacheForm, abrevService:{value:e.target.value}})}
                        />
                        <Button size="sm" variant="secondary" onClick={handleAnnulerEditionService} title="Annuler l'édition du service">✕</Button> 
                        </div>
                    )
                }
                return (
                    <span 
                    style={{
                        cursor: enModeAjoutService ? 'not-allowed' : 'text',
                        opacity: enModeAjoutService ? 0.5 : 1,
                        width: '100%',
                        display: 'block'
                    }}
                    >
                    {row.abrevService}
                    </span>
                )
            }
        }
    ]

    const conditionalRowStylesDirection = [
        {
            when : (row:any) => row.codeDir === ligneDirectionSelectionnee.codeDir,
            style: {
                backgroundColor : 'blue',
                color : 'white',
                '&hover' : {
                    cursor: 'pointer'
                }
            }
        }
    ]
    const conditionalRowStylesService = [
        {
            when: (row:any) => row.idService === ligneServiceRatacheSelectionnee.idService,
            style: {
                backgroundColor : 'blue',
                color : 'white',
                '&hover' : {
                    cursor:'pointer'
                }
            }
        }
    ]
    const customStyles = {
        headRow: {
            style : {
                backgroundColor: '#dce6f1',
                minHeight: '42px',
                fontSize: '14px'
            },
        },
        headCells: {
            style: {
                color: '#1f3864',
                fontWeighr: 'bold',
                fontSize: '14px',
            },
        },
        rows: {
            style: {
                minHeight: '44px',
                fontSize: '14px',
            },
        },
        cells: {
            style: {
                paddingLeft: '12px',
                paddingRight: '12px',
            },
        }, 
    }

    useEffect(() => {
        getAllDirections()
        getAllServicesRataches()
    },[])

    return (
        <div style={{width:'60%' , margin:'0 auto'}}>
            <h5>Saisie / MAJ Structures Administratives</h5>
            <Card>
                <Card.Header>
                    <Row>
                        <Col className="text-center">
                            <Button
                                variant="success"
                                className="me-2"
                                title="Ajouter"
                                onClick={sectionCibleePourAjout === 'direction' ? handleAjouterUneDirection : handleAjouterUnService}
                                // disabled={ligneDirectionSelectionnee.codDirect}
                            >
                                <AddIcon/>
                            </Button>
                            <Button
                                variant="danger"
                                className="me-2"
                                title="Supprimer"
                                onClick={handleSupprimer}
                                disabled={!ligneDirectionSelectionnee.codDirect}
                            >
                                <DeleteIcon/>
                            </Button>
                            <Button
                                variant="primary"
                                className="me-2"
                                title="Enregistrer les données"
                                onClick={handleEnregistrer}
                            >
                                <SaveSharpIcon/>
                            </Button>
                            <Button
                                variant="success"
                                className="me-2"
                                title="Imprimer"
                            >
                                <PrintRoundedIcon/>
                            </Button>
                            {enModeAjoutDirection && (
                                <Button variant="link" className="ms-2 text-muted" onClick={handleAnnulerAjoutDirection}><strong>Annuler</strong></Button>
                            )}
                            {enModeAjoutDirection === false && ligneDirectionSelectionnee.codDirect && (
                                <Button variant="link" className="ms-2 text-muted" onClick={handleAnnulerEditionDirection}><strong>Annuler</strong></Button>
                            )}
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <div>
                        <span><b>Directions</b></span>
                        <DataTable
                            columns={directionsColumn}
                            data={donneesFinalaAfficherPourDirection}
                            fixedHeader
                            customStyles={customStyles}
                            conditionalRowStyles={conditionalRowStylesDirection}
                            fixedHeaderScrollHeight="250px"
                            noDataComponent="Aucune donnée"
                            highlightOnHover
                            pointerOnHover
                            onRowClicked={(data) => {
                                if(enModeAjoutDirection) return;
                                setSectionCibleePourAjout('direction')
                                setLigneDirectionSelectionnee(data)
                                setAjouterDirectionForm({
                                    codeDir: {value: data.codeDir},
                                    nomDirection:{value: data.nomDirection},
                                    abrev: {value: data.abrev}
                                })
                            }}
                            onRowDoubleClicked={(data) => {
                                setLigneDirectionSelectionnee(emptyDirectionsResponseDto);
                                initDirectionForm();
                            }}
                        />
                    </div>
                    <div
                        onClick={() => {
                            if(!ligneDirectionSelectionnee.codeDir){
                                okWarnignDialog("Veuillez d'abord sélectionner une direction");
                                return;
                            }
                            setSectionCibleePourAjout('service')
                        }}
                        style={{cursor:'pointer'}}
                    >
                        <span><b>Services ratachés</b></span>
                        <DataTable
                            columns={servicesRatachesColomn}
                            data={donneesFinalaAfficherPourServicesRataches}
                            fixedHeader
                            customStyles={customStyles}
                            conditionalRowStyles={conditionalRowStylesService}
                            fixedHeaderScrollHeight="200px"
                            noDataComponent="Aucune donnée"
                            highlightOnHover
                            pointerOnHover
                            onRowClicked={(data) => {
                                setSectionCibleePourAjout('service')
                                setLigneServiceRatacheSelectionnee(data)
                                setAjouterServiceRatacheForm({
                                    nomService: {value: data.nomService},
                                    abrevService: {value: data.nomService},
                                    codDirect: {value: data.codDirect}
                                })
                            }}
                            onRowDoubleClicked={(data) => {
                                setLigneServiceRatacheSelectionnee(emptyServiceResponseDto);
                                initServiceRatacheForm();
                            }}
                        />
                    </div>
                </Card.Body>
                <Card.Footer>

                </Card.Footer>
            </Card>
        </div>
    )
}

export default ParametresSaisieMiseAjourStructuresAdministrativesForm;