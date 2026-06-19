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


const ParametresParametresSystemesForm =()=> {

    //////////ETATS//////////
    const [pdfUrl,setPdfUrl] = useState("")
    const [loading, setLoading] = useState<boolean>(false);

    //////////APPELS SERVICES FONCTIONS
   
    //////////FONCTIONS//////////
    const genererLeRapport =async()=> {
        try {
            const pdfBlob = await PatrimoineStatutService.statutBienReport();
            const url = window.URL.createObjectURL(pdfBlob);
            setPdfUrl(url)
        } catch {
            okWarnignDialog("Erreur lors de l'impression")
        }
        
    }
    
    const handlePrint = () => {
        if (!pdfUrl) return;
        const iframe = document.getElementById("pdf-frame") as HTMLIFrameElement;
        if (iframe) {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
        }
    };

    const handleDownload = () => {
        if (!pdfUrl) return;
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "PatrimoinStatu.pdf";
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
                    <div>
                        
                    </div>
                </Tab>
            
                <Tab eventKey="statutDeBien" title="Statut de bien">
                    {/* Barre d'outils */}
                    <div className="d-flex align-items-center gap-2 my-2">
                        <Button
                            variant="outline-primary"
                            title="Charger le rapport"
                            onClick={genererLeRapport}
                            disabled={loading}
                        >
                            <><PrintIcon fontSize="small" className="me-1" />Générer</>
                        </Button>

                        {pdfUrl && (
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
                    {pdfUrl ? (
                        <iframe
                            id="pdf-frame"
                            src={pdfUrl}
                            style={{
                                width: '100%',
                                height: '600px',
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
                <Tab eventKey="typeDeFiche" title="Type de fiche">
                    
                </Tab>
                <Tab eventKey="etatsDeFiche" title="Etat de fiche">
                    
                </Tab>
            </Tabs>
        </div>
    )
}

export default ParametresParametresSystemesForm;