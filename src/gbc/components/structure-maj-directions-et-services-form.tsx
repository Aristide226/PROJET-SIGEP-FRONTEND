import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, Row } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import Swal from 'sweetalert2';
import DataTable  from 'react-data-table-component'; 
import { costumeStyles } from '../../helpers/costume-styles';
import { okSuccessDialog } from '../../helpers/dialogs';
import { BsPencilSquare, BsPlusLg, BsTrash } from 'react-icons/bs';
import DirectionServiceService from '../services/direction-service-service';
import { DirectionServiceRequestDto, emptyDirectionServiceRequestDto } from '../models/direction-service';
import { DirectionServiceNiveauResponseDto } from '../models/direction-service-niveau';
import DirectionServiceNiveauService from '../services/direction-service-niveau-service';
import EnteteStructureService from '../services/entete-structure-service';
import { emptyEnteteStructureResponseDto, EnteteStructureResponseDto } from '../models/entete-structure';

type FormDs = {
  idService: Field,
	libelle: Field,
	abrev: Field,
  idHerachique: Field,
	idNiveau: Field,
	codStruct: Field,
	idParent: Field,
	idServices: Field,
	mles: Field
}

const StructureMajDirectionsEtServicesForm: FunctionComponent = () => {

  const [directionServiceNiveaus, setDirectionServiceNiveaus] = useState<DirectionServiceNiveauResponseDto[]>([]);
  const [dSs, setDss] = useState<any[]>([]);
  const [_dSs, set_Dss] = useState<any[]>([]);
  const [dSDeReleveDs, setDsDeReleveDs] = useState<any[]>([]);
  const [filteredDss, setFilteredDss] = useState<any[]>([]);
  const [operationDs, setOperationDs] = useState<string>("add");
  const [termDs, setTermDs] = useState<string>('');

  const [es, setEs] = useState<EnteteStructureResponseDto>(emptyEnteteStructureResponseDto);

  const tableDsColumns = [
    {
      name: "ID",
      selector: (row: any) => row.idService,
      sortable: true,
      width: "100px",
      wrap: true
    },
    {
      name: "Nom",
      selector: (row: any) => row.libelle,
      sortable: true,
      wrap: true,
      
    },
    {
      name: "Abrév",
      selector: (row: any) => row.abrev,
      sortable: true,
      width: "100px"
    },
    {
      name: "Niveau",
      selector: (row: any) => row.idNiveau,
      sortable: true,
      width: "100px"
    },
    {
      name: "Relève de",
      selector: (row: any) => row.releveDe,
      sortable: true,
      width: "100px"
    },
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            <Button variant="outline-warning" title="Modifier" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleEditDs(row)}><BsPencilSquare /></Button>
            <Button variant="outline-danger" title="Supprimer" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleDeleteDs(row.idService)}><BsTrash /></Button>
        </ButtonGroup>
      ),
      width: "90px",
      center: true,
    }
  ]

  const [formDs, setFormDs] = useState<FormDs>({
    idService: { value: '' },
    libelle: { value: '' },
    abrev: { value: '' },
    idHerachique: { value: '' },
    idNiveau: { value: '' },
    codStruct: { value: '' },
    idParent: { value: '' },
    idServices: { value: '' },
    mles: { value: '' }
  })

  const initFormDs = () => {
    setOperationDs('add');
    setFormDs({
      idService: { value: '' },
      libelle: { value: '' },
      abrev: { value: '' },
      idHerachique: { value: '' },
      idNiveau: { value: '' },
      codStruct: { value: '' },
      idParent: { value: '' },
      idServices: { value: '' },
      mles: { value: '' }
    })
    setDsDeReleveDs([])
  }

  const handleInputChangeFormDs = (e: any): void => { 
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormDs({ ...formDs, ...newField}); 

    if (fieldName === "idNiveau") {
      const results = dSs.filter(ds => ds.idNiveau === Number(fieldValue) - 1);
      setDsDeReleveDs(results); 
    } 
  }

  useEffect(() => {
    if (dSDeReleveDs.length !== 0) {
      formDs.idParent.value = dSDeReleveDs[0].idService;
    } else {
      formDs.idParent.value = "";
    }
  }, [dSDeReleveDs])


  const validateFormDs = () => {
    let newForm: FormDs = formDs;

    // Libelle
    if(formDs.libelle.value === "") {
      const errorMsg: string = 'Abreviation obligatoire !';
      const newField: Field = { value: formDs.libelle.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ libelle: newField } };
    } else {
      const newField: Field = { value: formDs.libelle.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ libelle: newField } };
    }

    // Abréviation
    if(formDs.abrev.value === "") {
      const errorMsg: string = 'Abreviation obligatoire !';
      const newField: Field = { value: formDs.abrev.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ abrev: newField } };
    } else {
      const newField: Field = { value: formDs.abrev.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ abrev: newField } };
    }

    // Abréviation
    if(formDs.idNiveau.value === "") {
      const errorMsg: string = 'Niveau obligatoire !';
      const newField: Field = { value: formDs.idNiveau.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ idNiveau: newField } };
    } else {
      const newField: Field = { value: formDs.idNiveau.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ idNiveau: newField } };
    }

    setFormDs(newForm);
    return  newForm.libelle.isValid && newForm.abrev.isValid && newForm.idNiveau.isValid;
  }

  const handleSubmitFormDs = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormDs()) {
      Swal.fire({
        title: 'GesBud',
        text: "Les champs nom, abrév et niveau sont obligatoires !",
        icon: 'warning',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
      });
      return;
    }

    if (operationDs === 'add') addDs();
    if (operationDs === 'edit') editDs(); 
  }

  const libelleOperationDs = () => {
    if (operationDs === 'add') return "Ajouter une structure administrative"
    if (operationDs === 'edit') return "Modifier une structure administrative"
  }

  const libelleButtonSumbitDs = () => {
    if (operationDs === 'add') return "Enregistrer"
    if (operationDs === 'edit') return "Enregistrer"
  }

  const handleAddDs = () => {
    initFormDs();
  }

  const handleEditDs = (row: any) => {
    setOperationDs("edit");
    setFormDs({
      idService: { value: row.idService, isValid: true },
      libelle: { value: row.libelle, isValid: true },
      abrev: { value: row.abrev, isValid: true },
      idHerachique: { value: row.idHerachique, isValid: true },
      idNiveau: { value: row.idNiveau, isValid: true },
      codStruct: { value: row.codStruct, isValid: true },
      idParent: { value: row.idParent, isValid: true },
      idServices: { value: row.idServices, isValid: true },
      mles: { value: row.mles, isValid: true }
    })  
    const results = dSs.filter(ds => ds.idNiveau === Number(row.idNiveau) - 1);
    setDsDeReleveDs(results); 
  }

  const handleDeleteDs = (id: number) => {
    initFormDs()
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
        DirectionServiceService.delete(id).then(() => {
          getDss();
          okSuccessDialog("Structure administrative supprimée avec succès !")
        });
      }
    });
  }

  const addDs = () => {
    let newDs: DirectionServiceRequestDto = emptyDirectionServiceRequestDto;
    newDs.libelle = formDs.libelle.value;
    newDs.abrev = formDs.abrev.value;
    newDs.idNiveau = formDs.idNiveau.value;
    newDs.codStruct = es.abrevEpe;
    newDs.idParent = formDs.idParent.value;
    DirectionServiceService.add(newDs).then(data => {
      initFormDs()
      getDss()
      okSuccessDialog("Structure administrative ajoutée avec succès !");
    })
  }

  const editDs = () => {
    let newDs: DirectionServiceRequestDto = emptyDirectionServiceRequestDto;
    newDs.libelle = formDs.libelle.value;
    newDs.abrev = formDs.abrev.value;
    newDs.idNiveau = formDs.idNiveau.value;
    newDs.codStruct = formDs.codStruct.value;
    newDs.idParent = formDs.idParent.value;
    DirectionServiceService.edit(formDs.idService.value, newDs).then(data => {
      initFormDs()
      getDss()
      okSuccessDialog("Structure administrative modifiée avec succès !");
    })
  }

  useEffect(() => {
    initFormDs();
    getEss();
    getDirectionServiceNiveaus();
    getDss();
  }, [])

  useEffect( () => {
    dSs.forEach(ds => {
      const directionServiceParent = _dSs.find(_ds => _ds.idService === ds.idParent);
      ds.releveDe = directionServiceParent?.abrev;
    })
    setFilteredDss(dSs)
  }, [dSs, _dSs])

  const getDirectionServiceNiveaus = () => {
    DirectionServiceNiveauService.getAll().then( data => setDirectionServiceNiveaus(data));
  }

  const getDss = () => {
    DirectionServiceService.getAll().then(data => {
      setDss(data)
      set_Dss(data)
    })
  }

  const handleSearchDsInputChange = (e: any): void => {
    const term = e.target.value.toLowerCase();
    setTermDs(term);

    if(!term) {
      setFilteredDss(dSs);
    } else {
      const results = dSs.filter(item => {
        return Object.keys(item).some(key => {
          return item[key] && item[key].toString().toLowerCase().includes(term);
        })
      })
      setFilteredDss(results);
    }
  }

  const getEss = () => {
    EnteteStructureService.getAll().then(data => {
      setEs(data[0])
    })
  }

  return (
    <Container>
          <div className="mt-1 p-1">
            <h6 className="shadow-sm text-primary text-center rounded">PARAMETRES &gt; STRUCTURE &gt; METTRE A JOUR DIRECTIONS ET SERVICES</h6>
            <Form onSubmit={(e) => handleSubmitFormDs(e)}>
                <Card className="mb-3">
                  <Card.Header className='p-1'>
                  { libelleOperationDs() }
                  </Card.Header>
                  <Card.Body className=''>
                    <Row>
                      <Col>
                        <Form.Group controlId="libelle" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Nom :</Form.Label></Col>
                          <Col><Form.Control name='libelle' value={formDs.libelle.value} size='sm' type="text" onChange={e => handleInputChangeFormDs(e)} /></Col>
                        </Form.Group>
                        <Form.Group controlId="abrev" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Abréviation :</Form.Label></Col>
                          <Col><Form.Control name='abrev' value={formDs.abrev.value} size='sm' type="text" onChange={e => handleInputChangeFormDs(e)} /></Col>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="idNiveau" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className='label2'>Niveau :</Form.Label></Col>
                          <Col>
                            <Form.Select name='idNiveau' value={formDs.idNiveau.value} size='sm' aria-label="Default select example" onChange={e => handleInputChangeFormDs(e)}>
                              <option value=''></option>
                              {
                                directionServiceNiveaus.map( dsn => (
                                  <option key={dsn.idNiveau} value={dsn.idNiveau}>{dsn.libelleNiveau}</option>
                                ))
                              }
                            </Form.Select>
                          </Col>
                        </Form.Group>
                        <Form.Group controlId="idParent" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className='label2'>Relève de : </Form.Label></Col>
                          <Col>
                            <Form.Select name='idParent' value={formDs.idParent.value} size='sm' aria-label="Default select example" onChange={e => handleInputChangeFormDs(e)}>
                              {
                                dSDeReleveDs.map( ds => (
                                  <option key={ds.idService} value={ds.idService}>{ds.abrev} : {ds.libelle}</option>
                                ))
                              }
                            </Form.Select>
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>                  
                  </Card.Body>
                  <Card.Footer className='p-1'>
                    <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>{ libelleButtonSumbitDs() }</Button>
                    <Button size='sm' variant="outline-success" title="Ajouter Nouveau" className='ms-1' style={{width: "100px"}} onClick={ () => handleAddDs()}><BsPlusLg /></Button>
                  </Card.Footer>
                </Card>
              </Form>  

              <Card>
                  <Card.Body className='p-1'>
                    <DataTable
                      customStyles={costumeStyles}
                      columns={tableDsColumns}
                      data={filteredDss}
                      noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                      fixedHeader
                      responsive
                      striped
                      fixedHeaderScrollHeight='300px'
                      highlightOnHover
                      subHeader
                      subHeaderComponent={
                        <Form.Control size='sm' type="text" placeholder="Recherche une structure administrative" value={termDs} className='w-25'  onChange={e => handleSearchDsInputChange(e)} />
                      }
                      />
                  </Card.Body>
              </Card>  
          </div>
      </Container>
  );
};

export default StructureMajDirectionsEtServicesForm;
