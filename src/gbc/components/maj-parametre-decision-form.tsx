import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, Modal, Row, Tab, Tabs } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import Swal from 'sweetalert2';
import DataTable  from 'react-data-table-component'; 
import { costumeStylesRDTavecButtonsActionsALaFin } from '../../helpers/costume-styles';
import { okSuccessDialog, okWarnignDialog } from '../../helpers/dialogs';
import { BsPencilSquare, BsPlusLg, BsTrash } from 'react-icons/bs';
import DecisionSVisaService from '../services/decision-svisa-service';
import { DecisionSVisaDto, emptyDecisionSVisaDto } from '../models/decision-svisa';
import TypeDecisionService from '../services/type-decision-service';
import DecisionSArticleService from '../services/decision-sarticle-service';
import { DecisionSArticleDto, emptyDecisionSArticleDto } from '../models/decision-sarticle';
import DecisionSAmpliationService from '../services/decision-sampliation-service';
import { DecisionSAmpliationRequestDto, emptyDecisionSAmpliationRequestDto } from '../models/decision-sampliation';
import CellWithTooltip from '../../helpers/cell-with-tooltip';

type FormDsv = {
  rangVisa: Field,
	libelleVisa: Field,
  idType: Field,
  oldRangVisa: Field,
}

type FormDsa = {
  numArticle: Field,
	intituleArticle: Field,
  intituleArticleReam: Field,
  olduNmArticle: Field,
}

type FormDsam = {
  id: Field,
  ampliataire: Field,
	ampliataireReam: Field
}

