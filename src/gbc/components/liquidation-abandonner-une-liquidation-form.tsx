import { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import DataTable  from 'react-data-table-component'; 
import { costumeStyles } from '../../helpers/costume-styles';
import { BsPlusLg, BsTrash } from 'react-icons/bs';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams, GridToolbarContainer } from '@mui/x-data-grid';
import { ConnectedUser, Gestion, IdBudget } from '../helpers/session-storage';
import Stack from '@mui/material/Stack';
import { PJPourEngagement } from '../models/pj-pour-engagment';
import PieceJustifService from '../services/piece-justif-service';
import { formatDateWithHoursAndMinutes } from '../../helpers/format-date';
import LiquidationViewService from '../services/liquidation-view-service';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import bcrypt from 'bcryptjs-react';
import Swal from 'sweetalert2';
import AccesCodeDto, { emptyAccesCodeDto } from '../models/accesCodeDto';
import AccesCodeService from '../services/accesCodeService';
import { okSuccessDialog, okWarnignDialog } from '../../helpers/dialogs';
import MandatService from '../services/mandat-service';
import { emptyInfosPourAbandonnerLiquidation, InfosPourAbandonnerLiquidation } from '../models/infos-pour-abandonner-liquidation';
import ServerDateService from '../../shared/system/services/server-date-service';

// FORUMULAIRE LIQUIDATION
type FormLiquidation = {
  codBud: Field, // ENGAGEMENT
  numBe: Field, 
  benum: Field,
  dateCreation: Field,
  montantEngagement: Field,
  dejaLiquideEngagement: Field;
  resteALiquiderEngagement: Field,
  natDepense: Field,
  proced: Field,
  nombreLiq: Field,
  chap: Field,// NOMANCLATURED
  art: Field,
  parag: Field,
  rub: Field,
  intitule: Field,
  idContrat: Field, // CONTRAT
  montantContrat: Field,
  engageValidContrat: Field,
  mandateValidContrat: Field,
  referenceContrat: Field,
  dateSaisieContrat: Field,
  idFourn: Field, // FOURNISSEUR
  ifuMle: Field,
  nom: Field,
  codLiq: Field, // RECU
  gestion: Field,
  numBl: Field,
  dateLiq: Field,
  montant: Field,
  numeroDemande: Field,
  numMand: Field, // MANDAT
  mandNum: Field,
  dateMand: Field, 
  compteFourn: Field,
  numBlMand: Field,
  bln: Field,
  mandatNumero: Field,
  auProfitDuCompte: Field // Utilisé pour stocker le compte
}

// CRITERES DE RECHERCHE LIQUIDATION
type FormRLiquidation = {
  benum: Field,
  numBlMand: Field,
  nom: Field,
}

