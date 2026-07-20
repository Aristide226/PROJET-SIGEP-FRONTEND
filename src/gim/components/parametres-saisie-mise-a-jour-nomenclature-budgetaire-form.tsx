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
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';

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
    const[sectionCibleePourAjout, setSectionCibleePourAjout] = useState<'codeBudgetaire'| 'codeMateriel'>('codeBudgetaire');

    const[enModeAjoutCodeMateriel, setEnModeAjoutCodeMateriel] = useState<boolean>(false);
    const[nouveauCodeMaterielId, setNouveauCodeMaterielId] = useState<string>('');
    const[nouveauIntituleMateriel, setNouveauIntituleMateriel] = useState<string>('');
    const[nouvelleDureeVieAn, setNouvelleDureeVieAn] = useState<number>(2);
    const ID_NOUVELLE_LIGNE_CODE_MATERIEL = 'NOUVELLE_LIGNE_CODE_MATERIEL';

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
            // console.table(data);
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

    const donneesFinalaAfficherPourCodeMateriel =useMemo(() => {
        if(enModeAjoutCodeMateriel) {
            return [
                {
                    codMat : ID_NOUVELLE_LIGNE_CODE_MATERIEL,
                    intituleMateriel : '',
                    dureeVieAn : nouvelleDureeVieAn,
                    codBud : ligneDeCodeBudgetaireSelectionnee.codBud
                },
                ...filtrerEnFonctionDeCodBud
            ]
        }
        return filtrerEnFonctionDeCodBud;
    }, [enModeAjoutCodeMateriel,filtrerEnFonctionDeCodBud,nouvelleDureeVieAn,ligneDeCodeBudgetaireSelectionnee]);

    const handleAjouterCodeMateriel = async()=> {
        if(sectionCibleePourAjout === 'codeMateriel') {
            if(!ligneDeCodeBudgetaireSelectionnee.codBud) {
                okWarnignDialog("Veuillez sélectionner d'abord une ligne budgétaire");
                return;
            }
            const codBud = ligneDeCodeBudgetaireSelectionnee.codBud;
            await CodeMaterielService.getMaxNumByCodBud(codBud)
            .then((maxNum: number) => {
                const prochainNum = (maxNum ?? 0) +1;
                const numFormate = String(prochainNum).padStart(2, '0');
                setNouveauCodeMaterielId(`${codBud}.${numFormate}`);
            })
            .catch(() => {
                okWarnignDialog("Erreur lors de la génération du code")
            })
            
            setNouveauIntituleMateriel('');
            setNouvelleDureeVieAn(2);
            setEnModeAjoutCodeMateriel(true);
        }
    }
    const handleAjouterCodeBudgetaire =async()=> {
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
    const handleEnregistrerCodeMateriel = async () => {
        if(nouveauIntituleMateriel.trim() === '') return;
        const maxNum : number = await CodeMaterielService.getMaxNumByCodBud(ligneDeCodeBudgetaireSelectionnee.codBud); 
        await CodeMaterielService.add({
            codMat: nouveauCodeMaterielId,
            num: Number(maxNum +1),
            intituleMateriel: nouveauIntituleMateriel,
            dureeVieAn: nouvelleDureeVieAn,
            art: '',
            codBud: ligneDeCodeBudgetaireSelectionnee.codBud
        })
        .then(() => {
            okSuccessDialog("Ajouter avec succès");
            setEnModeAjoutCodeMateriel(false);
            setNouveauCodeMaterielId('');
            setNouveauIntituleMateriel('');
            setNouvelleDureeVieAn(2);
            getAllCodeMateriel()
        })
        .catch(() => okWarnignDialog("Erreur lors de l'enregistrement"))
    }
    const handleEnregistrer =async()=> {
        if(enModeAjoutCodeMateriel) {
            return handleEnregistrerCodeMateriel();
        }
        return handleEnregistrerCodeBudgetaire();
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
        console.log(idEnEditionCodeBudgetaire)
    }
    const handleAnnulerAjoutCodeMateriel =()=> {
        setEnModeAjoutCodeMateriel(false)
        setNouveauCodeMaterielId('')
        setNouveauIntituleMateriel('')
        setNouvelleDureeVieAn(2)
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
            selector: (row:any) => row.codBudActif,
            cell : (row : any) => (
                row.codBudActif ? <CheckBoxOutlinedIcon/> : <CheckBoxOutlineBlankOutlinedIcon/>
            )
        }
    ]
    
    const codeMaterielColumn = [
        {
            name: 'Code Bud',
            selector: (row:any) => row.codMat,
            cell: (row:any) => {
                if(row.codMat === ID_NOUVELLE_LIGNE_CODE_MATERIEL) {
                    return <span className="text-muted">{nouveauCodeMaterielId || ''}</span>
                }
                return <span>{row.codMat}</span>
            }
        },
        {
            name: 'Intitulé',
            grow: 6,
            selector: (row:any) => row.intituleMateriel,
            cell: (row:any) => {
                if(row.codMat === ID_NOUVELLE_LIGNE_CODE_MATERIEL) {
                    return (
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={nouveauIntituleMateriel}
                            onChange={(e) => setNouveauIntituleMateriel(e.target.value)}
                        />
                    );
                }
                return <span>{row.intituleMateriel}</span>
            }
        },
        {
            name: 'Durée de vie',
            grow: 2,
            selector: (row:any) => row.dureeVieAn,
            cell: (row:any) => {
                if(row.codMat === ID_NOUVELLE_LIGNE_CODE_MATERIEL) {
                    return (
                        <Form.Control
                            size="sm"
                            type="number"
                            min={1}
                            value={nouvelleDureeVieAn}
                            onChange={(e) => setNouvelleDureeVieAn(Number(e.target.value))}
                        />
                    );
                }
                return <span>{row.dureeVieAn}</span>
            }
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
                                onClick={sectionCibleePourAjout==='codeBudgetaire' ? handleAjouterCodeBudgetaire : handleAjouterCodeMateriel}
                                // disabled={
                                //     sectionCibleePourAjout === 'codeBudgetaire' ?
                                //     (idEnEditionCodeBudgetaire !== null) : (ligneDeCodeBudgetaireSelectionnee.codBud || enModeAjoutCodeMateriel)
                                // }
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
                                onClick={handleEnregistrer}
                                disabled={!enModeAjoutCodeBudgetaire && !enModeAjoutCodeMateriel && idEnEditionCodeBudgetaire==null}
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
                            {enModeAjoutCodeMateriel && (
                                <Button variant="link" className="ms-2 text-muted" onClick={handleAnnulerAjoutCodeMateriel}><strong>Annuler</strong></Button>
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
                                setSectionCibleePourAjout('codeBudgetaire');
                            }}
                            onRowDoubleClicked={() => {
                                setLigneDeCodeBudgetaireSelectionnee(emptyCodeBudgetaireResponseDto)
                                setIdEnEditionCodeBudgetaire(null)
                                setIntituleEnEditionCodeBudgetaire("")
                            }}
                        />
                        <div
                            onClick={() => {
                                if(!ligneDeCodeBudgetaireSelectionnee.codBud) {
                                    okWarnignDialog("Veuillez sélectionner d'abord une ligne budgétaire");
                                    return;
                                }
                                setSectionCibleePourAjout('codeMateriel')
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            <span><b>Rubrique budgétaire</b></span>
                            <DataTable
                                columns={codeMaterielColumn}
                                data={donneesFinalaAfficherPourCodeMateriel}
                                striped
                                dense
                                highlightOnHover
                                pointerOnHover
                                fixedHeader
                                fixedHeaderScrollHeight="200px"
                                noDataComponent="Aucune donnée"
                                onRowClicked={() => {
                                    setSectionCibleePourAjout('codeMateriel')
                                }}
                            />
                        </div>
                    </div>
                </Card.Body>
                <Card.Footer>

                </Card.Footer>
            </Card>
        </div>
    )
}

export default ParametresSaisieMiseAjourNomenclatureBudgetaireForm;