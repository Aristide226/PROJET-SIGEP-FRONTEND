//Aristide
import React from "react"
import Tab  from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useEffect,useState } from "react";
import PatrimoineStatutService from "../services/patrimoine-statut-service";
import { okWarnignDialog } from "../../helpers/dialogs";
import { Button, Spinner  } from "react-bootstrap";
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import TypFicheService from "../services/typ-fiche-service";
import EtatFicheService from "../services/etat-fiche-service";
import CategorieBienService from "../services/categorie-bien-service";


const ParametresParametresSystemesForm =()=> {

    //////////ETATS//////////
    const[categorieBienpdfUrl,setCategorieBienpdfUrl] = useState("");
    const [statutDeBienpdfUrl,setStatutDeBienpdfUrl] = useState("");
    const [typeDeFichePdfUrl,setTypeDeFichePdfUrl] = useState("");
    const [etatFichePdfUrl,setEtatFichePdfUrl] = useState("");

    //////////APPELS SERVICES FONCTIONS
   
    //////////FONCTIONS//////////
    const genererLeRapportDeCategorieBien =async()=> {
        try {
            const pdfBlob = await CategorieBienService.categorieBienReport();
            const url = window.URL.createObjectURL(pdfBlob);
            setCategorieBienpdfUrl(url)
        } catch {
            okWarnignDialog("Erreur lors de l'impression")
        }
        
    }
    const genererLeRapport =async()=> {
        try {
            const pdfBlob = await PatrimoineStatutService.statutBienReport();
            const url = window.URL.createObjectURL(pdfBlob);
            setStatutDeBienpdfUrl(url)
        } catch {
            okWarnignDialog("Erreur lors de l'impression")
        }
        
    }
    const genererLeRapportDeTypDeFiche =async()=> {
        try {
            const pdfBlob = await TypFicheService.typFicheReport();
            const url = window.URL.createObjectURL(pdfBlob);
            setTypeDeFichePdfUrl(url)
        } catch {
            okWarnignDialog("Erreur lors de l'impression")
        }
        
    }
    const genererLeRapportDeEtatFiche =async()=> {
        try {
            const pdfBlob = await EtatFicheService.etatFicheReport();
            const url = window.URL.createObjectURL(pdfBlob);
            setEtatFichePdfUrl(url)
        } catch {
            okWarnignDialog("Erreur lors de l'impression")
        }
        
    }
    
    const handlePrintCategorieBien = () => {
        if (!categorieBienpdfUrl) return;
        const iframe = document.getElementById("pdf-categorie-de-bien-frame") as HTMLIFrameElement;
        if (iframe) {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
        }
    };
    const handlePrint = () => {
        if (!statutDeBienpdfUrl) return;
        const iframe = document.getElementById("pdf-frame") as HTMLIFrameElement;
        if (iframe) {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
        }
    };
    const handlePrintTypDeFiche = () => {
        if (!typeDeFichePdfUrl) return;
        const iframe = document.getElementById("pdf-typ-de-fiche-frame") as HTMLIFrameElement;
        if (iframe) {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
        }
    };
    const handlePrintEtatDeFiche = () => {
        if (!etatFichePdfUrl) return;
        const iframe = document.getElementById("pdf-etat-de-fiche-frame") as HTMLIFrameElement;
        if (iframe) {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
        }
    };

    const handleDownloadCategorieDeBien = () => {
        if (!typeDeFichePdfUrl) return;
        const link = document.createElement("a");
        link.href = typeDeFichePdfUrl;
        link.download = "CatBien.pdf";
        link.click();
    };
    const handleDownload = () => {
        if (!statutDeBienpdfUrl) return;
        const link = document.createElement("a");
        link.href = statutDeBienpdfUrl;
        link.download = "PatrimoinStatu.pdf";
        link.click();
    };
    const handleDownloadTypDeFiche = () => {
        if (!typeDeFichePdfUrl) return;
        const link = document.createElement("a");
        link.href = typeDeFichePdfUrl;
        link.download = "Fiche.pdf";
        link.click();
    };
    const handleDownloadEtatDeFiche = () => {
        if (!etatFichePdfUrl) return;
        const link = document.createElement("a");
        link.href = etatFichePdfUrl;
        link.download = "EtatFiche.pdf";
        link.click();
    };

    useEffect(() => {

    },[])

    return (
        <div style={{ width:'60%', margin:'0 auto'}} >
            <Tabs
              defaultActiveKey="profile" 
              className="" 
              fill
            >
                <Tab eventKey="categorieBien" title="Catégories de bien">
                    {/* Barre d'outils */}
                    <div className="d-flex align-items-center gap-2 my-2">
                        <Button
                            variant="outline-primary"
                            title="Charger le rapport"
                            onClick={genererLeRapportDeCategorieBien}
                        >
                            <><PrintIcon fontSize="small" className="me-1" />Générer</>
                        </Button>

                        {categorieBienpdfUrl && (
                             <>
                                <Button
                                    variant="outline-secondary"
                                    title="Imprimer"
                                    onClick={handlePrintCategorieBien}
                                >
                                    <PrintIcon fontSize="small" className="me-1" />
                                    Imprimer
                                </Button>

                                <Button
                                    variant="outline-success"
                                    title="Télécharger le PDF"
                                    onClick={handleDownloadCategorieDeBien}
                                >
                                    <DownloadIcon fontSize="small" className="me-1" />
                                    Télécharger
                                </Button>
                            </>
                        )}
                    </div>

                    {/* vue PDF */}
                    {categorieBienpdfUrl ? (
                        <iframe
                            id="pdf-categorie-de-bien-frame"
                            src={categorieBienpdfUrl}
                            style={{
                                width: '100%',
                                height: '500px',
                                border: '1px solid #dee2e6',
                                borderRadius: '4px'
                            }}
                            title="Catégories de bien"
                        />
                    ) : (
                        <div
                            className="d-flex align-items-center justify-content-center text-muted"
                            style={{
                                height: '500px',
                                border: '1px dashed #dee2e6',
                                borderRadius: '4px'
                            }}
                        >
                            Cliquez sur <strong className="mx-1">Générer</strong> pour afficher le rapport
                        </div>
                    )}
                </Tab>
            
                <Tab eventKey="statutDeBien" title="Statut de bien" >
                    {/* Barre d'outils */}
                    <div className="d-flex align-items-center gap-2 my-2">
                        <Button
                            variant="outline-primary"
                            title="Charger le rapport"
                            onClick={genererLeRapport}
                        >
                            <><PrintIcon fontSize="small" className="me-1" />Générer</>
                        </Button>

                        {statutDeBienpdfUrl && (
                             <>
                                <Button
                                    variant="outline-secondary"
                                    title="Imprimer"
                                    onClick={handlePrint}
                                >
                                    <PrintIcon fontSize="small" className="me-1" />
                                    Imprimer
                                </Button>

                                <Button
                                    variant="outline-success"
                                    title="Télécharger le PDF"
                                    onClick={handleDownload}
                                >
                                    <DownloadIcon fontSize="small" className="me-1" />
                                    Télécharger
                                </Button>
                            </>
                        )}
                    </div>

                    {/* vue PDF */}
                    {statutDeBienpdfUrl ? (
                        <iframe
                            id="pdf-frame"
                            src={statutDeBienpdfUrl}
                            style={{
                                width: '100%',
                                height: '500px',
                                border: '1px solid #dee2e6',
                                borderRadius: '4px'
                            }}
                            title="Statut de bien"
                        />
                    ) : (
                        <div
                            className="d-flex align-items-center justify-content-center text-muted"
                            style={{
                                height: '500px',
                                border: '1px dashed #dee2e6',
                                borderRadius: '4px'
                            }}
                        >
                            Cliquez sur <strong className="mx-1">Générer</strong> pour afficher le rapport
                        </div>
                    )}
                </Tab>
                <Tab eventKey="typeDeFiche" title="Types de fiche">
                    {/* Barre d'outils */}
                    <div className="d-flex align-items-center gap-2 my-2">
                        <Button
                            variant="outline-primary"
                            title="Charger le rapport"
                            onClick={genererLeRapportDeTypDeFiche}
                        >
                            <><PrintIcon fontSize="small" className="me-1" />Générer</>
                        </Button>

                        {typeDeFichePdfUrl && (
                             <>
                                <Button
                                    variant="outline-secondary"
                                    title="Imprimer"
                                    onClick={handlePrintTypDeFiche}
                                >
                                    <PrintIcon fontSize="small" className="me-1" />
                                    Imprimer
                                </Button>

                                <Button
                                    variant="outline-success"
                                    title="Télécharger le PDF"
                                    onClick={handleDownloadTypDeFiche}
                                >
                                    <DownloadIcon fontSize="small" className="me-1" />
                                    Télécharger
                                </Button>
                            </>
                        )}
                    </div>

                    {/* vue PDF */}
                    {typeDeFichePdfUrl ? (
                        <iframe
                            id="pdf-typ-de-fiche-frame"
                            src={typeDeFichePdfUrl}
                            style={{
                                width: '100%',
                                height: '500px',
                                border: '1px solid #dee2e6',
                                borderRadius: '4px'
                            }}
                            title="Types de fiche"
                        />
                    ) : (
                        <div
                            className="d-flex align-items-center justify-content-center text-muted"
                            style={{
                                height: '500px',
                                border: '1px dashed #dee2e6',
                                borderRadius: '4px'
                            }}
                        >
                            Cliquez sur <strong className="mx-1">Générer</strong> pour afficher le rapport
                        </div>
                    )}
                </Tab>
                <Tab eventKey="etatsDeFiche" title="Etat de fiche">
                    {/* Barre d'outils */}
                    <div className="d-flex align-items-center gap-2 my-2">
                        <Button
                            variant="outline-primary"
                            title="Charger le rapport"
                            onClick={genererLeRapportDeEtatFiche}
                        >
                            <><PrintIcon fontSize="small" className="me-1" />Générer</>
                        </Button>

                        {etatFichePdfUrl && (
                             <>
                                <Button
                                    variant="outline-secondary"
                                    title="Imprimer"
                                    onClick={handlePrintEtatDeFiche}
                                >
                                    <PrintIcon fontSize="small" className="me-1" />
                                    Imprimer
                                </Button>

                                <Button
                                    variant="outline-success"
                                    title="Télécharger le PDF"
                                    onClick={handleDownloadEtatDeFiche}
                                >
                                    <DownloadIcon fontSize="small" className="me-1" />
                                    Télécharger
                                </Button>
                            </>
                        )}
                    </div>

                    {/* vue PDF */}
                    {etatFichePdfUrl ? (
                        <iframe
                            id="pdf-etat-de-fiche-frame"
                            src={etatFichePdfUrl}
                            style={{
                                width: '100%',
                                height: '500px',
                                border: '1px solid #dee2e6',
                                borderRadius: '4px'
                            }}
                            title="Etats de fiche"
                        />
                    ) : (
                        <div
                            className="d-flex align-items-center justify-content-center text-muted"
                            style={{
                                height: '500px',
                                border: '1px dashed #dee2e6',
                                borderRadius: '4px'
                            }}
                        >
                            Cliquez sur <strong className="mx-1">Générer</strong> pour afficher le rapport
                        </div>
                    )}
                </Tab>
            </Tabs>
        </div>
    )
}

export default ParametresParametresSystemesForm;