const LiquidationAbandonnerUneLiquidationForm: FunctionComponent = () => {

  const [gestionCourante] = useState<string>(Gestion() ?? '');
  const [idBudget] = useState<string>(IdBudget() ?? '');
  const [utilisateurCourante] = useState<string>(ConnectedUser() ?? '');
  const [isGestionClose, setIsGestionClose] = useState<boolean>(false);
  const dateEnregistrementPourGestionClose: Date = new Date(gestionCourante + '-12-31');
  const [disableAbandonnerLiquidation, setDisableAbandonnerLiquidation] = useState<boolean>(true);

  useEffect(() => {
    // On recupere la date du server : si la gestion en cours est strictement inférieur à l'année de la date du serveur alors elle est close :
    ServerDateService.getServerDate().then(data => {
      if (Number(gestionCourante) < new Date(data).getFullYear()) setIsGestionClose(true); else setIsGestionClose(false)   
    }) 
  }, []) 

  ///////////////// GESTION LIQUIDATION
  const [formLiquidation, setFormLiquidation] = useState<FormLiquidation>({
    codBud: { value: '' },
    numBe: { value: '' },
    benum: { value: '' },
    dateCreation: { value: '' },
    montantEngagement: { value: 0},
    dejaLiquideEngagement: { value: 0},
    resteALiquiderEngagement: { value: 0},
    natDepense: { value: '' },
    proced: { value: '' },
    nombreLiq: { value: '' },
    chap: { value: '' },
    art: { value: '' },
    parag: { value: '' },
    rub: { value: '' },
    intitule: { value: '' },
    idContrat: { value: '' },
    montantContrat: { value: 0 },
    engageValidContrat: { value: 0 },
    mandateValidContrat: { value: 0 },
    referenceContrat: { value: '' },
    dateSaisieContrat: { value: '' },
    idFourn: { value: '' },
    ifuMle: { value: '' },
    nom: { value: '' },
    codLiq: { value: '' },
    gestion: { value: '' },
    numBl: { value: '' },
    dateLiq: { value: "" },
    montant: { value: '' },
    numeroDemande: { value: ''},
    numMand:{ value: ''},
    mandNum: { value: ''},
    dateMand: { value: ''},
    compteFourn: { value: ''},
    numBlMand: { value: ''},
    bln : { value: ''},
    mandatNumero : { value: ''},
    auProfitDuCompte : { value: ''}
  })

  const initFormLiquidation = () => {
    setFormLiquidation({
      codBud: { value: '' },
      numBe: { value: '' },
      benum: { value: '' },
      dateCreation: { value: '' },
      montantEngagement: { value: 0},
      dejaLiquideEngagement: { value: 0},
      resteALiquiderEngagement: { value: 0},
      natDepense: { value: '' },
      proced: { value: '' },
      nombreLiq: { value: '' },
      chap: { value: '' },
      art: { value: '' },
      parag: { value: '' },
      rub: { value: '' },
      intitule: { value: '' },
      idContrat: { value: '' },
      montantContrat: { value: 0 },
      engageValidContrat: { value: 0 },
      mandateValidContrat: { value: 0 },
      referenceContrat: { value: '' },
      dateSaisieContrat: { value: '' },
      idFourn: { value: '' },
      ifuMle: { value: '' },
      nom: { value: '' },
      codLiq: { value: '' },
      gestion: { value: '' },
      numBl: { value: '' },
      dateLiq: { value: "" },
      montant: { value: '' },
      numeroDemande: { value: ''},
      numMand:{ value: ''},
      mandNum: { value: ''},
      dateMand: { value: ''},
      compteFourn: { value: ''},
      numBlMand: { value: ''},
      bln : { value: ''},
      mandatNumero : { value: ''},
      auProfitDuCompte : { value: ''}
    })

    setPjSelectionnees([])
    setBenumPourRechercherLiquidation('');
    setNumBlMandPourRechercherLiquidation('');
  } 
  ///////////////// GESTION LIQUIDATION
  
  ///////////////// GESTION RECHERCHE LIQUIDATION
  const [liquidations, setLiquidations] = useState<any[]>([]);
  const [filteredLiquidations, setFilteredLiquidations] = useState<any[]>([]);
  const [showModalSelectionnerLiquidation, setShowModalSelectionnerLiquidation] = useState(false);
  const [numBlMandPourRechercherLiquidation, setNumBlMandPourRechercherLiquidation] = useState<string>('');
  const [benumPourRechercherLiquidation, setBenumPourRechercherLiquidation] = useState<string>('');
  
  const tableLiquidationColumns = [
    {
      name: "Gestion",
      selector: (row: any) => row.gestion,
      width: "100px",
      center: true,
    },
    {
      name: "Numero",
      selector: (row: any) => String(row.benum).padStart(4, '0'),
      width: "100px",
      center: true
    },
    {
      name: "",
      selector: (row: any) => row.numBlMand,
      width: "50px",
      center: true
    },
    {
      name: "Montant",
      selector: (row: any) => Number(row.montant).toLocaleString(),
      width: "110px",
      right: true,
    },
    {
      name: "Bénéficiaire",
      selector: (row: any) => row.nom,
      wrap: true
    },
  ]

  const handleNumBlMandRechercherLiquidationInputChange = (e: any): void => {
    setNumBlMandPourRechercherLiquidation(e.target.value.toLowerCase());
  }

  const handleBenumRechercherLiquidationInputChange = (e: any): void => {
    setBenumPourRechercherLiquidation(e.target.value.toLowerCase());
  }

  const [formRLiquidation, setFormRLiquidation] = useState<FormRLiquidation>({
    benum: { value: ''},
    numBlMand: { value: ''},
    nom: { value: ''},
  })

  const handleInputChangeFormRLiquidation = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormRLiquidation({ ...formRLiquidation, ...newField})
  }

  useEffect( () => {
    const results = liquidations.filter(item => {
      return ((item.benum || '').toString().toLowerCase().includes(formRLiquidation.benum.value.toString().toLowerCase())
        && (item.numBlMand || '').toString().toLowerCase().includes(formRLiquidation.numBlMand.value.toString().toLowerCase())
        && (item.nom || '').toString().toLowerCase().includes(formRLiquidation.nom.value.toString().toLowerCase()))
    })
    setFilteredLiquidations(results);
  }, [formRLiquidation])  

  const getLiquidations = () => {
    LiquidationViewService.getLiquidationModifiables(Number(gestionCourante), Number(idBudget)).then(data => {
      setLiquidations(data) 
      if (formRLiquidation.benum.value !== "" || formRLiquidation.numBlMand.value !== "" || formRLiquidation.nom.value !== "") {
        const results = liquidations.filter(item => {
          return ((item.benum || '').toString().toLowerCase().includes(formRLiquidation.benum.value.toString().toLowerCase())
            && (item.numBlMand || '').toString().toLowerCase().includes(formRLiquidation.numBlMand.value.toString().toLowerCase())
            && (item.nom || '').toString().toLowerCase().includes(formRLiquidation.nom.value.toString().toLowerCase()))
        })
        setFilteredLiquidations(results);
      } else {
        setFilteredLiquidations(data)
      }
    })
  }
  
  const handleCloseModalSelectionnerLiquidation = () => {
    setShowModalSelectionnerLiquidation(false);
  }

  const handleShowModalSelectionnerLiquidation = () => {
    getLiquidations();
    setShowModalSelectionnerLiquidation(true);
  }
  
