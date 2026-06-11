//Aristide
import { FunctionComponent,useState,useEffect } from "react";
import { Button,Container,Table, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { costumeStyles } from "../../helpers/costume-styles";
import PpmActeService from "../services/ppm-acte-service";
import { ppmActeRequestDto } from "../models/ppm-acte";
import { Gestion, IdBudget} from '../helpers/session-storage';
import PpmService from "../services/ppm-service";
import { okWarnignDialog } from "../../helpers/dialogs";
import PpmExecService from "../services/ppm-exec-service";

const ReediterLePpmForm : FunctionComponent =()=> {
    //////////DECLARATIONS DE TABLEAUX
    const reediterPpmCol = [
        {name: 'Date', selector: (row:any) => (formateDate(row.dateCreate)),grow:2},
        {name: 'Quantième', selector: (row:any) => (row.quantieme),grow:2},
        {name: 'Motif', selector: (row:any) => (row.motifModif),grow:2},
    ]

    //////////DECLARATIONS STATES
    const [ppmActe,setPpmActe] = useState <ppmActeRequestDto[]>([]);
    const acteValider = ppmActe.find(item => item.valide === true);
    const [gestionCourante,setGestionCourante] = useState<string>(Gestion () ?? '');
    const [idBudget] = useState <string> (() => { 
            const id = IdBudget();
            if (!id) return '';
            const num = parseInt(id);
            return num < 10 ? `0${num}` : `${num}`;
        });
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [pdfUrl,setPdfUrl] = useState('');
    const [typeImpression,setTypeImpression] = useState<String | null> (null);
    
    //////////DECLARATIONS DES FONCTIONS
    const formateDate = (d : string) => {
        const date = new Date(d);
        const jour = parseInt(date.getDate().toString().padStart(2, ''));
        const mois = (date.getMonth() + 1).toString().padStart(2, '0');
        const annee = date.getFullYear();
        return `${jour <10 ? `0${jour}` : `${jour}` }/${mois}/${annee}`
    }
    const getByGestionAndIdBudget =()=> {
        PpmActeService.getByGestionAndIdBudget(gestionCourante,idBudget).then(data => {
            setPpmActe(data);
        })
    }

    const handleClosePdfModal =() => {
        if(pdfUrl) {
            window.URL.revokeObjectURL(pdfUrl);
        }
        setPdfUrl('')
        setShowPdfModal(false)
    }

    const handleImpression = async(type:any)=> {
        setTypeImpression(type);
        if (type === 'prevision') {
            handleClosePdfModal()
            try {
                const pdfBlob = await PpmService.downloadPpmReport(parseInt(gestionCourante));
                const url = window.URL.createObjectURL(pdfBlob);
                setPdfUrl(url);
                setShowPdfModal(true);
            } catch {
                okWarnignDialog("Erreur lors de l'impression")
            }
        } else if (type === 'execution') {
            handleClosePdfModal()
            try {
                const pdfBlob = await PpmExecService.generatePdfReport(parseInt(gestionCourante));
                const url = window.URL.createObjectURL(pdfBlob);
                setPdfUrl(url)
                setShowPdfModal(true)
            } catch {
                okWarnignDialog("Erreur lors de l'impression")
            }
        } else if(type === 'visibilite') {
            handleClosePdfModal()
            try {
                const pdfBlob = await PpmExecService.generateVisibilitePrm(parseInt(gestionCourante));
                const url = window.URL.createObjectURL(pdfBlob);
                setPdfUrl(url)
                setShowPdfModal(true)
            } catch {
                okWarnignDialog("Erreur lors de l'impression")
            }
        }
    }

    useEffect (() => {
        getByGestionAndIdBudget();
    },[]);

    return (
        <Container>
            <div className="mt-1 p-1">
            <h6 className='shadow-sm rounded  text-primary text-center rounded'>CONTRATS &gt; PLAN DE PASSATION &gt; RÉEDITER LE PROJET DE PPM DE {gestionCourante}</h6>
            <div>
                <DropdownButton
                    variant="outline-primary"
                    title= {<><i className="bi bi-printer-fill">Imprimer</i></>}
                    className="ms-2"
                >
                    <Dropdown.Item onClick={() => handleImpression('prevision')}>PPM Prévision</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleImpression('execution')}>PPM Exécution</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleImpression('visibilite')}>Visibilité de la PRM</Dropdown.Item>
                </DropdownButton>
            </div>
            <div style= {{width:'100%', maxWidth:'1050px', overflow: 'auto'}}>
                <DataTable
                    columns={reediterPpmCol}
                    data={acteValider ? [acteValider] : []}
                    customStyles={costumeStyles}
                    noDataComponent={""}
                    fixedHeader
                    fixedHeaderScrollHeight="150px"
                    highlightOnHover
                    responsive
                    striped
                />
            </div>
            {/**Modal de visualisation du pdf */}
            <Modal show={showPdfModal} onHide={handleClosePdfModal} backdrop="static" keyboard= {false} size="xl" centered>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body style={{ height:'80vh', padding: 0}}>
                    {pdfUrl && (
                        <iframe
                            src={pdfUrl}
                            style={{ width:'100%', height: '100%', border: 'none'}}
                            title="Aperçu du PPM"
                        >
                            Votre navigateur ne supporte pas l'affichage PDF intégré
                        </iframe>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="success"
                        onClick={(type:any) => {
                            const link = document.createElement('a');
                            link.href = pdfUrl;
                            if(typeImpression === "prevision") {
                                link.setAttribute('download', `PPM_${gestionCourante}.pdf`);
                            } else if(typeImpression === "execution") {
                                link.setAttribute('download', `Execution_PPM_${gestionCourante}.pdf`);
                            } else if(typeImpression === "visibilite") {
                                link.setAttribute('download', `VISIBILITE_PRM_${gestionCourante}.pdf`);
                            }
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                    >
                        Télécharger
                    </Button>
                </Modal.Footer>
            </Modal>
            </div>
        </Container>
    )
}
export default ReediterLePpmForm;