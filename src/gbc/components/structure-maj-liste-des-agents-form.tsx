import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, Row } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import Swal from 'sweetalert2';
import DataTable  from 'react-data-table-component'; 
import { costumeStylesRDTavecButtonsActionsALaFin } from '../../helpers/costume-styles';
import { BsPencilSquare, BsPlusLg, BsTrash } from 'react-icons/bs';
import DirectionServiceService from '../services/direction-service-service';
import { AgentRequestDto, emptyAgentRequestDto } from '../models/agent';
import { DestinataireRequestDto, emptyDestinataireRequestDto } from '../models/destinataire';
import { DirectionServiceResponseDto } from '../models/direction-service';
import DestinataireService from '../services/destinataire-service';
import AgentService from '../services/agent-service';
import { okSuccessDialog, okWarnignDialog } from '../../helpers/dialogs';
import AgentsDirectionServiceSDestinatairesViewService from '../services/agents-direction-service-s-destinaires-view-service';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import PdfViewer from '../../helpers/pdf-viewer';
import ReportService from '../../shared/report/services/report-service';
import { Report, emptyReport } from '../../shared/report/models/report';
import CellWithTooltip from '../../helpers/cell-with-tooltip';

type FormAgent = {
  ifumle: Field,
  mle: Field,
  nom: Field,
  prenom: Field,
  telephone: Field,
  email: Field,
  sexe: Field,
  service: Field,
  signataire: Field,
  titreHonorifique: Field,
  actif: Field,
  oldIfumle: Field, // JUSTE STOCKER L ANCIEN ifumle lors de la modification
}

