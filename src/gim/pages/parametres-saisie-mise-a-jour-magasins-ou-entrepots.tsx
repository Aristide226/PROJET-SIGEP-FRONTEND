//Aristide
import React, { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';
import GimMenuPrincipal from '../components/gim-menu-principal';
import GimEntete from '../components/gim-entete';
import ParametresSaisieMiseAjourMagasinsOuEntrepotsForm from '../components/parametres-saisie-mise-a-jour-magasins-ou-entrepots-form';

interface IAppProps {
}

const ParametresSaisieMiseAjourMagasinsOuEntrepots : FunctionComponent<IAppProps> = (props) => {
  return (
      <div>
        <Row className="fixed-top sticky-top">
          <Col>
            <GimEntete />
            <GimMenuPrincipal />
          </Col>
        </Row>
        <Row  className='m-1 bg-light'>
            {<ParametresSaisieMiseAjourMagasinsOuEntrepotsForm/>}
        </Row>
      </div>
  );
};

export default ParametresSaisieMiseAjourMagasinsOuEntrepots;
