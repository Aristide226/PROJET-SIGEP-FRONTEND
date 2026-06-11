import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import Swal from 'sweetalert2';
import DataTable  from 'react-data-table-component'; 
import { costumeStyles } from '../../helpers/costume-styles';
import { okSuccessDialog } from '../../helpers/dialogs';
import { BsPencilSquare, BsPlusLg, BsTrash } from 'react-icons/bs';
import RetenueCategorieService from '../services/retenue-categorie-service';
import RetenuTypeService from '../services/retenu-type-service';
import CompteService from '../services/compte-service';
import { emptyRetenuTypeDto, RetenuTypeDto } from '../models/retenu-type';

type FormRt = {
  idTypRetenu: Field,
	libelle: Field,
	taux: Field,
	codCpte: Field,
	idCategorie: Field
}

const SaisieMajInstutionFinanciereForm: FunctionComponent = () => {

  const [rts, setRts] = useState<any[]>([]);
  const [filteredRts, setFilteredRts] = useState<any[]>([]);
  const [operationRt, setOperationRt] = useState<string>("add");
  const [retenueCategories, setRetenueCategories] = useState<any[]>([]);
  const [comptes, setComptes] = useState<any[]>([]);
  const [term, setTerm] = useState<string>('');

  const tableRtColumns = [
    {
      name: "ID",
      selector: (row: any) => row.idTypRetenu,
      sortable: true,
      width: "80px"
    },
    {
      name: "Compte",
      selector: (row: any) => row.codCpte + ' ' +row.libelleCpte,
      sortable: true,
      wrap: true,
    },
    {
      name: "Libellé",
      selector: (row: any) => row.libelle,
      sortable: true,
      wrap: true,
    },
    {
      name: "Catégorie",
      selector: (row: any) => getRetenueCategorieLibelle(row.idCategorie),
      sortable: true,
      wrap: true,
    },
    {
      name: "Taux en %",
      selector: (row: any) => Number(row.taux).toFixed(2),
      sortable: true,
      width: "120px",
      center: true
    },
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            <Button variant="outline-warning" title="Modifier" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleEditRt(row)}><BsPencilSquare /></Button>
            <Button variant="outline-danger" title="Supprimer" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleDeleteRt(row.idTypRetenu)}><BsTrash /></Button>
        </ButtonGroup>
      ),
      width: "90px",
      center: true,
    }
  ]

  const [formRt, setFormRt] = useState<FormRt>({
    idTypRetenu: { value: '' },
    libelle: { value: '' },
    taux: { value: Number(0).toFixed(2) },
    codCpte: { value: '' },
    idCategorie: { value: '' }
  })

  const initFormRt = () => {
    setOperationRt('add');
    setFormRt({
      idTypRetenu: { value: '' },
      libelle: { value: '' },
      taux: { value: Number(0).toFixed(2) },
      codCpte: { value: '' },
      idCategorie: { value: '' }
    })
  }

  const handleInputChangeFormRt = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormRt({ ...formRt, ...newField}); 
  }

  const validateFormRt = () => {
    let newForm: FormRt = formRt;

    // Compte
    if(formRt.codCpte.value === "") {
      const errorMsg: string = 'Compte obligatoire !';
      const newField: Field = { value: formRt.codCpte.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ codCpte: newField } };
    } else {
      const newField: Field = { value: formRt.codCpte.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ codCpte: newField } };
    }

    // Libelle
    if(formRt.libelle.value === "") {
      const errorMsg: string = 'Libelle obligatoire !';
      const newField: Field = { value: formRt.libelle.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ libelle: newField } };
    } else {
      const newField: Field = { value: formRt.libelle.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ libelle: newField } };
    }

    // Categorie
    if(formRt.idCategorie.value === "") {
      const errorMsg: string = 'Categorie obligatoire !';
      const newField: Field = { value: formRt.idCategorie.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ idCategorie: newField } };
    } else {
      const newField: Field = { value: formRt.idCategorie.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ idCategorie: newField } };
    }

    // Taux
    if(formRt.taux.value === "") {
      const errorMsg: string = 'Taux obligatoire !';
      const newField: Field = { value: formRt.taux.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ taux: newField } };
    } else {
      const newField: Field = { value: formRt.taux.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ taux: newField } };
    }

    setFormRt(newForm);
    return newForm.codCpte.isValid && newForm.libelle.isValid && newForm.idCategorie.isValid && newForm.taux.isValid;
  }

  const handleSubmitFormRt = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormRt()) {
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

    if (operationRt === 'add') addRt();
    if (operationRt === 'edit') editRt(); 
  }

  const libelleOperationRt = () => {
    if (operationRt === 'add') return "Ajouter type de précompte"
    if (operationRt === 'edit') return "Modifier type de précompte"
  }

  const libelleButtonSumbitRt = () => {
    if (operationRt === 'add') return "Enregister"
    if (operationRt === 'edit') return "Enregister"
  }

  const handleAddRt = () => {
    initFormRt();
  }

  const handleEditRt = (row: any) => {
    setOperationRt("edit");
    setFormRt({
      idTypRetenu: { value: row.idTypRetenu, isValid: true },
      libelle: { value: row.libelle, isValid: true },
      taux: { value: row.taux, isValid: true },
      codCpte: { value: row.codCpte, isValid: true },
      idCategorie: { value: row.idCategorie, isValid: true },
    })
  }

  const handleDeleteRt = (id: number) => {
    initFormRt()
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
        RetenuTypeService.delete(id).then(() => {
          getRts();
          okSuccessDialog("Type de précompte supprimé avec succès !")
        });
      }
    });
  }

  const addRt = () => {
    let newRt: RetenuTypeDto = emptyRetenuTypeDto;
    newRt.libelle = formRt.libelle.value;
    newRt.taux = formRt.taux.value;
    newRt.codCpte = formRt.codCpte.value;
    newRt.idCategorie = formRt.idCategorie.value;
    RetenuTypeService.add(newRt).then(data => {
      initFormRt()
      getRts()
      okSuccessDialog("Type de précompte ajouté avec succès !");
    })
  }

  const editRt = () => {
    let newRt: RetenuTypeDto = emptyRetenuTypeDto;
    newRt.libelle = formRt.libelle.value;
    newRt.taux = formRt.taux.value;
    newRt.codCpte = formRt.codCpte.value;
    newRt.idCategorie = formRt.idCategorie.value;
    RetenuTypeService.edit(formRt.idTypRetenu.value, newRt).then(data => {
      initFormRt()
      getRts()
      okSuccessDialog("Type de précompte modifié avec succès !");
    })
  }

  useEffect(() => {
    initFormRt();
    getRts();
    getComptes();
    getRetenueCategories();
  }, [])

  const getRts = () => {
    RetenuTypeService.getAll().then(data => {
      setRts(data)
      setFilteredRts(data)
    })
  }

  const getRetenueCategories = () => {
    RetenueCategorieService.getAll().then(data => {
      setRetenueCategories(data)
    })
  }

  const getComptes = () => {
    CompteService.getAll().then(data => {
      setComptes(data)
    })
  }

  const handleSearchInputChange = (e: any): void => {
    const term = e.target.value.toLowerCase();
    setTerm(term);

    if(!term) {
      setFilteredRts(rts);
    } else {
      const results = rts.filter(item => {
        return Object.keys(item).some(key => {
          return item[key] && item[key].toString().toLowerCase().includes(term);
        })
      })
      setFilteredRts(results);
    }
  }

  const getRetenueCategorieLibelle = (id: string): string => {
    return (retenueCategories.find(item => item.idCategorie === id)).libelle;
  }

  return (
    <Container>
          <div className="mt-1 p-1">
            <h6 className="shadow-sm text-primary text-center rounded">PARAMETRES &gt; SAISIE / MAJ TYPE DE PRECOMPTES</h6>
            <Form onSubmit={(e) => handleSubmitFormRt(e)}>
                <Card className="mb-3">
                  <Card.Header className='p-1'>
                  { libelleOperationRt() }
                  </Card.Header>
                  <Card.Body className=''>
                    <Row>
                      <Col>
                        <Form.Group controlId="idTypRetenu" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">ID :</Form.Label></Col>
                          <Col><Form.Control name='idTypRetenu' value={formRt.idTypRetenu.value} size='sm' type="text" disabled /></Col>
                        </Form.Group>
                        <Form.Group controlId="codCpte" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Compte :</Form.Label></Col>
                          <Col>
                            <Form.Select name='codCpte' value={formRt.codCpte.value} onChange={e => handleInputChangeFormRt(e)}  size='sm' aria-label="Default select example" style={{fontSize:"0.72em"}}>
                            <option value=''></option>
                              {
                                comptes.map( (item: any) => (
                                  <option key={item.codCpte} value={item.codCpte}>{item.codCpte + ' ' + item.libCompte}</option>
                                ))   
                              }
                            </Form.Select>
                          </Col>
                        </Form.Group>
                        <Form.Group controlId="libelle" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Libellé :</Form.Label></Col>
                          <Col><Form.Control name='libelle' value={formRt.libelle.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormRt(e)} /></Col>
                        </Form.Group>
                        <Form.Group controlId="idCategorie" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Catégorie :</Form.Label></Col>
                          <Col>
                            <Form.Select name='idCategorie' value={formRt.idCategorie.value} onChange={e => handleInputChangeFormRt(e)}  size='sm' aria-label="Default select example" style={{fontSize:"0.72em"}}>
                            <option value=''></option>
                              {
                                retenueCategories.map( (item: any) => (
                                  <option key={item.idCategorie} value={item.idCategorie}>{ item.libelle }</option>
                                ))   
                              }
                            </Form.Select>
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="taux" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Taux en % :</Form.Label></Col>
                          <Col><Form.Control name='taux' value={formRt.taux.value} size='sm' type="number" onChange={e => handleInputChangeFormRt(e)} /></Col>
                        </Form.Group>
                      </Col>
                    </Row>                  
                  </Card.Body>
                  <Card.Footer className='p-1'>
                    <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>{ libelleButtonSumbitRt() }</Button>
                    <Button size='sm' variant="outline-success" title="Ajouter Nouveau" className='ms-1' style={{width: "100px"}} onClick={ () => handleAddRt()}><BsPlusLg /></Button>
                  </Card.Footer>
                </Card>
              </Form>  

              <Card>
                  <Card.Body className='p-1'>
                    <DataTable
                      customStyles={costumeStyles}
                      columns={tableRtColumns}
                      data={filteredRts}
                      noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                      fixedHeader
                      responsive
                      striped
                      fixedHeaderScrollHeight='300px'
                      highlightOnHover
                      subHeader
                      subHeaderComponent={
                        <Form.Control size='sm' type="text" placeholder="Recherche un compte" value={term} className='w-25'  onChange={e => handleSearchInputChange(e)} />
                      }
                      />
                  </Card.Body>
              </Card>  
          </div>
      </Container>
  );
};

export default SaisieMajInstutionFinanciereForm;
