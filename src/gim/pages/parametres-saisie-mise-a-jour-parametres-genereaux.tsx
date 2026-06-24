//Aristide
import React, { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';
import GimMenuPrincipal from '../components/gim-menu-principal';
import GimEntete from '../components/gim-entete';
import ParametresSaisieMiseAjourParametresGenereauxForm from '../components/parametres-saisie-mise-a-jour-parametres-genereaux-form';

interface IAppProps {
}

const ParametresSaisieMiseAjourParametresGenereaux : FunctionComponent<IAppProps> = (props) => {
  return (
      <div>
        <Row className="fixed-top sticky-top">
          <Col>
            <GimEntete />
            <GimMenuPrincipal />
          </Col>
        </Row>
        <Row  className='m-1 bg-light'>
            {<ParametresSaisieMiseAjourParametresGenereauxForm/>}
        </Row>
      </div>
  );
};

export default ParametresSaisieMiseAjourParametresGenereaux;
