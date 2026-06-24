//Aristide
import React, { useEffect, useState } from "react";
import { Button, Form, Tab, Tabs } from "react-bootstrap";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import Swal from "sweetalert2";
import { okSuccessDialog } from "../../helpers/dialogs";
import { emptyEtatBienResponseDto, EtatBienResponseDto } from "../models/etat-bien";
import EtatBienService from "../services/etat-bien-service";
import DataTable from "react-data-table-component";
import { fontSize, minHeight, style } from "@mui/system";
import { emptyPiecesResponseDto, PiecesResponseDto } from "../models/pieces";
import PiecesService from "../services/pieces-service";

const ParametresSaisieMiseAjourParametresGenereauxForm =()=> {

    //////////GESTION TAB ETAT DES BIENS //////////
    const [allEtatBiens,setAllEtatBiens] = useState<EtatBienResponseDto[]>([]);
    const [ligneSelectionneeEtatBien,setLigneSelectionneeEtatBien] = useState<EtatBienResponseDto>(emptyEtatBienResponseDto);
    const [enModeAjoutEtatBien,setEnModeAjoutEtatBien] = useState<boolean>(false);
    const [nouveauLibelleEtatBien,setNouveauLibelleEtatBien] = useState<string>('');
    const ID_NOUVELLE_LIGNE_EtatBien = 'NOUVELLE_LIGNE';

    const getAllEtatBiens =async()=> {
        await EtatBienService.getAll()
        .then((data) => {
            setAllEtatBiens(data)
        })
    }

    const handleAjouterEtatBien =()=> {
        setNouveauLibelleEtatBien('');
        setEnModeAjoutEtatBien(true);
        setLigneSelectionneeEtatBien(emptyEtatBienResponseDto);
    }

    const handleEnregistrerEtatBien =async()=> {
        if(enModeAjoutEtatBien) {
            if(nouveauLibelleEtatBien.trim() === '') return;

            await EtatBienService.add({ etatB : nouveauLibelleEtatBien} as any)
            .then(() => {
                okSuccessDialog("Ajouté avec succès");
                setEnModeAjoutEtatBien(false);
                setNouveauLibelleEtatBien('');
                getAllEtatBiens();
            });
            return;
        }
    }
    const handleSupprimerEtatBien = async () => {
        if (!ligneSelectionneeEtatBien || ligneSelectionneeEtatBien.etatB === null) return;
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
                await EtatBienService.delete(ligneSelectionneeEtatBien.etatB)
                .then(() => {
                    setLigneSelectionneeEtatBien(emptyEtatBienResponseDto);
                    getAllEtatBiens();
                });
            }
        })  
    };
    const handleAnnulerAjoutEtatBien =()=> {
        setEnModeAjoutEtatBien(false);
        setNouveauLibelleEtatBien('');
    }

    const donneesAfficheesEtatBien = enModeAjoutEtatBien ? [...allEtatBiens, {etatB : ID_NOUVELLE_LIGNE_EtatBien, libelleEtatBien : ''}] : allEtatBiens;

    const etatDesBiensColumn = [
        {
            name : "ETAT",
            grow: 2,
            selector : (row:any) => row.etatB,
            cell : (row : any) => {
                if(row.etatB === ID_NOUVELLE_LIGNE_EtatBien) {
                    return (
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={nouveauLibelleEtatBien}
                            onChange={(e) => setNouveauLibelleEtatBien(e.target.value)}
                        />
                    )
                }
                return (
                    <span
                        style={{
                            cursor: enModeAjoutEtatBien ? 'not-allowed' : 'text',
                            opacity: enModeAjoutEtatBien ? 0.5 : 1,
                            width : '100%',
                            display : 'block'
                        }}
                    >
                        {row.etatB}
                    </span>
                )
            }
        }
    ]
    const conditionalRowStylesEtatBien = [
        {
            when : (row :any) => row.etatB === ligneSelectionneeEtatBien.etatB,
            style: {
                backgroundColor : 'blue',
                color :'white',
                '&:hover' : {
                    cursor: 'pointer'
                }
            } 
        }
    ]
    //////////FIN GESTION TAB ETAT DES BIENS //////////

    //////////GESTION PIECES JUSTIFICATIVES//////////
    const [allPieces,setAllPieces] = useState<PiecesResponseDto[]>([]);
    const [ligneSelectionneePiece,setLigneSelectionneePiece] = useState<PiecesResponseDto>(emptyPiecesResponseDto);
    const [enModeAjoutPiece,setEnModeAjoutPiece] = useState<boolean>(false);
    const [nouveauLibellePiece,setNouveauLibellePiece] = useState<string>('');
    const ID_NOUVELLE_LIGNE_PIECE = 'NOUVELLE_LIGNE_PIECE';
    const [idEnEditionPiece,setIdEnEditionPiece] = useState<any>(null);
    const [libelleEditionPiece,setLibelleEditionPiece] = useState<string>('');

    const getAllPieces =async()=> {
        await PiecesService.getAll()
        .then((data) => {
            setAllPieces(data)
        })
    }

    const handleAjouterPiece =()=> {
        setNouveauLibellePiece('');
        setEnModeAjoutPiece(true);
        setLigneSelectionneePiece(emptyPiecesResponseDto);
    }

    const handleEnregistrerPiece =async()=> {
        if(enModeAjoutPiece) {
            if(nouveauLibellePiece.trim() === '') return;

            await PiecesService.add({ naturePiece : nouveauLibellePiece} as any)
            .then(() => {
                okSuccessDialog("Ajouté avec succès");
                setEnModeAjoutPiece(false);
                setNouveauLibellePiece('');
                getAllPieces();
            });
            return;
        }
        if(idEnEditionPiece !==null) {
            if(libelleEditionPiece.trim()=== '') return;
            await PiecesService.edit(
                idEnEditionPiece, 
                {naturePiece : libelleEditionPiece} as any
            )
            .then(()=> {
                okSuccessDialog("Données enrégistrées avec succès");
                setIdEnEditionPiece(null);
                setLibelleEditionPiece('');
                getAllPieces();
            })
        }
        return;
    }
    const handleSupprimerPiece = async () => {
        if (!ligneSelectionneePiece || ligneSelectionneePiece.idPieces === null) return;
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
                await PiecesService.delete(ligneSelectionneePiece.idPieces)
                .then(() => {
                    setLigneSelectionneePiece(emptyPiecesResponseDto);
                    getAllPieces();
                });
            }
        })  
    };
    const handleAnnulerAjoutPiece =()=> {
        setEnModeAjoutPiece(false);
        setNouveauLibellePiece('');
    }

    const annulerEditionPiece =()=> {
        setIdEnEditionPiece(null);
    }
    const donneesAfficheesPiece = enModeAjoutPiece ? [...allPieces, {idPieces : ID_NOUVELLE_LIGNE_PIECE, naturePiece : ''}] : allPieces;

    const piecesColumn = [
        {
            name : "ID",
            width : '10%',
            selector : (row : any) => row.idPieces,
            cell : (row:any) => (
                row.idPieces === ID_NOUVELLE_LIGNE_PIECE ? '' : row.idPieces
            ),
        },
        {
            name : "Pièce",
            grow: 2,
            selector : (row:any) => row.etatB,
            cell : (row : any) => {
                if(row.idPieces === ID_NOUVELLE_LIGNE_PIECE) {
                    return (
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={nouveauLibellePiece}
                            onChange={(e) => setNouveauLibellePiece(e.target.value)}
                        />
                    )
                }
                if(idEnEditionPiece === row.idPieces) {
                    return (
                        <div className="d-flex align-items-center gap-2" style={{ width: '100%' }}>
                            <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={libelleEditionPiece}
                            onChange={(e) => setLibelleEditionPiece(e.target.value)}
                            />
                            <Button size="sm" variant="secondary" onClick={annulerEditionPiece}>✕</Button>
                        </div>
                        
                        
                    )
                }
                return (
                    <span
                        style={{
                            cursor: enModeAjoutPiece ? 'not-allowed' : 'text',
                            opacity: enModeAjoutPiece ? 0.5 : 1,
                            width : '100%',
                            display : 'block'
                        }}
                    >
                        {row.naturePiece}
                    </span>
                )
            }
        }
    ]
    const conditionalRowStylesPieces = [
        {
            when : (row :any) => row.idPieces === ligneSelectionneePiece.idPieces,
            style: {
                backgroundColor : 'blue',
                color :'white',
                '&:hover' : {
                    cursor: 'pointer'
                }
            } 
        }
    ]
    //////////FIN GESTION PIECES JUSTIFICATIVES//////////
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
        getAllEtatBiens()
        getAllPieces()
    },[])

    return (
        <div style={{width:'55%', margin:'0 auto'}}>
            <Tabs defaultActiveKey="profile" className="" fill>
                <Tab eventKey="etatBien" title="Etat des biens">
                    <div className="d-flex align-items-center justify-content-end gap-2 my-2">
                        <Button
                            variant="outline-success"
                            title="Ajouter"
                            onClick={handleAjouterEtatBien}
                            disabled={enModeAjoutEtatBien}
                        >
                            <AddIcon/>
                        </Button>
                        <Button
                            variant="outline-primary"
                            title="Enregistrer les données"
                            className="ms-2"
                            disabled={!enModeAjoutEtatBien}
                            onClick={handleEnregistrerEtatBien}
                        >
                            <SaveIcon/>
                        </Button>
                        <Button
                            variant="outline-danger"
                            title="Supprimer"
                            className="ms-2"
                            disabled={!ligneSelectionneeEtatBien.etatB}
                            onClick={handleSupprimerEtatBien}
                        >
                           <DeleteIcon/> 
                        </Button>
                        {enModeAjoutEtatBien && (
                            <Button variant="link" className="ms-2 text-muted" onClick={handleAnnulerAjoutEtatBien}><strong>Annuler</strong></Button>
                        )}
                    </div>
                    <DataTable
                        columns={etatDesBiensColumn}
                        data={donneesAfficheesEtatBien}
                        striped
                        highlightOnHover
                        pointerOnHover
                        customStyles={customStyles}
                        conditionalRowStyles={conditionalRowStylesEtatBien}
                        fixedHeader
                        fixedHeaderScrollHeight="400px"
                        noDataComponent="Aucune donnée"
                        onRowClicked={(row:any) => {
                            if(enModeAjoutEtatBien) return;
                            setLigneSelectionneeEtatBien(row)
                        }}
                    />
                </Tab>
                <Tab eventKey="listeDesPieceJustificatives" title="Liste des pièces justificatives">
                    <div className="d-flex align-items-center justify-content-end gap-2 my-2">
                        <Button
                            variant="outline-success"
                            title="Ajouter"
                            onClick={handleAjouterPiece}
                            disabled={enModeAjoutPiece || idEnEditionPiece !== null}
                        >
                            <AddIcon/>
                        </Button>
                        <Button
                            variant="outline-primary"
                            title="Enregistrer les données"
                            className="ms-2"
                            disabled={!enModeAjoutPiece && idEnEditionPiece == null}
                            onClick={handleEnregistrerPiece}
                        >
                            <SaveIcon/>
                        </Button>
                        <Button
                            variant="outline-danger"
                            title="Supprimer"
                            className="ms-2"
                            disabled={!ligneSelectionneePiece.idPieces}
                            onClick={handleSupprimerPiece}
                        >
                           <DeleteIcon/> 
                        </Button>

                        {enModeAjoutPiece && (
                            <Button variant="link" className="ms-2 text-muted" onClick={handleAnnulerAjoutPiece}><strong>Annuler</strong></Button>
                        )}
                    </div>
                    <DataTable
                        columns={piecesColumn}
                        data={donneesAfficheesPiece}
                        striped
                        highlightOnHover
                        pointerOnHover
                        customStyles={customStyles}
                        conditionalRowStyles={conditionalRowStylesPieces}
                        fixedHeader
                        fixedHeaderScrollHeight="400px"
                        noDataComponent="Aucune donnée"
                        onRowClicked={(row:any) => {
                            if(enModeAjoutPiece) return;
                            setLigneSelectionneePiece(row);
                            setIdEnEditionPiece(row.idPieces);
                            setLibelleEditionPiece(row.naturePiece);
                        }}
                    />
                </Tab>
                <Tab eventKey="modeDacquisition" title="Mode d'acquisition">
                    <div className="d-flex align-items-center justify-content-end gap-2 my-2">
                        <Button
                            variant="outline-success"
                            title="Ajouter"
                        >
                            <AddIcon/>
                        </Button>
                        <Button
                            variant="outline-danger"
                            title="Supprimer"
                        >
                           <DeleteIcon/> 
                        </Button>
                        <Button
                            variant="outline-primary"
                            title="Enregistrer les données"
                        >
                            <SaveIcon/>
                        </Button>
                    </div>
                </Tab>
                <Tab eventKey="sourceDeFinancement" title="Source de financement">
                    <div className="d-flex align-items-center justify-content-end gap-2 my-2">
                        <Button
                            variant="outline-success"
                            title="Ajouter"
                        >
                            <AddIcon/>
                        </Button>
                        <Button
                            variant="outline-danger"
                            title="Supprimer"
                        >
                           <DeleteIcon/> 
                        </Button>
                        <Button
                            variant="outline-primary"
                            title="Enregistrer les données"
                        >
                            <SaveIcon/>
                        </Button>
                    </div>
                </Tab>
            </Tabs>
        </div>
    )
}
export default ParametresSaisieMiseAjourParametresGenereauxForm;