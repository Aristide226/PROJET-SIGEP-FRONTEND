//Aristide
import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Dropdown, Row } from "react-bootstrap";
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

const ParametresSaisieMiseAjourNomenclatureBudgetaireForm =()=> {

    //////////ETATS//////////
    const[allCodeBudgetaires, setAllCodeBudgetaires] = useState<CodeBudgetaireResponseDto[]>([]);
    const[allCodeBudgetaireType,setAllCodeBudgetaireType] = useState<CodeBudgTypeResponseDto[]>([]);

    ///TYPE DE CODTYPE sélectionné dans le dropdown
    const [typeCodeTypSelectionne,setTypeCodeTypSelectionne] = useState<number>();
    const [libelleTypeCodeTypSelectionne,setLibelleTypeCodeTypSelectionne] = useState<string>('Choisir un type');

    const[allCodeMateriels,setAllCodeMateriels] = useState<CodeMaterielResponseDto[]>([]);
    const[ligneDeCodeBudgetaireSelectionnee,setLigneDeCodeBudgetaireSelectionnee] = useState<CodeBudgetaireResponseDto>(emptyCodeBudgetaireResponseDto);

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

    const filtrerEnFonctionDeCodBud = useMemo(() => {
        let resultat = allCodeMateriels;
        if(ligneDeCodeBudgetaireSelectionnee) {
            resultat = resultat.filter((item:any) => item.codBud === ligneDeCodeBudgetaireSelectionnee.codBud)
        }
        return resultat;
    },[allCodeMateriels,ligneDeCodeBudgetaireSelectionnee])

    //////////GESTION DU DROPDOWN DU CODTYPE//////////
    const handleSelectionCodTyp = (codTyp: number, intituleTyp: string) => {
        setTypeCodeTypSelectionne(codTyp);
        setLibelleTypeCodeTypSelectionne(intituleTyp);
    }

    //////////TABLEAUX//////////
    const codeBudgetaireColumn = [
        {
            name: 'Code',
            selector: (row:any) => row.codBud
        },
        {
            name: 'Intitulé', 
            grow: 10,
            selector: (row:any) => row.intituleCodBud
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
        {
            name: 'Nomen. EPE',
            grow: 4,
            selector: (row:any) => row.unknown
        },
    ]

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
                            data={filtrerCodeBudgetairesEnFonctionDeCodTyp}
                            striped
                            dense
                            highlightOnHover
                            pointerOnHover
                            fixedHeader
                            fixedHeaderScrollHeight="200px"
                            noDataComponent="Aucune donnée"
                            onRowClicked={(data) => {
                                setLigneDeCodeBudgetaireSelectionnee(data)
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