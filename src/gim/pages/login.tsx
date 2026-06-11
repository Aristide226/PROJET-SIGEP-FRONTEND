import React, { FunctionComponent, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { Field } from '../../helpers/types';
import bcrypt from 'bcryptjs-react';
import { COPYRIGHT } from '../../shared/config/app.constants';
import Swal from 'sweetalert2';
import { useGimSignOut } from '../helpers/use-sign-out';
import CodeAccesDto, { emptyCodeAccesDto } from '../models/code-acces';
import CodeAccesService from '../services/code-acces-service';
import GimAuthenticationService from '../services/authentication-service';
import { GimConnectedUser } from '../helpers/session-storage';

// On déclare un type Form pour modéliser le formulaire avec la liste des champs disponibles
type Formulaire = {
  userName: Field,
  motPasse: Field
}

type FormulaireCMDPPD = {
  nouveauMotPasse: Field,
  confirmerNouveauMotPasse: Field
}

const GimLogin: FunctionComponent = () => {

    const navigate = useNavigate();
    const signOut = useGimSignOut();

    const [message, setMessage] = useState<string>();
    const [alertColor, setAlertColor] = useState<string>("danger");
    const [codeAccesDto, setCodeAccesDto] = useState<CodeAccesDto>(emptyCodeAccesDto);
    const [showModal, setShowModal] = useState(false);

    // On déclare un state form qui représent notre formulaire et on initialise ses champs
    const [form, setForm] = useState<Formulaire>({
      userName: { value: GimConnectedUser() ?? ''},
      motPasse: { value: ''}
    });
 
    const [formulaireCMDPPD, setFormulaireCMDPPD] = useState<FormulaireCMDPPD>({
      nouveauMotPasse: {value: ''},
      confirmerNouveauMotPasse: {value: ''}
    })


    // On déclare une methode pour recupérer les valeurs des champs userName et MotPasse et les sauvegarder dans le state form
    const handleInputChange = (e: any): void => {
      const fieldName: string = e.target.name;
      let fieldValue: string = e.target.value;

      if (fieldName ==="userName") fieldValue = fieldValue.toLocaleUpperCase();
  
      const newField: Field = { [fieldName]: { value: fieldValue } };
      setForm({ ...form, ...newField});
    }

    // On déclare une methode pour recupérer les valeurs des champs userName et MotPasse et les sauvegarder dans le state form
    const handleInputChangeFormulaireCMDPPD = (e: any): void => {
      const fieldName: string = e.target.name;
      const fieldValue: string = e.target.value;
      const newField: Field = { [fieldName]: { value: fieldValue } };
  
      setFormulaireCMDPPD({ ...formulaireCMDPPD, ...newField});
    }

    // Pour la validation des champs du formulaire
    const validateForm = () => {
      let newForm: Formulaire = form;
  
      // userName
      if(form.userName.value === "" ||  form.userName.value.length > 5) {
        const errorMsg: string = 'Nom utilisateur incorrect !';
        const newField: Field = { value: form.userName.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ userName: newField } };
      } else {
        const newField: Field = { value: form.userName.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ userName: newField } };
      }
  
      // motPasse
      if(form.motPasse.value === "" || form.motPasse.value.length > 256) {
        const errorMsg: string = 'Mot de passe incorrect !';
        const newField: Field = {value: form.motPasse.value, error: errorMsg, isValid: false};
        newForm = { ...newForm, ...{ motPasse: newField } };
      } else {
        const newField: Field = { value: form.motPasse.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ motPasse: newField } };
      }
  
      setForm(newForm);
      
      return newForm.userName.isValid && newForm.motPasse.isValid;
    }

    // Pour la validation des champs du formulaire changer mot de passe par defaut
    const validateFormulaireCMDPPD = () => {
      let newForm: FormulaireCMDPPD = formulaireCMDPPD;

      // nouveauMotPasse
      if(formulaireCMDPPD.nouveauMotPasse.value === "") {
        const errorMsg: string = 'Champ obligatoire';
        const newField: Field = { value: formulaireCMDPPD.nouveauMotPasse.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ nouveauMotPasse: newField } };
      } else if (formulaireCMDPPD.nouveauMotPasse.value.length < 3) {
        const errorMsg: string = 'Le mot de passe doit avoir au moins 3';
        const newField: Field = { value: formulaireCMDPPD.nouveauMotPasse.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ nouveauMotPasse: newField } };
      } else {
        const newField: Field = { value: formulaireCMDPPD.nouveauMotPasse.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ nouveauMotPasse: newField } };
      }
  
      // motPasse
      if(formulaireCMDPPD.confirmerNouveauMotPasse.value === "") {
        const errorMsg: string = 'Champ obligatoire';
        const newField: Field = {value: formulaireCMDPPD.confirmerNouveauMotPasse.value, error: errorMsg, isValid: false};
        newForm = { ...newForm, ...{ confirmerNouveauMotPasse: newField } };
      } else if (formulaireCMDPPD.confirmerNouveauMotPasse.value !== formulaireCMDPPD.nouveauMotPasse.value) {
        const errorMsg: string = 'Les mots de passe que vous avez rentrés ne correspondent pas';
        const newField: Field = {value: formulaireCMDPPD.confirmerNouveauMotPasse.value, error: errorMsg, isValid: false};
        newForm = { ...newForm, ...{ confirmerNouveauMotPasse: newField } };
      } else {
        const newField: Field = { value: formulaireCMDPPD.confirmerNouveauMotPasse.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ confirmerNouveauMotPasse: newField } };
      }
  
      setFormulaireCMDPPD(newForm);
      
      return newForm.nouveauMotPasse.isValid && newForm.confirmerNouveauMotPasse.isValid;
    }

    // Sera evoquée lorsque l'utilisateur cliquera sur le button submit du formulaire
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const isFormValid = validateForm();
      if(isFormValid) {
        setMessage('👉 Tentative de connexion en cours ...');
        setAlertColor("success");
        
        GimAuthenticationService.login(form.userName.value, form.motPasse.value).then(isAuthenticated => {
          if(isAuthenticated === "serverIsOff") {
            setMessage('🔐 Problème de connexion avec le serveur.');
            setAlertColor("danger");
            return;
          }
          
          if(isAuthenticated === "dataNotExist" || isAuthenticated === "false") {
            setMessage('🔐 Identifiant ou mot de passe incorrect.');
            setAlertColor("danger");
            return;
          }

          if(isAuthenticated === "userInactif") {
            setMessage('🔐 Votre compte est désactivé.');
            setAlertColor("danger");
            return;
          }
          
          // User is authenticated
          setMessage("");
          CodeAccesService.getByUserName(form.userName.value)
          .then( data => {
            setCodeAccesDto(data);
          })
          .catch( error => {
              console.log("Login.tsx : ", error);
          }); 
        }); 
      } else {
        setMessage('🔐 Utilisateur ou mot de passe incorrect.');
        setAlertColor("danger");
      }
    } 

    const handleSubmitFormulaireCMDPPD = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const isFormValid = validateFormulaireCMDPPD();
      if(isFormValid) {
        const hashedPassword = bcrypt.hashSync(formulaireCMDPPD.nouveauMotPasse.value, 10); // To hash a password
        codeAccesDto.nbreConnect = codeAccesDto.nbreConnect + 1;
        codeAccesDto.motDePasse = hashedPassword;
        CodeAccesService.edit(codeAccesDto.idUser, codeAccesDto).then( () => {
          handleCloseModal();
          Swal.fire({
            title: 'GesBud',
            text: "Mot de passe changé avec succès. Veuillez vous reconnecter !",
            icon: 'success',
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            confirmButtonColor: '#007E33' 
          }).then( (result) => {
            if (result.isConfirmed) {
              signOut();
              window.location.reload();
            }
          });
        }); 
      }    
    } 

    const handleCloseModal = () => {
      setShowModal(false);
    }

    const handleShowModal = () => {
      setShowModal(true);
    }

    // Code inside useEffect will execute when codeAccesDto is update
    useEffect( () => {
      if (codeAccesDto !== emptyCodeAccesDto) {
        bcrypt.compare("OK", codeAccesDto.motDePasse).then( res => {
          if (res) {
            handleShowModal();
          } else {
            codeAccesDto.nbreConnect = codeAccesDto.nbreConnect + 1;
            CodeAccesService.edit(codeAccesDto.idUser, codeAccesDto)
            .then( () => navigate("/gim"));
          }
        })
      }
    }, [codeAccesDto]);

    const onClickButtonRetourAuxModules = () => {
        navigate("/");
    }

    return (
        <Container>
          <Row className='mt-4'>
            <h1 className="shadow-sm text-success mt-4 p-3 text-center rounded">CONNEXION GIM</h1>
            <Col lg={5} md={6} sm={12} className="p-5 m-auto shadow-lg rounded">
            {message && <Alert variant={alertColor}>{ message }</Alert> }
              <Form onSubmit={(e) => handleSubmit(e)}>
                <Form.Group className="mb-3" controlId="userName">
                  <Form.Label>Utilisateur</Form.Label>
                  <Form.Control size='sm' name="userName" value={form.userName.value} type="text" autoComplete="off" placeholder="Votre nom d'utilisateur" onChange={e => handleInputChange(e)} />
                </Form.Group>
    
                <Form.Group className="mb-3" controlId="motPasse">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control size='sm' name="motPasse" type="password" autoComplete="new-password" placeholder="Votre mot de passe" onChange={e => handleInputChange(e)}/>
                </Form.Group>
    
                <Button variant="success w-100" type="submit" size='sm'>
                  Se connecter
                </Button>

                <Button variant="primary w-100 mt-1" size='sm' onClick={() => onClickButtonRetourAuxModules()}>
                  Retour aux modules
                </Button>
              </Form>
            </Col>
          </Row>
          <h6 className='mt-5 p-5 text-center text-secondary'>{COPYRIGHT}</h6>
          
          <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false} centered>
          <Form onSubmit={(e) => handleSubmitFormulaireCMDPPD(e)}>
            <Modal.Header>
                <Modal.Title as="h6">Changement de mot de passe par défaut</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Alert variant="danger">Le mot de passe par défaut (OK) ne vous permet pas de continuer. Veuillez le remplacer par votre propre mot de passe.</Alert>
            
              <Form.Group className="mb-3" controlId="nouveauMotPasse">
                <Form.Label>Nouveau mot de passe</Form.Label>
                <Form.Control size='sm' name="nouveauMotPasse" type="password" autoFocus onChange={e => handleInputChangeFormulaireCMDPPD(e)} />
                {formulaireCMDPPD.nouveauMotPasse.error && <Alert variant="danger" className='mt-1'>{ formulaireCMDPPD.nouveauMotPasse.error }</Alert> }
              </Form.Group>

              <Form.Group className="mb-3" controlId="confirmerNouveauMotPasse">
                <Form.Label>Confirmer le mot de passe</Form.Label>
                <Form.Control size='sm' name="confirmerNouveauMotPasse" type="password" onChange={e => handleInputChangeFormulaireCMDPPD(e)}/>
                {formulaireCMDPPD.confirmerNouveauMotPasse.error && <Alert variant="danger" className='mt-1'>{ formulaireCMDPPD.confirmerNouveauMotPasse.error }</Alert> }
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="success" size='sm' type='submit'>Valider</Button>
            </Modal.Footer>
          </Form>
          </Modal>
        </Container>
      );
};

export default GimLogin;
