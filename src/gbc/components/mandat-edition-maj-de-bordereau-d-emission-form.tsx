import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef, GridRowSelectionModel, GridValueFormatterParams } from '@mui/x-data-grid';
import { ConnectedUser, Gestion, IdBudget } from '../helpers/session-storage';
import Stack from '@mui/material/Stack';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import AccesCodeService from '../services/accesCodeService';
import AccesCodeDto, { emptyAccesCodeDto } from '../models/accesCodeDto';
import Swal from 'sweetalert2';
import { removeNonNumeric } from '../../helpers/format';
import { okSuccessDialog, okWarnignDialog } from '../../helpers/dialogs';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import MandatsViewService from '../services/mandats-view-service';
import { formatDateWithHoursAndMinutes } from '../../helpers/format-date';
import { BordereauEmismandatsRequestDto, emptyBordereauEmismandatsRequestDto } from '../models/bordereau-emis-mandat';
import BordereauEmisMandatsService from '../services/bordereau-emis-mandats-service';
import MandatService from '../services/mandat-service';
import { emptyIdMandsIdBordEmis, IdMandsIdBordEmis } from '../models/id-mands-id-bord-emis';
import BordMandService from '../services/bord-mand-service';
import BordereauEmismandatsViewService from '../services/bordereau-emis-mandat-view-service';
import { BordereauEmismandatsViewDto } from '../models/bordereau-emis-mandat-view';
import bcrypt from 'bcryptjs-react';
import ServerDateService from '../../shared/system/services/server-date-service';

// CRITERES DE RECHERCHE MANDAT
type FormRMandat = {
  mandNumb: Field,
  chapitre: Field,
  article: Field,
  paragraphe: Field,
  rubrique: Field
}

