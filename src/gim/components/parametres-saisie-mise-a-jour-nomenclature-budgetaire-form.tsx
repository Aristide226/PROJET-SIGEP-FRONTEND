//Aristide
import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Dropdown, Form, Row } from "react-bootstrap";
import { CodeBudgetaireResponseDto, emptyCodeBudgetaireResponseDto } from "../models/code-budgetaire";
import CodeBudgetaireService from "../services/code-budgetaire-service";
import DataTable from "react-data-table-component";
import { CodeBudgTypeResponseDto } from "../models/code-Budg-Type";
import CodeBudgTypeService from "../services/code-Budg-Type-service";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveSharpIcon from '@mui/icons-material/SaveSharp';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import { CodeMaterielResponseDto } from "../models/code-materiel";
import CodeMaterielService from "../services/code-materiel-service";
import { okSuccessDialog, okWarnignDialog } from "../../helpers/dialogs";
import Swal from "sweetalert2";

const ParametresSaisieMiseAjourNomenclatureBudgetaireForm =()=> {

    //////////ETATS//////////
    const[allCodeBudgetaires, setAllCodeBudgetaires] = useState<CodeBudgetaireResponseDto[]>([]);
    const[allCodeBudgetaireType,setAllCodeBudgetaireType] = useState<CodeBudgTypeResponseDto[]>([]);

    ///TYPE DE CODTYPE sélectionné dans le dropdown
    const [typeCodeTypSelectionne,setTypeCodeTypSelectionne] = useState<number>();
    const [libelleTypeCodeTypSelectionne,setLibelleTypeCodeTypSelectionne] = useState<string>('Choisir un type');

    const[allCodeMateriels,setAllCodeMateriels] = useState<CodeMaterielResponseDto[]>([]);
    const[ligneDeCodeBudgetaireSelectionnee,setLigneDeCodeBudgetaireSelectionnee] = useState<CodeBudgetaireResponseDto>(emptyCodeBudgetaireResponseDto);
    const[enModeAjoutCodeBudgetaire,setEnModeAjoutCodeBudgetaire] = useState<boolean>(false);
    const[nouveauCodeBudgetaireId,setNouveauCodeBudgetaireId] = useState<any>();
    const[nouveauIntituleCodeBudgetaire,setNouveauIntituleCodeBudgetaire] = useState<string>('');
    const ID_NOUVELLE_LIGNE_CODE_BUDGETAIRE = 'NOUVELLE_LIGNE_CODE_BUDGETAIRE';
    const[idEnEditionCodeBudgetaire,setIdEnEditionCodeBudgetaire] = useState<any>(null);
    const[intituleEnEditionCodeBudgetaire,setIntituleEnEditionCodeBudgetaire] = useState<string>('');

    //////////APPELS SERVICES//////////
    const getAllCodeBudgetaires =async()=> {
        await CodeBudgetaireService.getAll()
        .then((data) => {
            setAllCodeBudgetaires(data);
        })
    }
    const getAllCodeBudgetaireType =async()=> {
        await CodeBudgTypeService.getAll()
        .then((data) => {
            setAllCodeBudgetaireType(data);
        })
    }
    const getAllCodeMateriel =async()=> {
        await CodeMaterielService.getAll()
        .then((data) => {
            setAllCodeMateriels(data)
            console.table(data);
        })
    }
    //////////FONCTIONS//////////
    const filtrerCodeBudgetairesEnFonctionDeCodTyp = useMemo(() => {
        let resultat = allCodeBudgetaires;
        if(typeCodeTypSelectionne !== undefined) {
            resultat = resultat.filter((c:any) => c.codTyp === typeCodeTypSelectionne)
        } 
        return resultat;
    },[allCodeBudgetaires,typeCodeTypSelectionne])
    const donneesFinalaAfficherPourCodeBudgetaire = useMemo(() => {
        if(enModeAjoutCodeBudgetaire) {
            return [
                { codBud : ID_NOUVELLE_LIGNE_CODE_BUDGETAIRE, intituleCodBud : '', codBudActif : true, codTyp : typeCodeTypSelectionne},
                ...filtrerCodeBudgetairesEnFonctionDeCodTyp
            ]
        }
        return filtrerCodeBudgetairesEnFonctionDeCodTyp;
    },[enModeAjoutCodeBudgetaire,filtrerCodeBudgetairesEnFonctionDeCodTyp])

    const filtrerEnFonctionDeCodBud = useMemo(() => {
        let resultat = allCodeMateriels;
        if(ligneDeCodeBudgetaireSelectionnee) {
            resultat = resultat.filter((item:any) => item.codBud === ligneDeCodeBudgetaireSelectionnee.codBud)
        }
        return resultat;
    },[allCodeMateriels,ligneDeCodeBudgetaireSelectionnee])

    const handleAjouterCodeBudgetaire =()=> {
        if(!typeCodeTypSelectionne){
            okWarnignDialog("Veuillez choisir d'abord le type de bien");
            return;
        }
        setNouveauCodeBudgetaireId(undefined);
        setNouveauIntituleCodeBudgetaire('');
        setEnModeAjoutCodeBudgetaire(true);
        setLigneDeCodeBudgetaireSelectionnee(emptyCodeBudgetaireResponseDto);
    }
    const handleEnregistrerCodeBudgetaire =async()=> {
        if(enModeAjoutCodeBudgetaire) {
            if(nouveauCodeBudgetaireId === null || nouveauIntituleCodeBudgetaire.trim() === '') return;
            await CodeBudgetaireService.add({
                codBud : nouveauCodeBudgetaireId,
                intituleCodBud : nouveauIntituleCodeBudgetaire,
                codBudActif : true,
                codTyp : typeCodeTypSelectionne 
            })
            .then(() => {
                okSuccessDialog("Ajouté avec succès");
                setEnModeAjoutCodeBudgetaire(false);
                setNouveauCodeBudgetaireId(null);
                setNouveauIntituleCodeBudgetaire('');
                getAllCodeBudgetaires();
            });
            return;
        }
        if(idEnEditionCodeBudgetaire != null) {
            if(intituleEnEditionCodeBudgetaire.trim() === '') return;
            await CodeBudgetaireService.edit(
                idEnEditionCodeBudgetaire,
                {
                    codBud : idEnEditionCodeBudgetaire,
                    intituleCodBud : intituleEnEditionCodeBudgetaire,
                    codBudActif : ligneDeCodeBudgetaireSelectionnee.codBudActif,
                    codTyp : typeCodeTypSelectionne 
                }
            )
            .then(() => {
                okSuccessDialog("Données enrégistrées avec succès");
                setIdEnEditionCodeBudgetaire(null);
                setIntituleEnEditionCodeBudgetaire('');
                getAllCodeBudgetaires();
            })
        }
        return;
    }
    const handleSupprimerCodeBudgetaire =async () => {
        if(!ligneDeCodeBudgetaireSelectionnee || ligneDeCodeBudgetaireSelectionnee.codBud === null) return;
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
                await CodeBudgetaireService.delete(ligneDeCodeBudgetaireSelectionnee.codBud)
                .then(() => {
                    setLigneDeCodeBudgetaireSelectionnee(emptyCodeBudgetaireResponseDto);
                    setIdEnEditionCodeBudgetaire(null);
                    setIntituleEnEditionCodeBudgetaire('');
                    getAllCodeBudgetaires();
                })
            }
        })
    }
    const handleAnnulerAjoutCodeBudgetaire =()=> {
        setEnModeAjoutCodeBudgetaire(false);
        setNouveauIntituleCodeBudgetaire('');
    }
    const annulerEditionCodeBudgetaire =()=> {
        setIdEnEditionCodeBudgetaire(null);
        setIdEnEditionCodeBudgetaire('');
    }
    //////////GESTION DU DROPDOWN DU CODTYPE//////////
    const handleSelectionCodTyp = (codTyp: number, intituleTyp: string) => {
        setTypeCodeTypSelectionne(codTyp);
        setLibelleTypeCodeTypSelectionne(intituleTyp);
    }

    //////////TABLEAUX//////////
    const codeBudgetaireColumn = [
        {
            name: 'Code',
            width: '10%',
            selector: (row:any) => row.codBud,
            cell : (row:any) => {
                if(row.codBud === ID_NOUVELLE_LIGNE_CODE_BUDGETAIRE) {
                    return (
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={nouveauCodeBudgetaireId}
                            onChange={(e) => setNouveauCodeBudgetaireId(e.target.value)}
                        />
                    );
                }
                return (
                    <span style={{opacity: enModeAjoutCodeBudgetaire ? 0.5 : 1}}>
                        {row.codBud}
                    </span>
                )
            }
        },
        {
            name: 'Intitulé', 
            grow: 10,
            selector: (row:any) => row.intituleCodBud,
            cell : (row: any) => {
                if(row.codBud === ID_NOUVELLE_LIGNE_CODE_BUDGETAIRE) {
                    return (
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={nouveauIntituleCodeBudgetaire}
                            onChange={(e) => setNouveauIntituleCodeBudgetaire(e.target.value)}
                        />
                    )
                }
                if(idEnEditionCodeBudgetaire === row.codBud) {
                    return (
                        <div className="d-flex align-items-center gap-2" style={{ width: '100%' }}>
                            <Form.Control
                                size="sm"
                                type="text"
                                autoFocus
                                value={intituleEnEditionCodeBudgetaire}
                                onChange={(e) => setIntituleEnEditionCodeBudgetaire(e.target.value)}
                            />
                            <Button size="sm" variant="secondary" onClick={annulerEditionCodeBudgetaire}>✕</Button>
                        </div>
                    )
                }
                return (
                    <span
                        style={{
                            cursor: enModeAjoutCodeBudgetaire ? 'not-allowed' : 'text',
                            opacity: enModeAjoutCodeBudgetaire ? 0.5 : 1,
                            width: '100%',
                            display: 'block'
                        }}
                    >
                        {row.intituleCodBud}
                    </span>
                )
            }
        },
        {
            name: 'Actif',
            selector: (row:any) => row.codBudActif
        }
    ]

    const codeMaterielColumn = [
        {
            name: 'Code Bud',
            selector: (row:any) => row.codMat
        },
        {
            name: 'Intitulé',
            grow: 6,
            selector: (row:any) => row.intituleMateriel
        },
        {
            name: 'Durée de vie',
            grow: 2,
            selector: (row:any) => row.dureeVieAn
        },
    ]
    const conditionalRowStylesCodeBudgetaire = [
        {
            when : (row:any) => row.codBud === ligneDeCodeBudgetaireSelectionnee.codBud,
            style: {
                backgroundColor : 'blue',
                color : 'white',
                '&:hover' : {
                    cursor: 'pointer'
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
                fontWeight: 'bold',
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
        getAllCodeBudgetaires();
        getAllCodeBudgetaireType();
        getAllCodeMateriel();
    },[])

    return (
        <div style={{ width: '60%', margin: '0 auto' }}>
            <Card>
                <Card.Header>
                    <Row>
                        <Col className="text-center">
                            <Button
                                variant="success"
                                className="me-2"
                                title="Ajouter"
                                onClick={handleAjouterCodeBudgetaire}
                                disabled={enModeAjoutCodeBudgetaire || idEnEditionCodeBudgetaire !== null}
                            >
                                <AddIcon/>
                            </Button>
                            <Button
                                variant="danger"
                                className="me-2"
                                title="Supprimer"
                                onClick={handleSupprimerCodeBudgetaire}
                                disabled={!ligneDeCodeBudgetaireSelectionnee.codBud}
                            >
                                <DeleteIcon/>
                            </Button>
                            <Button
                                variant="primary"
                                className="me-2"
                                title="Enregistrer les données"
                                onClick={handleEnregistrerCodeBudgetaire}
                                disabled={!enModeAjoutCodeBudgetaire && idEnEditionCodeBudgetaire==null}
                            >
                                <SaveSharpIcon/>
                            </Button>
                            <Button
                                variant="success"
                                className="me-2"
                                title="Imprimer la nomenclature"
                            >
                                <PrintRoundedIcon/>
                            </Button>
                            {enModeAjoutCodeBudgetaire && (
                                <Button variant="link" className="ms-2 text-muted" onClick={handleAnnulerAjoutCodeBudgetaire}><strong>Annuler</strong></Button>
                            )}
                        </Col>
                    </Row>
                    <Row className="align-items-center mb-2">
                        <Col xs="auto">
                            <strong>Type de bien: {typeCodeTypSelectionne}</strong>
                        </Col>
                        <Col xs="auto">
                            <Dropdown>
                                <Dropdown.Toggle variant="light">{libelleTypeCodeTypSelectionne}</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item></Dropdown.Item>
                                    {allCodeBudgetaireType.map((item : any) => (
                                        <Dropdown.Item
                                            key={item.codTyp}
                                            onClick={() => handleSelectionCodTyp(item.codTyp,item.intituleTyp)}
                                        >
                                            {item.intituleTyp}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <div>
                        <span><b>Sommaire budgétaire activé</b></span>
                        <DataTable
                            columns={codeBudgetaireColumn}
                            data={donneesFinalaAfficherPourCodeBudgetaire}
                            striped
                            dense
                            highlightOnHover
                            pointerOnHover
                            customStyles={customStyles}
                            conditionalRowStyles={conditionalRowStylesCodeBudgetaire}
                            fixedHeader
                            fixedHeaderScrollHeight="200px"
                            noDataComponent="Aucune donnée"
                            onRowClicked={(data) => {
                                if(enModeAjoutCodeBudgetaire) return;
                                setLigneDeCodeBudgetaireSelectionnee(data);
                                setIdEnEditionCodeBudgetaire(data.codBud);
                                setIntituleEnEditionCodeBudgetaire(data.intituleCodBud);
                            }}
                            onRowDoubleClicked={() => {
                                setLigneDeCodeBudgetaireSelectionnee(emptyCodeBudgetaireResponseDto)
                            }}
                        />
                        <span><b>Rubrique budgétaire</b></span>
                        <DataTable
                            columns={codeMaterielColumn}
                            data={filtrerEnFonctionDeCodBud}
                            striped
                            dense
                            highlightOnHover
                            pointerOnHover
                            fixedHeader
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

export default ParametresSaisieMiseAjourNomenclatureBudgetaireForm;