import  { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';
import { BsPencilSquare, BsPlusLg, BsTrash } from 'react-icons/bs';
import { Gestion, IdBudget } from '../helpers/session-storage';
import { Field } from '../../helpers/types';
import { GestionResponseDto } from '../models/gestion';
import GestionService from '../services/gestion-service';
import Swal from 'sweetalert2';
import DataTable  from 'react-data-table-component'; 
import BudgetTypeService from '../services/budget-type-service';
import { BudgetTypeRequestDto, BudgetTypeResponseDto, emptyBudgetTypeRequestDto, emptyBudgetTypeResponseDto } from '../models/budget-type';
import { okSuccessDialog } from '../../helpers/dialogs';
import { costumeStyles } from '../../helpers/costume-styles';
import { useNavigate } from 'react-router-dom';
import { emptyEnteteStructureResponseDto, EnteteStructureResponseDto } from '../models/entete-structure';
import EnteteStructureService from '../services/entete-structure-service';

type FormBudgetType = {
  idBudget: Field,
  libelleBudget: Field,
  libelleDecision: Field
}

const ChoixDuBudgetGbc: FunctionComponent = () => {

  const [gestions, setGestions] = useState<GestionResponseDto[]>([]);
  const [budgetTypes, setBudgetTypes] = useState<BudgetTypeResponseDto[]>([]);
  const [gestionCourante, setGestionCourante] = useState<string>(Gestion() ?? '');
  const [budgetTypeSelectionne, setBudgetTypeSelectionne] = useState<BudgetTypeResponseDto>(emptyBudgetTypeResponseDto);
  const [showModal, setShowModal] = useState(false);
  const [operationBudgetType, setOperationBudgetType] = useState<string>("add");
  const navigate = useNavigate();
  const [enteteStructure, setEnteteStructure] = useState<EnteteStructureResponseDto>(emptyEnteteStructureResponseDto);

  const [formBudgetType, setFormBudgetType] = useState<FormBudgetType>({
    idBudget: {value : ''},
    libelleBudget: { value: '' },
    libelleDecision: { value: '' }
  })

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
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            <Button variant="outline-warning" title="Modifier" className='me-1' onClick={() => handleEditBudgetType(row)}><BsPencilSquare /></Button>
            <Button variant="outline-danger" title="Supprimer" className='me-1' onClick={() => handleDeleteBudgetType(row)}><BsTrash /></Button>
        </ButtonGroup>
      )
    }
  ]

  const initFormBudgetType = () => {
    setFormBudgetType({
      idBudget: {value : ''},
      libelleBudget: { value: '' },
      libelleDecision: { value:  '' }
    })
  }

  const handleInputChangeFormBudgetType = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    
    setFormBudgetType({ ...formBudgetType, ...newField}); 
  }

  const validateFormBudgetType = () => {
    let newForm: FormBudgetType = formBudgetType;

    // Libellé
    if(formBudgetType.libelleBudget.value === "") {
      const errorMsg: string = 'Libellé obligatoire !';
      const newField: Field = { value: formBudgetType.libelleBudget.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ libelleBudget: newField } };
    } else {
      const newField: Field = { value: formBudgetType.libelleBudget.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ libelleBudget: newField } };
    }

    // Libellé decision
    if(formBudgetType.libelleDecision.value === "") {
      const errorMsg: string = 'Libellé decision obligatoire !';
      const newField: Field = { value: formBudgetType.libelleDecision.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ libelleDecision: newField } };
    } else {
      const newField: Field = { value: formBudgetType.libelleDecision.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ libelleDecision: newField } };
    }

    setFormBudgetType(newForm)

    return  newForm.libelleBudget.isValid && newForm.libelleDecision.isValid
  }

  const handleSubmitFormBudgetType = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormBudgetType()) {
      Swal.fire({
        title: 'GesBud',
        text: "Les champs libellé, libellé decison sont obligatoires !",
        icon: 'warning',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
      });
      return;
    } 

    if (operationBudgetType === 'add') addBudgetType();
    if (operationBudgetType === 'edit') editBudgetType(); 
  }

  const addBudgetType = () => {
    const newBudgetType: BudgetTypeRequestDto = emptyBudgetTypeRequestDto;
    newBudgetType.libelleBudget = formBudgetType.libelleBudget.value;
    newBudgetType.libelleDecision = formBudgetType.libelleDecision.value;
    BudgetTypeService.add(newBudgetType).then(data => {
      getBudgetTypes()
      okSuccessDialog("Budget ajouté avec succès !")
    })
  }

  const editBudgetType = () => {
    const newBudgetType: BudgetTypeRequestDto = emptyBudgetTypeRequestDto;
    newBudgetType.libelleBudget = formBudgetType.libelleBudget.value;
    newBudgetType.libelleDecision = formBudgetType.libelleDecision.value;
    BudgetTypeService.edit(formBudgetType.idBudget.value, newBudgetType).then(data => {
      getBudgetTypes()
      okSuccessDialog("Budget modifié avec succès !")
    })
  }

  const handleAddBudgetType = () => {
    setOperationBudgetType('add')
    initFormBudgetType()
  }

  const handleEditBudgetType = (row: any) => {
    setOperationBudgetType('edit')
    setFormBudgetType({
      idBudget: {value: row.idBudget, isValid: true},
      libelleBudget: { value: row.libelleBudget, isValid: true },
      libelleDecision: { value:  row.libelleDecision, isValid: true }
    })
  }

  const handleDeleteBudgetType = (row: any) => {
    initFormBudgetType()
    setOperationBudgetType('add')
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
        BudgetTypeService.delete(row.idBudget).then(data => {
          getBudgetTypes()
          okSuccessDialog("Budget supprimé avec succès !")
        });
      }
    });
  }

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
    Gestion(e.target.value)
    window.location.reload(); // Pour actualiser la page
  }

  const handleBugdetTypeButtonClick = () => {
    initFormBudgetType()
    setOperationBudgetType('add')
    getBudgetTypes();
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

  const libelleOperationBudgetType = () => {
    if (operationBudgetType === 'add') return "Ajouter budget"
    if (operationBudgetType === 'edit') return "Modifier budget"
  }

  const libelleButtonSumbitBudgetType = () => {
    if (operationBudgetType === 'add') return "Ajouter"
    if (operationBudgetType === 'edit') return "Modifier"
  }

  const getBudgetType = () => {
    BudgetTypeService.get(Number(IdBudget() ?? '')).then(data => {
      setBudgetTypeSelectionne(data)
    })
  }

  return(
      <Container>
          <Row className="mt-1 p-1">
          <h6 className='shadow-sm rounded text-center text-primary'><b>GESTION CHOISIE : { gestionCourante }</b></h6>
            <Col lg={5} md={6} sm={12} className="p-5 m-auto shadow-lg rounded">
              <Form onSubmit={(e) => handleSubmitFormBudgetType(e)}>
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
          <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false} size="lg">
            <Modal.Header className='p-1'>
                <Modal.Title as="h6">Mise à jour liste des budgets</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2'>
              <Form onSubmit={(e) => handleSubmitFormBudgetType(e)}>
              <Card className='mb-3'>
                <Card.Header className='p-1'>
                  { libelleOperationBudgetType() }
                </Card.Header>

                <Card.Body className='p-1'>
                    <Row>
                        <Form.Group controlId="libelleBudget" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Libellé :</Form.Label></Col>
                          <Col><Form.Control type="text" name='libelleBudget' value={formBudgetType.libelleBudget.value} size='sm' onChange={(e) => handleInputChangeFormBudgetType(e)} /></Col>
                        </Form.Group>
                        <Form.Group controlId="libelleDecision" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Libellé à utiliser dans les décisions:</Form.Label></Col>
                          <Col><Form.Control type="text" name='libelleDecision' value={formBudgetType.libelleDecision.value} size='sm' onChange={(e) => handleInputChangeFormBudgetType(e)} /></Col>
                        </Form.Group>
                    </Row>
                </Card.Body>

                <Card.Footer className='p-1'>
                  <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>{ libelleButtonSumbitBudgetType() }</Button>
                  <Button size='sm' variant="outline-success" title="Ajouter Nouveau" className='ms-1' style={{width: "100px"}} onClick={() => handleAddBudgetType()}><BsPlusLg /></Button>
                </Card.Footer>
              </Card>
              </Form>

              <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tableBudgetTypeColumns}
                    data={budgetTypes}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    fixedHeaderScrollHeight='300px'
                    highlightOnHover
                    responsive
                    striped
                    onRowClicked={ (row, e) => {
                      setBudgetTypeSelectionne(row)
                      IdBudget(row.idBudget.toString());
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

export default ChoixDuBudgetGbc;