const MandatEditionMajDeBordereauDEmissionForm: FunctionComponent = () => {

  const [gestionCourante] = useState<string>(Gestion() ?? '');
  const [idBudget] = useState<string>(IdBudget() ?? '');
  const [utilisateurCourante] = useState<string>(ConnectedUser() ?? '');
  const [isGestionClose, setIsGestionClose] = useState<boolean>(false);
  const dateEnregistrementPourGestionClose: Date = new Date(gestionCourante + '-12-31');   
  const [disableEditerBordereauMandat, setDisbleDisableEditerBordereauMandat] = useState<boolean>(true);

  useEffect(() => {
    // On recupere la date du server : si la gestion en cours est strictement inférieur à l'année de la date du serveur alors elle est close :
    ServerDateService.getServerDate().then(data => {
      if (Number(gestionCourante) < new Date(data).getFullYear()) setIsGestionClose(true); else setIsGestionClose(false)   
    }) 
  }, []) 

  ///////////////// GESTION EDITION DE BORDEREAU DE MANDATS
  const [mandats, setMandats] = useState<any[]>([]);
  const [filteredMandats, setFilteredMandats] = useState<any[]>([]);
  const [loaderMandats, setLoaderMandats] = useState<boolean>(true);
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]); 
  const [selectedRows, setSelectedRows] = useState<any[]>([]); 

  const tableMandatColumns: GridColDef[] = [
    {
      field: 'numMand',
      headerName: 'Code',
      type: 'number',
      width: 60,
      headerClassName: 'header',
    },
    {
      field: 'numero',
      headerName: 'Numéro',
      type: 'string',
      width: 100,
      align: "center",
      headerClassName: 'header',
    },
    {
      field: 'dateMand',
      headerName: 'Date de création',
      type: 'Date',
      width: 140,
      align: "center",
      valueFormatter: (params : GridValueFormatterParams<any>) => {
        return formatDateWithHoursAndMinutes(new Date(params.value));
      },
      headerClassName: 'header',
    },    
    {
      field: 'nom',
      headerName: 'Fournisseur / Bénéficiaire',
      type: 'string',
      width: 430,
      headerClassName: 'header',
      headerAlign: 'center'
    },
    {
      field: 'montant',
      headerName: 'Montant',
      type: 'number',
      width: 120,
      headerClassName: 'header',
      headerAlign: 'center'
    }, 
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      width: 100,
      headerClassName: 'header',
    },
  ];

  useEffect(() => {
    getMandats()
  }, [])
  
  const getMandats = () => {
    MandatsViewService.getMandatValideAE2EtSansBordereaus(Number(gestionCourante), Number(idBudget)).then(data => {
      data.forEach(element => {
        (element as any).numero = element.gestion + "-" + String(element.mandNumb).padStart(4, '0');
      });      
      setMandats(data) 
      setFilteredMandats(data)
      setLoaderMandats(false)
    })
  }
  ///////////////// GESTION EDITION DE BORDEREAU DE MANDATS

  ///////////////// GESTION RECHERCHE MANDAT
  const [formRMandat, setFormRMandat] = useState<FormRMandat>({
    mandNumb: { value: ''},
    chapitre: { value: ''},
    article: { value: ''},
    paragraphe: { value: ''},
    rubrique: { value: ''},
  })

  const handleInputChangeFormRMandat = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormRMandat({ ...formRMandat, ...newField})

    if (fieldName === 'mandNumb') {
      const results = mandats.filter(item => {
        return ((item.mandNumb || '').toString().startsWith(fieldValue))
        && ((item.chap || '').toString().startsWith(formRMandat.chapitre.value))
        && ((item.art || '').toString().startsWith(formRMandat.article.value))
        && ((item.parag || '').toString().startsWith(formRMandat.paragraphe.value))
        && ((item.rub || '').toString().startsWith(formRMandat.rubrique.value))
      })
      setFilteredMandats(results);
    }

    if (fieldName === 'chapitre') {
      const results = mandats.filter(item => {
        return ((item.mandNumb || '').toString().startsWith(formRMandat.mandNumb.value))
        && ((item.chap || '').toString().startsWith(fieldValue))
        && ((item.art || '').toString().startsWith(formRMandat.article.value))
        && ((item.parag || '').toString().startsWith(formRMandat.paragraphe.value))
        && ((item.rub || '').toString().startsWith(formRMandat.rubrique.value))
      })
      setFilteredMandats(results);
    }

    if (fieldName === 'article') {
      const results = mandats.filter(item => {
        return ((item.mandNumb || '').toString().startsWith(formRMandat.mandNumb.value))
        && ((item.chap || '').toString().startsWith(formRMandat.chapitre.value))
        && ((item.art || '').toString().startsWith(fieldValue))
        && ((item.parag || '').toString().startsWith(formRMandat.paragraphe.value))
        && ((item.rub || '').toString().startsWith(formRMandat.rubrique.value))
      })
      setFilteredMandats(results);
    }

    if (fieldName === 'paragraphe') {
      const results = mandats.filter(item => {
        return ((item.mandNumb || '').toString().startsWith(formRMandat.mandNumb.value))
        && ((item.chap || '').toString().startsWith(formRMandat.chapitre.value))
        && ((item.art || '').toString().startsWith(formRMandat.article.value))
        && ((item.parag || '').toString().startsWith(fieldValue))
        && ((item.rub || '').toString().startsWith(formRMandat.rubrique.value))
      })
      setFilteredMandats(results);
    }

    if (fieldName === 'rubrique') {
      const results = mandats.filter(item => {
        return ((item.mandNumb || '').toString().startsWith(formRMandat.mandNumb.value))
        && ((item.chap || '').toString().startsWith(formRMandat.chapitre.value))
        && ((item.art || '').toString().startsWith(formRMandat.article.value))
        && ((item.parag || '').toString().startsWith(formRMandat.paragraphe.value))
        && ((item.rub || '').toString().startsWith(fieldValue))
      })
      setFilteredMandats(results);
    }
  }
  ///////////////// GESTION RECHERCHE MANDAT

  ///////////////// GESTION EDITER BORDEREAU MANDAT
  const handleEditerBordereauMandatButtonClick = () => {
    let ids : number[] = [];
    selectedRowIds.forEach(id => {
      ids.push(Number(id.valueOf()));
    });

    let total : number = 0;
    selectedRows.forEach(mandat => {
      total = total + mandat.montant;
    });

    let bordereauEmismandatsRequestDto: BordereauEmismandatsRequestDto = emptyBordereauEmismandatsRequestDto;
    bordereauEmismandatsRequestDto.gestion = gestionCourante;
    bordereauEmismandatsRequestDto.journee = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
    bordereauEmismandatsRequestDto.total = total;
    bordereauEmismandatsRequestDto.idLogin = utilisateurCourante;
    bordereauEmismandatsRequestDto.dossier = "M"; 
    bordereauEmismandatsRequestDto.actif = true;
    bordereauEmismandatsRequestDto.dateReception = null
    bordereauEmismandatsRequestDto.userReception = null;
    bordereauEmismandatsRequestDto.identiteRecept = null;
    bordereauEmismandatsRequestDto.idBudget = idBudget;

    BordereauEmisMandatsService.add(bordereauEmismandatsRequestDto).then(data => {
      let idMandsIdBordEmis: IdMandsIdBordEmis = emptyIdMandsIdBordEmis;
      idMandsIdBordEmis.ids = ids;
      idMandsIdBordEmis.idBordEmis = data.id;
      MandatService.transmettre(idMandsIdBordEmis).then(res => {
        BordMandService.adds(idMandsIdBordEmis).then(res => {
          if (res) {
            setSelectedRowIds([])
            getMandats();
            getBordereauEmismandats();
            Swal.fire({
              title: 'GesBud',
              text: "Mandats transmis avec succès !",
              icon: 'success',
              confirmButtonText: 'OK',
              allowOutsideClick: false,
              confirmButtonColor: '#007E33' 
            }).then( (result) => {
              if (result.isConfirmed) {
                // IMPRIMER BORDEREAU D'EMISSION DE MANDAT
                console.log(data.id);
                
              }
            });
          }
        })
      })
    });
  }

  useEffect(() => {
    if (selectedRowIds.length !== 0) setDisbleDisableEditerBordereauMandat(false); else setDisbleDisableEditerBordereauMandat(true);
  }, [selectedRowIds])
  ///////////////// GESTION EDITER BORDEREAU MANDAT

  ///////////////// GESTION REEDITER BORDEREAU MANDAT
  const [bordereauEmismandats, setBordereauEmismandats] = useState<BordereauEmismandatsViewDto[]>([]);
  const [numero, setNumero] = useState<string>("");
  const [bordereauEmismandatSelectionne, setBordereauEmismandatSelectionne] = useState<any>(null);
  const [disableEditerBordereauEmismandatSelectionne, setDisableEditerBordereauEmismandatSelectionne] = useState<boolean>(true);
  const [disableAnnulerBordereauEmismandatSelectionne, setDisableAnnulerBordereauEmismandatSelectionne] = useState<boolean>(true);

  const handleInputChangeNumero = (e: any): void => {
    setNumero(removeNonNumeric(e.target.value))
  }

  useEffect(() => {
    const result = bordereauEmismandats.find((item) => item.num === Number(numero));
    if (result) {
      setBordereauEmismandatSelectionne(result); 
      setDisableEditerBordereauEmismandatSelectionne(false);
      setDisableAnnulerBordereauEmismandatSelectionne(false);
    } else {
      setBordereauEmismandatSelectionne(null);
      setDisableEditerBordereauEmismandatSelectionne(true);
      setDisableAnnulerBordereauEmismandatSelectionne(true);
    }
  }, [numero])

  useEffect(() => {
    getBordereauEmismandats();
  }, [])  

  const getBordereauEmismandats = () => {
    BordereauEmismandatsViewService.getByGestionAndIdBudgetAndDossier(Number(gestionCourante), Number(idBudget), 'M').then( data => {
      if (data.length !== 0) setNumero(data[0].num);
      setBordereauEmismandats(data);
    });
  }

  const handleReediterBordereauMandatButtonClick = () => {
    const result = bordereauEmismandats.find((item) => item.num === Number(numero));
    if (result) {
        // IMPRIMER BORDEREAU D'EMISSION DE MANDAT : num, idBordEmis
        
    } else {
      okWarnignDialog("Ce numero ne corresond à aucun bordereau !")
    }
  }
  ///////////////// GESTION REEDITER BORDEREAU MANDAT

  ///////////////// GESTION ANNULER BORDEREAU
  const handleAnnulerBordereauEmismandatButtonClick = () => {
    handleShowModalMotDePasseDeConnexion();
  } 

  const AnnulerBordereauEmismandat = () => {
    Swal.fire({
      title: 'GesBud',
      text: "Etes-vous certain de vouloir annuler cet bordereau ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      allowOutsideClick: false,
      confirmButtonColor: '#007E33' 
    }).then( (result) => {
      if (result.isConfirmed) {
        const result = bordereauEmismandats.find((item) => item.num === Number(numero));
        if (result) {         
          BordMandService.deleteBordereauEmismandats(result.id).then(res => {
            if (res) {
              setSelectedRowIds([])
              getMandats();
              getBordereauEmismandats();
              okSuccessDialog("Bordereau annulé avec succès !");
            } else {
              setSelectedRowIds([])
              getMandats();
              getBordereauEmismandats();
              okWarnignDialog("Bordereau non annulé !");
            }
          })             
        } else {
          okWarnignDialog("Ce numero ne corresond à aucun bordereau !")
        }             
      }
    });
  }  
  ///////////////// GESTION ANNULER BORDEREAU

  ///////////////// GESTION REEDITER TOUT
  const handleReediterToutButtonClick = () => {
    
  } 
  ///////////////// GESTION REEDITER TOUT

  //////////////// GESTION MOT DE PASSE CONNEXION
  const [accesCodeCourante, setAccesCodeCourante] = useState<AccesCodeDto>(emptyAccesCodeDto);
  const [showModalMotDePasseDeConnexion, setShowModalMotDePasseDeConnexion] = useState(false);
  const [motDePasseDeConnexion, setMotDePasseDeConnexion] = useState("");

  useEffect(() => {
    getAccesCodeCourante();
  }, [])

  const getAccesCodeCourante = () => {
    AccesCodeService.get(ConnectedUser()).then( data => {
      setAccesCodeCourante(data)
    });
  }

  const handleMotDePasseDeConnexionInputChange = (e: any): void => {
    setMotDePasseDeConnexion(e.target.value);
  }

  const handleOk = () => {
    bcrypt.compare(motDePasseDeConnexion, accesCodeCourante.motDePasse).then( res => {
      if (!res) {
        okWarnignDialog("Mot de passe incorrect !")
      } else {
        //setDisableSupprimerLeReçu(true);
        AnnulerBordereauEmismandat();
        handleCloseModalMotDePasseDeConnexion();
      }
    })
  }

  const handleCloseModalMotDePasseDeConnexion = () => {
    setMotDePasseDeConnexion("");
    setShowModalMotDePasseDeConnexion(false);
  }

  const handleShowModalMotDePasseDeConnexion = () => {
    setShowModalMotDePasseDeConnexion(true)
  }
  //////////////// GESTION MOT DE PASSE CONNEXION  

  //////////////// MESSAGE AFFICHER QUAND IL NY A PAS DE DONNEES
  const NoRowsOverlay = () => {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        Aucun enregistrement à afficher !
      </Stack>
    );
  }
  //////////////// MESSAGE AFFICHER QUAND IL NY A PAS DE DONNEES

  return (
    <Container>
          <div className="mt-1 p-1">
            <h6 className="shadow-sm text-primary text-center rounded">MANDAT &gt; EDITION DE BORDEREAU DE D'EMISSION DE MANDAT</h6>
            <Form>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <Card.Subtitle>Nouvelle édition</Card.Subtitle>
                  <Form.Group as={Row}>
                    <InputGroup as={Col}>
                      <Form.Control name='mandNumb' value={formRMandat.mandNumb.value} size='sm' type="number" placeholder='n° mandat' onChange={e => handleInputChangeFormRMandat(e)} className='me-1' style={{minWidth:"100px", maxWidth:"100px"}} />
                      <Form.Control name='chapitre' value={formRMandat.chapitre.value} size='sm' type="number" placeholder='chapitre' onChange={e => handleInputChangeFormRMandat(e)} className='me-1' style={{minWidth:"100px", maxWidth:"100px"}} />
                      <Form.Control name='article' value={formRMandat.article.value} size='sm' type="number" placeholder='article' onChange={e => handleInputChangeFormRMandat(e)} className='me-1' style={{minWidth:"100px", maxWidth:"100px"}} />
                      <Form.Control name='paragraphe' value={formRMandat.paragraphe.value} size='sm' type="number" placeholder='paragraphe' onChange={e => handleInputChangeFormRMandat(e)} className='me-1' style={{minWidth:"100px", maxWidth:"100px"}} />
                      <Form.Control name='rubrique' value={formRMandat.rubrique.value} size='sm' type="number" placeholder='rubrique' onChange={e => handleInputChangeFormRMandat(e)} className='me-1' style={{minWidth:"100px", maxWidth:"100px"}} />
                    </InputGroup>
                    <ButtonGroup as={Col} xs={1} size="sm" className='justify-content-end'>
                      <Button variant="outline-primary" title="Editer bordereau des mandats sélectionnés" className='me-1' style={{maxWidth:"65px", maxHeight:"30px"}} onClick={ () => handleEditerBordereauMandatButtonClick()} disabled={disableEditerBordereauMandat}><LocalPrintshopIcon /></Button>
                    </ButtonGroup>
                  </Form.Group>
                </Card.Body>
              </Card>
              <Card className="mb-4">
                <Card.Body className='p-1' style={{height: "350px"}}>
                  <DataGrid
                      rows={filteredMandats}
                      loading={loaderMandats}
                      getRowId={(row) => row.numMand}
                      columns={tableMandatColumns}
                      columnHeaderHeight={50}
                      hideFooter={true}
                      rowHeight={25}
                      checkboxSelection
                      keepNonExistentRowsSelected
                      disableRowSelectionOnClick={true}
                      rowSelectionModel={selectedRowIds}
                      onRowSelectionModelChange={(ids) => {
                        setSelectedRowIds(ids)

                        let numMands : number[] = [];
                        ids.forEach(id => {
                          numMands.push(Number(id.valueOf()));
                        });                        
                        setSelectedRows(mandats.filter(mandat => numMands.includes(mandat.numMand)));
                      }}
                      slots={{
                        noRowsOverlay: NoRowsOverlay,
                      }}
                      sx={{
                        '& .header': {
                          backgroundColor: '#dc3545',
                          marginTop:'2px',
                        }
                      }}
                    />
                </Card.Body>                        
              </Card>
              <Card>
                <Card.Body className='p-1'>
                  <Card.Subtitle>Réedition</Card.Subtitle>
                  <Form.Group as={Row}>
                    <InputGroup as={Col}>
                      <Form.Control name='' size='sm' value={"Numéro :"} type="text" className='me-1 fw-bold text-primary' disabled />
                      <Form.Control name='' size='sm' value={gestionCourante} type="text" className='me-1' style={{minWidth:"50px", maxWidth:"50px", fontWeight:'bold'}} disabled />
                      <Form.Control name='numero' value={numero} size='sm' type="text" onChange={e => handleInputChangeNumero(e)} className='' style={{minWidth:"65px", maxWidth:"65px", fontWeight:'bold'}} />
                      <Form.Select name='numero' value={numero} size='sm' aria-label="Default select example" onChange={e => handleInputChangeNumero(e)} style={{minWidth:"1px", maxWidth:"1px", fontWeight:'bold'}}>
                        {
                          bordereauEmismandats.map( bem => (
                          <option key={bem.id} value={bem.num}>{bem.num}</option>
                          ))
                        }
                      </Form.Select>
                    </InputGroup>
                    <ButtonGroup as={Col} size="sm" className='justify-content-end'>
                      <Button variant="outline-primary" title="Réediter le bordereau sélectionné" className='me-1' style={{minWidth:"140px", maxWidth:"140px", maxHeight:"30px"}} onClick={ () => handleReediterBordereauMandatButtonClick()}>Editer <LocalPrintshopOutlinedIcon /></Button>
                      <Button variant="outline-primary" title="Annuler le bordereau sélectionné" className='me-1' style={{minWidth:"140px", maxWidth:"140px", maxHeight:"30px"}} onClick={ () => handleAnnulerBordereauEmismandatButtonClick()}>Annuler <DeleteIcon /></Button>  
                      <Button variant="outline-primary" title="Imprimer tout" className='me-1' style={{minWidth:"140px", maxWidth:"140px", maxHeight:"30px"}} onClick={ () => handleReediterBordereauMandatButtonClick()}>Editer tout <DescriptionOutlinedIcon /></Button>
                    </ButtonGroup>
                  </Form.Group>
                  <Card className='mt-1'>
                    <Card.Body className='p-1'>
                      <Card.Title style={{fontSize:"0.8em", marginBottom:"0px"}}>Eléments du bordereau</Card.Title>
                      <Table responsive striped bordered hover variant="" size="sm" style={{marginBottom:"0px"}}>
                        <thead>
                          <tr>
                            <th style={{width:"100px"}}>Numéro</th>
                            <th style={{width:"100px"}}>Journée</th>
                            <th style={{width:"100px"}}>Total</th>
                            <th style={{width:"100px"}}>Total antérieur</th>
                            <th style={{width:"100px"}}>Total cumul</th>
                            <th style={{width:"100px"}}>Nbre de mandat</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{fontWeight:"bold", fontSize:"1.1em"}} className='text-center'>
                            <td>{ bordereauEmismandatSelectionne !== null && bordereauEmismandatSelectionne.gestion + '-' + String(bordereauEmismandatSelectionne.num).padStart(4, '0') }</td>
                            <td>{ bordereauEmismandatSelectionne !== null && new Date(bordereauEmismandatSelectionne.journee).toLocaleDateString() }</td>
                            <td>{ bordereauEmismandatSelectionne !== null && Number(bordereauEmismandatSelectionne.total).toLocaleString() }</td>
                            <td>{ bordereauEmismandatSelectionne !== null && Number(bordereauEmismandatSelectionne.totalAnterieur).toLocaleString() }</td>
                            <td>{ bordereauEmismandatSelectionne !== null && Number(bordereauEmismandatSelectionne.totalCumul).toLocaleString() }</td>
                            <td>{ bordereauEmismandatSelectionne !== null && bordereauEmismandatSelectionne.nombreMand }</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Card.Body>
              </Card>
            </Form>
          </div>

          {/* MOT DE PASSE DE CONNEXION */}
          <Modal show={showModalMotDePasseDeConnexion} onHide={handleCloseModalMotDePasseDeConnexion} backdrop="static" keyboard={false}>
            <Modal.Header className='p-1'>
              <Modal.Title as="h6">Mot de passe de connexion</Modal.Title>
            </Modal.Header>
          
            <Modal.Body className='p-2'>
              <Form.Group className="" controlId="motDePasseDeConnexion">
                <Form.Label className="label2">Mot de passe de connexion</Form.Label>
                <Form.Control name="motDePasseDeConnexion" size='sm' type="password" value={motDePasseDeConnexion} onChange={e => handleMotDePasseDeConnexionInputChange(e)} autoFocus />
              </Form.Group>
            </Modal.Body>
          
            <Modal.Footer className='p-1'>
              <Button variant="outline-success" size='sm' onClick={handleOk}>Ok</Button>
              <Button variant="outline-secondary" size='sm' onClick={handleCloseModalMotDePasseDeConnexion}>Fermer</Button>
            </Modal.Footer>
          </Modal>
          
      </Container>
  );
};

export default MandatEditionMajDeBordereauDEmissionForm;
