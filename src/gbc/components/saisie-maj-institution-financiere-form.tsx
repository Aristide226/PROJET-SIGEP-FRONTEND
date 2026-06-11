import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import Swal from 'sweetalert2';
import DataTable  from 'react-data-table-component'; 
import { costumeStyles } from '../../helpers/costume-styles';
import { okSuccessDialog } from '../../helpers/dialogs';
import { BsEye, BsPencilSquare, BsPlusLg, BsTrash } from 'react-icons/bs';
import InstitutFinancierService from '../services/institut-financier-service';
import { emptyInstitutFinancierRequestDto, InstitutFinancierRequestDto } from '../models/institut-financier';
import { emptyInstitutFinAgenceDto, InstitutFinAgenceDto } from '../models/institut-fin-agence';
import InstitutFinAgenceService from '../services/institut-fin-agence-service';

type FormIf = {
  abreviation: Field,
	libelle: Field,
	addresseA: Field,
	transiArct: Field,
	codeBanque: Field,
	libCourtMinus: Field,
	libCourtMajus: Field,
	idDest: Field
}

type FormIfa = {
  idAgence: Field,
	codeAgence: Field,
	libelleAgence: Field,
	domicilieA: Field,
	abreviation: Field,
}

const SaisieMajInstutionFinanciereForm: FunctionComponent = () => {

  const [ifs, setIfs] = useState<any[]>([]);
  const [filteredIfs, setFilteredIfs] = useState<any[]>([]);
  const [operationIf, setOperationIf] = useState<string>("add");
  const [termIf, setTermIf] = useState<string>('');

  const tableIfColumns = [
    {
      name: "Abrev",
      selector: (row: any) => row.abreviation,
      sortable: true,
      width: "100px",
      wrap: true
    },
    {
      name: "Libellé long",
      selector: (row: any) => row.libelle,
      sortable: true,
      wrap: true,
      
    },
    {
      name: "CB",
      selector: (row: any) => row.codeBanque,
      sortable: true,
      width: "80px"
    },
    {
      name: "Lib. court minus",
      selector: (row: any) => row.libCourtMinus,
      sortable: true,
      width: "134px"
    },
    {
      name: "Lib. court majus",
      selector: (row: any) => row.libCourtMajus,
      sortable: true,
      width: "134px"
    },
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            <Button variant="outline-warning" title="Modifier" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleEditIf(row)}><BsPencilSquare /></Button>
            <Button variant="outline-danger" title="Supprimer" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleDeleteIf(row.abreviation)}><BsTrash /></Button>
            <Button variant="outline-primary" title="Cliquez pour voir les agences" onClick={() => handleInstitutFinancierButtonClick(row)} style={{maxWidth:'30px', maxHeight:'30px'}}><BsEye /></Button>
        </ButtonGroup>
      ),
      width: "90px",
      center: true,
    }
  ]

  const [formIf, setFormIf] = useState<FormIf>({
    abreviation: { value: '' },
    libelle: { value: '' },
    addresseA: { value: '' },
    transiArct: { value: '' },
    codeBanque: { value: '' },
    libCourtMinus: { value: '' },
    libCourtMajus: { value: '' },
    idDest: { value: '' }
  })

  const initFormIf = () => {
    setOperationIf('add');
    setFormIf({
      abreviation: { value: '' },
      libelle: { value: '' },
      addresseA: { value: '' },
      transiArct: { value: '' },
      codeBanque: { value: '' },
      libCourtMinus: { value: '' },
      libCourtMajus: { value: '' },
      idDest: { value: '' }
    })
  }

  const handleInputChangeFormIf = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormIf({ ...formIf, ...newField}); 
  }

  const validateFormIf = () => {
    let newForm: FormIf = formIf;

    // Abreviation
    if(formIf.abreviation.value === "") {
      const errorMsg: string = 'Abreviation obligatoire !';
      const newField: Field = { value: formIf.abreviation.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ abreviation: newField } };
    } else {
      const newField: Field = { value: formIf.abreviation.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ abreviation: newField } };
    }

    // Libelle
    if(formIf.libelle.value === "") {
      const errorMsg: string = 'Libelle obligatoire !';
      const newField: Field = { value: formIf.libelle.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ libelle: newField } };
    } else {
      const newField: Field = { value: formIf.libelle.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ libelle: newField } };
    }

    // Code banque
    if(formIf.codeBanque.value === "") {
      const errorMsg: string = 'CodeBanque obligatoire !';
      const newField: Field = { value: formIf.codeBanque.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ codeBanque: newField } };
    } else {
      const newField: Field = { value: formIf.codeBanque.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ codeBanque: newField } };
    }

    setFormIf(newForm);
    return  newForm.abreviation.isValid &&  newForm.libelle.isValid &&  newForm.codeBanque.isValid;
  }

  const handleSubmitFormIf = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormIf()) {
      Swal.fire({
        title: 'GesBud',
        text: "Les champs abreviation, libellé et code banque sont obligatoires !",
        icon: 'warning',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
      });
      return;
    }

    if (operationIf === 'add') addIf();
    if (operationIf === 'edit') editIf(); 
  }

  const libelleOperationIf = () => {
    if (operationIf === 'add') return "Ajouter une banque"
    if (operationIf === 'edit') return "Modifier une banque"
  }

  const libelleButtonSumbitIf = () => {
    if (operationIf === 'add') return "Enregister"
    if (operationIf === 'edit') return "Enregister"
  }

  const handleAddIf = () => {
    initFormIf();
  }

  const handleEditIf = (row: any) => {
    setOperationIf("edit");
    setFormIf({
      abreviation: { value: row.abreviation, isValid: true },
      libelle: { value: row.libelle, isValid: true },
      addresseA: { value: row.addresseA, isValid: true },
      transiArct: { value: row.transiArct, isValid: true },
      codeBanque: { value: row.codeBanque, isValid: true },
      libCourtMinus: { value: row.libCourtMinus, isValid: true },
      libCourtMajus: { value: row.libCourtMajus, isValid: true },
      idDest: { value: row.idDest, isValid: true }
    })
  }

  const handleDeleteIf = (id: string) => {
    initFormIf()
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
        InstitutFinancierService.delete(id).then(() => {
          getIfs();
          okSuccessDialog("Banque supprimée avec succès !")
        });
      }
    });
  }

  const addIf = () => {
    let newIf: InstitutFinancierRequestDto = emptyInstitutFinancierRequestDto;
    newIf.abreviation = formIf.abreviation.value;
    newIf.libelle = formIf.libelle.value;
    newIf.addresseA = formIf.addresseA.value;
    newIf.transiArct = formIf.transiArct.value;
    newIf.codeBanque = formIf.codeBanque.value;
    newIf.libCourtMinus = formIf.libCourtMinus.value;
    newIf.libCourtMajus = formIf.libCourtMajus.value;
    InstitutFinancierService.add(newIf).then(data => {
      initFormIf()
      getIfs()
      okSuccessDialog("Banque ajoutée avec succès !");
    })
  }

  const editIf = () => {
    let newIf: InstitutFinancierRequestDto = emptyInstitutFinancierRequestDto;
    newIf.libelle = formIf.libelle.value;
    newIf.addresseA = formIf.addresseA.value;
    newIf.transiArct = formIf.transiArct.value;
    newIf.codeBanque = formIf.codeBanque.value;
    newIf.libCourtMinus = formIf.libCourtMinus.value;
    newIf.libCourtMajus = formIf.libCourtMajus.value;
    InstitutFinancierService.edit(formIf.abreviation.value, newIf).then(data => {
      initFormIf()
      getIfs()
      okSuccessDialog("Banque modifiée avec succès !");
    })
  }

  useEffect(() => {
    initFormIf();
    getIfs();
  }, [])

  const getIfs = () => {
    InstitutFinancierService.getAll().then(data => {
      setIfs(data)
      setFilteredIfs(data)
    })
  }

  const handleSearchIfInputChange = (e: any): void => {
    const term = e.target.value.toLowerCase();
    setTermIf(term);

    if(!term) {
      setFilteredIfs(ifs);
    } else {
      const results = ifs.filter(item => {
        return Object.keys(item).some(key => {
          return item[key] && item[key].toString().toLowerCase().includes(term);
        })
      })
      setFilteredIfs(results);
    }
  }

  const handleInstitutFinancierButtonClick = (row: any) => {
    formIfa.idAgence.value = '';
    formIfa.codeAgence.value = '';
    formIfa.libelleAgence.value = '';
    formIfa.domicilieA.value = '';
    formIfa.abreviation.value = row.abreviation;
    setAbreviation(row.abreviation)
    getIfas();
    handleShowModal() 
  }

  //////////////////////////////////// GESTION AGENCES
  const [ifas, setIfas] = useState<any[]>([]);
  const [filteredIfas, setFilteredIfas] = useState<any[]>([]);
  const [operationIfa, setOperationIfa] = useState<string>("add");
  const [showModal, setShowModal] = useState(false);
  const [termIfa, setTermIfa] = useState<string>('');
  const [abreviation, setAbreviation] = useState<string>('');

  const tableIfaColumns = [
    {
      name: "Code guichet",
      selector: (row: any) => row.codeAgence,
      sortable: true,
      width: "150px",
      wrap: true
    },
    {
      name: "Libellé",
      selector: (row: any) => row.libelleAgence,
      sortable: true,
      wrap: true,
      
    },
    {
      name: "Domiciliée (ville)",
      selector: (row: any) => row.domicilieA,
      sortable: true,
      wrap: true,
    },
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            <Button variant="outline-warning" title="Modifier" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleEditIfa(row)}><BsPencilSquare /></Button>
            <Button variant="outline-danger" title="Supprimer" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleDeleteIfa(row.idAgence)}><BsTrash /></Button>
        </ButtonGroup>
      ),
      width: "90px",
      center: true,
    }
  ]

  const [formIfa, setFormIfa] = useState<FormIfa>({
    idAgence: { value: '' },
    codeAgence: { value: '' },
    libelleAgence: { value: '' },
    domicilieA: { value: '' },
    abreviation: { value: '' }
  })

  const initFormIfa = () => {
    setOperationIfa('add');
    setFormIfa({
      idAgence: { value: '' },
      codeAgence: { value: '' },
      libelleAgence: { value: '' },
      domicilieA: { value: '' },
      abreviation: { value: '' }
    })
  }

  const handleInputChangeFormIfa = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormIfa({ ...formIfa, ...newField}); 
  }

  const validateFormIfa = () => {
    let newForm: FormIfa = formIfa;

    // Code guichet
    if(formIfa.codeAgence.value === "") {
      const errorMsg: string = 'Code guichet obligatoire !';
      const newField: Field = { value: formIfa.codeAgence.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ codeAgence: newField } };
    } else {
      const newField: Field = { value: formIfa.codeAgence.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ codeAgence: newField } };
    }

    // Libelle
    if(formIfa.libelleAgence.value === "") {
      const errorMsg: string = 'Libelle agence obligatoire !';
      const newField: Field = { value: formIfa.libelleAgence.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ libelleAgence: newField } };
    } else {
      const newField: Field = { value: formIfa.libelleAgence.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ libelleAgence: newField } };
    }

    // Domiciliée a
    if(formIfa.domicilieA.value === "") {
      const errorMsg: string = 'Domiciliée à obligatoire !';
      const newField: Field = { value: formIfa.domicilieA.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ domicilieA: newField } };
    } else {
      const newField: Field = { value: formIfa.domicilieA.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ domicilieA: newField } };
    }

    setFormIfa(newForm);
    return  newForm.codeAgence.isValid &&  newForm.libelleAgence.isValid &&  newForm.domicilieA.isValid;
  }

  const handleSubmitFormIfa = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormIfa()) {
      Swal.fire({
        title: 'GesBud',
        text: "Les champs code, libelle agence et domiciliée à sont obligatoires !",
        icon: 'warning',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
      });
      return;
    }

    if (operationIfa === 'add') addIfa();
    if (operationIfa === 'edit') editIfa(); 
  }

  const libelleOperationIfa = () => {
    if (operationIfa === 'add') return "Ajouter une agence"
    if (operationIfa === 'edit') return "Modifier une agence"
  }

  const libelleButtonSumbitIfa = () => {
    if (operationIfa === 'add') return "Enregister"
    if (operationIfa === 'edit') return "Enregister"
  }

  const handleAddIfa = () => {
    initFormIfa();
  }

  const handleEditIfa = (row: any) => {
    setOperationIfa("edit");
    setFormIfa({
      idAgence: { value: row.idAgence, isValid: true },
      codeAgence: { value: row.codeAgence, isValid: true },
      libelleAgence: { value: row.libelleAgence, isValid: true },
      domicilieA: { value: row.domicilieA, isValid: true },
      abreviation: { value: row.abreviation, isValid: true }
    })
  }

  const handleDeleteIfa = (id: string) => {
    setOperationIfa('add');
    setFormIfa({
      idAgence: { value: '' },
      codeAgence: { value: '' },
      libelleAgence: { value: '' },
      domicilieA: { value: '' },
      abreviation: { value: abreviation }
    })
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
        InstitutFinAgenceService.delete(id).then(() => {
          getIfas();
          okSuccessDialog("Agence supprimée avec succès !")
        });
      }
    });
  }

  const addIfa = () => {
    let newIfa: InstitutFinAgenceDto = emptyInstitutFinAgenceDto;
    newIfa.codeAgence = formIfa.codeAgence.value;
    newIfa.libelleAgence = formIfa.libelleAgence.value;
    newIfa.domicilieA = formIfa.domicilieA.value;
    newIfa.abreviation = formIfa.abreviation.value;
    InstitutFinAgenceService.add(newIfa).then(data => {
      setOperationIfa('add');
      setFormIfa({
        idAgence: { value: '' },
        codeAgence: { value: '' },
        libelleAgence: { value: '' },
        domicilieA: { value: '' },
        abreviation: { value: newIfa.abreviation }
      })
      getIfas()
      okSuccessDialog("Agence ajoutée avec succès !");
    })
  }

  const editIfa = () => {
    let newIfa: InstitutFinAgenceDto = emptyInstitutFinAgenceDto;
    newIfa.codeAgence = formIfa.codeAgence.value;
    newIfa.libelleAgence = formIfa.libelleAgence.value;
    newIfa.domicilieA = formIfa.domicilieA.value;
    newIfa.abreviation = formIfa.abreviation.value;
    InstitutFinAgenceService.edit(formIfa.idAgence.value, newIfa).then(data => {
      setOperationIfa('add');
      setFormIfa({
        idAgence: { value: '' },
        codeAgence: { value: '' },
        libelleAgence: { value: '' },
        domicilieA: { value: '' },
        abreviation: { value: newIfa.abreviation }
      })
      getIfas()
      okSuccessDialog("Agence modifiée avec succès !");
    })
  }

  const getIfas = () => {
    InstitutFinAgenceService.getByAbreviation(formIfa.abreviation.value).then(data => {
      setIfas(data)
      setFilteredIfas(data)
    })
  }

  const handleSearchIfaInputChange = (e: any): void => {
    const term = e.target.value.toLowerCase();
    setTermIfa(term);

    if(!term) {
      setFilteredIfas(ifas);
    } else {
      const results = ifas.filter(item => {
        return Object.keys(item).some(key => {
          return item[key] && item[key].toString().toLowerCase().includes(term);
        })
      })
      setFilteredIfas(results);
    }
  }

  const handleCloseModal = () => {
    setShowModal(false);
  }

  const handleShowModal = () => {
    setShowModal(true);
  }

  /////////////////////////////////// GESTION AGENCES

  return (
    <Container>
          <div className="mt-1 p-1">
            <h6 className="shadow-sm text-primary text-center rounded">PARAMETRES &gt; SAISIE / MISE A JOUR INSTUTION FINANCIERE</h6>
            <Form onSubmit={(e) => handleSubmitFormIf(e)}>
                <Card className="mb-3">
                  <Card.Header className='p-1'>
                  { libelleOperationIf() }
                  </Card.Header>
                  <Card.Body className=''>
                    <Row>
                      <Col>
                        <Form.Group controlId="abreviation" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Abreviation :</Form.Label></Col>
                          <Col><Form.Control name='abreviation' value={formIf.abreviation.value} size='sm' type="text" onChange={e => handleInputChangeFormIf(e)} /></Col>
                        </Form.Group>
                        <Form.Group controlId="libelle" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Libellé long :</Form.Label></Col>
                          <Col><Form.Control name='libelle' value={formIf.libelle.value} size='sm' type="text" onChange={e => handleInputChangeFormIf(e)} /></Col>
                        </Form.Group>
                        <Form.Group controlId="codeBanque" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Code banque :</Form.Label></Col>
                          <Col><Form.Control name='codeBanque' value={formIf.codeBanque.value} size='sm' type="text" onChange={e => handleInputChangeFormIf(e)} /></Col>
                        </Form.Group>
                        <Form.Group controlId="addresseA" as={Row} className="">
                          <Col xs={4}><Form.Label className="label2">Ordre de virement adressé à (facultatif) :</Form.Label></Col>
                          <Col><Form.Control name='addresseA' value={formIf.addresseA.value} size='sm' type="text" onChange={e => handleInputChangeFormIf(e)} /></Col>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="libCourtMinus" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Lib. court minuscule :</Form.Label></Col>
                          <Col><Form.Control name='libCourtMinus' value={formIf.libCourtMinus.value} size='sm' type="text" onChange={e => handleInputChangeFormIf(e)} /></Col>
                        </Form.Group>
                        <Form.Group controlId="libCourtMajus" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Lib. court majuscule :</Form.Label></Col>
                          <Col><Form.Control name='libCourtMajus' value={formIf.libCourtMajus.value} size='sm' type="text" onChange={e => handleInputChangeFormIf(e)} /></Col>
                        </Form.Group>
                        <Form.Group controlId="transiArct" as={Row} className="">
                          <Col xs={4}><Form.Label className="label2">Article :</Form.Label></Col>
                          <Col><Form.Control name='transiArct' value={formIf.transiArct.value} size='sm' type="text" onChange={e => handleInputChangeFormIf(e)} /></Col>
                        </Form.Group>
                      </Col>
                    </Row>                  
                  </Card.Body>
                  <Card.Footer className='p-1'>
                    <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>{ libelleButtonSumbitIf() }</Button>
                    <Button size='sm' variant="outline-success" title="Ajouter Nouveau" className='ms-1' style={{width: "100px"}} onClick={ () => handleAddIf()}><BsPlusLg /></Button>
                  </Card.Footer>
                </Card>
              </Form>  

              <Card>
                  <Card.Body className='p-1'>
                    <DataTable
                      customStyles={costumeStyles}
                      columns={tableIfColumns}
                      data={filteredIfs}
                      noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                      fixedHeader
                      responsive
                      striped
                      fixedHeaderScrollHeight='300px'
                      highlightOnHover
                      subHeader
                      subHeaderComponent={
                        <Form.Control size='sm' type="text" placeholder="Recherche une banque" value={termIf} className='w-25'  onChange={e => handleSearchIfInputChange(e)} />
                      }
                      />
                  </Card.Body>
              </Card>  
          </div>
          {/* GESTION AGENCES */}
          <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false} size="xl">
            <Modal.Header className='p-1'>
                <Modal.Title as="h6">Mise à jour liste des agences : { abreviation }</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2'>
              <Form onSubmit={(e) => handleSubmitFormIfa(e)}>
                  <Card className="mb-3">
                    <Card.Header className='p-1'>
                    { libelleOperationIfa() }
                    </Card.Header>
                    <Card.Body className=''>
                      <Row>
                        <Col>
                          <Form.Group controlId="codeAgence" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Code guichet :</Form.Label></Col>
                            <Col><Form.Control name='codeAgence' value={formIfa.codeAgence.value} size='sm' type="text" onChange={e => handleInputChangeFormIfa(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="libelleAgence" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Libellé :</Form.Label></Col>
                            <Col><Form.Control name='libelleAgence' value={formIfa.libelleAgence.value} size='sm' type="text" onChange={e => handleInputChangeFormIfa(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="domicilieA" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Domiciliée(ville) :</Form.Label></Col>
                            <Col><Form.Control name='domicilieA' value={formIfa.domicilieA.value} size='sm' type="text" onChange={e => handleInputChangeFormIfa(e)} /></Col>
                          </Form.Group>
                        </Col>
                        <Col>
                        </Col>
                      </Row>                  
                    </Card.Body>
                    <Card.Footer className='p-1'>
                      <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>{ libelleButtonSumbitIfa() }</Button>
                      <Button size='sm' variant="outline-success" title="Ajouter Nouveau" className='ms-1' style={{width: "100px"}} onClick={ () => handleAddIfa()}><BsPlusLg /></Button>
                    </Card.Footer>
                  </Card>
              </Form>
              <Card>
                    <Card.Body className='p-1'>
                      <DataTable
                        customStyles={costumeStyles}
                        columns={tableIfaColumns}
                        data={filteredIfas}
                        noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                        fixedHeader
                        responsive
                        striped
                        fixedHeaderScrollHeight='180px'
                        highlightOnHover
                        subHeader
                        subHeaderComponent={
                          <Form.Control size='sm' type="text" placeholder="Recherche une agence" value={termIfa} className='w-25'  onChange={e => handleSearchIfaInputChange(e)} />
                        }
                        />
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

export default SaisieMajInstutionFinanciereForm;
