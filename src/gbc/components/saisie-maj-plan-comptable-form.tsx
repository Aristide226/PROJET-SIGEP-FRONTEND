import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, Row } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import Swal from 'sweetalert2';
import DataTable  from 'react-data-table-component'; 
import { costumeStyles } from '../../helpers/costume-styles';
import { okSuccessDialog, okWarnignDialog } from '../../helpers/dialogs';
import { BsPencilSquare, BsPlusLg, BsTrash } from 'react-icons/bs';
import PlanComptableService from '../services/plan-comptable-service';
import { emptyPlanComptableRequestDto, PlanComptableRequestDto } from '../models/plan-comptable';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import PdfViewer from '../../helpers/pdf-viewer';
import ReportService from '../../shared/report/services/report-service';
import { Report, emptyReport } from '../../shared/report/models/report';

type FormPc = {
  idPlan: Field,
  intitulePlan: Field,
  niveau: Field,
}

type FormR = {
  niveauR: Field,
  termR: Field
}

const SaisieMajPlanComptableForm: FunctionComponent = () => {

  const [pcs, setPcs] = useState<any[]>([]);
  const [filteredPcs, setFilteredPcs] = useState<any[]>([]);
  const [operationPc, setOperationPc] = useState<string>("add");
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<any>();
  const [pdfNameForDownload, setPdfNameForDownload] = useState("");

  const tablePcColumns = [
    {
      name: "Code",
      selector: (row: any) => row.idPlan,
      sortable: true,
      width: "100px",
    },
    {
      name: "Intitulé",
      selector: (row: any) => row.intitulePlan,
      sortable: true,
      wrap: true
    },
    {
      name: "Niveau",
      selector: (row: any) => libelleNiveau(row.niveau),
      width: "120px"
    },
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            <Button variant="outline-warning" title="Modifier" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleEditPc(row)}><BsPencilSquare /></Button>
            <Button variant="outline-danger" title="Supprimer" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleDeletePc(row.idPlan)}><BsTrash /></Button>
        </ButtonGroup>
      ),
      width: "90px",
      center: true,
    }
  ]

  const [formPc, setFormPc] = useState<FormPc>({
    idPlan: { value: '' },
    intitulePlan: { value: '' },
    niveau: { value: '' }
  })

  const [formR, setFormR] = useState<FormR>({
    niveauR: { value: 'tout'},
    termR: { value: ''}
  })

  const initFormPc = () => {
    setOperationPc('add');
    setFormPc({
      idPlan: { value: '' },
      intitulePlan: { value: '' },
      niveau: { value: '' }
    })
  }

  const handleInputChangeFormPc = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };

    if (fieldName ==='idPlan') {
      if (fieldValue.length <= 6) {
        setFormPc({ ...formPc, ...newField});
        formPc.niveau.value = fieldValue.length;
      }  
    } 

    if (fieldName ==='intitulePlan') {
      setFormPc({ ...formPc, ...newField})
    } 
  }

  const validateFormPc = () => {
    let newForm: FormPc = formPc;

    // Code
    if(formPc.idPlan.value === "") {
      const errorMsg: string = 'Pc obligatoire !';
      const newField: Field = { value: formPc.idPlan.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ idPlan: newField } };
    } else {
      const newField: Field = { value: formPc.idPlan.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ idPlan: newField } };
    }

    // Code
    if(formPc.intitulePlan.value === "") {
      const errorMsg: string = 'InTitule obligatoire !';
      const newField: Field = { value: formPc.intitulePlan.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ intitulePlan: newField } };
    } else {
      const newField: Field = { value: formPc.intitulePlan.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ intitulePlan: newField } };
    }

    setFormPc(newForm);
    return newForm.idPlan.isValid && newForm.intitulePlan.isValid;
  }

  const handleSubmitFormPc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormPc()) {
      Swal.fire({
        title: 'GesBud',
        text: "Les champs code, Intitulé et niveau sont obligatoires !",
        icon: 'warning',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
      });
      return;
    }

    if (operationPc === 'add') addPc();
    if (operationPc === 'edit') editPc(); 
  }

  const libelleOperationPc = () => {
    if (operationPc === 'add') return "Ajouter plan comptable"
    if (operationPc === 'edit') return "Modifier plan comptable"
  }

  const libelleButtonSumbitPc = () => {
    if (operationPc === 'add') return "Enregistrer"
    if (operationPc === 'edit') return "Enregistrer"
  }

  const handleAddPc = () => {
    initFormPc();
  }

  const handleEditPc = (row: any) => {
    setOperationPc("edit");
    setFormPc({
      idPlan: { value: row.idPlan.trim(), isValid: true },
      intitulePlan: { value: row.intitulePlan, isValid: true },
      niveau: { value: row.niveau, isValid: true }
    })
  }

  const handleDeletePc = (id: number) => {
    initFormPc()
    Swal.fire({
      title: 'GesBud',
      text: "Supprimer cet enregistrement ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      allowOutsideClick: false,
      confirmButtonColor: '#007E33' 
    }).then( (result) => {
      if (result.isConfirmed) {
        PlanComptableService.delete(id).then(() => {
          getPcs()
          okSuccessDialog("Plan comptable supprimé avec succès !")
        });
      }
    });
  }

  const addPc = () => {
    let newPc: PlanComptableRequestDto = emptyPlanComptableRequestDto;
    newPc.idPlan = formPc.idPlan.value;
    newPc.intitulePlan = formPc.intitulePlan.value;
    newPc.niveau = formPc.niveau.value;
    PlanComptableService.add(newPc).then(data => {
      initFormPc()
      getPcs()
      okSuccessDialog("Plan comptable ajouté avec succès !");
    })
    .catch(error => {
        okWarnignDialog("Erreur lors de l'enregistrement !");
    }); 
  }

  const editPc = () => {
    let newPc: PlanComptableRequestDto = emptyPlanComptableRequestDto;
    newPc.intitulePlan = formPc.intitulePlan.value;
    newPc.niveau = formPc.niveau.value;
    PlanComptableService.edit(formPc.idPlan.value, newPc).then(data => {
      initFormPc()
      getPcs()
      okSuccessDialog("Plan comptable modifié avec succès !");
    })
    .catch(error => {
        okWarnignDialog("Erreur lors de l'enregistrement !");
    }); 
  }

  useEffect(() => {
    initFormPc();
    getPcs();
  }, [])

  const getPcs = () => {
    PlanComptableService.getAll().then(data => {
      setPcs(data)
      if (formR.niveauR.value === 'tout') {
        const results = data.filter(item => {
          return (!item.niveau.toString().includes(formR.niveauR.value))
          && (item.idPlan.toString().startsWith(formR.termR.value))
        })
        setFilteredPcs(results);
        return;
      }

      const results = data.filter(item => {
        return (item.niveau.toString().includes(formR.niveauR.value))
        && (item.idPlan.toString().startsWith(formR.termR.value))
      })
      setFilteredPcs(results);   
    })
  }

  const handleInputChangeFormR = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormR({ ...formR, ...newField})
  }

  const libelleNiveau = (niveau: number): string => {
    let result = "";
    if (niveau === 0) result = "";
    if (niveau === 1) result = "CLASSE";
    if (niveau === 2) result = "CHAPITRE";
    if (niveau === 3) result = "ARTICLE";
    if (niveau === 4) result = "PARAGRAPHE";
    if (niveau === 5 || niveau === 6) result = "RUBRIQUE";
    return result;
  }

  useEffect(() => {
    if (formR.niveauR.value === 'tout') {
      const results = pcs.filter(item => {
        return (!item.niveau.toString().includes(formR.niveauR.value))
        && (item.idPlan.toString().startsWith(formR.termR.value))
      })
      setFilteredPcs(results);
      return;
    }

    // MEME SI ON 5 COMME VALEUR QUI DESIGNE UN RUBRIQUE DANS LE SELECT, LA VRAI VALEUR C EST 5 OU 6
    if (formR.niveauR.value === 5) {
      const results = pcs.filter(item => {
        return (item.niveau === 5 || item.niveau === 6)
        && (item.idPlan.toString().startsWith(formR.termR.value))
      })
      setFilteredPcs(results);
      return;
    }

    const results = pcs.filter(item => {
      return (item.niveau.toString().includes(formR.niveauR.value))
      && (item.idPlan.toString().startsWith(formR.termR.value))
    })
    setFilteredPcs(results);
  }, [formR])

  ///////////////// GESTION EDITER PLAN COMPTABLE
  const handleEditerPlanComptableButtonClick = () => {
    let report: Report = emptyReport;
    report.name = "fiche_plan_comptable";
    report.params = [
      {key: "ID_PLAN", value: formR.termR.value},
      {key: "NIVEAU", value: formR.niveauR.value},
    ];
    ReportService.createReport(report)
      .then(pdfBlob => {
        setPdfBlob(pdfBlob);
        setShowPdfViewer(true);
        setPdfNameForDownload("fiche_plan_comptable");
      })
      .catch(error => {
        okWarnignDialog("Erreur lors de l'impression");
      }); 
  }  
  ///////////////// GESTION EDITER PLAN COMPTABLE 

  return (
    <Container>
          <div className="mt-1 p-1">
            <h6 className="shadow-sm text-primary text-center rounded">PARAMETRES &gt; SAISIE / MISE A JOUR PLAN COMPTABLE</h6>
            <Form onSubmit={(e) => handleSubmitFormPc(e)}>
              <Card className="mb-3">
                <Card.Header className='p-1'>
                { libelleOperationPc() }
                </Card.Header>
                <Card.Body className=''>
                  <Row>
                    <Col>
                      <Form.Group controlId="idPlan" as={Row} className="mb-1">
                        <Col xs={4}><Form.Label className="label2">Code :</Form.Label></Col>
                        <Col><Form.Control name='idPlan' value={formPc.idPlan.value} size='sm' type="number" onChange={e => handleInputChangeFormPc(e)} autoFocus /></Col>
                      </Form.Group>
                      <Form.Group controlId="intitulePlan" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Intitulé :</Form.Label></Col>
                          <Col><Form.Control name='intitulePlan' value={formPc.intitulePlan.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormPc(e)} /></Col>
                      </Form.Group>
                      <Form.Group controlId="niveau" as={Row} className="mb-1">
                        <Col xs={4}><Form.Label className="label2">Niveau :</Form.Label></Col>
                        <Col><Form.Control name='niveau' value={libelleNiveau(formPc.niveau.value)} size='sm' type="text" disabled /></Col>
                      </Form.Group>
                    </Col>
                  </Row>                  
                </Card.Body>
                <Card.Footer className='p-1'>
                  <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>{ libelleButtonSumbitPc() }</Button>
                  <Button size='sm' variant="outline-success" title="Ajouter Nouveau" className='ms-1' style={{width: "100px"}} onClick={ () => handleAddPc()}><BsPlusLg /></Button>
                </Card.Footer>
              </Card>
            </Form>  

            <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tablePcColumns}
                    data={filteredPcs}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    responsive
                    striped
                    
                    highlightOnHover
                    subHeader
                    subHeaderComponent={
                      <Row className='w-100'>
                        <ButtonGroup as={Col} size="sm">
                          <Form.Select name='niveauR' value={formR.niveauR.value} onChange={e => handleInputChangeFormR(e)} size='sm' className='me-1' style={{width:"200px"}}>
                            <option value='tout'>Tout</option> 
                            <option value='1'>CLASSE</option> 
                            <option value='2'>CHAPITRE</option> 
                            <option value='3'>ARTICLE</option> 
                            <option value='4'>PARAGRAPHE</option> 
                            <option value='5'>RUBRIQUE</option> 
                          </Form.Select>
                          <Form.Control name="termR" value={formR.termR.value}  size='sm' type="number" placeholder='Code commençant par' onChange={e => handleInputChangeFormR(e)} style={{width:"300px"}}/>
                        </ButtonGroup> 
                        <Col></Col>  
                        <Col className='text-end'>
                          <Button variant="outline-primary" size='sm' title="Imprimer" style={{width:"60px", maxHeight:"30px"}} onClick={ () => handleEditerPlanComptableButtonClick()} disabled={filteredPcs.length === 0}><LocalPrintshopIcon /></Button>
                        </Col>                   
                      </Row>
                    }
                    />
                </Card.Body>
              </Card> 

              {/* PDF VIEWER */}
              { showPdfViewer && <PdfViewer blob={pdfBlob} name={pdfNameForDownload} />}
          </div>
      </Container>
  );
};

export default SaisieMajPlanComptableForm;