const MajParametreDecisionForm: FunctionComponent = () => {

  ///////////////// GESTION VISAS
  const [dsvs, setDsvs] = useState<any[]>([]);
  const [typeDecisions, setTypeDecisions] = useState<any[]>([]);
  const [filteredDsvs, setFilteredDsvs] = useState<any[]>([]);
  const [operationDsv, setOperationDsv] = useState<string>("add");
  const [term, setTerm] = useState<string>('');
  const [selectedRowIdDsv, setSelectedRowIdDsv] = useState(null);

  const tableDsvColumns = [
    {
      name: "Rang",
      selector: (row: any) => row.rangVisa,
      sortable: true,
      width: "100px"
    },
    {
      name: "Libellé",
      cell: (row: any) => <CellWithTooltip value={row.libelleVisa}/>,
      sortable: true,
      maxWidth: '600px'
    },
    {
      name: "Type",
      cell: (row: any) => <CellWithTooltip value={getType(row.idType)}/>,
      sortable: true,
      width: "150px"
    },
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            <Button variant="outline-warning" title="Modifier" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleEditDsv(row)}><BsPencilSquare /></Button>
            <Button variant="outline-danger" title="Supprimer" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleDeleteDsv(row)}><BsTrash /></Button>
        </ButtonGroup>
      ),
      width: "100px",
      center: true,
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

  const [formDsv, setFormDsv] = useState<FormDsv>({
    rangVisa: { value: '' },
    libelleVisa: { value: '' },
    idType: { value: '' },
    oldRangVisa: { value: '' }
  })

  const initFormDsv = () => {
    setOperationDsv('add');
    setSelectedRowIdDsv(null);
    setFormDsv({
      rangVisa: { value: '' },
      libelleVisa: { value: '' },
      idType: { value: '' },
      oldRangVisa: { value: '' }
    })
  }

  const handleInputChangeFormDsv = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormDsv({ ...formDsv, ...newField}); 
  }

  const validateFormDsv = () => {
    let newForm: FormDsv = formDsv;

    // RangVisa
    if(formDsv.rangVisa.value === "") {
      const errorMsg: string = 'RangVisa obligatoire !';
      const newField: Field = { value: formDsv.rangVisa.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ rangVisa: newField } };
    } else {
      const newField: Field = { value: formDsv.rangVisa.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ rangVisa: newField } };
    }

    // Type
    if(formDsv.idType.value === "") {
      const errorMsg: string = 'Type obligatoire !';
      const newField: Field = { value: formDsv.idType.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ idType: newField } };
    } else {
      const newField: Field = { value: formDsv.idType.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ idType: newField } };
    }

    setFormDsv(newForm);
    return newForm.rangVisa.isValid && newForm.idType.isValid;
  }

  const handleSubmitFormDsv = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormDsv()) {
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

    if (operationDsv === 'add') addDsv();
    if (operationDsv === 'edit') editDsv(); 
  }

  const libelleOperationDsv = () => {
    if (operationDsv === 'add') return "Ajouter visa"
    if (operationDsv === 'edit') return "Modifier visa"
  }

  const libelleButtonSumbitDsv = () => {
    if (operationDsv === 'add') return "Enregistrer"
    if (operationDsv === 'edit') return "Enregistrer"
  }

  const handleAddDsv = () => {
    initFormDsv();
  }

  const handleEditDsv = (row: any) => {
    setOperationDsv("edit");
    setSelectedRowIdDsv(row.rangVisa)
    setFormDsv({
      rangVisa: { value: row.rangVisa, isValid: true },
      libelleVisa: { value: row.libelleVisa, isValid: true },
      idType: { value: row.idType, isValid: true  },
      oldRangVisa: { value: row.rangVisa, isValid: true  }
    })
  }

  const handleDeleteDsv = (row: any) => {
    initFormDsv()
    setSelectedRowIdDsv(row.rangVisa)
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
        DecisionSVisaService.delete(row.rangVisa).then(() => {
          getDsvs();
          okSuccessDialog("Visa supprimée avec succès !")
        });
      }
    });
  }

  const addDsv = async () => {
    let newDsv: DecisionSVisaDto = emptyDecisionSVisaDto;
    newDsv.rangVisa = formDsv.rangVisa.value;
    newDsv.libelleVisa = formDsv.libelleVisa.value;
    newDsv.idType = formDsv.idType.value;

    let exists = await DecisionSVisaService.existsById(formDsv.rangVisa.value);
    if(!exists) {
      DecisionSVisaService.add(newDsv).then(res => {
        initFormDsv()
        getDsvs()
        okSuccessDialog("Visa ajoutée avec succès !");
      })      
    } else {
      okWarnignDialog("Il existe déja un visa avec ce rang !")
    }
  }

  const editDsv = async () => {
    let newDsv: DecisionSVisaDto = emptyDecisionSVisaDto;
    newDsv.libelleVisa = formDsv.libelleVisa.value;
    newDsv.idType = formDsv.idType.value;
    if (formDsv.rangVisa.value !== formDsv.oldRangVisa.value) {
      let exists = await DecisionSVisaService.existsById(formDsv.rangVisa.value);
      if(!exists) {
        DecisionSVisaService.edit(formDsv.rangVisa.value, formDsv.oldRangVisa.value, newDsv).then(data => {
          initFormDsv()
          getDsvs()
          okSuccessDialog("Visa modifiée avec succès !");
        })
      } else {
        okWarnignDialog("Il existe déja un visa avec ce rang !")
      }    
    } else {
      DecisionSVisaService.edit(formDsv.rangVisa.value, formDsv.oldRangVisa.value, newDsv).then(data => {
        initFormDsv()
        getDsvs()
        okSuccessDialog("Visa modifiée avec succès !");
      })
    }    
  }

  useEffect(() => {
    initFormDsv();
    getTypeDecisions();
    getDsvs()
  }, [])

  const getDsvs = () => {
    DecisionSVisaService.getAll().then(data => {
      setDsvs(data)
      setFilteredDsvs(data)
    })
  }

  const getTypeDecisions = () => {
    TypeDecisionService.getAll().then(data => {
      setTypeDecisions(data)
    })
  }

  const getType = (id: number): string => {
    const result = typeDecisions.find( item => {
      return item.idType === id
    })
    
    return result?.libelle;
  }

  const handleSearchInputChange = (e: any): void => {
    const term = e.target.value.toLowerCase();
    setTerm(term);

    if(!term) {
      setFilteredDsvs(dsvs);
    } else {
      const results = dsvs.filter(item => {
        return Object.keys(item).some(key => {
          return item[key] && item[key].toString().toLowerCase().includes(term);
        })
      })
      setFilteredDsvs(results);
    }
  }


  ///////////////// GESTION VISAS

  ///////////////// GESTION ARTICLES
  const [dsas, setDsas] = useState<any[]>([]);
  const [filteredDsas, setFilteredDsas] = useState<any[]>([]);
  const [operationDsa, setOperationDsa] = useState<string>("add");
  const [termDsa, setTermDsa] = useState<string>('');
  const [selectedRowIdDsa, setSelectedRowIdDsa] = useState(null);

  const tableDsaColumns = [
    {
      name: "No",
      selector: (row: any) => row.numArticle,
      sortable: true,
      width: "100px",
    },
    {
      name: "Intitulé",
      cell: (row: any) => <CellWithTooltip value={row.intituleArticle}/>,
      sortable: true,
      maxWidth: '800px'
    },
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            <Button variant="outline-warning" title="Modifier" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleEditDsa(row)}><BsPencilSquare /></Button>
            <Button variant="outline-danger" title="Supprimer" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleDeleteDsa(row)}><BsTrash /></Button>
        </ButtonGroup>
      ),
      width: "100px",
      center: true,
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

  const [formDsa, setFormDsa] = useState<FormDsa>({
    numArticle: { value: '' },
    intituleArticle: { value: '' },
    intituleArticleReam: { value: '' },
    olduNmArticle: { value: '' },
  })

  const initFormDsa = () => {
    setOperationDsa('add');
    setSelectedRowIdDsa(null);
    setFormDsa({
      numArticle: { value: '' },
      intituleArticle: { value: '' },
      intituleArticleReam: { value: '' },
      olduNmArticle: { value: '' },
    })
  }

  const handleInputChangeFormDsa = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormDsa({ ...formDsa, ...newField}); 
  }

  const validateFormDsa = () => {
    let newForm: FormDsa = formDsa;

    // numArticle
    if(formDsa.numArticle.value === "") {
      const errorMsg: string = 'numArticle obligatoire !';
      const newField: Field = { value: formDsa.numArticle.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ numArticle: newField } };
    } else {
      const newField: Field = { value: formDsa.numArticle.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ numArticle: newField } };
    }

    setFormDsa(newForm);
    return newForm.numArticle.isValid;
  }

  const handleSubmitFormDsa = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormDsa()) {
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

    if (operationDsa === 'add') addDsa();
    if (operationDsa === 'edit') editDsa(); 
  }

  const libelleOperationDsa = () => {
    if (operationDsa === 'add') return "Ajouter article"
    if (operationDsa === 'edit') return "Modifier article"
  }

  const libelleButtonSumbitDsa = () => {
    if (operationDsa === 'add') return "Enregistrer"
    if (operationDsa === 'edit') return "Enregistrer"
  }

  const handleAddDsa = () => {
    initFormDsa();
  }

  const handleEditDsa = (row: any) => {
    setOperationDsa("edit");
    setSelectedRowIdDsa(row.numArticle)
    setFormDsa({
      numArticle: { value: row.numArticle, isValid: true },
      intituleArticle: { value: row.intituleArticle, isValid: true },
      intituleArticleReam: { value: row.intituleArticleReam, isValid: true  },
      olduNmArticle: { value: row.numArticle, isValid: true },
    })
  }

  const handleDeleteDsa = (row: any) => {
    initFormDsa()
    setSelectedRowIdDsa(row.numArticle)
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
        DecisionSArticleService.delete(row.numArticle).then(() => {
          getDsas();
          okSuccessDialog("Article supprimé avec succès !")
        });
      }
    });
  }

  const addDsa = async () => {
    let newDsa: DecisionSArticleDto = emptyDecisionSArticleDto;
    newDsa.numArticle = formDsa.numArticle.value;
    newDsa.intituleArticle = formDsa.intituleArticle.value;
    newDsa.intituleArticleReam = formDsa.intituleArticleReam.value;
    let exists = await DecisionSArticleService.existsById(formDsa.numArticle.value);
    if(!exists) {
      DecisionSArticleService.add(newDsa).then(data => {
        initFormDsa()
        getDsas()
        okSuccessDialog("Article ajouté avec succès !");
      })     
    } else {
      okWarnignDialog("Il existe déja un article avec ce numero !")
    }
  }

  const editDsa = async () => {
    let newDsa: DecisionSArticleDto = emptyDecisionSArticleDto;
    newDsa.intituleArticle = formDsa.intituleArticle.value;
    newDsa.intituleArticleReam = formDsa.intituleArticleReam.value;
    if (formDsa.numArticle.value !== formDsa.olduNmArticle.value) {
      let exists = await DecisionSArticleService.existsById(formDsa.numArticle.value);
      if(!exists) {
        DecisionSArticleService.edit(formDsa.numArticle.value, formDsa.olduNmArticle.value, newDsa).then(data => {
          initFormDsa()
          getDsas()
          okSuccessDialog("Article modifié avec succès !");
        })
      } else {
        okWarnignDialog("Il existe déja un article avec ce numéro !")
      }    
    } else {
      DecisionSArticleService.edit(formDsa.numArticle.value, formDsa.olduNmArticle.value, newDsa).then(data => {
        initFormDsa()
        getDsas()
        okSuccessDialog("Article modifié avec succès !");
      })
    }
  }

  useEffect(() => {
    initFormDsa();
    getDsas()
  }, [])

  const getDsas = () => {
    DecisionSArticleService.getAll().then(data => {
      setDsas(data)
      setFilteredDsas(data)
    })
  }

  const handleSearchInputChangeDsa = (e: any): void => {
    const term = e.target.value.toLowerCase();
    setTermDsa(term);

    if(!term) {
      setFilteredDsas(dsas);
    } else {
      const results = dsas.filter(item => {
        return Object.keys(item).some(key => {
          return item[key] && item[key].toString().toLowerCase().includes(term);
        })
      })
      setFilteredDsas(results);
    }
  }
  ///////////////// GESTION ARTICLES

  ///////////////// GESTION AMPLIATIONS
  const [dsams, setDsams] = useState<any[]>([]);
  const [filteredDsams, setFilteredDsams] = useState<any[]>([]);
  const [operationDsam, setOperationDsam] = useState<string>("add");
  const [termDsam, setTermDsam] = useState<string>('');
  const [selectedRowIdDsam, setSelectedRowIdDsam] = useState(null);

  const tableDsamColumns = [
    {
      name: "Ampliataire",
      cell: (row: any) => <CellWithTooltip value={row.ampliataire}/>,
      sortable: true,
      wrap: true,
    },
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            <Button variant="outline-warning" title="Modifier" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleEditDsam(row)}><BsPencilSquare /></Button>
            <Button variant="outline-danger" title="Supprimer" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleDeleteDsam(row)}><BsTrash /></Button>
        </ButtonGroup>
      ),
      width: "90px",
      center: true,
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

  const [formDsam, setFormDsam] = useState<FormDsam>({
    id: { value: '' },
    ampliataire: { value: '' },
    ampliataireReam: { value: '' }
  })

  const initFormDsam = () => {
    setOperationDsam('add');
    setSelectedRowIdDsam(null);
    setFormDsam({
      id: { value: '' },
      ampliataire: { value: '' },
      ampliataireReam: { value: '' }
    })
  }

  const handleInputChangeFormDsam = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormDsam({ ...formDsam, ...newField}); 
  }

  const validateFormDsam = () => {
    let newForm: FormDsam = formDsam;

    // ampliataire
    if(formDsam.ampliataire.value === "") {
      const errorMsg: string = 'ampliataire obligatoire !';
      const newField: Field = { value: formDsam.ampliataire.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ ampliataire: newField } };
    } else {
      const newField: Field = { value: formDsam.ampliataire.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ ampliataire: newField } };
    }

    setFormDsam(newForm);
    return newForm.ampliataire.isValid;
  }

  const handleSubmitFormDsam = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormDsam()) {
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

    if (operationDsam === 'add') addDsam();
    if (operationDsam === 'edit') editDsam(); 
  }

  const libelleOperationDsam = () => {
    if (operationDsam === 'add') return "Ajouter ampliataire"
    if (operationDsam === 'edit') return "Modifier ampliataire"
  }

  const libelleButtonSumbitDsam = () => {
    if (operationDsam === 'add') return "Enregistrer"
    if (operationDsam === 'edit') return "Enregistrer"
  }

  const handleAddDsam = () => {
    initFormDsam();
  }

  const handleEditDsam = (row: any) => {
    setOperationDsam("edit");
    setSelectedRowIdDsam(row.id)
    setFormDsam({
      id: { value: row.id, isValid: true },
      ampliataire: { value: row.ampliataire, isValid: true },
      ampliataireReam: { value: row.ampliataireReam, isValid: true  }
    })
  }

  const handleDeleteDsam = (row: any) => {
    initFormDsam()
    setSelectedRowIdDsam(row.id)
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
        DecisionSAmpliationService.delete(row.id).then(() => {
          getDsams();
          okSuccessDialog("Ampliataire supprimé avec succès !")
        });
      }
    });
  }

  const addDsam = () => {
    let newDsam: DecisionSAmpliationRequestDto = emptyDecisionSAmpliationRequestDto;
    newDsam.ampliataire = formDsam.ampliataire.value;
    newDsam.ampliataireReam = formDsam.ampliataireReam.value;
    DecisionSAmpliationService.add(newDsam).then(data => {
      initFormDsam()
      getDsams()
      okSuccessDialog("Ampliataire ajouté avec succès !");
    })
  }

  const editDsam = () => {
    let newDsam: DecisionSAmpliationRequestDto = emptyDecisionSAmpliationRequestDto;
    newDsam.ampliataire = formDsam.ampliataire.value;
    newDsam.ampliataireReam = formDsam.ampliataireReam.value;
    DecisionSAmpliationService.edit(formDsam.id.value, newDsam).then(data => {
      initFormDsam()
      getDsams()
      okSuccessDialog("Ampliataire modifié avec succès !");
    })
  }

  useEffect(() => {
    initFormDsam();
    getDsams()
  }, [])

  const getDsams = () => {
    DecisionSAmpliationService.getAll().then(data => {
      setDsams(data)
      setFilteredDsams(data)
    })
  }

  const handleSearchInputChangeDsam = (e: any): void => {
    const term = e.target.value.toLowerCase();
    setTermDsam(term);

    if(!term) {
      setFilteredDsams(dsams);
    } else {
      const results = dsams.filter(item => {
        return Object.keys(item).some(key => {
          return item[key] && item[key].toString().toLowerCase().includes(term);
        })
      })
      setFilteredDsams(results);
    }
  }
  ///////////////// GESTION AMPLIATIONS

  return (
    <Container>
          <div className="mt-1 p-1">
            <h6 className="shadow-sm text-primary text-center rounded">PARAMETRES &gt; MISE A JOUR PARAMETRE DECISION</h6>
            <Tabs id="uncontrolled-tab-example" defaultActiveKey="liste-des-visas" className="mb-1">
              {/* GESTION VISAS */}
              <Tab eventKey="liste-des-visas" title="Liste des visas (déblo et réamé)">
                <Form onSubmit={(e) => handleSubmitFormDsv(e)}>
                  <Card className="mb-1">
                    <Card.Header className='p-1'>
                    { libelleOperationDsv() }
                    </Card.Header>
                    <Card.Body className=''>
                      <Row>
                        <Col>
                          <Form.Group controlId="rangVisa" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Rang :</Form.Label></Col>
                            <Col><Form.Control name='rangVisa' value={formDsv.rangVisa.value} size='sm' type="number" onChange={e => handleInputChangeFormDsv(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="libelleVisa" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Libellé :</Form.Label></Col>
                            <Col><Form.Control name='libelleVisa' value={formDsv.libelleVisa.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormDsv(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="grpe" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Type :</Form.Label></Col>
                            <Col>
                              <Form.Select name='idType' value={formDsv.idType.value} size="sm" style={{fontSize:"0.72em"}} onChange={e => handleInputChangeFormDsv(e)}>
                                <option value=''></option>
                                {
                                  typeDecisions.map( (item: any) => (
                                    <option key={item.idType} value={item.idType}>{item.libelle}</option>
                                  ))   
                                }
                              </Form.Select>
                            </Col>
                          </Form.Group>
                        </Col>
                        <Col>
                        </Col>
                      </Row>                  
                    </Card.Body>
                    <Card.Footer className='p-1'>
                      <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>{ libelleButtonSumbitDsv() }</Button>
                      <Button size='sm' variant="outline-success" title="Ajouter Nouveau" className='ms-1' style={{width: "100px"}} onClick={ () => handleAddDsv()}><BsPlusLg /></Button>
                    </Card.Footer>
                  </Card>
                </Form>
                <Card>
                  <Card.Body className='p-1'>
                    <DataTable
                      customStyles={costumeStylesRDTavecButtonsActionsALaFin}
                      columns={tableDsvColumns}
                      data={filteredDsvs}
                      noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                      fixedHeader
                      responsive
                      striped
                      fixedHeaderScrollHeight='300px'
                      highlightOnHover
                      pointerOnHover
                      onRowClicked={(row) => setSelectedRowIdDsv(row.rangVisa) }
                      conditionalRowStyles={[
                        {
                          when: row => row.rangVisa === selectedRowIdDsv,
                          style: {
                            backgroundColor: "#e3f2fd",
                            borderLeft: "4px solid #1976d2",
                          },
                        },
                      ]}
                      subHeader
                      subHeaderComponent={
                        <Form.Control size='sm' type="text" placeholder="Recherche visa" value={term} className='w-25'  onChange={e => handleSearchInputChange(e)} />
                      }
                      />
                  </Card.Body>
              </Card>
              </Tab>

              {/* GESTION ARTICLES */}
              <Tab eventKey="liste-des-articles" title="Liste des articles (déblo)">
                <Form onSubmit={(e) => handleSubmitFormDsa(e)}>
                  <Card className="mb-1">
                    <Card.Header className='p-1'>
                    { libelleOperationDsa() }
                    </Card.Header>
                    <Card.Body className=''>
                      <Row>
                        <Col>
                          <Form.Group controlId="numArticle" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">No :</Form.Label></Col>
                            <Col><Form.Control name='numArticle' value={formDsa.numArticle.value} size='sm' type="number" onChange={e => handleInputChangeFormDsa(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="intituleArticle" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Intitulé :</Form.Label></Col>
                            <Col><Form.Control name='intituleArticle' value={formDsa.intituleArticle.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormDsa(e)} /></Col>
                          </Form.Group>
                        </Col>
                        <Col>
                        </Col>
                      </Row>                  
                    </Card.Body>
                    <Card.Footer className='p-1'>
                      <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>{ libelleButtonSumbitDsa() }</Button>
                      <Button size='sm' variant="outline-success" title="Ajouter Nouveau" className='ms-1' style={{width: "100px"}} onClick={ () => handleAddDsa()}><BsPlusLg /></Button>
                    </Card.Footer>
                  </Card>
                </Form>
                <Card>
                  <Card.Body className='p-1'>
                    <DataTable
                      customStyles={costumeStylesRDTavecButtonsActionsALaFin}
                      columns={tableDsaColumns}
                      data={filteredDsas}
                      noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                      fixedHeader
                      responsive
                      striped
                      fixedHeaderScrollHeight='300px'
                      highlightOnHover
                      pointerOnHover
                      onRowClicked={(row) => setSelectedRowIdDsa(row.numArticle) }
                      conditionalRowStyles={[
                        {
                          when: row => row.numArticle === selectedRowIdDsa,
                          style: {
                            backgroundColor: "#e3f2fd",
                            borderLeft: "4px solid #1976d2",
                          },
                        },
                      ]}
                      subHeader
                      subHeaderComponent={
                        <Form.Control size='sm' type="text" placeholder="Recherche article" value={termDsa} className='w-25'  onChange={e => handleSearchInputChangeDsa(e)} />
                      }
                      />
                  </Card.Body>
              </Card>
              </Tab>

              {/* GESTION AMPLIATAIRES */}
              <Tab eventKey="liste-des-ampliataires" title="Liste des ampliataires (déblo et réamé)">
                <Form onSubmit={(e) => handleSubmitFormDsam(e)}>
                  <Card className="mb-1">
                    <Card.Header className='p-1'>
                    { libelleOperationDsam() }
                    </Card.Header>
                    <Card.Body className=''>
                      <Row>
                        <Col>
                          <Form.Group controlId="ampliataire" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Ampliataire :</Form.Label></Col>
                            <Col><Form.Control name='ampliataire' value={formDsam.ampliataire.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormDsam(e)} /></Col>
                          </Form.Group>
                        </Col>
                        <Col>
                        </Col>
                      </Row>                  
                    </Card.Body>
                    <Card.Footer className='p-1'>
                      <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>{ libelleButtonSumbitDsam() }</Button>
                      <Button size='sm' variant="outline-success" title="Ajouter Nouveau" className='ms-1' style={{width: "100px"}} onClick={ () => handleAddDsam()}><BsPlusLg /></Button>
                    </Card.Footer>
                  </Card>
                </Form>
                <Card>
                  <Card.Body className='p-1'>
                    <DataTable
                      customStyles={costumeStylesRDTavecButtonsActionsALaFin}
                      columns={tableDsamColumns}
                      data={filteredDsams}
                      noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                      fixedHeader
                      responsive
                      striped
                      fixedHeaderScrollHeight='300px'
                      highlightOnHover
                      pointerOnHover
                      onRowClicked={(row) => setSelectedRowIdDsam(row.id) }
                      conditionalRowStyles={[
                        {
                          when: row => row.id === selectedRowIdDsam,
                          style: {
                            backgroundColor: "#e3f2fd",
                            borderLeft: "4px solid #1976d2",
                          },
                        },
                      ]}
                      subHeader
                      subHeaderComponent={
                        <Form.Control size='sm' type="text" placeholder="Recherche ampliataire" value={termDsam} className='w-25'  onChange={e => handleSearchInputChangeDsam(e)} />
                      }
                      />
                  </Card.Body>
              </Card>
              </Tab>
            </Tabs>  
          </div>
      </Container>
  );
};

export default MajParametreDecisionForm;
