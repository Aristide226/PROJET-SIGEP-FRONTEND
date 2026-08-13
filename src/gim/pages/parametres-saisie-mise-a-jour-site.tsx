//Aristide
import React, { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';
import GimMenuPrincipal from '../components/gim-menu-principal';
import GimEntete from '../components/gim-entete';
import ParametresSaisieMiseAjourSiteForm from '../components/parametres-saisie-mise-a-jour-site-form';

interface IAppProps {
}

const ParametresSaisieMiseAjourSite : FunctionComponent<IAppProps> = (props) => {
  return (
      <div>
        <Row className="fixed-top sticky-top">
          <Col>
            <GimEntete />
            <GimMenuPrincipal />
          </Col>
        </Row>
        <Row  className='m-1 bg-light'>
            {<ParametresSaisieMiseAjourSiteForm/>}
        </Row>
      </div>
  );
};

export default ParametresSaisieMiseAjourSite;
