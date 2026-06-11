import { DataGrid, GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Modal, Row } from 'react-bootstrap';
import { BsArrowDownCircleFill, BsPencilSquare, BsPlusLg, BsTrash } from 'react-icons/bs';
import { Field } from '../../helpers/types';
import FournisseursViewService from '../services/fournisseur-view-service';
import Swal from 'sweetalert2';
import { okSuccessDialog, okWarnignDialog } from '../../helpers/dialogs';
import { emptyFournisseurRequestDto, FournisseurRequestDto } from '../models/fournisseur';
import DestinataireService from '../services/destinataire-service';
import FournisseurService from '../services/fournisseur-service';
import { DestinataireRequestDto, emptyDestinataireRequestDto } from '../models/destinataire';
import { Stack } from '@mui/material';
import CompteDestinataireService from '../services/compte-destinataire-service';


interface Props {
  show: boolean;
  onHide: () => void;
}

type FormFournisseur = {
  ifumle: Field,
  idFourn: Field,
  raisonSociale: Field,
  bp: Field,
  profession: Field,
  telephone: Field,
  email: Field,
  oldIfumle: Field,
  oldRaisonSociale: Field,
}

type FormCompteDestinataire = {
  abreviation: Field,
  libelleAgence: Field,
  codeBanque: Field,
  codeAgence: Field,
  numCompte: Field,
  cleRib: Field,
  caissePop: Field,
  numCaissePop: Field,
  codeBic: Field,
  iban: Field,
}

