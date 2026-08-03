//Aristide

import { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { DirectionsRequestDto, DirectionsResponseDto, emptyDirectionsRequestDto, emptyDirectionsResponseDto } from "../models/directions";
import { ServiceResponseDto } from "../models/service";
import DirectionsService from "../services/directions-services";
import ServiceService from "../services/service-service";
import DataTable from "react-data-table-component";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveSharpIcon from '@mui/icons-material/SaveSharp';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import { Field } from "../../helpers/types";
import { okSuccessDialog } from "../../helpers/dialogs";

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
    const ID_NOUVELLE_LIGNE_CODE_DIR = 'NOUVELLE_LIGNE_CODE_DIR';
    const[enModeAjoutDirection,setEnModeAjoutDirection] = useState<boolean>(false);
    const[enModeModificationDirection,setEnModeModificationDirection] = useState<boolean>(false);
    const[sectionCibleePourAjout,setSectionCibleePourAjout] = useState<'direction'|'service'>('direction');
    const[ligneDirectionSelectionnee,setLigneDirectionSelectionnee] = useState<DirectionsResponseDto>(emptyDirectionsResponseDto);

    //////////FONCTIONS//////////
    const handleInputChangeDirection =(e:any)=> {
        const fieldName: string = e.target.name;
        const fieldValue: string = e.target.value;
        const newField : Field = {[fieldName]: {value: fieldValue}, error:'', isValid:true};
        setAjouterDirectionForm({...ajouterDirectionForm, ...newField})
    }
    const initsetAjouterDirectionForm =()=> {
        setAjouterDirectionForm({
            codeDir: {value: ''},
            nomDirection:{value: ''},
            abrev: {value: ''}
        })
    }
    const donneesFinalaAfficherPourDirection = useMemo(() => {
        if(enModeAjoutDirection) {
            return [
                {codeDir : ID_NOUVELLE_LIGNE_CODE_DIR, nomDirection: '', abrev : '', codDirect:''}
            ]
        }
        return allDirections;
    },[enModeAjoutDirection,allDirections])

    const handleAjouterUneDirection =async()=> {
        setEnModeAjoutDirection(true);
    }
    const handleEnregistrerUneDirection =async()=> {
        
        if(enModeAjoutDirection === true) {
            const data : DirectionsRequestDto = emptyDirectionsRequestDto;
            data.codeDir = ajouterDirectionForm.codeDir.value;
            data.nomDirection = ajouterDirectionForm.nomDirection.value;
            data.abrev = ajouterDirectionForm.abrev.value;
            await DirectionsService.add(data)
            .then((data) => {
                okSuccessDialog('Données enregistrées avec succès')
                getAllDirections()
                setAjouterDirectionForm({
                    codeDir: {value: ''},
                    nomDirection:{value: ''},
                    abrev: {value: ''}
                })
            })
        }
    }
    const handleAnnulerAjoutDirection =()=> {
        setEnModeAjoutDirection(false);
    }
    const handleAjouterUnService =async()=> {

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
                        {row.nomDirection}
                    </span>
                )
            }
        }
    ]

    const servicesRatachesColomn = [
        {
            name: 'Rang',
            width: '10%',
            selector: (row:any) => row.codServ
        },
        {
            name: 'Nom service',
            selector: (row:any) => row.nomService
        },
        {
            name: 'Abréviation',
            selector: (row:any) => row.abrevService
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
                            >
                                <AddIcon/>
                            </Button>
                            <Button
                                variant="danger"
                                className="me-2"
                                title="Supprimer"

                            >
                                <DeleteIcon/>
                            </Button>
                            <Button
                                variant="primary"
                                className="me-2"
                                title="Enregistrer les données"
                                onClick={handleEnregistrerUneDirection}
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
                            fixedHeaderScrollHeight="250px"
                            noDataComponent="Aucune donnée"
                            highlightOnHover
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
                                setLigneDirectionSelectionnee(emptyDirectionsResponseDto)
                            }}
                        />
                    </div>
                    <div>
                        <span><b>Services ratachés</b></span>
                        <DataTable
                            columns={servicesRatachesColomn}
                            data={allServicesRataches}
                            fixedHeader
                            customStyles={customStyles}
                            fixedHeaderScrollHeight="200px"
                            noDataComponent="Aucune donnée"
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