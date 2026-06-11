import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, Modal, Row, Tab, Tabs } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import Swal from 'sweetalert2';
import { okSuccessDialog } from '../../helpers/dialogs';
import { BsPencilSquare, BsPlusLg, BsTrash } from 'react-icons/bs';
import { emptyEnteteStructureRequestDto, EnteteStructureRequestDto } from '../models/entete-structure';
import EnteteStructureService from '../services/entete-structure-service';
import { AgentRequestDto, AgentResponseDto, emptyAgentRequestDto } from '../models/agent';
import { DestinataireRequestDto, DestinataireResponseDto, emptyDestinataireRequestDto } from '../models/destinataire';
import { DirectionServiceResponseDto } from '../models/direction-service';
import DestinataireService from '../services/destinataire-service';
import AgentService from '../services/agent-service';
import DirectionServiceService from '../services/direction-service-service';
import DataTable from 'react-data-table-component';
import { costumeStyles } from '../../helpers/costume-styles';
import EnteteService from '../services/entete-service';
import { ConnectedUser } from '../helpers/session-storage';
import { emptyEnteteRequestDto, EnteteRequestDto } from '../models/entete';
import AccesCodeService from '../services/accesCodeService';

type FormEs = {
  oldAbrevEpe: Field,
  abrevEpe: Field,
	section: Field,
	epe: Field,
	lieu: Field,
	logo: Field,
	signataireDg: Field,
	nomSignataireDg: Field,
	titreHonorifiqueDg: Field,
	signataireDaf: Field,
	nomSignataireDaf: Field,
	titreHonorifiqueDaf: Field,
	signataireCf: Field,
	nomSignataireCf: Field,
	titreHonorifiqueCf: Field,
	signataireAc: Field,
	nomSignataireAc: Field,
	titreHonorifiqueAc: Field,
	cfresident: Field,
	signatPenal: Field,
	adresse: Field,
	telephone: Field,
	fax: Field,
	email: Field,
	visa: Field,
	articleStruct: Field,
	nomPays: Field,
	devisePays: Field,
	mleCnss: Field,
	mleCarfo: Field,
	typeSupport: Field,
	avecReception: Field,
	quitFiligrane: Field,
	tauxTva: Field,
	typeAmmortDefaut: Field,
	gbc: Field,
	gim: Field,
	grh: Field,
	sectionNum: Field,
	filgraneL276cmH185cm: Field,
	signataireDrh: Field,
	nomSignataireDrh: Field,
	titreHonorifiqueDrh: Field,
	idCircuitGrh: Field,
	drhsigneEtat: Field,
	libAnnee: Field,
	mandNumApresVisaCf: Field
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
  titreHonorifique: Field
}

type FormE = {
  codUser: Field,
  niveau1: Field,
  niveau2: Field,
  niveau3: Field,
  niveau4: Field,
  abv1: Field,
  abv2: Field,
  abv3: Field,
  abv4: Field,
  complementNum: Field,
  abrevEpe: Field
}

