import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import DataTable  from 'react-data-table-component'; 
import { costumeStyles } from '../../helpers/costume-styles';
import HistoConSService from '../services/histo-con-s-service';
import { formatDateWithHoursAndMinutes } from '../../helpers/format-date';
import { Field } from '../../helpers/types';
import { Gestion } from '../helpers/session-storage';
import AccesCodeService from '../services/accesCodeService';
import HistoActionSService from '../services/histo-action-s-service';
import ReportService from '../../shared/report/services/report-service';
import { okWarnignDialog } from '../../helpers/dialogs';
import PdfViewer from '../../helpers/pdf-viewer';
import { error } from 'console';

type FormCriteres = {
  dateDebut: Field,
  dateFin: Field,
  userName: Field,
  action: Field
}

const HistoriqueUtilisateurForm: FunctionComponent = () => {

  ///////////////// GESTION CONNEXIONS
  const [gestionCourante] = useState<string>(Gestion() ?? '');
  const [histoCons, setHistoCons] = useState<any[]>([]);
  const [filteredHistoCons, setFilteredHistoCons] = useState<any[]>([]);
  const [dateDebut] = useState<string>(new Date("01/01/" + gestionCourante).toISOString().slice(0, 10));
  const [dateFin] = useState<string>(new Date().toISOString().slice(0, 10));
  const [utilisateurs, setUtilisateurs] = useState<any[]>([]);

  const [formCriteres, setFormCriteres] = useState<FormCriteres>({
    dateDebut: { value: dateDebut},
    dateFin: { value: dateFin },
    userName: { value: '' },
    action: { value: '' }
  })

  const tableHistoConsColumns = [
    {
      name: "Code",
      selector: (row: any) => row.idl,
      sortable: true,
      width: "120px",
    },
    {
      name: "Date",
      selector: (row: any) => formatDateWithHoursAndMinutes(new Date(row.dateConnexion)),
      sortable: true,
      width: "120px",
    },
    {
      name: "PC",
      selector: (row: any) => row.pc,
      sortable: true,
      wrap: true,
    },
    {
      name: "@MAC",
      selector: (row: any) => row.adressMac,
      sortable: true,
      wrap: true,
    }
  ]

  useEffect(() => {
    getUtilisateurs();
    getHistoCons() 
  }, [])

  const getHistoCons = () => {
    HistoConSService.getAll().then(data => {
      setHistoCons(data)
      const results = data.filter(item => {
        return item["dateConnexion"] >= dateDebut && item["dateConnexion"] <= dateFin
      })
      setFilteredHistoCons(results)
    })
  }

  const getUtilisateurs = () => {
    AccesCodeService.getUtilisateur().then(data => {
      setUtilisateurs(data)
    })
  }

  const handleInputChangeFormCriteres = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormCriteres({ ...formCriteres, ...newField});
  }

  const handleRechercher = () => {
    const resultHistoCons = histoCons.filter(item => {
      return (item["dateConnexion"] >= formCriteres.dateDebut.value && item["dateConnexion"] <= formCriteres.dateFin.value)
      && (item["idl"].toString().toLowerCase().includes(formCriteres.userName.value.toLowerCase()))
    })
    setFilteredHistoCons(resultHistoCons)

    const resultHistoActions = histoActions.filter(item => {
      return (item["dateConnexion"] >= formCriteres.dateDebut.value && item["dateConnexion"] <= formCriteres.dateFin.value)
      && (item["idl"].toString().toLowerCase().includes(formCriteres.userName.value.toLowerCase()))
      && (item["action"].toString().toLowerCase().includes(formCriteres.action.value.toLowerCase()))
    })
    setFilteredHistoActions(resultHistoActions)
  }

  const getGrpeCodesLibelle = (grpe: string): string => {
    let result: string = "";
    if (grpe.trim() === "Adm") result = "Directeur";
    if (grpe.trim() === "Agent") result = "Agent";
    if (grpe.trim() === "Chef") result = "Chef de service";
    if (grpe.trim() === "Fact") result = "Facturation";
    if (grpe.trim() === "Inv") result = "Invité";
    if (grpe.trim() === "Com") result = "Comptabilité";
    if (grpe.trim() === "Dep") result = "Régie de dépenses";
    if (grpe.trim() === "Rec") result = "Régie de recettes";

    return result;
  }

  const handleImprimerConnexions = () => {

  }
  ///////////////// GESTION CONNEXIONS

  ///////////////// GESTION ACTIONS
  const [histoActions, setHistoActions] = useState<any[]>([]);
  const [filteredHistoActions, setFilteredHistoActions] = useState<any[]>([]);

  const tableHistoActionsColumns = [
    {
      name: "Date",
      selector: (row: any) => formatDateWithHoursAndMinutes(new Date(row.dateAct)),
      sortable: true,
      width: "120px",
    },
    {
      name: "Action",
      selector: (row: any) => row.action,
      sortable: true,
      wrap: true,
    },
    {
      name: "PC",
      selector: (row: any) => row.pc,
      sortable: true,
      wrap: true,
    },
    {
      name: "@MAC",
      selector: (row: any) => row.adressMac,
      sortable: true,
      wrap: true,
    }
  ]

  useEffect(() => {
    getHistoActions() 
  }, [])

  const getHistoActions = () => {
    HistoActionSService.getHistoActionSHistoConS().then(data => {
      setHistoActions(data)
      const results = data.filter(item => {
        return item["dateConnexion"] >= dateDebut && item["dateConnexion"] <= dateFin
      })
      setFilteredHistoActions(results)
    })
  }
  ///////////////// GESTION ACTIONS


  return (
    <Container>
          <div className="mt-1 p-1">
            <h6 className="shadow-sm text-primary text-center rounded">PARAMETRES &gt; UTILISATEURS &gt; HISTORIQUE</h6>
            <Tabs id="uncontrolled-tab-example" defaultActiveKey="liste-des-connexions" className="mb-1">
              {/* GESTION CONNEXIONS */}
              <Tab eventKey="liste-des-connexions" title="Connexions à la base de données">
                <Card>
                  <Card.Header className='p-1'>
                    <Form.Group as={Row}>
                      <Col></Col>
                      <Col></Col>
                      <Col></Col>
                      <ButtonGroup as={Col} size="sm">
                        <Button variant="outline-warning" title="Interroger" className='me-1' style={{width:"100px"}} onClick={ () => handleRechercher()}>Rechercher</Button>
                        <Button variant="outline-primary" title="Imprimer" className='me-1' style={{width:"100px"}} onClick={ () => handleImprimerConnexions()}>Imprimer</Button>                    
                      </ButtonGroup>
                    </Form.Group>
                  </Card.Header>
                  <Card.Body className=''>
                    {/* CRITERES DE RECHERCHE */}
                    <Row className='mb-3' style={{backgroundColor:"#f5f3f3"}}>
                      <span className='text-primary'><i><b>Critères de recherche :</b></i></span>
                      <Col>
                        <Row>
                          <Col>
                            <Form.Group controlId="dateDebut" as={Row} className="">
                              <Col xs={4}><Form.Label className="label2">Période du :</Form.Label></Col>
                              <Col><Form.Control name='dateDebut' value={formCriteres.dateDebut.value} onChange={e => handleInputChangeFormCriteres(e)} size='sm' type="date" style={{fontSize:"0.72em"}}/></Col>
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group controlId="dateFin" as={Row} className="">
                              <Col xs={4}><Form.Label className="label2">au :</Form.Label></Col>
                              <Col><Form.Control name='dateFin' value={formCriteres.dateFin.value} onChange={e => handleInputChangeFormCriteres(e)} size='sm' type="date" style={{fontSize:"0.72em"}}/></Col>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Group controlId="userName" as={Row} className="mb-1">
                              <Col xs={4}><Form.Label className="label2">Code :</Form.Label></Col>
                              <Col>
                                <Form.Select name='userName' value={formCriteres.userName.value} onChange={e => handleInputChangeFormCriteres(e)}  size='sm' aria-label="Default select example" style={{fontSize:"0.72em"}}>
                                  <option value=''>(Tout)</option>
                                  {
                                    utilisateurs.map( (item: any) => (
                                      <option key={item.userName} value={item.userName}>{item.userName + '-' + item.statu + '-' + item.nom + ' ' + item.prenom + '-' + getGrpeCodesLibelle(item.grpe)}</option>
                                    ))   
                                  }
                                </Form.Select>
                              </Col>
                            </Form.Group>
                          </Col>
                        </Row> 
                      </Col>
                      <Col xs={5}>
                        <Form.Group controlId="action" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Action :</Form.Label></Col>
                          <Col><Form.Control name='action' value={formCriteres.action.value} onChange={e => handleInputChangeFormCriteres(e)} size='sm' type="text" as="textarea" rows={3} style={{fontSize:"0.72em"}}/></Col>
                        </Form.Group>
                      </Col>
                    </Row>
                    {/* TABLE RESULTAT DE RECHERCHE */}
                    <Row className='' style={{backgroundColor:"#f5f3f3"}}>
                      <span className='text-primary'><i><b>Les connexions :</b></i></span>
                      <DataTable
                        customStyles={costumeStyles}
                        columns={tableHistoConsColumns}
                        data={filteredHistoCons}
                        noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                        fixedHeader
                        responsive
                        striped
                        fixedHeaderScrollHeight='300px'
                        highlightOnHover
                        pagination
                        />
                    </Row>
                  </Card.Body>
                </Card>
              </Tab>

              {/* GESTION ACTIONS */}
              <Tab eventKey="liste-des-actions" title="Actions efféctuées sur la base de données">
                <Card>
                  <Card.Header className='p-1'>
                    <Form.Group as={Row}>
                      <Col></Col>
                      <Col></Col>
                      <Col></Col>
                      <ButtonGroup as={Col} size="sm">
                        <Button variant="outline-warning" title="Interroger" className='me-1' style={{width:"100px"}} onClick={ () => handleRechercher()}>Rechercher</Button>
                        <Button variant="outline-primary" title="Imprimer" className='me-1' style={{width:"100px"}}>Imprimer</Button>
                      </ButtonGroup>
                    </Form.Group>
                  </Card.Header>
                  <Card.Body className=''>
                    {/* CRITERES DE RECHERCHE */}
                    <Row className='mb-3' style={{backgroundColor:"#f5f3f3"}}>
                      <span className='text-primary'><i><b>Critères de recherche :</b></i></span>
                      <Col>
                        <Row>
                          <Col>
                            <Form.Group controlId="dateDebut" as={Row} className="">
                              <Col xs={4}><Form.Label className="label2">Période du :</Form.Label></Col>
                              <Col><Form.Control name='dateDebut' value={formCriteres.dateDebut.value} onChange={e => handleInputChangeFormCriteres(e)} size='sm' type="date" style={{fontSize:"0.72em"}}/></Col>
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group controlId="dateFin" as={Row} className="">
                              <Col xs={4}><Form.Label className="label2">au :</Form.Label></Col>
                              <Col><Form.Control name='dateFin' value={formCriteres.dateFin.value} onChange={e => handleInputChangeFormCriteres(e)} size='sm' type="date" style={{fontSize:"0.72em"}}/></Col>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Group controlId="userName" as={Row} className="mb-1">
                              <Col xs={4}><Form.Label className="label2">Code :</Form.Label></Col>
                              <Col>
                                <Form.Select name='userName' value={formCriteres.userName.value} onChange={e => handleInputChangeFormCriteres(e)}  size='sm' aria-label="Default select example" style={{fontSize:"0.72em"}}>
                                  <option value=''>(Tout)</option>
                                  {
                                    utilisateurs.map( (item: any) => (
                                      <option key={item.userName} value={item.userName}>{item.userName + '-' + item.statu + '-' + item.nom + ' ' + item.prenom + '-' + getGrpeCodesLibelle(item.grpe)}</option>
                                    ))   
                                  }
                                </Form.Select>
                              </Col>
                            </Form.Group>
                          </Col>
                        </Row> 
                      </Col>
                      <Col xs={5}>
                        <Form.Group controlId="action" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Action :</Form.Label></Col>
                          <Col><Form.Control name='action' value={formCriteres.action.value} onChange={e => handleInputChangeFormCriteres(e)} size='sm' type="text" as="textarea" rows={3} style={{fontSize:"0.72em"}}/></Col>
                        </Form.Group>
                      </Col>
                    </Row>
                    {/* TABLE RESULTAT DE RECHERCHE */}
                    <Row className='' style={{backgroundColor:"#f5f3f3"}}>
                      <span className='text-primary'><i><b>Les actions :</b></i></span>
                      <DataTable
                        customStyles={costumeStyles}
                        columns={tableHistoActionsColumns}
                        data={filteredHistoActions}
                        noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                        fixedHeader
                        responsive
                        striped
                        fixedHeaderScrollHeight='300px'
                        highlightOnHover
                        pagination
                        />
                    </Row>
                  </Card.Body>
              </Card>
              </Tab>
            </Tabs>  
          </div>

      </Container>
  );
};

export default HistoriqueUtilisateurForm;
