import  { FunctionComponent, useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import DataTable  from 'react-data-table-component'; 
import { useNavigate } from 'react-router-dom';
import { GestionResponseDto } from '../../shared/models/gestion';
import { BudgetTypeResponseDto, emptyBudgetTypeResponseDto } from '../../shared/models/budget-type';
import { GrhGestion, GrhIdBudget } from '../helpers/session-storage';
import GestionService from '../../shared/services/gestion-service';
import BudgetTypeService from '../../shared/services/budget-type-service';
import { costumeStyles } from '../../helpers/costume-styles';
import { emptyEnteteStructureResponseDto, EnteteStructureResponseDto } from '../../shared/models/entete-structure';
import EnteteStructureService from '../../shared/services/entete-structure-service';

const GrhChoixDuBudget: FunctionComponent = () => {

  const [gestions, setGestions] = useState<GestionResponseDto[]>([]);
  const [budgetTypes, setBudgetTypes] = useState<BudgetTypeResponseDto[]>([]);
  const [gestionCourante, setGestionCourante] = useState<string>(GrhGestion() ?? '');
  const [budgetTypeSelectionne, setBudgetTypeSelectionne] = useState<BudgetTypeResponseDto>(emptyBudgetTypeResponseDto);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [enteteStructure, setEnteteStructure] = useState<EnteteStructureResponseDto>(emptyEnteteStructureResponseDto);

  const tableBudgetTypeColumns = [
    {
      name: "ID",
      selector: (row: any) => row.idBudget,
    },
    {
      name: "Libellé",
      selector: (row: any) => row.libelleBudget,
    },
    {
      name: "Libellé a utiliser dans les décision",
      selector: (row: any) => row.libelleDecision,
    },
  ]

  useEffect(() => {
    getGestions()
    getBudgetType()
    getEnteteStructure()
  }, [])

  const getGestions = () => {
    GestionService.getAllByEtatOrderByCouranteDesc("ACTIF").then(data => {
      setGestions(data);
    })
  }

  const getEnteteStructure = () => {
    EnteteStructureService.getAll().then(data => {
      setEnteteStructure(data[0]);
    })
  }   

  const handleGestionInputChange = (e: any): void => {
    setGestionCourante(e.target.value);
    GrhGestion(e.target.value)
    window.location.reload(); // Pour actualiser la page
  }

  const handleBugdetTypeButtonClick = () => {
    getBudgetTypes()
    handleShowModal()
  }

  const handleCloseModal = () => {
    setShowModal(false);
  }

  const handleShowModal = () => {
    setShowModal(true);
  }

  const getBudgetTypes = () => {
    BudgetTypeService.getAll().then(data => {
      setBudgetTypes(data)    
    })
  }

  const getBudgetType = () => {
    BudgetTypeService.get(Number(GrhIdBudget() ?? '')).then(data => {
      setBudgetTypeSelectionne(data)
    })
  }

  return(
      <Container>
          <Row className="mt-1 p-1">
          <h6 className='shadow-sm rounded text-center text-primary'><b>GESTION CHOISIE : { gestionCourante }</b></h6>
            <Col lg={5} md={6} sm={12} className="p-5 m-auto shadow-lg rounded">
              <Form>
                <div className='mb-3 text-center'>
                  <img src={ "data:image/*;base64," + enteteStructure.logo } alt="Logo" style={{ width: '150px', height: '150px'}}/>                  
                </div>

                <Form.Group className="mb-3" controlId="gestion">
                  <Form.Label><i>Changer d'année</i></Form.Label>
                  <Form.Select name='gestion' value={gestionCourante} onChange={e => handleGestionInputChange(e)} size="sm" aria-label="Default select example">
                      {
                        gestions.map( (item: any) => (
                          <option key={item.courante} value={item.courante} style={{fontWeight:'bold'}}>{item.courante}</option>
                        ))   
                      }
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="typeBudget">
                  <Form.Label><i>Sélectionnez un budget</i></Form.Label><br />
                  <Button variant="primary" size='sm' title="Cliquez pour sélectionnez un budget" onClick={ () => handleBugdetTypeButtonClick() } className='w-100'><b>{budgetTypeSelectionne.libelleBudget}</b></Button>
                </Form.Group>
              </Form>
            </Col>
          </Row>

          {/* Gestion budget Type */}
          <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false} size="xl">
            <Modal.Header className='p-1'>
                <Modal.Title as="h6">Liste des budgets</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2'>
              <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tableBudgetTypeColumns}
                    data={budgetTypes}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    fixedHeaderScrollHeight='450px'
                    highlightOnHover
                    responsive
                    striped
                    onRowClicked={ (row, e) => {
                      setBudgetTypeSelectionne(row)
                      GrhIdBudget(row.idBudget.toString());
                      handleCloseModal()
                    }}/>
                </Card.Body>
              </Card>

            </Modal.Body>

            <Modal.Footer className='p-1'>
              <Button variant="outline-danger" size='sm' onClick={handleCloseModal}>Fermer</Button>
            </Modal.Footer>
          </Modal>
      </Container>
  );
};

export default GrhChoixDuBudget;
