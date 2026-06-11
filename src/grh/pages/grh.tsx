import React, { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';
import GrhEntete from '../components/grh-entete';
import GrhMenuPrincipal from '../components/grh-menu-principal';
import GrhChoixDuBudget from '../components/grh-choix-du-budget';
import GrhTableauDeBord from '../components/grh-tableau-de-bord';

interface IAppProps {
}

const Grh: FunctionComponent<IAppProps> = (props) => {
  return (
      <div>
        <Row className="fixed-top sticky-top">
          <Col>
            <GrhEntete />
            <GrhMenuPrincipal />
          </Col>
        </Row>
        <Row  className='m-1'>
          <Col className="m-1 bg-light">
            <GrhChoixDuBudget />
          </Col>
          <Col xs={3} className="m-1 bg-light">
            <GrhTableauDeBord />
          </Col>
        </Row>
      </div>
  );
};

export default Grh;