const StructureMajListeDesAgentsForm: FunctionComponent = () => {

  ////////////////////////////////////////// GESTION AGENTS
  const [agents, setAgents] = useState<any[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<any[]>([]);
  const [directionServiceResponseDtos, setDirectionServiceResponseDtos] = useState<DirectionServiceResponseDto[]>([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [operationAgent, setOperationAgent] = useState<string>("add");
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<any>();
  const [pdfNameForDownload, setPdfNameForDownload] = useState("");
   
  const [formAgent, setFormAgent] = useState<FormAgent>({
    ifumle: { value: '' },
    mle: { value: '' },
    nom: { value: '' },
    prenom: { value: '' },
    telephone: { value: '' },
    email: { value: '' },
    sexe: { value: '' },
    service: { value: '' },
    signataire: { value: '' },
    titreHonorifique: { value: '' },
    actif: { value: true },
    oldIfumle: { value: '' },
  })  

  const initFormAgent = () => {
    setOperationAgent('add');
    setFormAgent({
      ifumle: { value: '' },
      mle: { value: '' },
      nom: { value: '' },
      prenom: { value: '' },
      telephone: { value: '' },
      email: { value: '' },
      sexe: { value: '' },
      service: { value: '' },
      signataire: { value: '' },
      titreHonorifique: { value: '' },
      actif: { value: true },
      oldIfumle: { value: '' },
    })
  }

  const tableAgentColumns = [
    {
      name: "Matricule",
      cell: (row: any) => <CellWithTooltip value={row.ifumle}/>,
      sortable: true,     
    },    
    {
      name: "Nom",
      cell: (row: any) => <CellWithTooltip value={row.nom}/>,
      sortable: true
    },  
    {
      name: "Prénom",
      cell: (row: any) => <CellWithTooltip value={row.prenom}/>,
      sortable: true
    },
    {
      name: "Sexe",
      cell: (row: any) => <CellWithTooltip value={(row.sexe === 'M')? 'Masculin' :  'Féminin'}/>,
      sortable: true,
      width: "100px",
    },
    {
      name: "Service",
      cell: (row: any) => <CellWithTooltip value={row.libelle}/>,
      sortable: true,
    },
    {
      name: "Actif",
      cell: (row: any) => <Form.Check type='checkbox' checked={row.actif} className='label2' />,
      width: "100px",
    },
    {
      name: "Signataire",
      cell: (row: any) => <CellWithTooltip value={row.signataire}/>,
      sortable: true
    },
    {
      name: "Titre honorifique",
      cell: (row: any) => <CellWithTooltip value={row.titreHonoSign}/>,
      sortable: true
    },
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            <Button variant="outline-warning" title="Modifier" className='me-1' onClick={() => handleEditAgent(row)}><BsPencilSquare /></Button>
            <Button variant="outline-danger" title="Supprimer" className='me-1' onClick={() => handleDeleteAgent(row)}><BsTrash /></Button>
        </ButtonGroup>
      ), 
      width: "100px",
      right:true,
      conditionalCellStyles: [
        {
          when: () => true,
          style: {
            position: "sticky",
            right: 0,
            backgroundColor: "#fff",
            zIndex: 0
          }
        }
      ]
    }
  ]  
  
  const handleInputChangeFormAgent = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormAgent({ ...formAgent, ...newField})
  } 
  
  const handleCheckboxInputChangeFormAgent = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: boolean = e.target.checked;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormAgent({ ...formAgent, ...newField})
  } 
  
  const validateFormAgent = () => {
    let newForm: FormAgent = formAgent;

    // Nom
    if(formAgent.nom.value === "") {
      const errorMsg: string = 'Nom obligatoire !';
      const newField: Field = { value: formAgent.nom.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ nom: newField } };
    } else {
      const newField: Field = { value: formAgent.nom.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ nom: newField } };
    }

    // Prenom
    if(formAgent.prenom.value === "") {
      const errorMsg: string = 'Prenom obligatoire !';
      const newField: Field = { value: formAgent.prenom.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ prenom: newField } };
    } else {
      const newField: Field = { value: formAgent.prenom.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ prenom: newField } };
    }

    // Sexe
    if(formAgent.sexe.value === "") {
      const errorMsg: string = 'Sexe obligatoire !';
      const newField: Field = { value: formAgent.sexe.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ sexe: newField } };
    } else {
      const newField: Field = { value: formAgent.sexe.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ sexe: newField } };
    }

    // Service
    if(formAgent.service.value === "") {
      const errorMsg: string = 'Service obligatoire !';
      const newField: Field = { value: formAgent.service.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ service: newField } };
    } else {
      const newField: Field = { value: formAgent.service.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ service: newField } };
    }

    setFormAgent(newForm);

    return newForm.nom.isValid && newForm.prenom.isValid && newForm.sexe.isValid && newForm.service.isValid;
  }

  const handleSubmitFormAgent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Formulaire invalide
    if(!validateFormAgent()) {
      Swal.fire({
        title: 'GesBud',
        text: 'Les champs nom, prenom, sexe et service sont obligatoires !',
        icon: 'warning',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
      });
      return;
    }  
  
    if (operationAgent === 'add') addAgent();
    if (operationAgent === 'edit') editAgent(); 
  }  

  const libelleOperationAgent = () => {
    if (operationAgent === 'add') return "Ajouter agent"
    if (operationAgent === 'edit') return "Modifier agent"
  }

  const libelleButtonSumbitAgent = () => {
    if (operationAgent === 'add') return "Enregistrer"
    if (operationAgent === 'edit') return "Enregistrer"
  }
   
  const handleAddAgent = () => {
    initFormAgent();
  }

  const handleEditAgent = (row: any) => {
    setOperationAgent("edit")
    setFormAgent({
      ifumle: { value: row.ifumle, isValid: true },
      mle: { value: row.mle, isValid: true },
      nom: { value: row.nom, isValid: true },
      prenom: { value: row.prenom, isValid: true },
      telephone: { value: row.contactTel, isValid: true },
      email: { value: row.contactEmail, isValid: true },
      sexe: { value: row.sexe, isValid: true },
      service: { value: row.idService, isValid: true },
      signataire: { value: row.signataire, isValid: true },
      titreHonorifique: { value: row.titreHonoSign, isValid: true },
      actif: { value: row.actif, isValid: true },
      oldIfumle: { value: row.ifumle, isValid: true },
    })

    setSelectedRowId(row.mle)
  }

  const handleDeleteAgent = (row: any) => {
    initFormAgent()
    setOperationAgent('add')
    setSelectedRowId(row.mle)
    Swal.fire({
      title: 'GesBud',
      text: "Supprimer cet agent ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      allowOutsideClick: false,
      confirmButtonColor: '#007E33' 
    }).then( (result) => {
      if (result.isConfirmed) {
        DestinataireService.delete(row.mle).then(() => {
          getAgents();
          okSuccessDialog("Agent supprimé avec success !");
        });
      }
    });
  }

  const addAgent = async () => {
    let newObject: AgentRequestDto = emptyAgentRequestDto;
    newObject.nom = formAgent.nom.value;
    newObject.prenom = formAgent.prenom.value;
    newObject.sexe = formAgent.sexe.value;
    newObject.signataire = formAgent.signataire.value;
    newObject.titreHonoSign = formAgent.titreHonorifique.value;
    newObject.actif = formAgent.actif.value;
    newObject.idService = formAgent.service.value;

    let agentWithIfumleExists = await DestinataireService.existsByIfumleAndIfumleNot(formAgent.ifumle.value, "-");
    if(!agentWithIfumleExists) {
      AgentService.add(newObject).then( data => {
        editDestinataire(data.mle, "Agent ajouté avec success !")
      }) 
    } else {
      okWarnignDialog("Il existe déja un agent avec ce numero matricule !")
    }
  }

  const editAgent = async () => {
    let newObject: AgentRequestDto = emptyAgentRequestDto;
    newObject.nom = formAgent.nom.value;
    newObject.prenom = formAgent.prenom.value;
    newObject.sexe = formAgent.sexe.value;
    newObject.signataire = formAgent.signataire.value;
    newObject.titreHonoSign = formAgent.titreHonorifique.value;
    newObject.actif = formAgent.actif.value;
    newObject.idService = formAgent.service.value;

    if (formAgent.ifumle.value !== formAgent.oldIfumle.value) {
      let agentWithIfumleExists = await DestinataireService.existsByIfumleAndIfumleNot(formAgent.ifumle.value, "-");
      if(!agentWithIfumleExists) {
        AgentService.edit(formAgent.mle.value, newObject).then( () => {
          editDestinataire(formAgent.mle.value, "Agent modifié avec success !")
        })
      } else {
        okWarnignDialog("Il existe déja un agent avec ce numero matricule !")
      }    
    } else {
      AgentService.edit(formAgent.mle.value, newObject).then( () => {
        editDestinataire(formAgent.mle.value, "Agent modifié avec success !")
      })
    }
  }

  const editDestinataire = (id: number, message: string) => {
    let newObject: DestinataireRequestDto = emptyDestinataireRequestDto;
    newObject.ifumle = formAgent.ifumle.value;
    newObject.ftype = "A";
    newObject.contactTel = formAgent.telephone.value;
    newObject.contactEmail = formAgent.email.value;
    DestinataireService.edit(id, newObject)
    .then( () => {
      getAgents()
      initFormAgent();
      Swal.fire({
        title: 'GesBud',
        text: message,
        icon: 'success',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
      });
    })
    .catch(error => {
      okWarnignDialog("Erreur lors de l'enregistrement");
    })
  }

  useEffect( () => {
    const results = agents.filter(item => {
      return ((item.ifumle || '').toString().toLowerCase().includes(formAgent.ifumle.value.toString().toLowerCase()))
       && ((item.nom || '').toString().toLowerCase().includes(formAgent.nom.value.toString().toLowerCase()))
       && ((item.prenom || '').toString().toLowerCase().includes(formAgent.prenom.value.toString().toLowerCase()))
       && ((item.contactTel || '').toString().toLowerCase().includes(formAgent.telephone.value.toString().toLowerCase()))
       && ((item.contactEmail || '').toString().toLowerCase().includes(formAgent.email.value.toString().toLowerCase()))
       && ((item.sexe || '').toString().toLowerCase().includes(formAgent.sexe.value.toString().toLowerCase()))
       && ((item.idService || '').toString().toLowerCase().includes(formAgent.service.value.toString().toLowerCase()))
       && ((item.signataire || '').toString().toLowerCase().includes(formAgent.signataire.value.toString().toLowerCase()))
       && ((item.titreHonoSign || '').toString().toLowerCase().includes(formAgent.titreHonorifique.value.toString().toLowerCase()))  
       && ((item.actif === formAgent.actif.value))  
     })
     setFilteredAgents(results);
  }, [formAgent]) 

  useEffect( () => {
    getAgents();
    getDirectionServices();
  }, [])

  const getAgents = () => {
    AgentsDirectionServiceSDestinatairesViewService.getAll().then(data => {
      setAgents(data) 
      setFilteredAgents(data)
    })
  }

  const getDirectionServices = () => {
    DirectionServiceService.getAll().then( data => setDirectionServiceResponseDtos(data));
  }  
  ////////////////////////////////////////// GESTION AGENTS

  ///////////////// GESTION EDITER AGENTS
  const handleEditerAgentsButtonClick = () => {
    let report: Report = emptyReport;
    report.name = "fiche_agents";
    report.params = [
      {key: "MATRICULE", value: formAgent.mle.value},
      {key: "NOM", value: formAgent.mle.value},
      {key: "PRENOM", value: formAgent.mle.value},
      {key: "SERVICE", value: formAgent.service.value}
    ];
    ReportService.createReport(report)
      .then(pdfBlob => {
        setPdfBlob(pdfBlob);
        setShowPdfViewer(true);
        setPdfNameForDownload("fiche_agents");
      })
      .catch(error => {
        okWarnignDialog("Erreur lors de l'impression");
      }); 
  }  
  ///////////////// GESTION EDITER AGENTS  

  return (
    <Container>
          <div className="mt-1 p-1">
            <h6 className="shadow-sm text-primary text-center rounded">PARAMETRES &gt; STRUCTURE &gt; METTRE A JOUR LISTE DES AGENTS</h6>
            <Form onSubmit={(e) => handleSubmitFormAgent(e)}>
                <Card className='mb-3'>
                  <Card.Header className='p-1'>
                    { libelleOperationAgent() }
                  </Card.Header>

                  <Card.Body className='p-1'>
                      <Row>
                        <Col>
                          <Form.Group controlId="ifumle" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Matricule :</Form.Label></Col>
                            <Col><Form.Control name='ifumle' size='sm' type="text" value={formAgent.ifumle.value} autoComplete='off' onChange={e => handleInputChangeFormAgent(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="nom" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Nom :</Form.Label></Col>
                            <Col><Form.Control name='nom' size='sm' type="text" value={formAgent.nom.value} autoComplete='off' onChange={e => handleInputChangeFormAgent(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="prenom" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Prénom :</Form.Label></Col>
                            <Col><Form.Control name='prenom' size='sm' type="text" value={formAgent.prenom.value} autoComplete='off' onChange={e => handleInputChangeFormAgent(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="telephone" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Téléphone :</Form.Label></Col>
                            <Col><Form.Control name='telephone' size='sm' type="text" value={formAgent.telephone.value} autoComplete='off' onChange={e => handleInputChangeFormAgent(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="email" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Email :</Form.Label></Col>
                            <Col><Form.Control name='email' size='sm' type="email" value={formAgent.email.value} autoComplete='off' onChange={e => handleInputChangeFormAgent(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="sexe" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Sexe :</Form.Label></Col>
                            <Col>
                              <Form.Select name='sexe' value={formAgent.sexe.value} size='sm' aria-label="Default select example" onChange={e => handleInputChangeFormAgent(e)}>
                                <option value=''></option>
                                <option value='M'>Masculin</option>
                                <option value='F'>Féminin</option>
                              </Form.Select>
                            </Col>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Check name='actif' type="checkbox" label="Toujours en service" className='label2' checked={formAgent.actif.value} onChange={(e: any) => handleCheckboxInputChangeFormAgent(e)} />
                          <Form.Group controlId="service">
                            <Form.Label className='label2'>Service :</Form.Label>
                            <Form.Select name='service' value={formAgent.service.value} size='sm' aria-label="Default select example" onChange={e => handleInputChangeFormAgent(e)}>
                              <option value=''></option>
                              {
                                directionServiceResponseDtos.map( ds => (
                                  <option key={ds.idService} value={ds.idService}>{ds.libelle}</option>
                                ))
                              }
                            </Form.Select>
                          </Form.Group>
                          <Form.Group controlId="signataire">
                            <Form.Label className='label2'>Fonction :</Form.Label>
                            <Form.Control name='signataire' size='sm' type="text" value={formAgent.signataire.value} autoComplete='off' onChange={e => handleInputChangeFormAgent(e)} />
                          </Form.Group>
                          <Form.Group controlId="titreHonorifique">
                            <Form.Label className='label2'>Titre honorifique :</Form.Label>
                            <Form.Control name='titreHonorifique' size='sm' type="text" value={formAgent.titreHonorifique.value} autoComplete='off' onChange={e => handleInputChangeFormAgent(e)} />
                          </Form.Group>
                        </Col>
                      </Row>
                  </Card.Body>

                  <Card.Footer className='p-1'>
                    <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>{ libelleButtonSumbitAgent() }</Button>
                    <Button size='sm' variant="outline-success" title="Ajouter Nouveau" className='ms-1' style={{width: "100px"}} onClick={ () => handleAddAgent()}><BsPlusLg /></Button>
                  </Card.Footer>
                </Card>
              </Form>  

              <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStylesRDTavecButtonsActionsALaFin}
                    columns={tableAgentColumns}
                    data={filteredAgents}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    responsive
                    striped
                    fixedHeaderScrollHeight='300px'
                    highlightOnHover
                    pointerOnHover
                    onRowClicked={(row) => setSelectedRowId(row.mle) }
                    conditionalRowStyles={[
                      {
                        when: row => row.mle === selectedRowId,
                        style: {
                          backgroundColor: "#e3f2fd",
                          borderLeft: "4px solid #1976d2",
                        },
                      },
                    ]}
                    subHeader
                    subHeaderComponent={   
                      <Row className='w-100'>
                        <Col className='text-end'>
                          <Button variant="outline-primary" size='sm' title="Imprimer" style={{width:"60px", maxHeight:"30px"}} onClick={ () => handleEditerAgentsButtonClick()} disabled={filteredAgents.length === 0}><LocalPrintshopIcon /></Button>
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

export default StructureMajListeDesAgentsForm;
