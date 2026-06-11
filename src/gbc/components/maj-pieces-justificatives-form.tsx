import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import Swal from 'sweetalert2';
import DataTable  from 'react-data-table-component'; 
import { costumeStyles } from '../../helpers/costume-styles';
import { okSuccessDialog } from '../../helpers/dialogs';
import PjService from '../services/pj-service';
import { BsPencilSquare, BsPlusLg, BsTrash } from 'react-icons/bs';
import { emptyPjRequestDto, PjRequestDto, PjResponseDto } from '../models/pj';

type FormPj = {
  codPj: Field,
  pj: Field,
  avecMontant: Field,
}

const MajPiecesJustificativesForm: FunctionComponent = () => {

  const [pjs, setPjs] = useState<any[]>([]);
  const [filteredPjs, setFilteredPjs] = useState<any[]>([]);
  const [operationPj, setOperationPj] = useState<string>("add");
  const [term, setTerm] = useState<string>('');

  const tablePJColumns = [
    {
      name: "N°",
      selector: (row: any) => row.codPj,
      sortable: true,
      width: "100px",
    },
    {
      name: "PJ",
      selector: (row: any) => row.pj,
      sortable: true, 
      cell: (row: any) => <div title={row.pj}>{row.pj}</div>
    },
    {
      name: "Avec montant",
      cell: (row: any) => <Form.Check type='checkbox' checked={row.avecMontant === true} disabled className='label2' />,
      width: "120px",
      center: true,
    },
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            <Button variant="outline-warning" title="Modifier" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleEditPj(row)}><BsPencilSquare /></Button>
            <Button variant="outline-danger" title="Supprimer" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleDeletePj(row.codPj)}><BsTrash /></Button>
        </ButtonGroup>
      ),
      width: "90px",
      center: true,
    }
  ]

  const [formPj, setFormPj] = useState<FormPj>({
    codPj: { value: '' },
    pj: { value: '' },
    avecMontant: { value: 'false' }
  })

  const initFormPj = () => {
    setOperationPj('add');
    setFormPj({
      codPj: { value: ''},
      pj: { value: ''},
      avecMontant: { value: 'false' }
    })
  }

  const handleInputChangeFormPj = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    
    setFormPj({ ...formPj, ...newField}); 
  }

  const validateFormPj = () => {
    let newForm: FormPj = formPj;

    // Pj
    if(formPj.pj.value === "") {
      const errorMsg: string = 'Pj obligatoire !';
      const newField: Field = { value: formPj.pj.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ pj: newField } };
    } else {
      const newField: Field = { value: formPj.pj.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ pj: newField } };
    }

    setFormPj(newForm);
    return  newForm.pj.isValid;
  }

  const handleSubmitFormPj = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormPj()) {
      Swal.fire({
        title: 'GesBud',
        text: "Les champs PJ, Avec montant sont obligatoires !",
        icon: 'warning',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
      });
      return;
    }

    if (operationPj === 'add') addPj();
    if (operationPj === 'edit') editPj(); 
  }

  const libelleOperationPj = () => {
    if (operationPj === 'add') return "Ajouter pièce justificative"
    if (operationPj === 'edit') return "Modifier pièce justificatives"
  }

  const libelleButtonSumbitPj = () => {
    if (operationPj === 'add') return "Enregistrer"
    if (operationPj === 'edit') return "Enregistrer"
  }

  const handleAddPj = () => {
    initFormPj();
  }

  const handleEditPj = (row: any) => {
    setOperationPj("edit");
    setFormPj({
      codPj: { value: row.codPj, isValid: true },
      pj: { value: row.pj, isValid: true },
      avecMontant: { value: row.avecMontant.toString(), isValid: true }
    })
  }

  const handleDeletePj = (id: number) => {
    initFormPj()
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
        PjService.delete(id).then(() => {
          getPjs();
          okSuccessDialog("Pièce justificative supprimée avec succès !")
        });
      }
    });
  }

  const addPj = () => {
    let newPj: PjRequestDto = emptyPjRequestDto;
    newPj.pj = formPj.pj.value;
    newPj.avecMontant = formPj.avecMontant.value;
    PjService.add(newPj).then(data => {
      initFormPj()
      getPjs()
      okSuccessDialog("Pièce justificative ajoutée avec succès !");
    })
  }

  const editPj = () => {
    let newPj: PjRequestDto = emptyPjRequestDto;
    newPj.pj = formPj.pj.value;
    newPj.avecMontant = formPj.avecMontant.value;
    PjService.edit(formPj.codPj.value, newPj).then(data => {
      initFormPj()
      getPjs()
      okSuccessDialog("Pièce justificative modifiée avec succès !");
    })
  }

  useEffect(() => {
    initFormPj();
    getPjs();
  }, [])

  const getPjs = () => {
    PjService.getAll().then(data => {
      setPjs(data)
      if(!term) {
        setFilteredPjs(data);
      } else {
        const results = data.filter(item => {
          return (Object.keys(item) as (keyof PjResponseDto)[]).some(key => {
            return item[key] && item[key].toString().toLowerCase().includes(term);
          })
        })
        setFilteredPjs(results);
      }
    })
  }

  const handleSearchPjInputChange = (e: any): void => {
    const term = e.target.value.toLowerCase();
    setTerm(term);

    if(!term) {
      setFilteredPjs(pjs);
    } else {
      const results = pjs.filter(item => {
        return Object.keys(item).some(key => {
          return item[key] && item[key].toString().toLowerCase().includes(term);
        })
      })
      setFilteredPjs(results);
    }
  }

  return (
    <Container>
          <div className="mt-1 p-1">
            <h6 className="shadow-sm text-primary text-center rounded">PARAMETRES &gt; MISE A JOUR PIECES JUSTIFICATIVES</h6>
            <Form onSubmit={(e) => handleSubmitFormPj(e)}>
              <Card className="mb-3">
                <Card.Header className='p-1'>
                { libelleOperationPj() }
                </Card.Header>
                <Card.Body className=''>
                  <Row>
                    <Col>
                      <Form.Group controlId="codPj" as={Row} className="mb-1">
                        <Col xs={4}><Form.Label className="label2">N° :</Form.Label></Col>
                        <Col><Form.Control name='codPj' value={formPj.codPj.value} size='sm' type="text" disabled onChange={e => handleInputChangeFormPj(e)} /></Col>
                      </Form.Group>
                      <Form.Group controlId="pj" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">PJ :</Form.Label></Col>
                          <Col><Form.Control name='pj' value={formPj.pj.value} size='sm' type="text" onChange={e => handleInputChangeFormPj(e)} /></Col>
                      </Form.Group>
                      <Form.Group controlId="avecMontant" as={Row} className="mb-1">
                        <Col xs={4}><Form.Label className="label2">Avec Montant :</Form.Label></Col>
                        <Col>
                          <Form.Check inline type="radio" label="Oui" name="avecMontant" value="true" id="oui" checked={formPj.avecMontant.value === 'true'} className='label2' onChange={e => handleInputChangeFormPj(e)}/>
                          <Form.Check inline type="radio" label="Non" name="avecMontant" value="false" id="non" checked={formPj.avecMontant.value === 'false'} className='label2' onChange={e => handleInputChangeFormPj(e)}/>
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>                  
                </Card.Body>
                <Card.Footer className='p-1'>
                  <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>{ libelleButtonSumbitPj() }</Button>
                  <Button size='sm' variant="outline-success" title="Ajouter Nouveau" className='ms-1' style={{width: "100px"}} onClick={ () => handleAddPj()}><BsPlusLg /></Button>
                </Card.Footer>
              </Card>
            </Form>  

            <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tablePJColumns}
                    data={filteredPjs}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    responsive
                    striped
                    fixedHeaderScrollHeight='300px'
                    highlightOnHover
                    subHeader
                    subHeaderComponent={
                      <Form.Control size='sm' type="text" placeholder="Recherche une pièces" value={term} className='w-25'  onChange={e => handleSearchPjInputChange(e)} />
                    }
                    />
                </Card.Body>
              </Card> 
          </div>
      </Container>
  );
};

export default MajPiecesJustificativesForm;