const ModalSaisieMajFournisseur: FunctionComponent<Props> = ({show, onHide}) => {

  ////////////////////////////////////////// GESTION FOURNISSEURS
  const [fournisseurs, setFournisseurs] = useState<any[]>([]);
  const [filteredFournisseurs, setFilteredFournisseurs] = useState<any[]>([]);
  const [loaderFournisseurs, setLoaderFournisseurs] = useState<boolean>(true);
  const [operationFournisseur, setOperationFournisseur] = useState<string>("add");
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<any>();
  const [pdfNameForDownload, setPdfNameForDownload] = useState("");  
  const [borderColorRaisonSociale, setBorderColorRaisonSociale] = useState<string>("");

  const [formFournisseur, setFormFournisseur] = useState<FormFournisseur>({
    ifumle: { value: '' },
    idFourn: { value: '' },
    raisonSociale: { value: '' },
    bp: { value: '' },
    profession: { value: '' },
    telephone: { value: '' },
    email: { value: '' },
    oldIfumle: { value: '' },
    oldRaisonSociale: { value: '' }
  })  
  
  const initFormFournisseur = () => {
    setOperationFournisseur('add');
    setFormFournisseur({
      ifumle: { value: '' },
      idFourn: { value: '' },
      raisonSociale: { value: '' },
      bp: { value: '' },
      profession: { value: '' },
      telephone: { value: '' },
      email: { value: '' },
      oldIfumle: { value: '' },
      oldRaisonSociale: { value: '' }
    })
    setBorderColorRaisonSociale("")
  } 
  
  const tableFournisseurColumns: GridColDef[] = [
    {
      field: 'idFourn',
      headerName: 'ID',
      type: 'string',
      width: 100,
      headerClassName: 'header',
    },
    {
      field: 'ifumle',
      headerName: 'IFU',
      type: 'string',
      width: 200,
      headerClassName: 'header',
    },
    {
      field: 'raisonSociale',
      headerName: 'Raison sociale',
      type: 'string',
      flex: 1,
      minWidth: 300,
      headerClassName: 'header',
    },
    {
      field: '',
      headerName: 'Compte banque',
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Button variant="outline-primary" size="sm" title={ (params.row.nbreCompteDestinataire === 0)? "Ajouter": "Mise à jour" } style={{width:"100px"}} onClick={() => handleMiseAjourCompteBancaire(params.row)}>{ (params.row.nbreCompteDestinataire === 0)? "Ajouter": "Maj"}</Button>
        )
      },
      align: 'center',
      headerClassName: 'header',
      headerAlign: 'center'
    },
    {
      field: 'actions',
      headerName: '',
      type: 'actions',
      width: 100,
      cellClassName: 'actions',
      getActions: (params: GridRowParams) => {
        return [
          <GridActionsCellItem
            icon={<Button variant="outline-warning" size="sm" title="Modifier"><BsPencilSquare /></Button>}
            label="Delete"
            color="inherit"
            onClick={handleEditFournisseur(params.row)}
          />,
          <GridActionsCellItem
            icon={<Button variant="outline-danger" size="sm" title="Supprimer"><BsTrash /></Button>}
            label="Delete"
            color="inherit"
            onClick={handleDeleteFournisseur(params.row)}
            disabled={params.row.occurenceFournisseurDansEngagement !== 0 || params.row.cccurenceFournisseurDansPPM_EXEC !== 0}
          />
        ];
      },
      headerClassName: 'header',
    } 
  ]; 
  
  const handleInputChangeFormFournisseur = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormFournisseur({ ...formFournisseur, ...newField})
  }  
  
  const validateFormFournisseur = () => {
    let newForm: FormFournisseur = formFournisseur;

    // Raison sociale
    if(formFournisseur.raisonSociale.value === "") {
      const errorMsg: string = 'Raison sociale obligatoire !';
      const newField: Field = { value: formFournisseur.raisonSociale.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ nom: newField } };
      setBorderColorRaisonSociale("red")
    } else {
      const newField: Field = { value: formFournisseur.raisonSociale.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ raisonSociale: newField } };
      setBorderColorRaisonSociale("")
    }

    setFormFournisseur(newForm);

    return newForm.raisonSociale.isValid;
  } 
  
  const handleSubmitFormFournisseur = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Formulaire invalide
    if(!validateFormFournisseur()) {
      okWarnignDialog("Veuillez renseigner les parties encadrées en rouge !")
      return;
    }  
  
    if (operationFournisseur === 'add') addFournisseur();
    if (operationFournisseur === 'edit') editFournisseur(); 
  } 
  
  const libelleOperationFournisseur = () => {
    if (operationFournisseur === 'add') return "Ajouter fournisseur"
    if (operationFournisseur === 'edit') return "Modifier fournisseur"
  }  

  const handleAddFournisseur = () => {
    initFormFournisseur();
  } 

  const handleEditFournisseur = (row: any) => () => {
    setOperationFournisseur("edit")
    setFormFournisseur({
      ifumle: { value: (row.ifumle)? row.ifumle: '', isValid: true },
      idFourn: { value: row.idFourn, isValid: true },
      raisonSociale: { value: row.raisonSociale, isValid: true },
      bp: { value: (row.bp)? row.bp: '', isValid: true },
      profession: { value: (row.profession)? row.profession: '', isValid: true },
      telephone: { value: (row.telephone)? row.telephone: '', isValid: true },
      email: { value: (row.contactEmail)? row.contactEmail: '', isValid: true },
      oldIfumle: { value: (row.ifumle)? row.ifumle: '', isValid: true },
      oldRaisonSociale: { value: (row.raisonSociale)? row.raisonSociale: '', isValid: true }
    })   
  }  
  
  const addFournisseur = async () => {
    let newObject: FournisseurRequestDto = emptyFournisseurRequestDto;
    newObject.raisonSociale = formFournisseur.raisonSociale.value;
    newObject.bp = formFournisseur.bp.value;
    newObject.profession = formFournisseur.profession.value;
    newObject.telephone = formFournisseur.telephone.value;

    let fournisseurWithIfumleOrNomExists = await DestinataireService.existsByIfumleAndIfumleNotOrNom(formFournisseur.ifumle.value, "-", formFournisseur.raisonSociale.value);
    if(!fournisseurWithIfumleOrNomExists) {
      FournisseurService.add(newObject).then( data => {
        editDestinataire(data.idFourn, "Fournisseur ajouté avec success !")
      }) 
    } else {
      okWarnignDialog("Ce numero ifu ou nom existe déja !")
    }
  } 
  
  const editFournisseur = async () => {
    let newObject: FournisseurRequestDto = emptyFournisseurRequestDto;
    newObject.raisonSociale = formFournisseur.raisonSociale.value;
    newObject.bp = formFournisseur.bp.value;
    newObject.profession = formFournisseur.profession.value;
    newObject.telephone = formFournisseur.telephone.value;

    if (formFournisseur.ifumle.value !== formFournisseur.oldIfumle.value || formFournisseur.raisonSociale.value !== formFournisseur.oldRaisonSociale.value) {
      let fournisseurWithIfumleOrNomExists = await DestinataireService.existsByIfumleAndIfumleNotAndIdDestNotOrNomAndIdDestNot(formFournisseur.ifumle.value, "-", formFournisseur.idFourn.value, formFournisseur.raisonSociale.value, formFournisseur.idFourn.value);
      if(!fournisseurWithIfumleOrNomExists) {
        FournisseurService.edit(formFournisseur.idFourn.value, newObject).then( () => {
          editDestinataire(formFournisseur.idFourn.value, "Fournisseur modifié avec success !")
        })
      } else {
        okWarnignDialog("Ce numero ifu ou nom existe déja !")
      }    
    } else {
      FournisseurService.edit(formFournisseur.idFourn.value, newObject).then( () => {
        editDestinataire(formFournisseur.idFourn.value, "Fournisseur modifié avec success !")
      })
    }
  }  

  const editDestinataire = (id: number, message: string) => {
    let newObject: DestinataireRequestDto = emptyDestinataireRequestDto;
    newObject.ifumle = formFournisseur.ifumle.value;
    newObject.ftype = "F";
    newObject.contactTel = formFournisseur.telephone.value;
    newObject.contactEmail = formFournisseur.email.value;
    DestinataireService.edit(id, newObject)
    .then( () => {
      getFournisseurs();
      if (operationFournisseur ==="add") initFormFournisseur();
      okSuccessDialog(message);
    })
    .catch(error => {
      okWarnignDialog("Erreur lors de l'enregistrement");
    })
  }
  
  const handleDeleteFournisseur = (row: any) => () => {
    Swal.fire({
      title: 'GesBud',
      text: "Supprimer cet fournisseur ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      allowOutsideClick: false,
      confirmButtonColor: '#007E33' 
    }).then( (result) => {
      if (result.isConfirmed) {
        FournisseurService.delete(row.idFourn).then(() => {
          if (operationFournisseur === "edit") initFormFournisseur();
          getFournisseurs();
          okSuccessDialog("Fournisseur supprimé avec success !");
        });
      }
    });
  }  
  
  useEffect( () => {
    const results = fournisseurs.filter(item => {
      return ((item.ifumle || '').toString().toLowerCase().includes(formFournisseur.ifumle.value.toString().toLowerCase()))
       && ((item.raisonSociale || '').toString().toLowerCase().includes(formFournisseur.raisonSociale.value.toString().toLowerCase()))
       && ((item.bp || '').toString().toLowerCase().includes(formFournisseur.bp.value.toString().toLowerCase()))
       && ((item.telephone || '').toString().toLowerCase().includes(formFournisseur.telephone.value.toString().toLowerCase()))
       && ((item.contactEmail || '').toString().toLowerCase().includes(formFournisseur.email.value.toString().toLowerCase()))
       && ((item.profession || '').toString().toLowerCase().includes(formFournisseur.profession.value.toString().toLowerCase())) 
     })
     setFilteredFournisseurs(results);
  }, [formFournisseur])   

  useEffect(() => {
    if (show) {
      getFournisseurs();
    } else {
      initFormFournisseur();
    }
  }, [show])

  const getFournisseurs = () => {
    FournisseursViewService.getAll().then(data => {     
      setFournisseurs(data) 
    })
  } 

  useEffect(() => {
    const results = fournisseurs.filter(item => {
      return ((item.ifumle || '').toString().toLowerCase().includes(formFournisseur.ifumle.value.toString().toLowerCase()))
      && ((item.raisonSociale || '').toString().toLowerCase().includes(formFournisseur.raisonSociale.value.toString().toLowerCase()))
      && ((item.bp || '').toString().toLowerCase().includes(formFournisseur.bp.value.toString().toLowerCase()))
      && ((item.telephone || '').toString().toLowerCase().includes(formFournisseur.telephone.value.toString().toLowerCase()))
      && ((item.contactEmail || '').toString().toLowerCase().includes(formFournisseur.email.value.toString().toLowerCase()))
      && ((item.profession || '').toString().toLowerCase().includes(formFournisseur.profession.value.toString().toLowerCase())) 
    }) 
    setFilteredFournisseurs(results); 
    setLoaderFournisseurs(false)    
  }, [fournisseurs])  
  ////////////////////////////////////////// GESTION FOURNISSEURS

  ////////////////////////////////////////// GESTION MISE A JOUR COMPTE BANCAIRE DU FOURNISSEUR
  const [showModalMajCompteBancaireFournisseur, setShowModalMajCompteBancaireFournisseur] = useState(false);
  const [compteDestinataires, setCompteDestinataires] = useState<any[]>([]);
  const [filteredCompteDestinataires, setFilteredCompteDestinataires] = useState<any[]>([]);
  const [loaderCompteDestinataires, setLoaderCompteDestinataires] = useState<boolean>(true);
  const [operationCompteDestinataire, setOperationCompteDestinataire] = useState<string>("add");

  const [formCompteDestinataire, setFormCompteDestinataire] = useState<FormCompteDestinataire>({
    abreviation: { value: '' },
    libelleAgence: { value: '' },
    codeBanque: { value: '' },
    codeAgence: { value: '' },
    numCompte: { value: '' },
    cleRib: { value: '' },
    caissePop: { value: '' },
    numCaissePop: { value: '' },
    codeBic: { value: '' },
    iban: { value: '' }
  })  
  
  const initFormCompteDestinataire = () => {
    setOperationCompteDestinataire('add');
    setFormCompteDestinataire({
      abreviation: { value: '' },
      libelleAgence: { value: '' },
      codeBanque: { value: '' },
      codeAgence: { value: '' },
      numCompte: { value: '' },
      cleRib: { value: '' },
      caissePop: { value: '' },
      numCaissePop: { value: '' },
      codeBic: { value: '' },
      iban: { value: '' }
    })
  } 

  const tableCompteDestinataireColumns: GridColDef[] = [
    {
      field: 'abreviation',
      headerName: 'Banque',
      type: 'string',
      width: 200,
      headerClassName: 'header',
    },
    {
      field: 'libelleAgence',
      headerName: 'Agence',
      type: 'string',
      width: 200,
      headerClassName: 'header',
    },
    {
      field: 'codeBanque',
      headerName: 'Code Banque',
      type: 'string',
      minWidth: 100,
      headerClassName: 'header',
    },
    {
      field: 'codeAgence',
      headerName: 'Code Agence',
      type: 'string',
      minWidth: 100,
      headerClassName: 'header',
    },
    {
      field: 'numCompte',
      headerName: 'Num compte',
      type: 'string',
      minWidth: 200,
      headerClassName: 'header',
    },
    {
      field: 'cleRib',
      headerName: 'Clé Rib',
      type: 'string',
      minWidth: 100,
      headerClassName: 'header',
    },
    {
      field: 'codeBic',
      headerName: 'BIC (SWIFT)',
      type: 'string',
      minWidth: 100,
      headerClassName: 'header',
    },
    {
      field: 'iban',
      headerName: 'IBAN',
      type: 'string',
      minWidth: 200,
      headerClassName: 'header',
    },
    {
      field: 'caissePop',
      headerName: 'Caisse populaire',
      type: 'string',
      minWidth: 200,
      headerClassName: 'header',
    },
    {
      field: 'numCaissePop',
      headerName: 'N Caisse pop',
      type: 'string',
      minWidth: 200,
      headerClassName: 'header',
    },
    {
      field: 'actions',
      headerName: '',
      type: 'actions',
      width: 100,
      headerClassName: 'header',
      cellClassName: 'actions',
      getActions: (params: GridRowParams) => {
        return [
          <GridActionsCellItem
            icon={<Button variant="outline-warning" size="sm" title="Modifier"><BsPencilSquare /></Button>}
            label="Delete"
            color="inherit"
            onClick={handleEditFournisseur(params.row)}
          />,
          <GridActionsCellItem
            icon={<Button variant="outline-danger" size="sm" title="Supprimer"><BsTrash /></Button>}
            label="Delete"
            color="inherit"
            onClick={handleDeleteFournisseur(params.row)}
            disabled={params.row.occurenceFournisseurDansEngagement !== 0 || params.row.cccurenceFournisseurDansPPM_EXEC !== 0}
          />
        ];
      },
    } 
  ];

  const handleInputChangeFormCompteDestinataire = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormCompteDestinataire({ ...formCompteDestinataire, ...newField})
  }  
  
  const validateFormCompteDestinataire = () => {
    let newForm: FormFournisseur = formFournisseur;

    // Raison sociale
    if(formFournisseur.raisonSociale.value === "") {
      const errorMsg: string = 'Raison sociale obligatoire !';
      const newField: Field = { value: formFournisseur.raisonSociale.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ nom: newField } };
      setBorderColorRaisonSociale("red")
    } else {
      const newField: Field = { value: formFournisseur.raisonSociale.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ raisonSociale: newField } };
      setBorderColorRaisonSociale("")
    }

    setFormFournisseur(newForm);

    return newForm.raisonSociale.isValid;
  } 
  
  const handleSubmitFormCompteDestinataire = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if(!validateFormCompteDestinataire()) {
      okWarnignDialog("Veuillez renseigner les parties encadrées en rouge !")
      return;
    }  
  
    if (operationCompteDestinataire === 'add') addCompteDestinataire();
    if (operationCompteDestinataire === 'edit') editCompteDestinataire(); 
  } 
  
  const libelleOperationCompteDestinataire = () => {
    if (operationCompteDestinataire === 'add') return "Ajouter bancaire"
    if (operationCompteDestinataire === 'edit') return "Modifier bancaire"
  }  

  const handleAddCompteDestinataire = () => {
    initFormCompteDestinataire();
  } 

  const handleEditCompteDestinataire = (row: any) => () => {
    setOperationCompteDestinataire("edit")
    setFormCompteDestinataire({
      abreviation: { value: row.abreviation, isValid: true },
      libelleAgence: { value: row.libelleAgence, isValid: true },
      codeBanque: { value: row.codeBanque, isValid: true },
      codeAgence: { value: row.codeAgence, isValid: true },
      numCompte: { value: row.numCompte, isValid: true },
      cleRib: { value: row.cleRib, isValid: true },
      caissePop: { value: row.caissePop, isValid: true },
      numCaissePop: { value: row.numCaissePop, isValid: true },
      codeBic: { value: row.codeBic, isValid: true },
      iban: { value: row.iban, isValid: true }
    })   
  }
  
  const addCompteDestinataire = () => {
    let newObject: FournisseurRequestDto = emptyFournisseurRequestDto;
    newObject.raisonSociale = formFournisseur.raisonSociale.value;
    newObject.bp = formFournisseur.bp.value;
    newObject.profession = formFournisseur.profession.value;
    newObject.telephone = formFournisseur.telephone.value;

    let fournisseurWithIfumleOrNomExists =  DestinataireService.existsByIfumleAndIfumleNotOrNom(formFournisseur.ifumle.value, "-", formFournisseur.raisonSociale.value);
    if(!fournisseurWithIfumleOrNomExists) {
      FournisseurService.add(newObject).then( data => {
        editDestinataire(data.idFourn, "Fournisseur ajouté avec success !")
      }) 
    } else {
      okWarnignDialog("Ce numero ifu ou nom existe déja !")
    }
  }
  
  const editCompteDestinataire = () => {
    let newObject: FournisseurRequestDto = emptyFournisseurRequestDto;
    newObject.raisonSociale = formFournisseur.raisonSociale.value;
    newObject.bp = formFournisseur.bp.value;
    newObject.profession = formFournisseur.profession.value;
    newObject.telephone = formFournisseur.telephone.value;

    let fournisseurWithIfumleOrNomExists = DestinataireService.existsByIfumleAndIfumleNotOrNom(formFournisseur.ifumle.value, "-", formFournisseur.raisonSociale.value);
    if(!fournisseurWithIfumleOrNomExists) {
      FournisseurService.add(newObject).then( data => {
        editDestinataire(data.idFourn, "Fournisseur ajouté avec success !")
      }) 
    } else {
      okWarnignDialog("Ce numero ifu ou nom existe déja !")
    }
  }  

  const getCompteDestinataires = (idFourn: number) => {
    CompteDestinataireService.getByDestinataires(idFourn).then(data => {     
      setCompteDestinataires(data)
    })
  }
  
  useEffect(() => {
    setFilteredCompteDestinataires(compteDestinataires); 
    setLoaderCompteDestinataires(false)    
  }, [compteDestinataires])    

  const handleShowModalMajCompteBancaireFournisseur = () => { 
    setShowModalMajCompteBancaireFournisseur(true);
  }

  const handleCloseModalMajCompteBancaireFournisseur = () => {
    setShowModalMajCompteBancaireFournisseur(false);
    setCompteDestinataires([])
    setFilteredCompteDestinataires([])
  }

  const handleMiseAjourCompteBancaire = (row: any) => {
    handleShowModalMajCompteBancaireFournisseur();
    getCompteDestinataires(row.idFourn)
  } 
  ////////////////////////////////////////// GESTION MISE A JOUR COMPTE BANCAIRE DU FOURNISSEUR

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
    <>
      <Modal show={show} onHide={onHide} backdrop="static" keyboard={true} size="xl">
        <Modal.Header closeButton className='p-1'>
          <Modal.Title as="h6">Liste des fournisseurs</Modal.Title>
        </Modal.Header>

        <Modal.Body className='p-1'>
          <Form onSubmit={(e) => handleSubmitFormFournisseur(e)}>
            <Card className="mb-1">
              <Card.Header className='p-1'>{ libelleOperationFournisseur() }</Card.Header>
              <Card.Body className='p-2'>
                <Row>
                  <Col>
                    <Form.Group controlId="ifumle" as={Row} className="mb-1">
                      <Col xs={4}><Form.Label className="label2">IFU :</Form.Label></Col>
                      <Col><Form.Control name='ifumle' value={formFournisseur.ifumle.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormFournisseur(e)} /></Col>
                    </Form.Group>
                    <Form.Group controlId="bp" as={Row} className="mb-1">
                      <Col xs={4}><Form.Label className="label2">Boite postale (facultatif) :</Form.Label></Col>
                      <Col><Form.Control name='bp' value={formFournisseur.bp.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormFournisseur(e)} /></Col>
                    </Form.Group>
                    <Form.Group controlId="profession" as={Row} className="mb-1">
                      <Col xs={4}><Form.Label className="label2">Profession (facultatif) :</Form.Label></Col>
                      <Col><Form.Control name='profession' value={formFournisseur.profession.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormFournisseur(e)} /></Col>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="raisonSociale" as={Row} className="mb-1">
                      <Col xs={4}><Form.Label className="label2">Raison sociale ou nom :</Form.Label></Col>
                      <Col><Form.Control name='raisonSociale' value={formFournisseur.raisonSociale.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormFournisseur(e)} style={{ borderColor: borderColorRaisonSociale }} /></Col>
                    </Form.Group>
                    <Form.Group controlId="telephone" as={Row} className="mb-1">
                      <Col xs={4}><Form.Label className="label2">Téléphone :</Form.Label></Col>
                      <Col><Form.Control name='telephone' value={formFournisseur.telephone.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormFournisseur(e)} /></Col>
                    </Form.Group>
                    <Form.Group controlId="email" as={Row} className="mb-1">
                      <Col xs={4}><Form.Label className="label2">Email (facultatif)  :</Form.Label></Col>
                      <Col><Form.Control name='email' value={formFournisseur.email.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormFournisseur(e)} /></Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer className='p-1'>
                <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>Enregistrer</Button>
                <Button size='sm' variant="outline-success" title="Ajouter Nouveau" className='ms-1' style={{width: "100px"}} onClick={ () => handleAddFournisseur()}><BsPlusLg /></Button>
              </Card.Footer>            
            </Card>
          </Form> 
          <Card className="">
            <Card.Body className='p-0' style={{height: "300px"}}>
              <DataGrid
                rows={filteredFournisseurs}
                loading={loaderFournisseurs}
                getRowId={(row) => row.idFourn}
                columns={tableFournisseurColumns}
                columnHeaderHeight={50}
                rowHeight={25}
                slots={{
                  noRowsOverlay: NoRowsOverlay,
                }}
                sx={{
                  '& .header': {
                    backgroundColor: '#dc3545',
                    marginTop:'2px',
                  },
                  '& .MuiDataGrid-actionsCell': {
                    gap: '0px'
                  }
                }}
              />             
            </Card.Body>
          </Card>             
        </Modal.Body>

        <Modal.Footer className='p-0'>
          <Button variant="outline-danger" size='sm' onClick={onHide}>Fermer</Button>
        </Modal.Footer>
      </Modal>  

      {/* MODAL GESTION MISE A JOUR COMPTE BANCAIRE DU FOURNISSEUR */}
      <Modal show={showModalMajCompteBancaireFournisseur} onHide={handleCloseModalMajCompteBancaireFournisseur} backdrop="static" keyboard={true} size="xl" style={{ zIndex: 2000 }}>
        <Modal.Header closeButton className='p-1 bg-primary'>
          <Modal.Title as="h6">Liste des comptes bancaires</Modal.Title>
        </Modal.Header>

        <Modal.Body className='p-1 bg-primary'>
          <Form onSubmit={(e) => handleSubmitFormFournisseur(e)}>
            <Card className="mb-1">
              <Card.Header className='p-1'>{ libelleOperationFournisseur() }</Card.Header>
              <Card.Body className='p-2'>
                <Row>
                  <Col>
                    <Form.Group controlId="abreviation" as={Row} className="mb-1">
                      <Col xs={4}><Form.Label className="label2">Banque : *</Form.Label></Col>
                      <Col>
                        <InputGroup size='sm'>
                          <Form.Control name='abreviation' value={formCompteDestinataire.abreviation.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormCompteDestinataire(e)} disabled />
                          <Button variant="outline-primary" title="Cliquez pour sélectionner une institution financière"><BsArrowDownCircleFill /></Button>
                        </InputGroup>
                      </Col>
                    </Form.Group>
                    <Form.Group controlId="libelleAgence" as={Row} className="">
                      <Col xs={4}><Form.Label className="label2">Agence : *</Form.Label></Col>
                      <Col>
                        <InputGroup size='sm'>
                          <Form.Control name='libelleAgence' value={formCompteDestinataire.libelleAgence.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormCompteDestinataire(e)} disabled />
                          <Button variant="outline-primary" title="Cliquez pour sélectionner une agence"><BsArrowDownCircleFill /></Button>
                        </InputGroup>
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="codeBic" as={Row} className="mb-1">
                      <Col xs={4}><Form.Label className="label2">BIC (SWIFT) :</Form.Label></Col>
                      <Col><Form.Control name='codeBic' value={formCompteDestinataire.codeBic.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormCompteDestinataire(e)} /></Col>
                    </Form.Group>
                    <Form.Group controlId="iban" as={Row} className="">
                      <Col xs={4}><Form.Label className="label2">IBAN :</Form.Label></Col>
                      <Col><Form.Control name='iban' value={formCompteDestinataire.iban.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormCompteDestinataire(e)} /></Col>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className='g-1'>
                  <Col xs={2}>
                    <Form.Group controlId="codeBanque">
                      <Form.Label className="label2 mb-0">Code banque : *</Form.Label>
                      <Form.Control name="codeBanque" value={formCompteDestinataire.codeBanque.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormCompteDestinataire(e)} disabled />
                    </Form.Group>
                  </Col>
                  <Col xs={2}>
                    <Form.Group controlId="codeAgence"> 
                      <Form.Label className="label2 mb-0">Code agence : *</Form.Label>
                      <Form.Control name="codeAgence" value={formCompteDestinataire.codeAgence.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormCompteDestinataire(e)} disabled />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="numCompte">
                      <Form.Label className="label2 mb-0">Numero Compte : *</Form.Label>
                      <Form.Control name="numCompte" value={formCompteDestinataire.numCompte.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormCompteDestinataire(e)} />
                    </Form.Group>
                  </Col>
                  <Col xs={2}>
                    <Form.Group controlId="cleRib">
                      <Form.Label className="label2 mb-0">Clé RIB : *</Form.Label>
                      <Form.Control name="cleRib" value={formCompteDestinataire.cleRib.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormCompteDestinataire(e)} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className='g-1'>
                  <Col>
                    <Form.Group controlId="caissePop">
                      <Form.Label className="label2 mb-0">Caisse populaire :</Form.Label>
                      <InputGroup size='sm'>
                        <Form.Control name='caissePop' value={formCompteDestinataire.caissePop.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormCompteDestinataire(e)} disabled />
                        <Button variant="outline-primary" title="Cliquez pour sélectionner une caisse populaire"><BsArrowDownCircleFill /></Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col xs={2}>
                    <Form.Group controlId="numCaissePop">
                      <Form.Label className="label2 mb-0">Nº Caisse pop :</Form.Label>
                      <Form.Control name="numCaissePop" value={formCompteDestinataire.numCaissePop.value} size='sm' type="text" autoComplete='off' onChange={e => handleInputChangeFormCompteDestinataire(e)} disabled />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer className='p-1'>
                <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>Enregistrer</Button>
                <Button size='sm' variant="outline-success" title="Ajouter Nouveau" className='ms-1' style={{width: "100px"}} onClick={ () => handleAddFournisseur()}><BsPlusLg /></Button>
              </Card.Footer>            
            </Card>
          </Form> 
          <Card className="">
            <Card.Body className='p-0' style={{height: "250px"}}>
              <DataGrid
                rows={filteredCompteDestinataires}
                loading={loaderCompteDestinataires}
                getRowId={(row) => row.id}
                columns={tableCompteDestinataireColumns}
                columnHeaderHeight={30}
                rowHeight={25}
                slots={{
                  noRowsOverlay: NoRowsOverlay,
                }}
                sx={{
                  '& .header': {
                    backgroundColor: '#0d6efd',
                    marginTop:'2px',
                  },
                  '& .MuiDataGrid-actionsCell': {
                    gap: '0px',
                  },
                  '& .actions': {
                    position: "sticky",
                    right: 0,
                    backgroundColor: "#fff",
                    zIndex: 0
                  },
                }}
              />             
            </Card.Body>
          </Card>             
        </Modal.Body>

        <Modal.Footer className='p-0 bg-primary'>
          <Button variant="outline-danger" size='sm' onClick={handleCloseModalMajCompteBancaireFournisseur} className='text-black'>Fermer</Button>
        </Modal.Footer>
      </Modal>   
    </>
  );
};

export default ModalSaisieMajFournisseur;
