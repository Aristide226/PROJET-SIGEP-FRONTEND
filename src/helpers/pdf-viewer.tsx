import { FunctionComponent, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

interface PdfViewerProps {
  blob: Blob;
  name: string;
}

const PdfViewer: FunctionComponent<PdfViewerProps> = ({blob, name}) => {
  const [showModal, setShowModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    if (blob) {
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
    }
    handleShowModal();
  }, [blob])

  const handleShowModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false);
    window.URL.revokeObjectURL(pdfUrl); 
    setPdfUrl("");
  }

  const handleTelecharger = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', name + ".pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  return (
    <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={true} fullscreen>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body style={{ height:'80vh', padding: 0}}>
          <iframe src={pdfUrl} style={{ width:'100%', height: '100%', border: 'none'}} title="Aperçu du PPM">
            Votre navigateur ne supporte pas l'affichage PDF intégré
          </iframe>                       
        </Modal.Body>
        <Modal.Footer className='p-0'>
          <Button variant="outline-success" size='sm' onClick={handleTelecharger}>Télécharger</Button>
          <Button variant="outline-secondary" size='sm' onClick={handleCloseModal}>Fermer</Button>
        </Modal.Footer>
    </Modal> 
  );
};

export default PdfViewer;
