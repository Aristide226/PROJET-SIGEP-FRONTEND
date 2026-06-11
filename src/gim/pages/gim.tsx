import React, { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';
import GimMenuPrincipal from '../components/gim-menu-principal';
import GimEntete from '../components/gim-entete';
import GimTableauDeBord from '../components/gim-tableau-de-bord';
import GimChoixDuBudget from '../components/gim-choix-du-budget';
import GimTableauDeBord2 from '../components/gim-tableau-de-bord2';

interface IAppProps {
}

const Gim: FunctionComponent<IAppProps> = (props) => {
  return (
      <div>
        <Row className="fixed-top sticky-top">
          <Col>
            <GimEntete />
            <GimMenuPrincipal />
          </Col>
        </Row>
        <Row  className='m-1'>
          <Col xs={8} className="m-1 bg-light">
            <GimTableauDeBord />
          </Col>
          <Col className="m-1 bg-light">
            <GimChoixDuBudget />
          </Col>
        </Row>
        <Row>
          <GimTableauDeBord2/>
        </Row>
      </div>
  );
};

export default Gim;
