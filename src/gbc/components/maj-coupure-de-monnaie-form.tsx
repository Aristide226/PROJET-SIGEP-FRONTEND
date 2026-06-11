import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import Swal from 'sweetalert2';
import DataTable  from 'react-data-table-component'; 
import { costumeStyles } from '../../helpers/costume-styles';
import { okSuccessDialog } from '../../helpers/dialogs';
import { BsPencilSquare, BsPlusLg, BsTrash } from 'react-icons/bs';
import { emptyCoupureMonnaieDto, CoupureMonnaieDto } from '../models/coupure-monnaie';
import CoupureMonnaieService from '../services/coupure-monnaie-service';

type FormCm = {
  designa: Field,
	idCoupure: Field,
  oldDesigna: Field,
  oldIdCoupure: Field
}

const SaisieMajInstutionFinanciereForm: FunctionComponent = () => {

  const [cms, setCms] = useState<any[]>([]);
  const [filteredCms, setFilteredCms] = useState<any[]>([]);
  const [operationCm, setOperationCm] = useState<string>("add");
  const [term, setTerm] = useState<string>('');

  const tableCmColumns = [
    {
      name: "Designation",
      selector: (row: any) => row.designa,
      sortable: true,
      wrap: true,
    },
    {
      name: "ID",
      selector: (row: any) => row.idCoupure,
      sortable: true,
      wrap: true,
    },
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            <Button variant="outline-warning" title="Modifier" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleEditCm(row)}><BsPencilSquare /></Button>
            <Button variant="outline-danger" title="Supprimer" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleDeleteCm(row)}><BsTrash /></Button>
        </ButtonGroup>
      ),
      width: "90px",
      center: true,
    }
  ]

  const [formCm, setFormCm] = useState<FormCm>({
    designa: { value: '' },
    idCoupure: { value: '' },
    oldDesigna: { value: '' },
    oldIdCoupure: { value: '' }
  })

  const initFormCm = () => {
    setOperationCm('add');
    setFormCm({
      designa: { value: '' },
      idCoupure: { value: '' },
      oldDesigna: { value: '' },
      oldIdCoupure: { value: '' }
    })
  }

  const handleInputChangeFormCm = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormCm({ ...formCm, ...newField}); 
  }

  const validateFormCm = () => {
    let newForm: FormCm = formCm;

    // Desingation
    if(formCm.designa.value === "" || formCm.designa.value.toString().length > 1) {
      const errorMsg: string = 'Desingation obligatoire !';
      const newField: Field = { value: formCm.designa.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ designa: newField } };
    } else {
      const newField: Field = { value: formCm.designa.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ designa: newField } };
    }

    // ID coupure
    if(formCm.idCoupure.value === "") {
      const errorMsg: string = 'Id coupure obligatoire !';
      const newField: Field = { value: formCm.idCoupure.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ idCoupure: newField } };
    } else {
      const newField: Field = { value: formCm.idCoupure.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ idCoupure: newField } };
    }

    setFormCm(newForm);
    return newForm.designa.isValid && newForm.idCoupure.isValid;
  }

  const handleSubmitFormCm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormCm()) {
      Swal.fire({
        title: 'GesBud',
        text: "Tout les champs sont obligatoires !",
        icon: 'warning',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
      });
      return;
    }

    if (operationCm === 'add') addCm();
    if (operationCm === 'edit') editCm(); 
  }

  const libelleOperationCm = () => {
    if (operationCm === 'add') return "Ajouter coupure de monnaie"
    if (operationCm === 'edit') return "Modifier coupure de monnaie"
  }

  const libelleButtonSumbitCm = () => {
    if (operationCm === 'add') return "Enregister"
    if (operationCm === 'edit') return "Enregister"
  }

  const handleAddCm = () => {
    initFormCm();
  }

  const handleEditCm = (row: any) => {
    setOperationCm("edit");
    setFormCm({
      designa: { value: row.designa, isValid: true },
      idCoupure: { value: row.idCoupure, isValid: true },
      oldDesigna: { value: row.designa, isValid: true  },
      oldIdCoupure: { value: row.idCoupure, isValid: true }
    })
  }

  const handleDeleteCm = (row: any) => {
    initFormCm()
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
        CoupureMonnaieService.delete(row.designa, row.idCoupure).then(() => {
          getCms();
          okSuccessDialog("Coupure de monnaie supprimée avec succès !")
        });
      }
    });
  }

  const addCm = () => {
    let newCm: CoupureMonnaieDto = emptyCoupureMonnaieDto;
    newCm.designa = formCm.designa.value;
    newCm.idCoupure = formCm.idCoupure.value;
    CoupureMonnaieService.add(newCm).then(data => {
      initFormCm()
      getCms()
      okSuccessDialog("Coupure de monnaie ajoutée avec succès !");
    })
  }

  const editCm = () => {
    let newCm: CoupureMonnaieDto = emptyCoupureMonnaieDto;
    newCm.designa = formCm.designa.value;
    newCm.idCoupure = formCm.idCoupure.value;
    CoupureMonnaieService.edit(formCm.oldDesigna.value, formCm.oldIdCoupure.value, newCm).then(data => {
      initFormCm()
      getCms()
      okSuccessDialog("Coupure de monnaie modifiée avec succès !");
    })
  }

  useEffect(() => {
    initFormCm();
    getCms();
  }, [])

  const getCms = () => {
    CoupureMonnaieService.getAll().then(data => {
      setCms(data)
      setFilteredCms(data)
    })
  }

  const handleSearchInputChange = (e: any): void => {
    const term = e.target.value.toLowerCase();
    setTerm(term);

    if(!term) {
      setFilteredCms(cms);
    } else {
      const results = cms.filter(item => {
        return Object.keys(item).some(key => {
          return item[key] && item[key].toString().toLowerCase().includes(term);
        })
      })
      setFilteredCms(results);
    }
  }

  return (
    <Container>
          <div className="mt-1 p-1">
            <h6 className="shadow-sm text-primary text-center rounded">PARAMETRES &gt; MISE A JOUR COUPURE DE MONNAIE</h6>
            <Form onSubmit={(e) => handleSubmitFormCm(e)}>
                <Card className="mb-3">
                  <Card.Header className='p-1'>
                  { libelleOperationCm() }
                  </Card.Header>
                  <Card.Body className=''>
                    <Row>
                      <Col>
                        <Form.Group controlId="designa" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Designation :</Form.Label></Col>
                          <Col><Form.Control name='designa' value={formCm.designa.value} onChange={e => handleInputChangeFormCm(e)} size='sm' type="text" /></Col>
                        </Form.Group>
                        <Form.Group controlId="idCoupure" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">ID :</Form.Label></Col>
                          <Col><Form.Control name='idCoupure' value={formCm.idCoupure.value} size='sm' type="number" onChange={e => handleInputChangeFormCm(e)} /></Col>
                        </Form.Group>
                      </Col>
                      <Col>
                      </Col>
                    </Row>                  
                  </Card.Body>
                  <Card.Footer className='p-1'>
                    <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>{ libelleButtonSumbitCm() }</Button>
                    <Button size='sm' variant="outline-success" title="Ajouter Nouveau" className='ms-1' style={{width: "100px"}} onClick={ () => handleAddCm()}><BsPlusLg /></Button>
                  </Card.Footer>
                </Card>
              </Form>  

              <Card>
                  <Card.Body className='p-1'>
                    <DataTable
                      customStyles={costumeStyles}
                      columns={tableCmColumns}
                      data={filteredCms}
                      noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                      fixedHeader
                      responsive
                      striped
                      fixedHeaderScrollHeight='300px'
                      highlightOnHover
                      subHeader
                      subHeaderComponent={
                        <Form.Control size='sm' type="text" placeholder="Recherche une coupure de monnaie" value={term} className='w-25'  onChange={e => handleSearchInputChange(e)} />
                      }
                      />
                  </Card.Body>
              </Card>  
          </div>
      </Container>
  );
};

export default SaisieMajInstutionFinanciereForm;
