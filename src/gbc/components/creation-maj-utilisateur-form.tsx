import React, { FunctionComponent, useEffect, useState } from 'react';
import { Badge, Button, ButtonGroup, Card, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';

import { BsEye, BsKey, BsPencilSquare, BsPlusLg, BsTrash} from 'react-icons/bs';
import { AgentRequestDto, emptyAgentRequestDto } from '../models/agent';
import { DestinataireRequestDto, emptyDestinataireRequestDto } from '../models/destinataire';
import { DirectionServiceResponseDto } from '../models/direction-service';
import AgentService from '../services/agent-service';
import DirectionServiceService from '../services/direction-service-service';
import DestinataireService from '../services/destinataire-service';
import { Field } from '../../helpers/types';
import Swal from 'sweetalert2';
import DataTable  from 'react-data-table-component'; 
import AccesCodeNiveauService from '../services/acces-code-niveau-service';
import AccesCodeService from '../services/accesCodeService';
import { AccesCodeNiveauResponseDto, emptyAccesCodeNiveauResponseDto } from '../models/acces-code-niveau';
import AccesCodeDto, { emptyAccesCodeDto } from '../models/accesCodeDto';
import { ConnectedUser, Gestion, IdBudget } from '../helpers/session-storage';
import { costumeStyles } from '../../helpers/costume-styles';
import AgentAccesCodeAccesCodeNiveauGrpeCodeViewService from '../services/agent-acces-code-acces-code-niveau-grpe-code-view-service';
import { okSuccessDialog, okWarnignDialog } from '../../helpers/dialogs';
import BudgetNomenclaturedViewService from '../services/budget-nomenclatured-view-service';
import AccesLigneBudgetaireNomenclaturedBudgetViewService from '../services/acces-ligne-budgetaire-nomenclatured-budget-view-service';
import AccesLigneBudgetaireService from '../services/acces-ligne-budgetaire-service';
import { AccesLigneBudgetaireRequestDto, emptyAccesLigneBudgetaireRequestDto } from '../models/acces-ligne-budgetaire';
import bcrypt from 'bcryptjs-react';
import AgentsDirectionServiceSDestinatairesViewService from '../services/agents-direction-service-s-destinaires-view-service';

type FormAccesCode = {
  code: Field,
  intituleCode: Field,
  userName: Field,
  grpe: Field,
  statu: Field,
  mle: Field,
  nom: Field,
  prenom: Field,
  motDePasse: Field,
  nbreDeFois: Field,
  id: Field
}

type FormAgent = {
  ifumle: Field,
  mle: Field,
  nom: Field,
  prenom: Field,
  telephone: Field,
  email: Field,
  sexe: Field,
  service: Field,
  signataire: Field,
  titreHonorifique: Field,
  actif: Field
}

const CreationMajUtilisateurForm: FunctionComponent = () => {

  ////////////////////////////////////////// Gestion des accesCode
  const [gestionCourante] = useState<string>(Gestion() ?? '');
  const [idBudgetCourante] = useState<string>(IdBudget() ?? '');
  const [accesCodeCourante, setAccesCodeCourante] = useState<AccesCodeDto>(emptyAccesCodeDto);
  const [accesCodeSelectionnee, setAccesCodeSelectionne] = useState<any>({});
  const [accesCodeNiveauCourante, setAccesCodeNiveauCourante] = useState<AccesCodeNiveauResponseDto>(emptyAccesCodeNiveauResponseDto);
  const [operationAccesCode, setOperationAccesCode] = useState<string>("add");
  const [selectedAgent] = useState<any>({});
  const [agentAccesCodeAccesCodeNiveaus, setAgentAccesCodeAccesCodeNiveaus] = useState<any[]>([]);
  const [filteredAgentAccesCodeAccesCodeNiveaus, setFilteredAgentAccesCodeAccesCodeNiveaus] = useState<any[]>([]);
  const [searchTermUserName, setSearchTermUserName] = useState<string>('');
  const [showModalLigneBudgetaire, setShowModalLigneBudgetaire] = useState(false);
  const [showModalRenitialiserMotPasse, setShowModalRenitialiserMotPasse] = useState(false);
  const [motPasseCourant, setMotPasseCourant] = useState("");
  const [ligneBudgetaireGestionCourantes, setLigneBudgetaireGestionCourantes] = useState<any[]>([]);
  const [ligneBudgetaireUtilisateurSelectionne, setLigneBudgetaireUtilisateurSelectionne] = useState<any[]>([]);
  var ligneBudgetaireAEnregistrer: any[] = [];

  const tableAccesCodeColumns = [
    {
      name: "ID",
      selector: (row: any) => row.mle,
      sortable: true,
      width: "60px",
    },
    {
      name: "Nom et prénom(s)",
      selector: (row: any) => row.nom + ' ' + row.prenom,
      sortable: true
    },
    {
      name: "Utilisateur ",
      selector: (row: any) => row.userName,
      sortable: true,
      width: "120px",
      style: {
        
      }
    },
    {
      name: "Groupe",
      selector: (row: any) => row.intituleCode,
      sortable: true,
    },
    {
      name: "Niveau du code",
      selector: (row: any) => row.libelleGrpe,
      sortable: true,
    },
    {
      name: "Actif",
      cell: (row: any) => <Form.Check type='checkbox' checked={row.statu === "ACTIF"} disabled className='label2' />,
      width: "60px",
      center: true,
    },
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            <Button variant="outline-warning" title="Modifier" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleEditAccesCode(row)}><BsPencilSquare /></Button>
            <Button variant="outline-danger" title="Supprimer" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleDeleteAccesCode(row.userName)}><BsTrash /></Button>
            <Button variant="outline-danger" title="Renitialiser le mot de passe" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleRenitialiserMotPasseAccesCode(row)}><BsKey /></Button>
            <Button variant="outline-primary" title="Cliquez pour voir les lignes budgetaires" onClick={() => handleLignesBudgetairesButtonClick(row)} className='' style={{maxWidth:'30px', maxHeight:'30px'}}><BsEye /></Button>
        </ButtonGroup>
      ),
      width: "133px",
      center: true,
    }
  ]

  const tableLigneBudgetaireGestionCouranteColumns = [
    {
      name: "Code budgétaire",
      selector: (row: any) => {
        let codeBudgetaire = '';
        if (row.titre != null) codeBudgetaire = codeBudgetaire + row.titre
        if (row.section != null) codeBudgetaire = codeBudgetaire + '-' + row.section
        if (row.art != null) codeBudgetaire = codeBudgetaire + '-' + row.art
        if (row.chap != null) codeBudgetaire = codeBudgetaire + '-' + row.chap
        if (row.parag != null) codeBudgetaire = codeBudgetaire + '-' + row.parag
        if (row.rub != null) codeBudgetaire = codeBudgetaire + '-' + row.rub
        return codeBudgetaire;
      },
      sortable: true,
    },
    {
      name: "Intitule",
      selector: (row: any) => row.intitule,
      sortable: true,
    },
  ]

  const [formAccesCode, setformAccesCode] = useState<FormAccesCode>({
    code: { value: '' },
    intituleCode: { value: '' },
    userName: { value: '' },
    grpe: { value: '' },
    statu: { value: 'ACTIF' },
    mle: { value: '' },
    nom: { value: '' },
    prenom: { value: '' },
    motDePasse: { value: '' },
    nbreDeFois: { value: '' },
    id: { value: '' }
  })

  const initFormAccesCode = () => {
    setOperationAccesCode('add');
    setformAccesCode({
      code: { value: accesCodeNiveauCourante.code },
      intituleCode: { value:  accesCodeNiveauCourante.intituleCode },
      userName: { value: '' },
      grpe: { value: '' },
      statu: { value: 'ACTIF' },
      mle: { value: '' },
      nom: { value: '' },
      prenom: { value: '' },
      motDePasse: { value: '' },
      nbreDeFois: { value: '' },
      id: { value: '' }
    })
  }

  const handleInputChangeFormAccesCode = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    
    setformAccesCode({ ...formAccesCode, ...newField}); 
  }

  const validateFormAccesCode = () => {
    let newForm: FormAccesCode = formAccesCode;

    // AccesCodeNiveau
    if(formAccesCode.code.value === "") {
      const errorMsg: string = 'Niveau code obligatoire !';
      const newField: Field = { value: formAccesCode.code.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ code: newField } };
    } else {
      const newField: Field = { value: formAccesCode.code.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ code: newField } };
    }

    // Groupe
    if(formAccesCode.grpe.value === "") {
      const errorMsg: string = 'Groupe obligatoire !';
      const newField: Field = { value: formAccesCode.grpe.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ grpe: newField } };
    } else {
      const newField: Field = { value: formAccesCode.grpe.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ grpe: newField } };
    }

    // Mle
    if(formAccesCode.mle.value === "" || formAccesCode.mle.value === undefined) {
      const errorMsg: string = "Identité de l'utilisateur obligatoire !";
      const newField: Field = { value: formAccesCode.mle.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ mle: newField } };
    } else {
      const newField: Field = { value: formAccesCode.mle.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ mle: newField } };
    }

    setformAccesCode(newForm);

    return  newForm.code.isValid && newForm.grpe.isValid && newForm.mle.isValid;
  }

  const handleSubmitFormAccesCode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormAccesCode()) {
      Swal.fire({
        title: 'GesBud',
        text: "Les champs groupe d'utilisateur, niveau du code , identité de l'utilisateur sont obligatoires !",
        icon: 'warning',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
      });
      return;
    }

    if (operationAccesCode === 'add') addAccesCode();
    if (operationAccesCode === 'edit') editAccesCode(); 
  }

  const libelleOperationAccesCode = () => {
    if (operationAccesCode === 'add') return "Ajouter utilisateur"
    if (operationAccesCode === 'edit') return "Modifier utilisateur"
  }

  const libelleButtonSumbitAccesCode = () => {
    if (operationAccesCode === 'add') return "Enregistrer"
    if (operationAccesCode === 'edit') return "Enregistrer"
  }

  const handleAddAccesCode = () => {
    initFormAccesCode();
  }

  const handleEditAccesCode = (row: any) => {
    setOperationAccesCode("edit");
    setformAccesCode({
      code: { value: accesCodeNiveauCourante.code },
      intituleCode: { value:  accesCodeNiveauCourante.intituleCode },
      userName: { value: row.userName, isValid: true },
      grpe: { value: row.grpe, isValid: true },
      statu: { value: row.statu, isValid: true },
      mle: { value: row.mle, isValid: true },
      nom: { value: row.nom, isValid: true },
      prenom: { value: row.prenom, isValid: true },
      motDePasse: { value: row.motDePasse, isValid: true},
      nbreDeFois: { value: row.nbreDeFois, isValid: true},
      id: { value: row.id, isValid: true}
    })
  }

  const handleDeleteAccesCode = (id: string) => {
    initFormAccesCode();
    Swal.fire({
      title: 'GesBud',
      text: "Supprimer cet utilisateur ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      allowOutsideClick: false,
      confirmButtonColor: '#007E33' 
    }).then( (result) => {
      if (result.isConfirmed) {
        AccesCodeService.delete(id).then(() => {
          getAgentAccesCodeAccesCodeNiveauGrpeCodes();
          okSuccessDialog("Utilisateur supprimé avec succès !")
        });
      }
    });
  }


  const handleCloseModalRenitialiserMotPasse = () => {
    setShowModalRenitialiserMotPasse(false);
  }

  const handleShowModalRenitialiserMotPasse = () => {
    setShowModalRenitialiserMotPasse(true)
  }

  const handleRenitialiserMotPasseAccesCode = (row: any) => {
    setAccesCodeSelectionne({
      userName: row.userName,
      motPasse: row.motDePasse,
      statu: row.statu,
      dateChangement: row.dateChangement,
      nbreDeFois: row.nbreDeFois,
      rangCod: row.rangCod,
      id: row.id,
      dateCreat: row.dateCreat,
      code: row.code,
      grpe: row.grpe,
      mle: row.mle,
    })
    handleShowModalRenitialiserMotPasse();
  }

  const handleRenitialiserMotPasse = () => {
    // On compare le mot de passe que l'utilisateur a saisie au mot de passe de l'utilisateur connecté
    bcrypt.compare(motPasseCourant, accesCodeCourante.motDePasse).then( res => {
      if (!res) {
        okWarnignDialog("Mot de passe incorrect !")
      } else {
        accesCodeSelectionnee.motDePasse = bcrypt.hashSync("OK", 10);
        AccesCodeService.edit(accesCodeSelectionnee.userName,  accesCodeSelectionnee).then(data => {
          initFormAccesCode();
          getAgentAccesCodeAccesCodeNiveauGrpeCodes();
          handleCloseModalRenitialiserMotPasse()
          okSuccessDialog("Mot de passe renitialisé avec succès !");
        })
      }
    })
  }

  const handleMotPasseCourantInputChange = (e: any): void => {
    setMotPasseCourant(e.target.value);
  }

  const addAccesCode = () => {
    const hashedPassword = bcrypt.hashSync("OK", 10); // To hash a password

    let newAccesCode: AccesCodeDto = emptyAccesCodeDto;
    newAccesCode.code = formAccesCode.code.value;
    newAccesCode.grpe = formAccesCode.grpe.value;
    newAccesCode.mle = formAccesCode.mle.value;
    newAccesCode.motDePasse = hashedPassword;
    newAccesCode.statu = formAccesCode.statu.value;
    AccesCodeService.add(newAccesCode).then(data => {
      initFormAccesCode();
      getAgentAccesCodeAccesCodeNiveauGrpeCodes();
      okSuccessDialog("Utilisateur crée avec succès !");
    })
  }

  const editAccesCode = () => {
    let newAccesCode: AccesCodeDto = emptyAccesCodeDto;
    newAccesCode.code = formAccesCode.code.value;
    newAccesCode.grpe = formAccesCode.grpe.value;
    newAccesCode.mle = formAccesCode.mle.value;
    newAccesCode.statu = formAccesCode.statu.value;
    newAccesCode.motDePasse = formAccesCode.motDePasse.value;
    newAccesCode.nbreDeFois = formAccesCode.nbreDeFois.value;
    newAccesCode.id = formAccesCode.id.value;
    AccesCodeService.edit(formAccesCode.userName.value,  newAccesCode).then(data => {
      initFormAccesCode();
      getAgentAccesCodeAccesCodeNiveauGrpeCodes();
      okSuccessDialog("Utilisateur modifié avec succès !");
    })
  }

  useEffect(() => {
    initFormAccesCode();
    getAccesCodeCourante();
    getLigneBudgetaireGestionCourantes();
  }, [])

  useEffect(() => {
    getAccesCodeNiveauCourante()
    getAgentAccesCodeAccesCodeNiveauGrpeCodes()
  }, [accesCodeCourante])

  useEffect(() => {
    formAccesCode.code.value = accesCodeNiveauCourante.code;
    formAccesCode.intituleCode.value = accesCodeNiveauCourante.intituleCode;
  }, [accesCodeNiveauCourante])

  useEffect(() => {
    formAccesCode.mle.value = selectedAgent.mle;
    formAccesCode.nom.value = selectedAgent.nom;
    formAccesCode.prenom.value = selectedAgent.prenom;
  }, [selectedAgent])

  const getAccesCodeCourante = () => {
    AccesCodeService.get(ConnectedUser()).then( data => {
      setAccesCodeCourante(data)
    });
  }

  const getAccesCodeNiveauCourante = () => {
    AccesCodeNiveauService.get(accesCodeCourante.code).then( data => {
      setAccesCodeNiveauCourante(data)
    });
  }

  const getAgentAccesCodeAccesCodeNiveauGrpeCodes = () => {
    AgentAccesCodeAccesCodeNiveauGrpeCodeViewService.getByCode(accesCodeCourante.code).then( data => {
      setAgentAccesCodeAccesCodeNiveaus(data)
      if(!searchTermUserName) {
        setFilteredAgentAccesCodeAccesCodeNiveaus(data);
      } else {
        const results = data.filter(item => {
          return item.userName && item.userName.toString().toLowerCase().includes(searchTermUserName.toLowerCase())
        })
        setFilteredAgentAccesCodeAccesCodeNiveaus(results)
      }      
    });
  }

  const getLigneBudgetaireGestionCourantes = () => {
    BudgetNomenclaturedViewService.getByGestionAndIdBudget(Number(gestionCourante), Number(idBudgetCourante)).then( data => {
      setLigneBudgetaireGestionCourantes(data)
    });
  }

  const getLigneBudgetaireUtilisateurSelectionne = (userName: string, gestion: number, idBudget: number) => {
    AccesLigneBudgetaireNomenclaturedBudgetViewService.getByUserNameAndGestionAndIdBudget(userName, gestion, idBudget).then( data => {
      setLigneBudgetaireUtilisateurSelectionne(data)
    });
  }

  const handleSearchAccesCodeInputChange = (e: any): void => {
    const termm: string = e.target.value;
    setSearchTermUserName(termm.toUpperCase());
    
    if(!termm) {
      setFilteredAgentAccesCodeAccesCodeNiveaus(agentAccesCodeAccesCodeNiveaus);
    } else {
      const results = agentAccesCodeAccesCodeNiveaus.filter(item => {
        return item.userName && item.userName.toString().toLowerCase().includes(termm.toLowerCase())
      })
      setFilteredAgentAccesCodeAccesCodeNiveaus(results)
    }
  }

  const handleCloseModalLigneBudgetaires = () => {
    setShowModalLigneBudgetaire(false);
  }

  const handleShowModalLigneBudgetaires = () => {
    setShowModalLigneBudgetaire(true);
  }

  const handleLignesBudgetairesButtonClick = (row: any) => {
    formAccesCode.userName.value = row.userName;
    getLigneBudgetaireUtilisateurSelectionne(row.userName, Number(gestionCourante), Number(idBudgetCourante))
    handleShowModalLigneBudgetaires()
  }

  const handleModifierLigneBudgetaires = () => {
    AccesLigneBudgetaireService.deleteByUserNameAndGestionAndIdBudget(formAccesCode.userName.value, Number(gestionCourante), Number(idBudgetCourante)).then( () => {
      ligneBudgetaireAEnregistrer.forEach(item => {
        let newAccesLigneBudgetaire: AccesLigneBudgetaireRequestDto = emptyAccesLigneBudgetaireRequestDto;
        newAccesLigneBudgetaire.userName = formAccesCode.userName.value;
        newAccesLigneBudgetaire.courante = item.gestion;
        newAccesLigneBudgetaire.numNo = item.numNo;
        newAccesLigneBudgetaire.idBudgett = item.idBudget;
        AccesLigneBudgetaireService.add(newAccesLigneBudgetaire).then(data => {
          
        })
      })
    })
    okSuccessDialog("Ligne budgétaire affectées avec succès !");
  }

  
  ////////////////////////////////////////// Gestion des accesCode

  
  ///////////////// GESTION SELECTIONNER AGENT
  const [agents, setAgents] = useState<any[]>([]);
  const [filteredAgents, setFilteredFilteredAgents] = useState<any[]>([]);
  const [showModalSelectionnerAgent, setShowModalSelectionnerAgent] = useState(false);
  const [directionServiceResponseDtos, setDirectionServiceResponseDtos] = useState<DirectionServiceResponseDto[]>([]);
  const [operationAgent, setOperationAgent] = useState<string>("add");

  const [formAgent, setFormAgent] = useState<FormAgent>({
    ifumle: { value: '' },
    mle: { value: '' },
    nom: { value: '' },
    prenom: { value: '' },
    telephone: { value: '' },
    email: { value: '' },
    sexe: { value: '' },
    service: { value: '' },
    signataire: { value: '' },
    titreHonorifique: { value: '' },
    actif: { value: true }
  })

  const initFormAgent = () => {
    setOperationAgent('add');
    setFormAgent({
      ifumle: { value: '' },
      mle: { value: '' },
      nom: { value: '' },
      prenom: { value: '' },
      telephone: { value: '' },
      email: { value: '' },
      sexe: { value: '' },
      service: { value: '' },
      signataire: { value: '' },
      titreHonorifique: { value: '' },
      actif: { value: true }
    })
  }

  const tableAgentColumns = [
    {
      name: "Matricule",
      selector: (row: any) => row.ifumle,
      sortable: true,     
    },    
    {
      name: "Nom",
      selector: (row: any) => row.nom,
      sortable: true
    },  
    {
      name: "Prénom",
      selector: (row: any) => row.prenom,
      sortable: true
    },
    {
      name: "Sexe",
      selector: (row: any) => (row.sexe === 'M')? 'Masculin' :  'Féminin',
      sortable: true
    },
    {
      name: "Service",
      selector: (row: any) => row.libelle,
      sortable: true
    },
    {
      name: "Actif",
      selector: (row: any) => <Form.Check type='checkbox' checked={row.actif} className='label2' />
    },
    {
      name: "Signataire",
      selector: (row: any) => row.signataire,
      sortable: true
    },
    {
      name: "Titre honorifique",
      selector: (row: any) => row.titreHonoSign,
    },
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            <Button variant="outline-warning" title="Modifier" className='me-1' onClick={() => handleEditAgent(row)}><BsPencilSquare /></Button>
            <Button variant="outline-danger" title="Supprimer" className='me-1' onClick={() => handleDeleteAgent(row.mle)}><BsTrash /></Button>
        </ButtonGroup>
      )
    }
  ]

  const handleInputChangeFormAgent = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormAgent({ ...formAgent, ...newField})
  }

  const handleCheckboxInputChangeFormAgent = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: boolean = e.target.checked;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormAgent({ ...formAgent, ...newField})
  }

  const validateFormAgent = () => {
    let newForm: FormAgent = formAgent;

    // Nom
    if(formAgent.nom.value === "") {
      const errorMsg: string = 'Nom obligatoire !';
      const newField: Field = { value: formAgent.nom.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ nom: newField } };
    } else {
      const newField: Field = { value: formAgent.nom.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ nom: newField } };
    }

    // Prenom
    if(formAgent.prenom.value === "") {
      const errorMsg: string = 'Prenom obligatoire !';
      const newField: Field = { value: formAgent.prenom.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ prenom: newField } };
    } else {
      const newField: Field = { value: formAgent.prenom.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ prenom: newField } };
    }

    // Sexe
    if(formAgent.sexe.value === "") {
      const errorMsg: string = 'Sexe obligatoire !';
      const newField: Field = { value: formAgent.sexe.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ sexe: newField } };
    } else {
      const newField: Field = { value: formAgent.sexe.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ sexe: newField } };
    }

    // Service
    if(formAgent.service.value === "") {
      const errorMsg: string = 'Service obligatoire !';
      const newField: Field = { value: formAgent.service.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ service: newField } };
    } else {
      const newField: Field = { value: formAgent.service.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ service: newField } };
    }

    setFormAgent(newForm);

    return newForm.nom.isValid && newForm.prenom.isValid && newForm.sexe.isValid && newForm.service.isValid;
  }

  const handleSubmitFormAgent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Formulaire invalide
    if(!validateFormAgent()) {
      Swal.fire({
        title: 'GesBud',
        text: 'Les champs nom, prenom, sexe et service sont obligatoires !',
        icon: 'warning',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
      });
      return;
    }  
  
    if (operationAgent === 'add') addAgent();
    if (operationAgent === 'edit') editAgent(); 
  }  

  const libelleOperationAgent = () => {
    if (operationAgent === 'add') return "Ajouter agent"
    if (operationAgent === 'edit') return "Modifier agent"
  }

  const libelleButtonSumbitAgent = () => {
    if (operationAgent === 'add') return "Enregistrer"
    if (operationAgent === 'edit') return "Enregistrer"
  }
   
  const handleAddAgent = () => {
    initFormAgent();
  }

  const handleEditAgent = (row: any) => {
    setOperationAgent("edit")
    setFormAgent({
      ifumle: { value: row.ifumle, isValid: true },
      mle: { value: row.mle, isValid: true },
      nom: { value: row.nom, isValid: true },
      prenom: { value: row.prenom, isValid: true },
      telephone: { value: row.contactTel, isValid: true },
      email: { value: row.contactEmail, isValid: true },
      sexe: { value: row.sexe, isValid: true },
      service: { value: row.idService, isValid: true },
      signataire: { value: row.signataire, isValid: true },
      titreHonorifique: { value: row.titreHonoSign, isValid: true },
      actif: { value: row.actif, isValid: true }
    })
  }

  const handleDeleteAgent = (id: number) => {
    initFormAgent()
    setOperationAgent('add')
    Swal.fire({
      title: 'GesBud',
      text: "Supprimer cet agent ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      allowOutsideClick: false,
      confirmButtonColor: '#007E33' 
    }).then( (result) => {
      if (result.isConfirmed) {
        DestinataireService.delete(id).then(() => {
          getAgents();
          okSuccessDialog("Agent supprimé avec success !");
        });
      }
    });
  }

  const addAgent = () => {
    let newObject: AgentRequestDto = emptyAgentRequestDto;
    newObject.nom = formAgent.nom.value;
    newObject.prenom = formAgent.prenom.value;
    newObject.sexe = formAgent.sexe.value;
    newObject.signataire = formAgent.signataire.value;
    newObject.titreHonoSign = formAgent.titreHonorifique.value;
    newObject.actif = formAgent.actif.value;
    newObject.idService = formAgent.service.value;
    AgentService.add(newObject).then( data => {
      editDestinataire(data.mle, "Agent ajouté avec success !")
    })
  }

  const editAgent = () => {
    let newObject: AgentRequestDto = emptyAgentRequestDto;
    newObject.nom = formAgent.nom.value;
    newObject.prenom = formAgent.prenom.value;
    newObject.sexe = formAgent.sexe.value;
    newObject.signataire = formAgent.signataire.value;
    newObject.titreHonoSign = formAgent.titreHonorifique.value;
    newObject.actif = formAgent.actif.value;
    newObject.idService = formAgent.service.value;
    AgentService.edit(formAgent.mle.value, newObject).then( () => {
      editDestinataire(formAgent.mle.value, "Agent modifié avec success !")
    })
  }

  const editDestinataire = (id: number, message: string) => {
    let newObject: DestinataireRequestDto = emptyDestinataireRequestDto;
    newObject.ifumle = formAgent.ifumle.value;
    newObject.ftype = "A";
    newObject.contactTel = formAgent.telephone.value;
    newObject.contactEmail = formAgent.email.value;
    DestinataireService.edit(id, newObject).then( () => {
      getAgents()
      initFormAgent();
      Swal.fire({
        title: 'GesBud',
        text: message,
        icon: 'success',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
      });
    })
  }

  useEffect( () => {
    const results = agents.filter(item => {
      return ((item.ifumle || '').toString().toLowerCase().includes(formAgent.ifumle.value.toString().toLowerCase()))
       && ((item.nom || '').toString().toLowerCase().includes(formAgent.nom.value.toString().toLowerCase()))
       && ((item.prenom || '').toString().toLowerCase().includes(formAgent.prenom.value.toString().toLowerCase()))
       && ((item.contactTel || '').toString().toLowerCase().includes(formAgent.telephone.value.toString().toLowerCase()))
       && ((item.contactEmail || '').toString().toLowerCase().includes(formAgent.email.value.toString().toLowerCase()))
       && ((item.sexe || '').toString().toLowerCase().includes(formAgent.sexe.value.toString().toLowerCase()))
       && ((item.idService || '').toString().toLowerCase().includes(formAgent.service.value.toString().toLowerCase()))
       && ((item.signataire || '').toString().toLowerCase().includes(formAgent.signataire.value.toString().toLowerCase()))
       && ((item.titreHonoSign || '').toString().toLowerCase().includes(formAgent.titreHonorifique.value.toString().toLowerCase()))  
       && ((item.actif === formAgent.actif.value))  
     })
     setFilteredFilteredAgents(results);
  }, [formAgent]) 

  useEffect( () => {
    getAgents();
    getDirectionServices();
  }, [])

  const getAgents = () => {
    AgentsDirectionServiceSDestinatairesViewService.getAll().then(data => {
      setAgents(data) 
    })
  }

  useEffect( () => {
    setFilteredFilteredAgents(agents)
  }, [agents])

  const getDirectionServices = () => {
    DirectionServiceService.getAll().then( data => setDirectionServiceResponseDtos(data));
  }
  
  const handleCloseModalSelectionnerAgent = () => {
    setShowModalSelectionnerAgent(false);
  }

  const handleShowModalSelectionnerAgent = () => {
    setShowModalSelectionnerAgent(true);
  }
  ////////////////////////////////////////// GESTION SELECTIONNER AGENT

  return (
    <Container>
          <div className="mt-1 p-1">
            <h6 className="shadow-sm text-primary text-center rounded">PARAMETRES &gt; UTILISATEURS &gt; CREATION MISE A JOUR</h6>
            <Form onSubmit={(e) => handleSubmitFormAccesCode(e)}>
              <Card className="mb-3">
                <Card.Header className='p-1'>
                { libelleOperationAccesCode() }
                </Card.Header>
                <Card.Body className=''>
                  <Row>
                    <Col>
                      <Form.Group controlId="intituleCode" as={Row} className="mb-1">
                        <Col xs={4}><Form.Label className="label2">Groupe d'utilisateur :</Form.Label></Col>
                        <Col><Form.Control name='intituleCode' value={formAccesCode.intituleCode.value} size='sm' type="text" disabled /></Col>
                      </Form.Group>
                      <Form.Group controlId="" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Identité de l'utilisateur :</Form.Label></Col>
                          <Col><Button size='sm' variant="outline-primary" title="Cliquez pour selection l'identité" className='w-100' onClick={handleShowModalSelectionnerAgent}>Sélectionnez</Button></Col>
                      </Form.Group>
                      <Form.Group controlId="mle" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Identifiant :</Form.Label></Col>
                          <Col><Form.Control name='mle' value={formAccesCode.mle.value} size='sm' type="text" disabled /></Col>
                      </Form.Group>
                      <Form.Group controlId="nomPrenom" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Nom et prénom(s) :</Form.Label></Col>
                          <Col><Form.Control name='nomPrenom' value={formAccesCode.nom.value + ' ' + formAccesCode.prenom.value} size='sm' type="text" disabled /></Col>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="statu" as={Row} className="mb-1">
                        <Col xs={4}><Form.Label className="label2">Statut :</Form.Label></Col>
                        <Col>
                          <Form.Check inline type="radio" label="Actif" name="statu" value="ACTIF" id="actif" checked={formAccesCode.statu.value === "ACTIF"} className='label2' onChange={e => handleInputChangeFormAccesCode(e)}/>
                          <Form.Check inline type="radio" label="Inactif" name="statu" value="INACTIF" id="inactif" checked={formAccesCode.statu.value === "INACTIF"} className='label2' onChange={e => handleInputChangeFormAccesCode(e)}/>
                        </Col>
                      </Form.Group>
                      <Form.Group controlId="userName" as={Row} className="mb-1">
                          <Col xs={4}><Form.Label className="label2">Nom d'utilisateur :</Form.Label></Col>
                          <Col><Form.Control name='userName' value={formAccesCode.userName.value}  size='sm' type="text" disabled /></Col>
                      </Form.Group>
                      <Form.Group controlId="grpe" as={Row} className="mb-1">
                        <Col xs={4}><Form.Label className="label2">Niveau du code :</Form.Label></Col>
                        <Col>
                          <Form.Select name='grpe' value={formAccesCode.grpe.value} size="sm" style={{fontSize:"0.72em"}} onChange={e => handleInputChangeFormAccesCode(e)}>
                            <option value=''></option>
                            {
                              accesCodeNiveauCourante.grpes && accesCodeNiveauCourante.grpes.map( (item: any) => (
                                <option key={item.grpe} value={item.grpe}>{item.libelleGrpe}</option>
                              ))   
                            }
                          </Form.Select>
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>                  
                </Card.Body>
                <Card.Footer className='p-1'>
                  <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>{ libelleButtonSumbitAccesCode() }</Button>
                  <Button size='sm' variant="outline-success" title="Ajouter Nouveau" className='ms-1' style={{width: "100px"}} onClick={ () => handleAddAccesCode()}><BsPlusLg /></Button>
                </Card.Footer>
              </Card>
            </Form>  

            <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tableAccesCodeColumns}
                    data={filteredAgentAccesCodeAccesCodeNiveaus}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    responsive
                    striped
                    fixedHeaderScrollHeight='300px'
                    highlightOnHover
                    subHeader
                    subHeaderComponent={
                      <Form.Control size='sm' type="text" placeholder="Recherche un utilisateur" className='w-25' value={searchTermUserName} onChange={e => handleSearchAccesCodeInputChange(e)} />
                    }
                    />
                </Card.Body>
              </Card> 
          </div>

          {/* LIGNE BUDGETAIRE D'UN UTILISATEUR */}
          <Modal show={showModalLigneBudgetaire} onHide={handleCloseModalLigneBudgetaires} backdrop="static" keyboard={false} size="lg">
            <Modal.Header className='p-1'>
                <Modal.Title as="h6">Ligne(s) budgétaire(s) accessible(s) : <Badge bg="secondary">{ligneBudgetaireUtilisateurSelectionne.length}</Badge></Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2'>
              <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tableLigneBudgetaireGestionCouranteColumns}
                    data={ligneBudgetaireGestionCourantes}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    fixedHeaderScrollHeight='500px'
                    highlightOnHover
                    responsive
                    striped
                    selectableRows
                    selectableRowSelected={row => (
                      ligneBudgetaireUtilisateurSelectionne.some((item) => {
                        return item.codBud === row.codBud;
                      })
                    )}
                    onSelectedRowsChange={ (selected) => {
                      ligneBudgetaireAEnregistrer = selected.selectedRows;
                    }}
                     />
                </Card.Body>
              </Card>
            </Modal.Body>

            <Modal.Footer className='p-1'>
              <Button variant="outline-success" size='sm' onClick={handleModifierLigneBudgetaires}>Enregistrer</Button>
              <Button variant="outline-danger" size='sm' onClick={handleCloseModalLigneBudgetaires}>Fermer</Button>
            </Modal.Footer>
          </Modal>

          {/* RENITIALISER MOT DE PASSE D'UN UTILISATEUR */}
          <Modal show={showModalRenitialiserMotPasse} onHide={handleCloseModalRenitialiserMotPasse} backdrop="static" keyboard={false}>
            <Modal.Header className='p-1'>
                <Modal.Title as="h6">Renitialisation du mot de passe de l'utilisateur : {accesCodeSelectionnee.userName}</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2'>
              <Form.Group className="" controlId="motPasseCourant">
                <Form.Label className="label2">Mot de passe de connexion</Form.Label>
                <Form.Control name="motPasseCourant" size='sm' type="password" value={motPasseCourant} onChange={e => handleMotPasseCourantInputChange(e)} autoFocus />
              </Form.Group>
            </Modal.Body>

            <Modal.Footer className='p-1'>
              <Button variant="outline-success" size='sm' onClick={handleRenitialiserMotPasse}>Renitialiser</Button>
              <Button variant="outline-danger" size='sm' onClick={handleCloseModalRenitialiserMotPasse}>Fermer</Button>
            </Modal.Footer>
          </Modal>

          {/* GESTION AGENT */}
          <Modal show={showModalSelectionnerAgent} onHide={handleCloseModalSelectionnerAgent} backdrop="static" keyboard={false} size="xl">
            <Modal.Header className='p-1'>
                <Modal.Title as="h6">Liste des agents</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2'>
              <Form onSubmit={(e) => handleSubmitFormAgent(e)}>
                <Card className='mb-3'>
                  <Card.Header className='p-1'>
                    { libelleOperationAgent() }
                  </Card.Header>

                  <Card.Body className='p-1'>
                      <Row>
                        <Col>
                          <Form.Group controlId="ifumle" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Matricule :</Form.Label></Col>
                            <Col><Form.Control name='ifumle' size='sm' type="text" value={formAgent.ifumle.value} onChange={e => handleInputChangeFormAgent(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="nom" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Nom :</Form.Label></Col>
                            <Col><Form.Control name='nom' size='sm' type="text" value={formAgent.nom.value} onChange={e => handleInputChangeFormAgent(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="prenom" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Prénom :</Form.Label></Col>
                            <Col><Form.Control name='prenom' size='sm' type="text" value={formAgent.prenom.value} onChange={e => handleInputChangeFormAgent(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="telephone" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Téléphone :</Form.Label></Col>
                            <Col><Form.Control name='telephone' size='sm' type="text" value={formAgent.telephone.value} onChange={e => handleInputChangeFormAgent(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="email" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Email :</Form.Label></Col>
                            <Col><Form.Control name='email' size='sm' type="email" value={formAgent.email.value} onChange={e => handleInputChangeFormAgent(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="sexe" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Sexe :</Form.Label></Col>
                            <Col>
                              <Form.Select name='sexe' value={formAgent.sexe.value} size='sm' aria-label="Default select example" onChange={e => handleInputChangeFormAgent(e)}>
                                <option value=''></option>
                                <option value='M'>Masculin</option>
                                <option value='F'>Féminin</option>
                              </Form.Select>
                            </Col>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Check name='actif' type="checkbox" label="Toujours en service" className='label2' checked={formAgent.actif.value} onChange={(e: any) => handleCheckboxInputChangeFormAgent(e)} />
                          <Form.Group controlId="service">
                            <Form.Label className='label2'>Service :</Form.Label>
                            <Form.Select name='service' value={formAgent.service.value} size='sm' aria-label="Default select example" onChange={e => handleInputChangeFormAgent(e)}>
                              <option value=''></option>
                              {
                                directionServiceResponseDtos.map( ds => (
                                  <option key={ds.idService} value={ds.idService}>{ds.libelle}</option>
                                ))
                              }
                            </Form.Select>
                          </Form.Group>
                          <Form.Group controlId="signataire">
                            <Form.Label className='label2'>Fonction :</Form.Label>
                            <Form.Control name='signataire' size='sm' type="text" value={formAgent.signataire.value} onChange={e => handleInputChangeFormAgent(e)} />
                          </Form.Group>
                          <Form.Group controlId="titreHonorifique">
                            <Form.Label className='label2'>Titre honorifique :</Form.Label>
                            <Form.Control name='titreHonorifique' size='sm' type="text" value={formAgent.titreHonorifique.value} onChange={e => handleInputChangeFormAgent(e)} />
                          </Form.Group>
                        </Col>
                      </Row>
                  </Card.Body>

                  <Card.Footer className='p-1'>
                    <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>{ libelleButtonSumbitAgent() }</Button>
                    <Button size='sm' variant="outline-success" title="Ajouter Nouveau" className='ms-1' style={{width: "100px"}} onClick={ () => handleAddAgent()}><BsPlusLg /></Button>
                  </Card.Footer>
                </Card>
              </Form>

              <Card>
                <Card.Body className='p-1'>
                <div style={{overflowX:'auto', width: '100%'}}>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tableAgentColumns}
                    data={filteredAgents}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    fixedHeaderScrollHeight='200px'
                    highlightOnHover
                    responsive
                    striped
                    onRowClicked={ (row, e) => {
                      formAccesCode.mle.value = row.mle;
                      formAccesCode.nom.value = row.nom;
                      formAccesCode.prenom.value = row.prenom;
                      handleCloseModalSelectionnerAgent();
                    }}/>
                    </div>
                </Card.Body>
              </Card>

            </Modal.Body>

            <Modal.Footer className='p-1'>
              <Button variant="outline-danger" size='sm' onClick={handleCloseModalSelectionnerAgent}>Fermer</Button>
            </Modal.Footer>
          </Modal>
      </Container>
  );
};

export default CreationMajUtilisateurForm;
