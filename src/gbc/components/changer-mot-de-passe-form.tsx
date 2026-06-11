import React, { FunctionComponent, useEffect, useState } from 'react';
import { Alert, Button, ButtonGroup, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { Field } from '../../helpers/types';
import AccesCodeDto, { emptyAccesCodeDto } from '../models/accesCodeDto';
import AccesCodeService from '../services/accesCodeService';
import Swal from 'sweetalert2';
import bcrypt from 'bcryptjs-react';

import { useSignOut } from '../helpers/use-sign-out';
import { ConnectedUser } from '../helpers/session-storage';

type FormulaireCMDP = {
  ancienMotPasse: Field,
  nouveauMotPasse: Field,
  confirmerNouveauMotPasse: Field
}

const ChangerMotDePasseForm: FunctionComponent = () => {

  const navigate = useNavigate();

  const [accesCodeDto, setAccesCodeDto] = useState<AccesCodeDto>(emptyAccesCodeDto);
  const connectedUser = ConnectedUser();
  const signOut = useSignOut();


  useEffect( () => {
    AccesCodeService.get(connectedUser)
    .then( data => setAccesCodeDto(data))
    .catch( error => {
      console.log(error);
    });
  }, [])

  const [formulaireCMDP, setFormulaireCMDP] = useState<FormulaireCMDP>({
    ancienMotPasse: { value: ''},
    nouveauMotPasse: { value: ''},
    confirmerNouveauMotPasse: { value: ''}
  });

  const handleInputChangeFormulaireCMDP = (e: any) => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };

    setFormulaireCMDP({ ...formulaireCMDP, ...newField});
  }

  const validateFormulaireCMDP = async () => {
    let newForm: FormulaireCMDP = formulaireCMDP;

    // ancienMotPasse
    if (formulaireCMDP.ancienMotPasse.value === "") {
      const errorMsg: string = 'Champ obligatoire !';
      const newField: Field = { value: formulaireCMDP.ancienMotPasse.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ ancienMotPasse: newField } };
    } else if (!await bcrypt.compare(formulaireCMDP.ancienMotPasse.value, accesCodeDto.motDePasse)) {
      const errorMsg: string = 'Ancien mot de passe incorrect !';
      const newField: Field = { value: formulaireCMDP.ancienMotPasse.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ ancienMotPasse: newField } };
    } else {
      const newField: Field = { value: formulaireCMDP.ancienMotPasse.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ ancienMotPasse: newField } };
    }

    // nouveauMotPasse
    if (formulaireCMDP.nouveauMotPasse.value === "") {
      const errorMsg: string = 'Champ obligatoire !';
      const newField: Field = { value: formulaireCMDP.nouveauMotPasse.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ nouveauMotPasse: newField } };
    } else if (await bcrypt.compare(formulaireCMDP.nouveauMotPasse.value, accesCodeDto.motDePasse)) {
      const errorMsg: string = 'Nouveau mot de passe indentique à l\'ancien !';
      const newField: Field = { value: formulaireCMDP.nouveauMotPasse.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ nouveauMotPasse: newField } };
    } else if (formulaireCMDP.nouveauMotPasse.value.length < 3) {
      const errorMsg: string = 'Nouveau mot de passe doit avoir au moins 3 caractères !';
      const newField: Field = { value: formulaireCMDP.nouveauMotPasse.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ nouveauMotPasse: newField } };
    } else {
      const newField: Field = { value: formulaireCMDP.nouveauMotPasse.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ nouveauMotPasse: newField } };
    }

    if (formulaireCMDP.confirmerNouveauMotPasse.value === "") {
      const errorMsg: string = 'Champ obligatoire !';
      const newField: Field = { value: formulaireCMDP.confirmerNouveauMotPasse.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ confirmerNouveauMotPasse: newField } };
    } else if (formulaireCMDP.confirmerNouveauMotPasse.value !== formulaireCMDP.nouveauMotPasse.value) {
      const errorMsg: string = 'Mot de passe de confirmation incorrect !';
      const newField: Field = { value: formulaireCMDP.confirmerNouveauMotPasse.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ confirmerNouveauMotPasse: newField } };
    } else {
      const newField: Field = { value: formulaireCMDP.confirmerNouveauMotPasse.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ confirmerNouveauMotPasse: newField } };
    }

    setFormulaireCMDP(newForm);
    
    return newForm.ancienMotPasse.isValid && newForm.nouveauMotPasse.isValid && newForm.confirmerNouveauMotPasse.isValid;
  }

  const handleSubmitFormulaireCMDP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(await validateFormulaireCMDP()) {
      accesCodeDto.motDePasse = bcrypt.hashSync(formulaireCMDP.nouveauMotPasse.value, 10); // To hash a password
      AccesCodeService.edit(accesCodeDto.userName, accesCodeDto)
      .then( () => {

        Swal.fire({
          title: 'Mot de passe changé avec succès !',
          text: 'Veuillez vous reconnecter !',
          icon: 'success',
          confirmButtonText: 'OK',
          allowOutsideClick: false,
          confirmButtonColor: '#007E33' 
        }).then((result) => {   
            if (result.isConfirmed) signOut();
        });

      });     
    }    
  }

  const handleAnnuler = () => {
    navigate("/gbc")
  }

  return (
    <Container>
          <Row className="mt-1 p-1">
            <h6 className="shadow-sm text-primary text-center rounded">PARAMETRES &gt; CHANGER LE MOT DE PASSE</h6>
            <Col lg={5} md={6} sm={12} className="p-5 m-auto shadow-lg rounded">
              <Form onSubmit={ (e) => handleSubmitFormulaireCMDP(e) }>
                <Form.Group className="mb-3" controlId="ancienMotPasse">
                  <Form.Label>Ancien mot de passe</Form.Label>
                  <Form.Control size='sm' name="ancienMotPasse" type="password" onChange={ e => handleInputChangeFormulaireCMDP(e) } autoFocus/>
                  { formulaireCMDP.ancienMotPasse.error && <Alert variant="danger" className='mt-1'>{ formulaireCMDP.ancienMotPasse.error }</Alert> }
                </Form.Group>
    
                <Form.Group className="mb-3" controlId="nouveauMotPasse">
                  <Form.Label>Nouveau mot de passe</Form.Label>
                  <Form.Control size='sm' name="nouveauMotPasse" type="password" onChange={ e => handleInputChangeFormulaireCMDP(e) } />
                  { formulaireCMDP.nouveauMotPasse.error && <Alert variant="danger" className='mt-1'>{ formulaireCMDP.nouveauMotPasse.error }</Alert> }
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirmerNouveauMotPasse">
                  <Form.Label>confirmer Nouveau mot de passe</Form.Label>
                  <Form.Control size='sm' name="confirmerNouveauMotPasse" type="password" onChange={ e => handleInputChangeFormulaireCMDP(e) } />
                  { formulaireCMDP.confirmerNouveauMotPasse.error && <Alert variant="danger" className='mt-1'>{ formulaireCMDP.confirmerNouveauMotPasse.error }</Alert> }
                </Form.Group>
    
                <ButtonGroup size="sm" className='w-100'>
                  <Button variant="success" type="submit" className='me-1'>Valider</Button>
                  <Button variant="danger" className='' onClick={handleAnnuler}>Annuler</Button>
                </ButtonGroup>
              </Form>
            </Col>
          </Row>
      </Container>
  );
};

export default ChangerMotDePasseForm;
