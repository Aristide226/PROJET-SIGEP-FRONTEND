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
import { emptyPiecesResponseDto, PiecesResponseDto } from "../models/pieces";
import PiecesService from "../services/pieces-service";
import { emptyTypeAcquisitionResponseDto, TypeAcquisitionResponseDto } from "../models/type-acquisition";
import TypeAcquisitionService from "../services/type-acquisition-service";
import { emptySourceFinancementResponseDto, SourceFinancementResponseDto } from "../models/source-financement";
import SourceFinancementService from "../services/source-financement-service";

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

    //////////GESTION TYPE ACQUISITION//////////
    const [allTypeAcquisition,setAllTypeAcquisition] = useState<TypeAcquisitionResponseDto[]>([]);
    const [ligneSelectionneeTypeAcquisition,setLigneSelectionneeTypeAcquisition] = useState<TypeAcquisitionResponseDto>(emptyTypeAcquisitionResponseDto);
    const [enModeAjoutTypeAcquisition,setEnModeAjoutTypeAcquisition] = useState<boolean>(false);
    const [nouveauLibelleTypeAcquisition,setNouveauLibelleTypeAcquisition] = useState<string>('');
    const ID_NOUVELLE_LIGNE_TypeAcquisition = 'NOUVELLE_LIGNE_TypeAcquisition';
    const [idEnEditionTypeAcquisition,setIdEnEditionTypeAcquisition] = useState<any>(null);
    const [libelleEditionTypeAcquisition,setLibelleEditionTypeAcquisition] = useState<string>('');

    const getAllTypeAcquisition =async()=> {
        await TypeAcquisitionService.getAll()
        .then((data) => {
            setAllTypeAcquisition(data)
        })
    }

    const handleAjouterTypeAcquisition =()=> {
        setNouveauLibelleTypeAcquisition('');
        setEnModeAjoutTypeAcquisition(true);
        setLigneSelectionneeTypeAcquisition(emptyTypeAcquisitionResponseDto);
    }

    const handleEnregistrerTypeAcquisition =async()=> {
        if(enModeAjoutTypeAcquisition) {
            if(nouveauLibelleTypeAcquisition.trim() === '') return;

            await TypeAcquisitionService.add({ libTypeAcq : nouveauLibelleTypeAcquisition, exigerEngagement : false} as any)
            .then(() => {
                okSuccessDialog("Ajouté avec succès");
                setEnModeAjoutTypeAcquisition(false);
                setNouveauLibelleTypeAcquisition('');
                getAllTypeAcquisition();
            });
            return;
        }
        if(idEnEditionTypeAcquisition !==null) {
            if(libelleEditionTypeAcquisition.trim()=== '') return;
            await TypeAcquisitionService.edit(
                idEnEditionTypeAcquisition, 
                {libTypeAcq : libelleEditionTypeAcquisition, exigerEngagement : false} as any
            )
            .then(()=> {
                okSuccessDialog("Données enrégistrées avec succès");
                setIdEnEditionTypeAcquisition(null);
                setLibelleEditionTypeAcquisition('');
                getAllTypeAcquisition();
            })
        }
        return;
    }
    const handleSupprimerTypeAcquisition = async () => {
        if (!ligneSelectionneeTypeAcquisition || ligneSelectionneeTypeAcquisition.idTypeAcq === null) return;
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
                await TypeAcquisitionService.delete(ligneSelectionneeTypeAcquisition.idTypeAcq)
                .then(() => {
                    setLigneSelectionneeTypeAcquisition(emptyTypeAcquisitionResponseDto);
                    getAllTypeAcquisition();
                });
            }
        })  
    };
    const handleAnnulerAjoutTypeAcquisition =()=> {
        setEnModeAjoutTypeAcquisition(false);
        setNouveauLibelleTypeAcquisition('');
    }

    const annulerEditionTypeAcquisition =()=> {
        setIdEnEditionTypeAcquisition(null);
    }
    const donneesAfficheesTypeAcquisition = enModeAjoutTypeAcquisition ? [...allTypeAcquisition, {idTypeAcq : ID_NOUVELLE_LIGNE_TypeAcquisition, libTypeAcq : ''}] : allTypeAcquisition;

    const typeAcquisitionColumn = [
        {
            name : "ID",
            width : '10%',
            selector : (row : any) => row.idTypeAcq,
            cell : (row:any) => (
                row.idTypeAcq === ID_NOUVELLE_LIGNE_TypeAcquisition ? '' : row.idTypeAcq
            ),
        },
        {
            name : "Libellé",
            grow: 2,
            selector : (row:any) => row.libTypeAcq,
            cell : (row : any) => {
                if(row.idTypeAcq === ID_NOUVELLE_LIGNE_TypeAcquisition) {
                    return (
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={nouveauLibelleTypeAcquisition}
                            onChange={(e) => setNouveauLibelleTypeAcquisition(e.target.value)}
                        />
                    )
                }
                if(idEnEditionTypeAcquisition === row.idTypeAcq) {
                    return (
                        <div className="d-flex align-items-center gap-2" style={{ width: '100%' }}>
                            <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={libelleEditionTypeAcquisition}
                            onChange={(e) => setLibelleEditionTypeAcquisition(e.target.value)}
                            />
                            <Button size="sm" variant="secondary" onClick={annulerEditionTypeAcquisition}>✕</Button>
                        </div>
                        
                        
                    )
                }
                return (
                    <span
                        style={{
                            cursor: enModeAjoutTypeAcquisition ? 'not-allowed' : 'text',
                            opacity: enModeAjoutTypeAcquisition ? 0.5 : 1,
                            width : '100%',
                            display : 'block'
                        }}
                    >
                        {row.libTypeAcq}
                    </span>
                )
            }
        }
    ]
    const conditionalRowStylesTypeAcquisition = [
        {
            when : (row :any) => row.idTypeAcq === ligneSelectionneeTypeAcquisition.idTypeAcq,
            style: {
                backgroundColor : 'blue',
                color :'white',
                '&:hover' : {
                    cursor: 'pointer'
                }
            } 
        }
    ]
    //////////FIN GESTION TYPE ACQUISITION//////////

    //////////GESTION SOURCE FINANCEMENT//////////
    const [allSourceFinancement,setAllSourceFinancement] = useState<SourceFinancementResponseDto[]>([]);
    const [ligneSelectionneeSourceFinancement,setLigneSelectionneeSourceFinancement] = useState<SourceFinancementResponseDto>(emptySourceFinancementResponseDto);
    const [enModeAjoutSourceFinancement,setEnModeAjoutSourceFinancement] = useState<boolean>(false);
    const [nouveauCodeSourceFinancement,setNouveauCodeSourceFinancement] = useState<string>('');
    const [nouveauLibelleSourceFinancement,setNouveauLibelleSourceFinancement] = useState<string>('');
    const ID_NOUVELLE_LIGNE_SourceFinancement = 'NOUVELLE_LIGNE_SourceFinancement';
    const [idEnEditionSourceFinancement,setIdEnEditionSourceFinancement] = useState<any>(null);
    const [libelleEditionSourceFinancement,setLibelleEditionSourceFinancement] = useState<string>('');

    const getAllSourceFinancement =async()=> {
        await SourceFinancementService.getAll()
        .then((data) => {
            setAllSourceFinancement(data)
        })
    }

    const handleAjouterSourceFinancement =()=> {
        setNouveauCodeSourceFinancement('');
        setNouveauLibelleSourceFinancement('');
        setEnModeAjoutSourceFinancement(true);
        setLigneSelectionneeSourceFinancement(emptySourceFinancementResponseDto);
    }

    const handleEnregistrerSourceFinancement =async()=> {
        if(enModeAjoutSourceFinancement) {
            if(nouveauCodeSourceFinancement.trim() === '' || nouveauLibelleSourceFinancement.trim() === '') return;

            await SourceFinancementService.add({ 
                codSourceFin : nouveauCodeSourceFinancement,
                libSourceFin : nouveauLibelleSourceFinancement,
                abrevSourceFin : '' } as any)
            .then(() => {
                okSuccessDialog("Ajouté avec succès");
                setEnModeAjoutSourceFinancement(false);
                setNouveauCodeSourceFinancement('')
                setNouveauLibelleSourceFinancement('');
                getAllSourceFinancement();
            });
            return;
        }
        if(idEnEditionSourceFinancement !==null) {
            if(libelleEditionSourceFinancement.trim() === '') return;
            await SourceFinancementService.edit(
                idEnEditionSourceFinancement, 
                {
                    codSourceFin : idEnEditionSourceFinancement,
                    libSourceFin : libelleEditionSourceFinancement,
                    abrevSourceFin : ''
                } as any
            )
            .then(()=> {
                okSuccessDialog("Données enrégistrées avec succès");
                setIdEnEditionSourceFinancement(null);
                setLibelleEditionSourceFinancement('');
                getAllSourceFinancement();
            })
        }
        return;
    }
    const handleSupprimerSourceFinancement = async () => {
        if (!ligneSelectionneeSourceFinancement || ligneSelectionneeSourceFinancement.codSourceFin === null) return;
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
                await SourceFinancementService.delete(ligneSelectionneeSourceFinancement.codSourceFin)
                .then(() => {
                    setLigneSelectionneeSourceFinancement(emptySourceFinancementResponseDto);
                    getAllSourceFinancement();
                });
            }
        })  
    };
    const handleAnnulerAjoutSourceFinancement =()=> {
        setEnModeAjoutSourceFinancement(false);
        setNouveauLibelleSourceFinancement('');
    }

    const annulerEditionSourceFinancement =()=> {
        setIdEnEditionSourceFinancement(null);
    }
    const donneesAfficheesSourceFinancement = enModeAjoutSourceFinancement ? [...allSourceFinancement, {codSourceFin : ID_NOUVELLE_LIGNE_SourceFinancement, libSourceFin : ''}] : allSourceFinancement;

    const sourceFinancementColumn = [
        {
            name : "Code",
            width : '10%',
            selector : (row : any) => row.codSourceFin,
            cell : (row:any) => {
                if(row.codSourceFin === ID_NOUVELLE_LIGNE_SourceFinancement) {
                    return (
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={nouveauCodeSourceFinancement}
                            onChange={(e) => setNouveauCodeSourceFinancement(e.target.value)}
                        />
                    );
                }
                return (
                    <span style={{ opacity: enModeAjoutSourceFinancement ? 0.5 : 1}}>
                        {row.codSourceFin}
                    </span>
                )
            }
        },
        {
            name : "Libellé",
            grow: 2,
            selector : (row:any) => row.libSourceFin,
            cell : (row : any) => {
                if(row.codSourceFin === ID_NOUVELLE_LIGNE_SourceFinancement) {
                    return (
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={nouveauLibelleSourceFinancement}
                            onChange={(e) => setNouveauLibelleSourceFinancement(e.target.value)}
                        />
                    )
                }
                if(idEnEditionSourceFinancement === row.codSourceFin) {
                    return (
                        <div className="d-flex align-items-center gap-2" style={{ width: '100%' }}>
                            <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={libelleEditionSourceFinancement}
                            onChange={(e) => setLibelleEditionSourceFinancement(e.target.value)}
                            />
                            <Button size="sm" variant="secondary" onClick={annulerEditionSourceFinancement}>✕</Button>
                        </div>
                    )
                }
                return (
                    <span
                        style={{
                            cursor: enModeAjoutSourceFinancement ? 'not-allowed' : 'text',
                            opacity: enModeAjoutSourceFinancement ? 0.5 : 1,
                            width : '100%',
                            display : 'block'
                        }}
                    >
                        {row.libSourceFin}
                    </span>
                )
            }
        }
    ]
    const conditionalRowStylesSourceFinancement = [
        {
            when : (row :any) => row.codSourceFin === ligneSelectionneeSourceFinancement.codSourceFin,
            style: {
                backgroundColor : 'blue',
                color :'white',
                '&:hover' : {
                    cursor: 'pointer'
                }
            } 
        }
    ]
    //////////FIN GESTION SOURCE FINANCEMENT//////////
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
        getAllTypeAcquisition()
        getAllSourceFinancement()
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
                            onClick={handleAjouterTypeAcquisition}
                            disabled={enModeAjoutTypeAcquisition || idEnEditionTypeAcquisition !== null}
                        >
                            <AddIcon/>
                        </Button>
                        <Button
                            variant="outline-primary"
                            title="Enregistrer les données"
                            className="ms-2"
                            disabled={!enModeAjoutTypeAcquisition && idEnEditionTypeAcquisition == null}
                            onClick={handleEnregistrerTypeAcquisition}
                        >
                            <SaveIcon/>
                        </Button>
                        <Button
                            variant="outline-danger"
                            title="Supprimer"
                            className="ms-2"
                            disabled={!ligneSelectionneeTypeAcquisition.idTypeAcq}
                            onClick={handleSupprimerTypeAcquisition}
                        >
                           <DeleteIcon/> 
                        </Button>

                        {enModeAjoutTypeAcquisition && (
                            <Button variant="link" className="ms-2 text-muted" onClick={handleAnnulerAjoutTypeAcquisition}><strong>Annuler</strong></Button>
                        )}
                    </div>
                    <DataTable
                        columns={typeAcquisitionColumn}
                        data={donneesAfficheesTypeAcquisition}
                        striped
                        highlightOnHover
                        pointerOnHover
                        customStyles={customStyles}
                        conditionalRowStyles={conditionalRowStylesTypeAcquisition}
                        fixedHeader
                        fixedHeaderScrollHeight="400px"
                        noDataComponent="Aucune donnée"
                        onRowClicked={(row:any) => {
                            if(enModeAjoutTypeAcquisition) return;
                            setLigneSelectionneeTypeAcquisition(row);
                            setIdEnEditionTypeAcquisition(row.idTypeAcq);
                            setLibelleEditionTypeAcquisition(row.libTypeAcq);
                        }}
                    />
                </Tab>
                <Tab eventKey="sourceDeFinancement" title="Source de financement">
                    <div className="d-flex align-items-center justify-content-end gap-2 my-2">
                        <Button
                            variant="outline-success"
                            title="Ajouter"
                            onClick={handleAjouterSourceFinancement}
                            disabled={enModeAjoutSourceFinancement || idEnEditionSourceFinancement !== null}
                        >
                            <AddIcon/>
                        </Button>
                        <Button
                            variant="outline-primary"
                            title="Enregistrer les données"
                            className="ms-2"
                            disabled={!enModeAjoutSourceFinancement && idEnEditionSourceFinancement == null}
                            onClick={handleEnregistrerSourceFinancement}
                        >
                            <SaveIcon/>
                        </Button>
                        <Button
                            variant="outline-danger"
                            title="Supprimer"
                            className="ms-2"
                            disabled={!ligneSelectionneeSourceFinancement.codSourceFin}
                            onClick={handleSupprimerSourceFinancement}
                        >
                           <DeleteIcon/> 
                        </Button>

                        {enModeAjoutSourceFinancement && (
                            <Button variant="link" className="ms-2 text-muted" onClick={handleAnnulerAjoutSourceFinancement}><strong>Annuler</strong></Button>
                        )}
                    </div>
                    <DataTable
                        columns={sourceFinancementColumn}
                        data={donneesAfficheesSourceFinancement}
                        striped
                        highlightOnHover
                        pointerOnHover
                        customStyles={customStyles}
                        conditionalRowStyles={conditionalRowStylesSourceFinancement}
                        fixedHeader
                        fixedHeaderScrollHeight="400px"
                        noDataComponent="Aucune donnée"
                        onRowClicked={(row:any) => {
                            if(enModeAjoutSourceFinancement) return;
                            setLigneSelectionneeSourceFinancement(row);
                            setIdEnEditionSourceFinancement(row.codSourceFin);
                            setLibelleEditionSourceFinancement(row.libSourceFin);
                        }}
                    />
                </Tab>
            </Tabs>
        </div>
    )
}
export default ParametresSaisieMiseAjourParametresGenereauxForm;