const StructureMajLEnteteForm: FunctionComponent = () => {

  const [ess, setEss] = useState<any[]>([]);
  const [code, setCode] = useState<string>("");

  const [formEs, setFormEs] = useState<FormEs>({
    oldAbrevEpe: { value: '' },
    abrevEpe: { value: '' },
    section: { value: '' },
    epe: { value: '' },
    lieu: { value: '' },
    logo: { value: '' },
    signataireDg: { value: '' },
    nomSignataireDg: { value: '' },
    titreHonorifiqueDg: { value: '' },
    signataireDaf: { value: '' },
    nomSignataireDaf: { value: '' },
    titreHonorifiqueDaf: { value: '' },
    signataireCf: { value: '' },
    nomSignataireCf: { value: '' },
    titreHonorifiqueCf: { value: '' },
    signataireAc: { value: '' },
    nomSignataireAc: { value: '' },
    titreHonorifiqueAc: { value: '' },
    cfresident: { value: '' },
    signatPenal: { value: '' },
    adresse: { value: '' },
    telephone: { value: '' },
    fax: { value: '' },
    email: { value: '' },
    visa: { value: '' },
    articleStruct: { value: '' },
    nomPays: { value: '' },
    devisePays: { value: '' },
    mleCnss: { value: '' },
    mleCarfo: { value: '' },
    typeSupport: { value: '' },
    avecReception: { value: '' },
    quitFiligrane: { value: '' },
    tauxTva: { value: '' },
    typeAmmortDefaut: { value: '' },
    gbc: { value: '' },
    gim: { value: '' },
    grh: { value: '' },
    sectionNum: { value: '' },
    filgraneL276cmH185cm: { value: '' },
    signataireDrh: { value: '' },
    nomSignataireDrh: { value: '' },
    titreHonorifiqueDrh: { value: '' },
    idCircuitGrh: { value: '' },
    drhsigneEtat: { value: '' },
    libAnnee: { value: '' },
    mandNumApresVisaCf: { value: '' }
  })

  const handleInputChangeFormEs = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormEs({ ...formEs, ...newField}); 
  }

  const handleLogoInputChange = (e: any): void => {
    const file = e.target.files[0];
    arrayBufferToBase64(file).then(res => {
      const fieldName: string = e.target.name;
      const fieldValue: string = res;
      const newField: Field = { [fieldName]: { value: fieldValue } };
      setFormEs({ ...formEs, ...newField}); 
    }) 
  }


  function readFile(file: any) {
    return new Promise((resolve, reject) => {
      // Create file reader
      let reader = new FileReader()
      // Register event listeners
      reader.addEventListener("loadend", e => resolve(e.target && e.target.result))
      reader.addEventListener("error", reject)
      // Read file
      reader.readAsArrayBuffer(file)
    })
  }

  async function arrayBufferToBase64(file: any) {
    let binary = '';
    let bytes = new Uint8Array(await readFile(file) as ArrayBufferLike);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return btoa( binary );
  }

  

  const validateFormEs = () => {
    let newForm: FormEs = formEs;

    // abrevEpe
    if(formEs.abrevEpe.value === "") {
      const errorMsg: string = 'Abreviation obligatoire !';
      const newField: Field = { value: formEs.abrevEpe.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ abrevEpe: newField } };
    } else {
      const newField: Field = { value: formEs.abrevEpe.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ abrevEpe: newField } };
    }

    // epe
    if(formEs.epe.value === "") {
      const errorMsg: string = 'Nom structure obligatoire !';
      const newField: Field = { value: formEs.epe.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ epe: newField } };
    } else {
      const newField: Field = { value: formEs.epe.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ epe: newField } };
    }

    setFormEs(newForm);
    return newForm.abrevEpe.isValid && newForm.epe.isValid;
  }

  const handleSubmitFormEs = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormEs()) {
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

    editEs(); 
  }

  const editEs = () => {
    let newEs: EnteteStructureRequestDto = emptyEnteteStructureRequestDto;
    newEs.abrevEpe = formEs.abrevEpe.value;
    newEs.section = formEs.section.value;
    newEs.epe = formEs.epe.value;
    newEs.lieu = formEs.lieu.value;
    newEs.logo = formEs.logo.value;
    newEs.signataireDg = formEs.signataireDg.value;
    newEs.nomSignataireDg = formEs.nomSignataireDg.value;
    newEs.titreHonorifiqueDg = formEs.titreHonorifiqueDg.value;
    newEs.signataireDaf = formEs.signataireDaf.value;
    newEs.nomSignataireDaf = formEs.nomSignataireDaf.value;
    newEs.titreHonorifiqueDaf = formEs.titreHonorifiqueDaf.value;
    newEs.signataireCf = formEs.signataireCf.value;
    newEs.nomSignataireCf = formEs.nomSignataireCf.value;
    newEs.titreHonorifiqueCf = formEs.titreHonorifiqueCf.value;
    newEs.signataireAc = formEs.signataireAc.value;
    newEs.nomSignataireAc = formEs.nomSignataireAc.value;
    newEs.titreHonorifiqueAc = formEs.titreHonorifiqueAc.value;
    newEs.cfresident = formEs.cfresident.value;
    newEs.signatPenal = formEs.signatPenal.value;
    newEs.adresse = formEs.adresse.value;
    newEs.telephone = formEs.telephone.value;
    newEs.fax = formEs.fax.value;
    newEs.email = formEs.email.value;
    newEs.visa = formEs.visa.value;
    newEs.articleStruct = formEs.articleStruct.value;
    newEs.nomPays = formEs.nomPays.value;
    newEs.devisePays = formEs.devisePays.value;
    newEs.mleCnss = formEs.mleCnss.value;
    newEs.mleCarfo = formEs.mleCarfo.value;
    newEs.typeSupport = formEs.typeSupport.value;
    newEs.avecReception = formEs.avecReception.value;
    newEs.quitFiligrane = formEs.quitFiligrane.value;
    newEs.tauxTva = formEs.tauxTva.value;
    newEs.typeAmmortDefaut = formEs.typeAmmortDefaut.value;
    newEs.gbc = formEs.gbc.value;
    newEs.gim = formEs.gim.value;
    newEs.grh = formEs.grh.value;
    newEs.sectionNum = formEs.sectionNum.value;
    newEs.filgraneL276cmH185cm = formEs.filgraneL276cmH185cm.value;
    newEs.signataireDrh = formEs.signataireDrh.value;
    newEs.nomSignataireDrh = formEs.nomSignataireDrh.value;
    newEs.titreHonorifiqueDrh = formEs.titreHonorifiqueDrh.value;
    newEs.idCircuitGrh = formEs.idCircuitGrh.value;
    newEs.drhsigneEtat = formEs.drhsigneEtat.value;
    newEs.libAnnee = formEs.libAnnee.value;
    newEs.mandNumApresVisaCf = formEs.mandNumApresVisaCf.value;
    
    EnteteStructureService.edit(formEs.abrevEpe.value, formEs.oldAbrevEpe.value, newEs).then(data => {
      getEss()
      okSuccessDialog("Entete structure modifiée avec succès !");
    })
  }

  useEffect(() => {
    getEss();
  }, [])

  const getEss = () => {
    EnteteStructureService.getAll().then(data => {
      setEss(data)
      let es = data[0]
      setFormEs({
        oldAbrevEpe: { value: es.abrevEpe, isValid: true },
        abrevEpe: { value: es.abrevEpe, isValid: true },
        section: { value: es.section, isValid: true },
        epe: { value: es.epe, isValid: true },
        lieu: { value: es.lieu, isValid: true },
        logo: { value: es.logo, isValid: true },
        signataireDg: { value: es.signataireDg, isValid: true },
        nomSignataireDg: { value: es.nomSignataireDg, isValid: true },
        titreHonorifiqueDg: { value: es.titreHonorifiqueDg, isValid: true },
        signataireDaf: { value: es.signataireDaf, isValid: true },
        nomSignataireDaf: { value: es.nomSignataireDaf, isValid: true },
        titreHonorifiqueDaf: { value: es.titreHonorifiqueDaf, isValid: true },
        signataireCf: { value: es.signataireCf, isValid: true },
        nomSignataireCf: { value: es.nomSignataireCf, isValid: true },
        titreHonorifiqueCf: { value: es.titreHonorifiqueCf, isValid: true },
        signataireAc: { value: es.signataireAc, isValid: true },
        nomSignataireAc: { value: es.nomSignataireAc, isValid: true },
        titreHonorifiqueAc: { value: es.titreHonorifiqueAc, isValid: true },
        cfresident: { value: es.cfresident, isValid: true },
        signatPenal: { value: es.signatPenal, isValid: true },
        adresse: { value: es.adresse, isValid: true },
        telephone: { value: es.telephone, isValid: true },
        fax: { value: es.fax, isValid: true },
        email: { value: es.email, isValid: true },
        visa: { value: es.visa, isValid: true },
        articleStruct: { value: es.articleStruct, isValid: true },
        nomPays: { value: es.nomPays, isValid: true },
        devisePays: { value: es.devisePays, isValid: true },
        mleCnss: { value: es.mleCnss, isValid: true },
        mleCarfo: { value: es.mleCarfo, isValid: true },
        typeSupport: { value: es.typeSupport, isValid: true },
        avecReception: { value: es.avecReception, isValid: true },
        quitFiligrane: { value: es.quitFiligrane, isValid: true },
        tauxTva: { value: es.tauxTva, isValid: true },
        typeAmmortDefaut: { value: es.typeAmmortDefaut, isValid: true },
        gbc: { value: es.gbc, isValid: true },
        gim: { value: es.gim, isValid: true },
        grh: { value: es.grh, isValid: true },
        sectionNum: { value: es.sectionNum, isValid: true },
        filgraneL276cmH185cm: { value: es.filgraneL276cmH185cm, isValid: true },
        signataireDrh: { value: es.signataireDrh, isValid: true },
        nomSignataireDrh: { value: es.nomSignataireDrh, isValid: true },
        titreHonorifiqueDrh: { value: es.titreHonorifiqueDrh, isValid: true },
        idCircuitGrh: { value: es.idCircuitGrh, isValid: true },
        drhsigneEtat: { value: es.drhsigneEtat, isValid: true },
        libAnnee: { value: es.libAnnee, isValid: true },
        mandNumApresVisaCf: { value: es.mandNumApresVisaCf, isValid: true }
      })
      
    })
  }

  ////////////////////////////////////////// Gestion des agents
  const [showModal, setShowModal] = useState(false);
  const [agents, setAgents] = useState<AgentResponseDto[]>([]);
  const [agentRequestDto] = useState<AgentRequestDto>(emptyAgentRequestDto);
  const [destinataireResponseDtos, setDestinataireResponseDtos] = useState<DestinataireResponseDto[]>([])
  const [destinataireRequestDto] = useState<DestinataireRequestDto>(emptyDestinataireRequestDto)
  const [agentDestinataireServices, setAgentDestinataireServices] = useState<any[]>([]);
  const [directionServiceResponseDtos, setDirectionServiceResponseDtos] = useState<DirectionServiceResponseDto[]>([]);
  const [operationAgent, setOperationAgent] = useState<string>("add");
  const [term, setTerm] = useState<string>('');
  const [filteredAgentDestinataireServices, setFilteredAgentDestinataireServices] = useState<any[]>([]);


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
    titreHonorifique: { value: '' }
  })

  const handleInputChangeFormAgent = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };

    setFormAgent({ ...formAgent, ...newField});
  }

  const validateFormAgent = () => {
    let newForm: FormAgent = formAgent;

    // Matricule
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
    
    // Formulaire valide : on effectue l'opération correspondante 
    agentRequestDto.nom = formAgent.nom.value;
    agentRequestDto.prenom = formAgent.prenom.value;
    agentRequestDto.sexe = formAgent.sexe.value;
    agentRequestDto.signataire = formAgent.signataire.value;
    agentRequestDto.titreHonoSign = formAgent.titreHonorifique.value;
    agentRequestDto.actif = true;
    agentRequestDto.idService = formAgent.service.value;

    destinataireRequestDto.ifumle = formAgent.ifumle.value;
    destinataireRequestDto.ftype = "A";
    destinataireRequestDto.contactTel = formAgent.telephone.value;
    destinataireRequestDto.contactEmail = formAgent.email.value;

    if (operationAgent === 'add') addAgent();
    if (operationAgent === 'edit') editAgent(); 
  }

  const initFormAgent = () => {
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
      titreHonorifique: { value: '' }
    })
  }

  const handleAddAgent = () => {
    setOperationAgent("add")
    initFormAgent();
  }

  const handleEditAgent = (row: any) => {
    setOperationAgent("edit")
    DestinataireService.get(row.mle)
    .then( data => {
      setFormAgent({
        ifumle: { value: data.ifumle, isValid: true },
        mle: { value: row.mle, isValid: true },
        nom: { value: row.nom, isValid: true },
        prenom: { value: row.prenom, isValid: true },
        telephone: { value: data.contactTel, isValid: true },
        email: { value: data.contactEmail, isValid: true },
        sexe: { value: row.sexe, isValid: true },
        service: { value: row.idService, isValid: true },
        signataire: { value: row.signataire, isValid: true },
        titreHonorifique: { value: row.titreHonoSign, isValid: true }
      })
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
        DestinataireService.delete(id)
        .then(() => {
          getDestinataires();
          getAgents();
          Swal.fire({
            title: 'Info',
            text: 'Agent supprimé avec success !',
            icon: 'success',
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            confirmButtonColor: '#007E33' 
          });
        });
      }
    });
  }

  const libelleOperationAgent = () => {
    if (operationAgent === 'add') return "Ajouter agent"
    if (operationAgent === 'edit') return "Modifier agent"
  }

  const libelleButtonSumbitAgent = () => {
    if (operationAgent === 'add') return "Enregistrer"
    if (operationAgent === 'edit') return "Enregistrer"
  }

  const tableAgentColumns = [
    {
      name: "Matricule",
      selector: (row: any) => row.ifumle,
      sortable: true
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
      selector: (row: any) => row.libelleService,
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

  useEffect( () => {
    getAgents();
    getDestinataires();
    getDirectionServices();
  }, [])

  useEffect( () => {
    agentDestinataireServices.forEach(ags => {
      const destinataire = destinataireResponseDtos.find(de => de.idDest === ags.mle);
      const directionService = directionServiceResponseDtos.find(di => di.idService === ags.idService);
      ags.idDest = destinataire?.idDest;
      ags.ifumle = destinataire?.ifumle;
      ags.ftype = destinataire?.ftype;
      ags.contactTel = destinataire?.contactTel;
      ags.contactEmail = destinataire?.contactEmail;
      ags.nomDestinataire = destinataire?.nom;
      ags.mleDestinataire = destinataire?.mle;
      ags.libelleService = directionService?.libelle;
    })
    setFilteredAgentDestinataireServices(agentDestinataireServices);
  }, [agents, destinataireResponseDtos, directionServiceResponseDtos])

  const getAgents = () => {
    AgentService.getAll().then( data => {
      setAgents(data)
      setAgentDestinataireServices(data)
    });
  }

  const getDestinataires = () => {
    DestinataireService.getAll().then( data => setDestinataireResponseDtos(data));
  }

  const getDirectionServices = () => {
    DirectionServiceService.getAll().then( data => setDirectionServiceResponseDtos(data));
  }

  const addAgent = () => {
    AgentService.add(agentRequestDto)
    .then( data => {
      editDestinataire(data.mle, "Agent ajouter avec success !")
    })
  }

  const editAgent = () => {
    AgentService.edit(formAgent.mle.value, agentRequestDto)
    .then( () => {
      editDestinataire(formAgent.mle.value, "Agent modifié avec success !")
    })
  }

  const editDestinataire = (id: number, message: string) => {
    DestinataireService.edit(id, destinataireRequestDto)
    .then( () => {
      getDestinataires()
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

  const handleSearchAgentInputChange = (e: any): void => {
    const term = e.target.value.toLowerCase();
    setTerm(term);

    if(!term) {
      setFilteredAgentDestinataireServices(agentDestinataireServices);
    } else {
      const results = agentDestinataireServices.filter(item => {
        return Object.keys(item).some(key => {
          return item[key] && item[key].toString().toLowerCase().includes(term);
        })
      })
      setFilteredAgentDestinataireServices(results);
    }
  }
  
  const handleCloseModal = () => {
    setShowModal(false);
  }

  const handleShowModal = (code: string) => {
    setCode(code);
    setShowModal(true);
  }
  ////////////////////////////////////////// Gestion des agents

  ////////////////////////////////////////// Gestion des entetes
  const connectedUser = ConnectedUser();

  const [formE, setFormE] = useState<FormE>({
    codUser: { value: '' },
    niveau1: { value: '' },
    niveau2: { value: '' },
    niveau3: { value: '' },
    niveau4: { value: '' },
    abv1: { value: '' },
    abv2: { value: '' },
    abv3: { value: '' },
    abv4: { value: '' },
    complementNum: { value: '' },
    abrevEpe: { value: '' }
  })

  const handleInputChangeFormE = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormE({ ...formE, ...newField}); 
  }

  const handleSubmitFormE = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editE(); 
  }

  const editE = () => {
    let newE: EnteteRequestDto = emptyEnteteRequestDto;
    newE.niveau1 = formE.niveau1.value;
    newE.niveau2 = formE.niveau2.value;
    newE.niveau3 = formE.niveau3.value;
    newE.niveau4 = formE.niveau4.value;
    newE.abv1 = formE.abv1.value;
    newE.abv2 = formE.abv2.value;
    newE.abv3 = formE.abv3.value;
    newE.abv4 = formE.abv4.value;
    newE.complementNum = formE.complementNum.value;
    newE.abrevEpe = formE.abrevEpe.value;
    
    EnteteService.edit(formE.codUser.value, newE).then(data => {
      getE(data.codUser)
      okSuccessDialog("Timbre modifié avec succès !");
    })
  }

  useEffect(() => {
    AccesCodeService.get(connectedUser)
    .then( data => getE(data.code))
    .catch( error => {
      console.log(error);
    });
  }, [])

  const getE = (codUser: string) => {
    EnteteService.get(codUser).then(data => {
      setFormE({
        codUser: { value: data.codUser, isValid: true },
        niveau1: { value: data.niveau1, isValid: true },
        niveau2: { value: data.niveau2, isValid: true },
        niveau3: { value: data.niveau3, isValid: true },
        niveau4: { value: data.niveau4, isValid: true },
        abv1: { value: data.abv1, isValid: true },
        abv2: { value: data.abv2, isValid: true },
        abv3: { value: data.abv3, isValid: true },
        abv4: { value: data.abv4, isValid: true },
        complementNum: { value: data.complementNum, isValid: true },
        abrevEpe: { value: data.abrevEpe, isValid: true }
      }) 
    })
  }

  ////////////////////////////////////////// Gestion des entetes

  return (
    <Container>
          <div className="mt-1 p-1">
            <h6 className="shadow-sm text-primary text-center rounded">PARAMETRES &gt; STRUCTURE &gt; METTRE A JOUR L'ENTETE</h6>
            <Tabs id="uncontrolled-tab-example" defaultActiveKey="structure" className="mb-1">
              <Tab eventKey="structure" title="Structure">
                <Form onSubmit={(e) => handleSubmitFormEs(e)}>
                  <Card className="mb-3">
                    <Card.Header className='p-1'>
                    { "Modifier entete structure" }
                    </Card.Header>
                    <Card.Body className=''>
                      <Row>
                        <Col>
                          <Form.Group controlId="epe" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Nom structure :</Form.Label></Col>
                            <Col><Form.Control name='epe' value={formEs.epe.value} onChange={e => handleInputChangeFormEs(e)} size='sm' type="text" /></Col>
                          </Form.Group>
                          <Form.Group controlId="adresse" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Boite postale :</Form.Label></Col>
                            <Col><Form.Control name='adresse' value={formEs.adresse.value} onChange={e => handleInputChangeFormEs(e)} size='sm' type="text" /></Col>
                          </Form.Group>
                          <Form.Group controlId="telephone" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Téléphone :</Form.Label></Col>
                            <Col><Form.Control name='telephone' value={formEs.telephone.value} onChange={e => handleInputChangeFormEs(e)} size='sm' type="text" /></Col>
                          </Form.Group>
                          <Form.Group controlId="email" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Email :</Form.Label></Col>
                            <Col><Form.Control name='email' value={formEs.email.value} onChange={e => handleInputChangeFormEs(e)} size='sm' type="text" /></Col>
                          </Form.Group>
                          <Form.Group controlId="nomPays" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Nom pays :</Form.Label></Col>
                            <Col><Form.Control name='nomPays' value={formEs.nomPays.value} onChange={e => handleInputChangeFormEs(e)} size='sm' type="text" /></Col>
                          </Form.Group>
                          <Form.Group controlId="devisePays" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Devise pays :</Form.Label></Col>
                            <Col><Form.Control name='devisePays' value={formEs.devisePays.value} onChange={e => handleInputChangeFormEs(e)} size='sm' type="text" /></Col>
                          </Form.Group>
                          <Form.Group controlId="mleCnss" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Mle CNSS :</Form.Label></Col>
                            <Col><Form.Control name='mleCnss' value={formEs.mleCnss.value} onChange={e => handleInputChangeFormEs(e)} size='sm' type="text" /></Col>
                          </Form.Group>
                          <Form.Group controlId="mleCarfo" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Mle CARFO :</Form.Label></Col>
                            <Col><Form.Control name='mleCarfo' value={formEs.mleCarfo.value} onChange={e => handleInputChangeFormEs(e)} size='sm' type="text" /></Col>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="abrevEpe" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Abréviation :</Form.Label></Col>
                            <Col><Form.Control name='abrevEpe' value={formEs.abrevEpe.value} size='sm' type="text" onChange={e => handleInputChangeFormEs(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="fax" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">IFU :</Form.Label></Col>
                            <Col><Form.Control name='fax' value={formEs.fax.value} size='sm' type="text" onChange={e => handleInputChangeFormEs(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="lieu" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Lieu :</Form.Label></Col>
                            <Col><Form.Control name='lieu' value={formEs.lieu.value} size='sm' type="text" onChange={e => handleInputChangeFormEs(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="section" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Auto.contrat :</Form.Label></Col>
                            <Col><Form.Control name='section' value={formEs.section.value} size='sm' type="text" onChange={e => handleInputChangeFormEs(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="visa" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Libellé visa :</Form.Label></Col>
                            <Col><Form.Control name='visa' value={formEs.visa.value} size='sm' type="text" onChange={e => handleInputChangeFormEs(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="articleStruct" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Article :</Form.Label></Col>
                            <Col><Form.Control name='articleStruct' value={formEs.articleStruct.value} size='sm' type="text" onChange={e => handleInputChangeFormEs(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="tauxTva" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Taux TVA :</Form.Label></Col>
                            <Col><Form.Control name='tauxTva' value={formEs.tauxTva.value} size='sm' type="number" onChange={e => handleInputChangeFormEs(e)} /></Col>
                          </Form.Group>
                        </Col>
                        <Col xs={2}>
                          <Form.Group controlId="logo" className="mb-1">
                            <Form.Label className="label2">Logo</Form.Label>
                            <Form.Control name='logo' size='sm' type="file" title='Cliquez pour sélectionner un logo' className="mb-1" onChange={e => handleLogoInputChange(e)} />
                            <img src={ "data:image/*;base64," + formEs.logo.value } alt=""  height={100} className="w-100"/>
                          </Form.Group>
                          <Form.Group controlId="quitFiligrane">
                            <Form.Label className="label2">Filigrane quit</Form.Label>
                            <Form.Control name='quitFiligrane' size='sm' type="file" title='Cliquez pour sélectionner le logo à utiliser comme filigrane' className="mb-1" onChange={e => handleLogoInputChange(e)} />
                            <img src={ "data:image/*;base64," + formEs.quitFiligrane.value } alt=""  height={100} className="w-100"/>
                          </Form.Group>
                        </Col>
                      </Row> 
                      <Row>
                        <Col>
                          <Form.Group controlId="" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2"><b>Ordonateur :</b></Form.Label></Col>
                            <Col><Button size='sm' variant="outline-primary" title="Cliquez pour selection l'ordonateur" className='w-100' onClick={() => handleShowModal("OR")}>Sélectionnez</Button></Col>
                          </Form.Group>
                          <Form.Group controlId="signataireDg" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Qualité :</Form.Label></Col>
                            <Col><Form.Control name='signataireDg' value={formEs.signataireDg.value} size='sm' type="text" onChange={e => handleInputChangeFormEs(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="nomSignataireDg" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Prénom(s) et nom :</Form.Label></Col>
                            <Col><Form.Control name='nomSignataireDg' value={formEs.nomSignataireDg.value} size='sm' type="text" onChange={e => handleInputChangeFormEs(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="titreHonorifiqueDg" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Titre honorifique :</Form.Label></Col>
                            <Col><Form.Control name='titreHonorifiqueDg' value={formEs.titreHonorifiqueDg.value} size='sm' type="text" onChange={e => handleInputChangeFormEs(e)} /></Col>
                          </Form.Group>

                          <Form.Group controlId="" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2"><b>Agent comptable :</b></Form.Label></Col>
                            <Col><Button size='sm' variant="outline-primary" title="Cliquez pour selection l'agent comptable" className='w-100' onClick={() => handleShowModal("AC")}>Sélectionnez</Button></Col>
                          </Form.Group>
                          <Form.Group controlId="signataireAc" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Qualité :</Form.Label></Col>
                            <Col><Form.Control name='signataireAc' value={formEs.signataireAc.value} size='sm' type="text" onChange={e => handleInputChangeFormEs(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="nomSignataireAc" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Prénom(s) et nom :</Form.Label></Col>
                            <Col><Form.Control name='nomSignataireAc' value={formEs.nomSignataireAc.value} size='sm' type="text" onChange={e => handleInputChangeFormEs(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="titreHonorifiqueAc" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Titre honorifique :</Form.Label></Col>
                            <Col><Form.Control name='titreHonorifiqueAc' value={formEs.titreHonorifiqueAc.value} size='sm' type="text" onChange={e => handleInputChangeFormEs(e)} /></Col>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2"><b>Admin de crédits :</b></Form.Label></Col>
                            <Col><Button size='sm' variant="outline-primary" title="Cliquez pour selection l'administrateur de crédits" className='w-100' onClick={() => handleShowModal("AD")}>Sélectionnez</Button></Col>
                          </Form.Group>
                          <Form.Group controlId="signataireDaf" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Qualité :</Form.Label></Col>
                            <Col><Form.Control name='signataireDaf' value={formEs.signataireDaf.value} size='sm' type="text" onChange={e => handleInputChangeFormEs(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="nomSignataireDaf" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Prénom(s) et nom :</Form.Label></Col>
                            <Col><Form.Control name='nomSignataireDaf' value={formEs.nomSignataireDaf.value} size='sm' type="text" onChange={e => handleInputChangeFormEs(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="titreHonorifiqueDaf" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Titre honorifique :</Form.Label></Col>
                            <Col><Form.Control name='titreHonorifiqueDaf' value={formEs.titreHonorifiqueDaf.value} size='sm' type="text" onChange={e => handleInputChangeFormEs(e)} /></Col>
                          </Form.Group>

                          <Form.Group controlId="" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2"><b>Contrl Financier :</b></Form.Label></Col>
                            <Col><Button size='sm' variant="outline-primary" title="Cliquez pour selection le controleur financier" className='w-100' onClick={() => handleShowModal("CF")}>Sélectionnez</Button></Col>
                          </Form.Group>
                          <Form.Group controlId="signataireCf" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Qualité :</Form.Label></Col>
                            <Col><Form.Control name='signataireCf' value={formEs.signataireCf.value} size='sm' type="text" onChange={e => handleInputChangeFormEs(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="nomSignataireCf" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Prénom(s) et nom :</Form.Label></Col>
                            <Col><Form.Control name='nomSignataireCf' value={formEs.nomSignataireCf.value} size='sm' type="text" onChange={e => handleInputChangeFormEs(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="titreHonorifiqueCf" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Titre honorifique :</Form.Label></Col>
                            <Col><Form.Control name='titreHonorifiqueCf' value={formEs.titreHonorifiqueCf.value} size='sm' type="text" onChange={e => handleInputChangeFormEs(e)} /></Col>
                          </Form.Group>
                        </Col>
                        <Col xs={2}>
                          <Form.Group controlId="filgraneL276cmH185cm" className="mt-5">
                            <Form.Label className="label2">Filigrane pour bulletin</Form.Label>
                            <Form.Control name='filgraneL276cmH185cm' size='sm' type="file" title='Cliquez pour sélectionner le filigrane à utiliser pour les bulletins' className="mb-1" onChange={e => handleLogoInputChange(e)} />
                            <img src={ "data:image/*;base64," + formEs.filgraneL276cmH185cm.value } alt=""  height={100} className="w-100"/>
                          </Form.Group>
                        </Col>
                      </Row>                 
                    </Card.Body>
                    <Card.Footer className='p-1'>
                      <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>{ "Enregistrer" }</Button>
                    </Card.Footer>
                  </Card>
                </Form>
              </Tab>
              <Tab eventKey="timbre" title="Timbre">
                <Form onSubmit={(e) => handleSubmitFormE(e)}>
                  <Card className="mb-3">
                    <Card.Header className='p-1'>
                    { "Modifier timbre" }
                    </Card.Header>
                    <Card.Body className=''>
                      <Row>
                        <Col xs={10}>
                          <Form.Group controlId="niveau1" as={Row} className="mb-1">
                            <Col xs={2}><Form.Label className="label2">Niveau 1 :</Form.Label></Col>
                            <Col><Form.Control name='niveau1' value={formE.niveau1.value} onChange={e => handleInputChangeFormE(e)} size='sm' type="text" /></Col>
                          </Form.Group>
                          <Form.Group controlId="niveau2" as={Row} className="mb-1">
                            <Col xs={2}><Form.Label className="label2">Niveau 2 :</Form.Label></Col>
                            <Col><Form.Control name='niveau2' value={formE.niveau2.value} onChange={e => handleInputChangeFormE(e)} size='sm' type="text" /></Col>
                          </Form.Group>
                          <Form.Group controlId="niveau3" as={Row} className="mb-1">
                            <Col xs={2}><Form.Label className="label2">Niveau 3 :</Form.Label></Col>
                            <Col><Form.Control name='niveau3' value={formE.niveau3.value} onChange={e => handleInputChangeFormE(e)} size='sm' type="text" /></Col>
                          </Form.Group>
                          <Form.Group controlId="niveau4" as={Row} className="mb-1">
                            <Col xs={2}><Form.Label className="label2">Niveau 4 :</Form.Label></Col>
                            <Col><Form.Control name='niveau4' value={formE.niveau4.value} onChange={e => handleInputChangeFormE(e)} size='sm' type="text" /></Col>
                          </Form.Group>
                        </Col>
                        <Col xs={2}>
                          <Form.Group controlId="abv1" as={Row} className="mb-1">
                            <Col><Form.Control name='abv1' value={formE.abv1.value} onChange={e => handleInputChangeFormE(e)} size='sm' type="text" /></Col>
                          </Form.Group>
                          <Form.Group controlId="abv2" as={Row} className="mb-1">
                            <Col><Form.Control name='abv2' value={formE.abv2.value} onChange={e => handleInputChangeFormE(e)} size='sm' type="text" /></Col>
                          </Form.Group>
                          <Form.Group controlId="abv3" as={Row} className="mb-1">
                            <Col><Form.Control name='abv3' value={formE.abv3.value} onChange={e => handleInputChangeFormE(e)} size='sm' type="text" /></Col>
                          </Form.Group>
                          <Form.Group controlId="abv4" as={Row} className="mb-1">
                            <Col><Form.Control name='abv4' value={formE.abv4.value} onChange={e => handleInputChangeFormE(e)} size='sm' type="text" /></Col>
                          </Form.Group>
                        </Col>
                      </Row>                 
                    </Card.Body>
                    <Card.Footer className='p-1'>
                      <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>{ "Enregistrer" }</Button>
                    </Card.Footer>
                  </Card>
                </Form>
              </Tab>
            </Tabs>  
          </div>

          {/* GESTION AGENT */}
          <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false} size="xl">
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
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tableAgentColumns}
                    data={filteredAgentDestinataireServices}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    responsive
                    striped
                    fixedHeaderScrollHeight='180px'
                    highlightOnHover
                    subHeader
                    subHeaderComponent={
                      <Form.Control size='sm' type="text" placeholder='Recherche un agent' value={term} onChange={e => handleSearchAgentInputChange(e)} className='w-25' />
                    }
                    onRowClicked={ (row, e) => {
                      handleCloseModal()
                      if (code === "OR") {
                        formEs.signataireDg.value = (row.signataire)? row.signataire : "";
                        formEs.nomSignataireDg.value = row.prenom + ' ' + row.nom;
                        formEs.titreHonorifiqueDg.value = (row.titreHonoSign)? row.titreHonoSign : "";
                      }
                      if (code === "AD") {
                        formEs.signataireDaf.value = (row.signataire)? row.signataire : "";
                        formEs.nomSignataireDaf.value = row.prenom + ' ' + row.nom;
                        formEs.titreHonorifiqueDaf.value = (row.titreHonoSign)? row.titreHonoSign : "";
                      }
                      if (code === "AC") {
                        formEs.signataireAc.value = (row.signataire)? row.signataire : "";
                        formEs.nomSignataireAc.value = row.prenom + ' ' + row.nom;
                        formEs.titreHonorifiqueAc.value = (row.titreHonoSign)? row.titreHonoSign : "";
                      }
                      if (code === "CF") {
                        formEs.signataireCf.value = (row.signataire)? row.signataire : "";
                        formEs.nomSignataireCf.value = row.prenom + ' ' + row.nom;
                        formEs.titreHonorifiqueCf.value = (row.titreHonoSign)? row.titreHonoSign : "";
                      }
                    }}/>
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

export default StructureMajLEnteteForm;
