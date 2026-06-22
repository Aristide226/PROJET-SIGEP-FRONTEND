//Aristide
import React from "react";
import { useState, useEffect, useMemo } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import { FournisseursRequestDto, FournisseursResponseDto, emptyFournisseursRequestDto, emptyFournisseursResponsetDto } from "../models/fournisseurs";
import { FournisseurTypeResponseDto } from "../models/fournisseur-type";
import FournisseursService from "../services/fournisseurs-service";
import FournisseurTypeService from "../services/fournisseur-type-service";
import DataTable from "react-data-table-component";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Field } from "../../helpers/types";
import { okSuccessDialog } from "../../helpers/dialogs";
import Swal from "sweetalert2";

type FournisseursForm = {
    fournisseur : Field,
	numIfu : Field,
	telFourn : Field,
	bpfourn : Field,
	typF : Field,
}
const ParametresSaisieMiseAjourFournisseursOuDonateursForm = () => {

    //////////ETATS//////////
    const [allFournisseurs, setAllFournisseurs] = useState<FournisseursResponseDto[]>([]);
    const [allFournisseurType, setAllFournisseurType] = useState<FournisseurTypeResponseDto[]>([]);
    const [showAjouterUnFournisseur,setShowAjouterUnFournisseur] = useState(false);

    const[fournisseurForm,setFournisseurForm] = useState<FournisseursForm>({
        fournisseur : {value : ""},
	    numIfu : {value : ""},
	    telFourn : {value : ""},
	    bpfourn : {value : ""},
	    typF : {value : ""},
    })

    // Type sélectionné dans le dropdown 
    const [typeSelectionne, setTypeSelectionne] = useState<string>('');
    const [libelleTypeSelectionne, setLibelleTypeSelectionne] = useState<string>('Tous');
    
    // Recherche par nom (filtrage local)
    const [nomRecherche, setNomRecherche] = useState<string>('');

    // Ligne sélectionnée (pour activer Modifier / Supprimer)
    const [ligneSelectionnee, setLigneSelectionnee] = useState<FournisseursResponseDto>(emptyFournisseursResponsetDto);

    // Mode édition 
    const [idEnEdition, setIdEnEdition] = useState<any>(null);
    const [valeursEdition, setValeursEdition] = useState<FournisseursResponseDto>(emptyFournisseursResponsetDto);
    
    //////////APPELS SERVICES//////////
    const getAllFournisseurs = async () => {
        await FournisseursService.getAll()
            .then((data: any) => {
                setAllFournisseurs(data);
            });
    };

    const getAllFournisseurType = async () => {
        await FournisseurTypeService.getAll()
            .then((data: any) => {
                setAllFournisseurType(data);
            });
    };
    ////////////////////////FONCTIONS//////////////////////////////
    //////////FILTRAGE LOCAL (Type + Nom)//////////
    const fournisseursFiltres = useMemo(() => {
        let resultat = allFournisseurs;

        // Filtre par type
        if (typeSelectionne !== '') {
            resultat = resultat.filter((f: any) => f.typF === typeSelectionne);
        }

        // Filtre par nom (insensible à la casse, recherche "contient")
        if (nomRecherche.trim() !== '') {
            const recherche = nomRecherche.trim().toLowerCase();
            resultat = resultat.filter((f: any) =>
                f.fournisseur?.toLowerCase().includes(recherche)
            );
        }

        return resultat;
    }, [allFournisseurs, typeSelectionne, nomRecherche]);

    //////////GESTION DU DROPDOWN TYPE//////////
    const handleSelectionType = (typF: string, libelle: string) => {
        setTypeSelectionne(typF);
        setLibelleTypeSelectionne(libelle);
    };

    //////////GESTION DE L'EDITION INLINE//////////
    const demarrerEdition = () => {
        if (!ligneSelectionnee || ligneSelectionnee.idFourn === null) return;
        setIdEnEdition(ligneSelectionnee.idFourn);
        setValeursEdition({ ...ligneSelectionnee });
    };

    const annulerEdition = () => {
        setIdEnEdition(null);
        setValeursEdition(emptyFournisseursResponsetDto);
    };

    const handleChangeChampEdition = (champ: string, valeur: string) => {
        setValeursEdition((prev: any) => ({ ...prev, [champ]: valeur }));
    };

    const handleInputChange =(e:any)=> {
        const fieldName : string = e.target.name;
        const fieldValue : string = e.target.value;
        const newField : Field = {[fieldName] : {value : fieldValue}};
        setFournisseurForm({...fournisseurForm, ...newField});
    }

    const handleShowModalAjouterUnFournisseur =()=> {
        if(typeSelectionne === ''){
        Swal.fire({
            icon: 'warning',
            title: 'Type requis',
            text: 'Veuillez sélectionner un type de fournisseur.'
        });
        return;
        }
        setShowAjouterUnFournisseur(true);
    }
    const handleCloseModalAjouterUnFournisseur =()=> {
        setShowAjouterUnFournisseur(false);
    }

    const ajouterUnFournisseur =async(e : React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            const newFournisseur : FournisseursRequestDto = {
                ...emptyFournisseursRequestDto
            } ;
            newFournisseur.fournisseur = fournisseurForm.fournisseur.value;
            newFournisseur.numIfu = fournisseurForm.numIfu.value;
            newFournisseur.telFourn = fournisseurForm.telFourn.value;
            newFournisseur.bpfourn = fournisseurForm.bpfourn.value;
            newFournisseur.typF = typeSelectionne;
            await FournisseursService.add(newFournisseur)
            .then(() => {
                okSuccessDialog("Fournisseur ajouté avec succès");
                setFournisseurForm(emptyFournisseursRequestDto);
            })
        } catch(error) {

        }
    }
    const modifierUnFournisseur = async () => {
        if (idEnEdition === null) return;
        try {
            const data = {
            fournisseur: valeursEdition.fournisseur,
            numIfu: valeursEdition.numIfu,
            telFourn: valeursEdition.telFourn,
            bpfourn: valeursEdition.bpfourn,
            typF: valeursEdition.typF,
            };
            await FournisseursService.edit(idEnEdition, data)
            .then(() => {
                getAllFournisseurs();
                setIdEnEdition(null);
                setValeursEdition(emptyFournisseursResponsetDto);
            });
        } catch(error) {
            console.log(error)
        }
        
    };

    //////////SUPPRESSION//////////
    const supprimerUnFournisseur = async () => {
        if (!ligneSelectionnee || ligneSelectionnee.idFourn === null) {
            alert("Veuillez sélectionner une ligne");
            return;
        }
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
                await FournisseursService.delete(ligneSelectionnee.idFourn)
                .then(() => {
                getAllFournisseurs();
                setLigneSelectionnee(emptyFournisseursResponsetDto);
            });
            }
        })  
    };

    //////////COLONNES (avec édition inline)//////////
    const fournisseursOuDonateursColumn = [
        {
            name: 'Nom',
            grow: 2,
            selector: (row: any) => row.fournisseur,
            cell: (row: any) => (
                idEnEdition === row.idFourn ? (
                    <Form.Control
                        size="sm"
                        type="text"
                        value={valeursEdition.fournisseur ?? ''}
                        onChange={(e) => handleChangeChampEdition('fournisseur', e.target.value)}
                    />
                ) : (
                    <span title={row.fournisseur}>{row.fournisseur}</span>
                )
            ),
        },
        {
            name: 'IFU',
            selector: (row: any) => row.numIfu,
            cell: (row: any) => (
                idEnEdition === row.idFourn ? (
                    <Form.Control
                        size="sm"
                        type="text"
                        value={valeursEdition.numIfu ?? ''}
                        onChange={(e) => handleChangeChampEdition('numIfu', e.target.value)}
                    />
                ) : (
                    <span title={row.numIfu}>{row.numIfu}</span>
                )
            ),
        },
        {
            name: 'Téléphone',
            selector: (row: any) => row.telFourn,
            cell: (row: any) => (
                idEnEdition === row.idFourn ? (
                    <Form.Control
                        size="sm"
                        type="text"
                        value={valeursEdition.telFourn ?? ''}
                        onChange={(e) => handleChangeChampEdition('telFourn', e.target.value)}
                    />
                ) : (
                    <span title={row.telFourn}>{row.telFourn}</span>
                )
            ),
        },
        {
            name: '',
            width: '90px',
            cell: (row: any) => (
                idEnEdition === row.idFourn ? (
                    <div>
                        <Button size="sm" variant="success" className="me-1" onClick={modifierUnFournisseur}>✓</Button>
                        <Button size="sm" variant="secondary" onClick={annulerEdition}>✕</Button>
                    </div>
                ) : null
            ),
        },
    ];

    const conditionalRowStyles = [
        {
            when : (row :any) => row.idFourn === ligneSelectionnee.idFourn,
            style: {
                backgroundColor : 'blue',
                color :'white',
                '&:hover' : {
                    cursor: 'pointer'
                }
            } 
        }
    ]

    useEffect(() => {
        getAllFournisseurs();
        getAllFournisseurType();
    }, []);

    return (
        <div style={{ width: '60%', margin: '0 auto' }}>
            <Card>
                <Card.Header>
                    <Row className="align-items-center mb-2">
                        <Col xs="auto">
                            <strong>Type :</strong>
                        </Col>
                        <Col xs="auto">
                            <Dropdown>
                                <Dropdown.Toggle variant="light">{libelleTypeSelectionne}</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleSelectionType('', 'Tous')}>
                                        Tous
                                    </Dropdown.Item>
                                    {allFournisseurType.map((item : any) => (
                                        <Dropdown.Item
                                            key={item.typF}
                                            onClick={() => handleSelectionType(item.typF, item.libelle)}
                                        >
                                            {item.libelle}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col className="text-end">
                            <Button
                                variant="success"
                                className="me-2"
                                title="Ajouter"
                                disabled = {typeSelectionne === ''}
                                onClick={() => {
                                    handleShowModalAjouterUnFournisseur()
                                }}
                            >
                                <AddIcon/>
                            </Button>
                            <Button
                                variant="primary"
                                className="me-2"
                                title="Modifier"
                                disabled={!ligneSelectionnee.idFourn}
                                onClick={demarrerEdition}
                            >
                                <EditIcon/>
                            </Button>
                            <Button
                                variant="danger"
                                title="Supprimer"
                                disabled={!ligneSelectionnee.idFourn}
                                onClick={supprimerUnFournisseur}
                            >
                                <DeleteIcon/>
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="auto">
                            <strong>Nom contenant : </strong>
                        </Col>
                        <Col>
                            <Form.Control
                                type="text"
                                id="nomContenant"
                                value={nomRecherche}
                                onChange={(e) => setNomRecherche(e.target.value)}
                                placeholder="Rechercher un fournisseur..."
                            />
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <DataTable
                        columns={fournisseursOuDonateursColumn}
                        data={fournisseursFiltres}
                        striped
                        dense
                        highlightOnHover
                        pointerOnHover
                        fixedHeader
                        fixedHeaderScrollHeight="400px"
                        noDataComponent="Aucune donnée"
                        onRowClicked={(data) => {
                            setLigneSelectionnee(data)
                        }}
                        onRowDoubleClicked={() => {
                            setIdEnEdition(null);
                            setLigneSelectionnee(emptyFournisseursResponsetDto)
                            setValeursEdition(emptyFournisseursResponsetDto);
                        }}
                        conditionalRowStyles={conditionalRowStyles}
                    />
                </Card.Body>
                <Card.Footer>
                    <strong>Boite postale : </strong>
                    {ligneSelectionnee.bpfourn ?? ''}
                </Card.Footer>
            </Card>

            {/** Ajouter un fournisseur */}
            <Modal show={showAjouterUnFournisseur} onHide={handleCloseModalAjouterUnFournisseur} backdrop="static" keyboard={false} size="lg" centered>
                <Modal.Header className='bg-light p-3' closeButton>
                        <Modal.Title as="h6">Mise à jour liste des fournisseurs/donnateurs</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-light px-5 py-4">
                    <Form onSubmit={(e) => ajouterUnFournisseur(e)}>
                        <Form.Group as={Row} className="mb-3" controlId="fournisseur">
                            <Form.Label column sm={2} className="text-primary fst-italic">Nom :</Form.Label>
                            <Col sm={10}>
                                <Form.Control type="text" name="fournisseur" onChange={handleInputChange} value={fournisseurForm.fournisseur.value} required/>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="numIfu">
                            <Form.Label column sm={2} className="text-primary fst-italic">IFU :</Form.Label>
                            <Col sm={10}>
                                <Form.Control type="text" name="numIfu" onChange={handleInputChange} value={fournisseurForm.numIfu.value} required/>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="telFourn">
                            <Form.Label column sm={2} className="text-primary fst-italic">Tél. :</Form.Label>
                            <Col sm={10}>
                                <Form.Control type="text" name="telFourn" onChange={handleInputChange} value={fournisseurForm.telFourn.value} required/>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="bpfourn">
                            <Form.Label column sm={2} className="text-primary fst-italic">BP :</Form.Label>
                            <Col sm={10}>
                                <Form.Control type="text" name="bpfourn" onChange={handleInputChange} value={fournisseurForm.bpfourn.value} required/>
                            </Col>
                        </Form.Group>
                        
                        <Card.Footer className="bg-light justify-content-center gap-3 py-3">
                            <Button variant="outline-primary" size="lg">
                                <i className="bi bi-plus-circle-fill text-success me-2"></i>
                                Nouveau
                            </Button>
                            <Button type="submit" variant="outline-secondary" size="lg">
                                <i className="bi bi-save-fill me-2"></i>
                                Enregistrer
                            </Button>
                        </Card.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ParametresSaisieMiseAjourFournisseursOuDonateursForm;