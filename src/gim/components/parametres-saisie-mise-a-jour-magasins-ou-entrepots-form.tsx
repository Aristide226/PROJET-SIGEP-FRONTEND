//Aristide 
import React, { useEffect, useState } from "react";
import { MagasinEntrepotResponseDto, emptyMagasinEntrepotResponseDto } from "../models/magasin-entrepot";
import MagasinEntrepotService from "../services/magasin-entrepot-service";
import DataTable from "react-data-table-component";
import { Button, ButtonGroup, Form } from "react-bootstrap";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import Swal from "sweetalert2";
import { okSuccessDialog } from "../../helpers/dialogs";

const ParametresSaisieMiseAjourMagasinsOuEntrepotsForm = () => {

    //////////ETATS//////////
    const [allMagasinsOuEntrepots, setAllMagasinsOuEntrepots] = useState<MagasinEntrepotResponseDto[]>([]);

    // Ligne sélectionnée (clic sur une ligne) → active le bouton Supprimer
    const [ligneSelectionnee, setLigneSelectionnee] = useState<MagasinEntrepotResponseDto>(emptyMagasinEntrepotResponseDto);

    // Mode "ajout" : une nouvelle ligne vide est ajoutée en bas, en édition
    const [enModeAjout, setEnModeAjout] = useState<boolean>(false);
    const [nouveauLibelle, setNouveauLibelle] = useState<string>('');

    // Edition inline d'une ligne existante (clic sur le libellé)
    const [idEnEdition, setIdEnEdition] = useState<any>(null);
    const [libelleEdition, setLibelleEdition] = useState<string>('');

    // Un id "fantôme" pour repérer la ligne d'ajout dans le tableau
    const ID_NOUVELLE_LIGNE = '__NOUVELLE_LIGNE__';

    //////////APPELS SERVICES//////////
    const getAllMagasinsOuEntrepots = async () => {
        await MagasinEntrepotService.getAll()
            .then((data: any) => {
                setAllMagasinsOuEntrepots(data);
            });
    };

    //////////GESTION DU BOUTON AJOUTER//////////
    const handleAjouter = () => {
        setIdEnEdition(null);
        setLibelleEdition('');
        setNouveauLibelle('');
        setEnModeAjout(true);
        setLigneSelectionnee(emptyMagasinEntrepotResponseDto);
    };

    //////////GESTION DU CLIC SUR UNE LIGNE EXISTANTE (édition inline)//////////
    const handleRowClicked = (row: MagasinEntrepotResponseDto) => {
        if (enModeAjout) return; // on bloque tout le reste pendant l'ajout
        setLigneSelectionnee(row);
        setIdEnEdition(row.idMagasin);
        setLibelleEdition(row.libelleMagasin);
    };

    //////////ENREGISTRER (ajout OU mise à jour selon le contexte)//////////
    const handleEnregistrer = async () => {
        // Cas 1 : on enregistre une nouvelle ligne
        if (enModeAjout) {
            if (nouveauLibelle.trim() === '') return;

            await MagasinEntrepotService.add({ libelleMagasin: nouveauLibelle } as any)
                .then(() => {
                    okSuccessDialog("Ajouté avec succès");
                    setEnModeAjout(false);
                    setNouveauLibelle('');
                    getAllMagasinsOuEntrepots();
                });
            return;
        }

        // Cas 2 : on enregistre la modification d'une ligne existante
        if (idEnEdition !== null) {
            if (libelleEdition.trim() === '') return;

            await MagasinEntrepotService.edit(idEnEdition, { libelleMagasin: libelleEdition } as any)
                .then(() => {
                    okSuccessDialog("Données enrégistrées avec succès");
                    setIdEnEdition(null);
                    setLibelleEdition('');
                    getAllMagasinsOuEntrepots();
                });
            return;
        }
        // Sinon (rien à enregistrer) 
    };

    //////////SUPPRIMER//////////
    const handleSupprimer = async () => {
        if (!ligneSelectionnee || ligneSelectionnee.idMagasin === null) return;
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
                await MagasinEntrepotService.delete(ligneSelectionnee.idMagasin)
                .then(() => {
                setLigneSelectionnee(emptyMagasinEntrepotResponseDto);
                getAllMagasinsOuEntrepots();
                });
            }
        })  
    };

    //////////ANNULER L'AJOUT (clic ailleurs ou touche Echap, optionnel)//////////
    const handleAnnulerAjout = () => {
        setEnModeAjout(false);
        setNouveauLibelle('');
    };

    //////////DONNEES AFFICHEES DANS LE TABLEAU//////////
    // On ajoute une ligne vide "fantôme" en bas si on est en mode ajout
    const donneesAffichees = enModeAjout ? [...allMagasinsOuEntrepots, { idMagasin: ID_NOUVELLE_LIGNE, libelleMagasin: '' }] : allMagasinsOuEntrepots;

    //////////COLONNES//////////
    const magasinsOuEntrepotsColumn = [
        {
            name: "ID",
            width: '80px',
            selector: (row: any) => row.idMagasin,
            cell: (row: any) => (
                row.idMagasin === ID_NOUVELLE_LIGNE ? '' : row.idMagasin
            ),
        },
        {
            name: "Libellé",
            grow: 3,
            selector: (row: any) => row.libelleMagasin,
            cell: (row: any) => {
                // Ligne en cours d'ajout
                if (row.idMagasin === ID_NOUVELLE_LIGNE) {
                    return (
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            placeholder="Saisir le libellé..."
                            value={nouveauLibelle}
                            onChange={(e) => setNouveauLibelle(e.target.value)}
                        />
                    );
                }
                // Ligne existante en cours d'édition
                if (idEnEdition === row.idMagasin) {
                    return (
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={libelleEdition}
                            onChange={(e) => setLibelleEdition(e.target.value)}
                        />
                    );
                }
                // Affichage normal (lecture seule, bloqué si mode ajout actif)
                return (
                    <span
                        style={{
                            cursor: enModeAjout ? 'not-allowed' : 'text',
                            opacity: enModeAjout ? 0.5 : 1,
                            width: '100%',
                            display: 'block',
                        }}
                    >
                        {row.libelleMagasin}
                    </span>
                );
            },
        },
    ];

    useEffect(() => {
        getAllMagasinsOuEntrepots();
    }, []);

    //////////STYLES PERSONNALISES DU TABLEAU (agrandi)//////////
    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#dce6f1',
                minHeight: '42px',
                fontSize: '14px',
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
    };

    return (
        <div style={{ width: '50%', margin: '0 auto' }}>
            <div>
                <h5 className="bg-light p-2 border-bottom"><b>Magasins ou Entrepôts</b></h5>

                <div className="d-flex justify-content-start align-items-center mb-3 mt-2">
                    <ButtonGroup>
                        <Button
                            variant="outline-success"
                            title="Ajouter nouveau"
                            onClick={handleAjouter}
                            disabled={enModeAjout || idEnEdition !== null}
                        >
                            <AddIcon />
                        </Button>
                        <Button
                            variant="outline-danger"
                            title="Supprimer"
                            className="ms-2"
                            disabled={!ligneSelectionnee.idMagasin || enModeAjout}
                            onClick={handleSupprimer}
                        >
                            <DeleteIcon />
                        </Button>
                        <Button
                            variant="outline-primary"
                            title="Enregistrer les données"
                            className="ms-2"
                            disabled={!enModeAjout && idEnEdition === null}
                            onClick={handleEnregistrer}
                        >
                            <SaveIcon />
                        </Button>
                        <Button
                            variant="outline-primary"
                            title="Imprimer"
                            className="ms-2"
                        >
                            <PrintIcon />
                        </Button>
                    </ButtonGroup>

                    {enModeAjout && (
                        <Button
                            variant="link"
                            className="ms-2 text-muted"
                            onClick={handleAnnulerAjout}
                        >
                            <strong>Annuler</strong> 
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={magasinsOuEntrepotsColumn}
                    data={donneesAffichees}
                    customStyles={customStyles}
                    striped
                    highlightOnHover
                    pointerOnHover
                    fixedHeader
                    fixedHeaderScrollHeight="400px"
                    noDataComponent="Aucune donnée"
                    onRowClicked={handleRowClicked}
                />
            </div>
        </div>
    );
};

export default ParametresSaisieMiseAjourMagasinsOuEntrepotsForm;