const rechercherAfficherLiquidation = (benum: number, numBlMand: number) => {
    LiquidationViewService.getLiquidationModifiables(Number(gestionCourante), Number(idBudget)).then(data => {
      const result = data.filter(item => {
        return (item.benum === benum && item.numBlMand === numBlMand)
      })

      if (result.length !== 0) {
        // ACTIVER
        setDisableAbandonnerLiquidation(false);

        setFormLiquidation({
          codBud: { value: result[0].codBud },
          numBe: { value: result[0].numBe },
          benum: { value: result[0].benum },
          dateCreation: { value: result[0].dateCreationEng },
          montantEngagement: { value: result[0].montantEng },
          dejaLiquideEngagement: { value: result[0].dejaLiquideReelEng },
          resteALiquiderEngagement: { value: result[0].resteALiquiderReelEng },
          natDepense: { value: result[0].objet },
          proced: { value: result[0].proced },
          nombreLiq: { value: result[0].nbreLiqReelEng },
          chap: { value: result[0].chap },
          art: { value: result[0].art },
          parag: { value: result[0].parag },
          rub: { value: result[0].rub },
          intitule: { value: result[0].intitule },
          idContrat: { value: result[0].idContrat },
          montantContrat: { value: result[0].montantContrat },
          engageValidContrat: { value: result[0].engageValidContrat },
          mandateValidContrat: { value: result[0].mandateValidContrat },
          referenceContrat: { value: result[0].referenceContrat },
          dateSaisieContrat: { value: result[0].dateSaisieContrat },
          idFourn: { value: result[0].idFourn },
          ifuMle: { value: result[0].ifumle },
          nom: { value: result[0].nom },
          codLiq: { value: result[0].codLiq },
          gestion: { value: result[0].gestion },
          numBl: { value: result[0].numBl },
          dateLiq: { value: result[0].dateLiq },
          montant: { value: result[0].montant },
          numeroDemande: { value: result[0].numeroDemande },
          numMand: { value: result[0].numMand },
          mandNum: { value: result[0].mandNumb },
          dateMand: { value: result[0].dateMand},
          compteFourn: { value:result[0].compteFournMand },
          numBlMand: { value:result[0].numBlMand },
          bln : { value: result[0].gestion + "-" + String(result[0].benum).padStart(4, '0') + "-" + result[0].numBlMand },
          mandatNumero : { value: result[0].gestion + "-" + String(result[0].mandNumb).padStart(4, '0') },
          auProfitDuCompte: { value: (result[0].compteFournMand !== null)? result[0].abreviation + " " + result[0].libelleAgence + " N°" + result[0].codeBanque + " " + result[0].codeAgence + " " + result[0].numCompte + " " + result[0].cleRib : ""}
        })
        setNumBlMandPourRechercherLiquidation(result[0].numBlMand);
        setBenumPourRechercherLiquidation(result[0].benum);

        // RECUPERATION DES PIECES JUSTIFICATIVES
        getPjSelectionnees(result[0].numMand);

      } else {
        initFormLiquidation();
      }

    });
  }  

  const handleRechercheButtonClick = () => {
    if (benumPourRechercherLiquidation ==="" || numBlMandPourRechercherLiquidation === "") {
      handleShowModalSelectionnerLiquidation();
    } else {
      rechercherAfficherLiquidation(Number(benumPourRechercherLiquidation), Number(numBlMandPourRechercherLiquidation));
    }
  }   
  ///////////////// GESTION RECHERCHE LIQUIDATION

  ///////////////// GESTION ABANDONNER LIQUIDATION
  const handleAbandonnerLiquidationButtonClick = () => {
    // On demande une confirmation avant toute action si la gestion est close
    if (isGestionClose) {
      Swal.fire({
        title: 'GesBud',
        text: "Cette gestion est déjà close. Voulez-vous néamoins continuer l'enregistrement ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
      }).then( (result) => {
        if (result.isConfirmed) {
          handleShowModalMotDePasseDeConnexion();
        }
      });
    } else {
      handleShowModalMotDePasseDeConnexion();
    }   
  }

  const abandonnerLiquidation = () => {
    Swal.fire({
      title: 'GesBud',
      text: "Etes-vous certain de vouloir abandonner cette liquidation ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      allowOutsideClick: false,
      confirmButtonColor: '#007E33' 
    }).then( (result) => {
      if (result.isConfirmed) {
        let infosPourAbandonnerLiquidation: InfosPourAbandonnerLiquidation = emptyInfosPourAbandonnerLiquidation;
        infosPourAbandonnerLiquidation.id = formLiquidation.numMand.value;
        infosPourAbandonnerLiquidation.date = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
        infosPourAbandonnerLiquidation.idUser = utilisateurCourante;  
        
        MandatService.abandonnerLiquidation(infosPourAbandonnerLiquidation).then(res => {
          if(res) {
            rechercherAfficherLiquidation(formLiquidation.benum.value, formLiquidation.numBlMand.value);
            okSuccessDialog("Liquidation abandonnée avec succès !");
          }
        });           
      }
    });
  }  
  ///////////////// GESTION ABANDONNER LIQUIDATION

  ///////////////// GESTION PIECES JUSTIFICATIVES SELECTIONNEES POUR LA LIQUIDATION
  const [pjSelectionnees, setPjSelectionnees] = useState<PJPourEngagement[]>([]);

  const tablePjSelectionneesColumns: GridColDef[] = [
    {
      field: 'pj',
      headerName: 'Piece justificative',
      type: 'string',
      width: 350,
      headerClassName: 'header',
    },
    {
      field: 'numero',
      headerName: 'Numero',
      type: 'string',
      width: 200,
      headerClassName: 'header',
    },
    {
      field: 'date',
      headerName: 'Date',
      type: 'date',
      width: 100,
      headerClassName: 'header',
    },
    {
      field: 'montant',
      headerName: 'Montant',
      type: 'number',
      width: 150,
      headerClassName: 'header',
    },
    {
      field: 'actions',
      headerName: '',
      type: 'actions',
      width: 100,
      cellClassName: 'actions',
      getActions: (params: GridRowParams) => {
        return [
          <GridActionsCellItem sx={{ mr: 0 }}
            icon={<Button variant="outline-primary" size="sm" title="PJ">PJ</Button>}
            label="PJ"
            color="inherit"
            disabled
          />,
          <GridActionsCellItem
            icon={<Button variant="outline-danger" size="sm" title="Supprimer"><BsTrash /></Button>}
            label="Delete"
            color="inherit"
            disabled
          />,
        ];
      },
      headerClassName: 'header',
    } 
  ];

  function EditToolbar() {
    return (
      <GridToolbarContainer>
        <ButtonGroup size="sm">
          <Button size='sm' variant="outline-success" title="Ajouter une pièce justificative" className='me-1' style={{width: "100px"}} disabled><BsPlusLg /></Button>
        </ButtonGroup>
      </GridToolbarContainer>
    );
  }

  const getPjSelectionnees = (numMand: number) => {
    PieceJustifService.getByNumMandOrderByPieceJustificative(numMand).then(data => {
      let pieceJustifs: PJPourEngagement[] = [];
      data.forEach(item => {
        pieceJustifs.push({
          identifiant: pieceJustifs.length+1,
          pj: item.pieceJustificative,
          numero: item.numero,
          date: (item.datePj !== null)? new Date(item.datePj) : null,
          montant: item.montant,
          codLiq: item.codLiq
        });
      });
      setPjSelectionnees(pieceJustifs); 
    })
  }   
  ///////////////// GESTION PIECES JUSTIFICATIVES SELECTIONNEES POUR LA LIQUIDATION

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
        setDisableAbandonnerLiquidation(true);
        abandonnerLiquidation();
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
            <h6 className="shadow-sm text-primary text-center rounded">LIQUIDATION &gt; ABANDONNER UNE LIQUIDATION</h6>
            <Form>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <Form.Group as={Row}>
                    <InputGroup as={Col}>
                      <Form.Control name='' size='sm' value={"BL N° :"} type="text" className='me-1 text-end fw-bold text-primary' disabled />
                      <Form.Control name='' size='sm' value={gestionCourante} type="text" className='me-1 fw-bold' style={{maxWidth:"50px", maxHeight:"30px"}} disabled />
                      <Form.Control name='' size='sm' value={benumPourRechercherLiquidation} type="text" onChange={e => handleBenumRechercherLiquidationInputChange(e)} className='me-1 fw-bold' style={{maxWidth:"50px", maxHeight:"30px"}} />
                      <Form.Control name='' size='sm' value={numBlMandPourRechercherLiquidation} type="text" onChange={e => handleNumBlMandRechercherLiquidationInputChange(e)} className='fw-bold' style={{maxWidth:"50px", maxHeight:"30px"}} />
                      <Button variant="outline-warning" size='sm' title="Lancer la recherche" style={{maxHeight:"31px"}} onClick={ () => handleRechercheButtonClick()}><QuestionMarkOutlinedIcon /></Button>
                    </InputGroup>
                    <Col xs={5}>
                    </Col>
                    <ButtonGroup as={Col} xs={2} size="sm" className='justify-content-end'>
                      <Button variant="outline-danger" title="Abandonner la liquidation en cours" className='me-1' style={{maxWidth:"65px", maxHeight:"30px"}} onClick={ () => handleAbandonnerLiquidationButtonClick()} disabled={disableAbandonnerLiquidation}><DeleteIcon /></Button>
                    </ButtonGroup>
                  </Form.Group>
                </Card.Body>
              </Card>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <Card className="p-1 mb-1">
                    <Card.Title style={{fontSize:"0.8em"}}>
                      Reçu de demande de liquidation N° {(formLiquidation.numeroDemande.value !== "")? <span style={{ color:'#198754'}}>{formLiquidation.numeroDemande.value}</span> : "__________"} du {(formLiquidation.dateLiq.value !== "")? <span style={{ color:'#198754'}}>{formatDateWithHoursAndMinutes(new Date(formLiquidation.dateLiq.value))}</span>: "__________"} Montant : {(formLiquidation.montant.value !== "")? <span style={{ color:'#198754'}}>{formLiquidation.montant.value.toLocaleString()}</span> : "__________"} 
                    </Card.Title> 
                    <Table responsive striped bordered hover variant="" size="sm" style={{marginBottom:"0px"}}>
                      <thead className='bg-primary'>
                        <tr>
                          <th style={{width:"40px"}}>Chap.</th>
                          <th style={{width:"40px"}}>Art.</th>
                          <th style={{width:"40px"}}>Parag.</th>
                          <th style={{width:"40px"}}>Rub.</th>
                          <th>Intitulé</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{fontWeight:"bold", fontSize:"1.1em"}} className='text-center'>
                          <td>{formLiquidation.chap.value}</td>
                          <td>{formLiquidation.art.value}</td>
                          <td>{formLiquidation.parag.value}</td>
                          <td>{formLiquidation.rub.value}</td>
                          <td>{formLiquidation.intitule.value}</td>
                        </tr>
                      </tbody>
                    </Table>                   
                  </Card>                    
                  <div>
                    <Row className="">
                      <Col>
                        <Card>
                          <Card.Body className='p-1'>
                            <Card.Title style={{fontSize:"0.8em", marginBottom:"0px"}}>Engagement</Card.Title>
                              <tr style={{fontSize:"0.75em"}}>Numero {formLiquidation.numBe.value && <span style={{ color:'#198754'}}>{ gestionCourante + "-" + String(formLiquidation.benum.value).padStart(4, '0')}</span>} du { formLiquidation.dateCreation.value && <span style={{ color:'#198754'}}>{formatDateWithHoursAndMinutes(new Date(formLiquidation.dateCreation.value))}</span>}</tr>
                              <Table responsive striped bordered hover variant="" size="sm" style={{marginBottom:"0px"}}>
                                <thead>
                                  <tr>
                                    <th style={{width:"100px"}}>Montant engagé</th>
                                    <th style={{width:"100px"}}>Déja liquidé</th>
                                    <th style={{width:"100px"}}>Reste à liquider</th>
                                    <th style={{width:"70px"}}>Procédure</th>
                                    <th style={{width:"70px"}}>Nb Liq</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr style={{fontWeight:"bold", fontSize:"1.1em"}} className='text-center'>
                                    <td>{formLiquidation.montantEngagement.value.toLocaleString()}</td>
                                    <td>{formLiquidation.dejaLiquideEngagement.value.toLocaleString()}</td>
                                    <td>{formLiquidation.resteALiquiderEngagement.value.toLocaleString()}</td>
                                    <td>{formLiquidation.proced.value}</td>
                                    <td>{formLiquidation.nombreLiq.value}</td>
                                  </tr>
                                </tbody>
                              </Table>
                          </Card.Body>                        
                        </Card>
                      </Col>
                      <Col>
                        <Card>
                          <Card.Body className='p-1'>
                            <Card.Title style={{fontSize:"0.8em", marginBottom:"15px"}}>Fournisseur</Card.Title>
                            <Table responsive striped bordered hover variant="" size="sm" style={{marginBottom:"0px"}}>
                              <thead>
                                <tr>
                                  <th style={{width:"100px"}}>IFU/Mle</th>
                                  <th>Nom</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr style={{fontWeight:"bold", fontSize:"1.1em"}} className='text-center'>
                                  <td style={{height:"29px"}}>{formLiquidation.ifuMle.value}</td>
                                  <td style={{height:"29px"}}>{formLiquidation.nom.value}</td>
                                </tr>
                              </tbody>
                            </Table>
                          </Card.Body>                        
                        </Card>                                                
                      </Col>
                    </Row>
                  </div>
                </Card.Body>                        
              </Card>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <Row className="mb-1">
                    <Col> 
                      <Form.Group controlId="montant" as={Row} className='mb-1 label2'>
                        <Form.Label column xs={4}>Montant :</Form.Label>
                        <Col><Form.Control name='montant' value={formLiquidation.montant.value.toLocaleString()} size='sm' type="text" disabled /></Col>
                      </Form.Group> 
                      <Form.Group controlId="natDepense" as={Row} className='mb-1 label2'>
                        <Form.Label column xs={4}>Object :</Form.Label>
                        <Col><Form.Control as="textarea" rows={2} name='natDepense' value={formLiquidation.natDepense.value} title={formLiquidation.natDepense.value} size='sm' disabled /></Col>
                      </Form.Group>  
                      <Form.Group controlId="compteFourn" as={Row} className='label2'>
                        <Form.Label column xs={4}>Au profit du compte :</Form.Label>
                        <Col>
                          <InputGroup>
                            <Form.Select name='compteFourn' value={formLiquidation.compteFourn.value} title={formLiquidation.auProfitDuCompte.value} size='sm' disabled>
                              <option>{ formLiquidation.auProfitDuCompte.value }</option>
                            </Form.Select>
                          </InputGroup>
                        </Col>
                      </Form.Group>                                                            
                    </Col>
                    <Col> 
                      <Form.Group controlId="dateMand" as={Row} className='mb-1 label2'>
                        <Form.Label column xs={4}>Date :</Form.Label>
                        <Col>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker 
                              value={dayjs(formLiquidation.dateMand.value)} 
                              views={['year', 'month', 'day', 'hours', 'minutes']} 
                              viewRenderers={{hours: null, minutes: null }} 
                              format="DD/MM/YYYY HH:mm" 
                              disabled
                              sx={{ 
                                "& .MuiOutlinedInput-root": 
                                  { 
                                    fontSize: '1.18em', 
                                    height: 30, 
                                    padding: 1,
                                  },
                                  '& .MuiInputBase-input': {
                                    textAlign: 'center',
                                  },
                                  width: '100%'
                              }}
                            />
                          </LocalizationProvider>                        
                        </Col>
                      </Form.Group> 
                      <Form.Group controlId="bln" as={Row} className='mb-1 label2'>
                        <Form.Label column xs={4}>BL N° :</Form.Label>
                        <Col><Form.Control name='bln' value={formLiquidation.bln.value} size='sm' type="text" className='text-center' disabled /></Col>
                      </Form.Group>
                      <Form.Group controlId="mandNum" as={Row} className='mb-1 label2'>
                        <Form.Label column xs={4}>Mandat N° :</Form.Label>
                        <Col><Form.Control name='mandNum' value={formLiquidation.mandatNumero.value} size='sm' type="text" className='text-center' disabled /></Col>
                      </Form.Group>                                                           
                    </Col>                    
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className='p-1' style={{height: "300px"}}>
                  <DataGrid
                      rows={pjSelectionnees}
                      getRowId={(row) => row.identifiant}
                      columns={tablePjSelectionneesColumns}
                      columnHeaderHeight={25}
                      hideFooter={true}
                      rowHeight={25}
                      getRowClassName={(params) =>
                        params.row.codLiq === 0 ? 'active-row' : 'inactive-row'
                      }
                      slots={{
                        toolbar: EditToolbar,
                        noRowsOverlay: NoRowsOverlay,
                      }}
                      sx={{
                        '& .header': {
                          backgroundColor: '#fff',
                          marginTop:'2px',
                        },
                        '& .active-row': {
                          backgroundColor: '#fff',
                        },
                        '& .inactive-row': {
                          backgroundColor: '#F5F5F5',
                          opacity: '0.8'
                        },
                      }}
                    />
                </Card.Body>                        
              </Card>
            </Form>
          </div>

          {/* GESTION RECHERCHE LIQUIDATION */}
          <Modal show={showModalSelectionnerLiquidation} onHide={handleCloseModalSelectionnerLiquidation} backdrop="static" keyboard={false} size="lg">
            <Modal.Header className='p-1'>
              <Modal.Title as="h6">Liste des BL</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2'>
              <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tableLiquidationColumns}
                    data={filteredLiquidations}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    fixedHeaderScrollHeight='450px'
                    highlightOnHover
                    responsive
                    striped
                    onRowClicked={ (row, e) => {
                      rechercherAfficherLiquidation(row.benum, row.numBlMand);
                      handleCloseModalSelectionnerLiquidation();
                    }}
                    subHeader
                    subHeaderComponent={
                      <ButtonGroup as={Col} size="sm">
                        <Form.Control name="benum" value={formRLiquidation.benum.value} size='sm' type="number" placeholder='Numero Eng' className='me-1' style={{width:"120px"}} onChange={e => handleInputChangeFormRLiquidation(e)}/>
                        <Form.Control name="numBlMand" value={formRLiquidation.numBlMand.value} size='sm' type="number" placeholder='Numero BL' className='me-1' style={{width:"120px"}} onChange={e => handleInputChangeFormRLiquidation(e)}/>
                        <Form.Control name="nom" value={formRLiquidation.nom.value} size='sm' type="text" placeholder='Nom du bénéficiaire' className='w-25' onChange={e => handleInputChangeFormRLiquidation(e)}/>
                      </ButtonGroup> 
                    }
                    />
                </Card.Body>
              </Card>
            </Modal.Body>

            <Modal.Footer className='p-1'>
              <Button variant="outline-danger" size='sm' onClick={handleCloseModalSelectionnerLiquidation}>Fermer</Button>
            </Modal.Footer>
          </Modal>
          
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

export default LiquidationAbandonnerUneLiquidationForm;
