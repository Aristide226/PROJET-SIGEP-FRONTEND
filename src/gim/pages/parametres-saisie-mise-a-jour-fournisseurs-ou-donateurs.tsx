//Aristide
import React, { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';
import GimMenuPrincipal from '../components/gim-menu-principal';
import GimEntete from '../components/gim-entete';
import ParametresSaisieMiseAjourFournisseursOuDonateursForm from '../components/parametres-saisie-mise-a-jour-fournisseurs-ou-donateurs-form';

interface IAppProps {
}

const ParametresSaisieMiseAjourFournisseursOuDonateurs : FunctionComponent<IAppProps> = (props) => {
  return (
      <div>
        <Row className="fixed-top sticky-top">
          <Col>
            <GimEntete />
            <GimMenuPrincipal />
          </Col>
        </Row>
        <Row  className='m-1 bg-light'>
            {<ParametresSaisieMiseAjourFournisseursOuDonateursForm/>}
        </Row>
      </div>
  );
};

export default ParametresSaisieMiseAjourFournisseursOuDonateurs;
