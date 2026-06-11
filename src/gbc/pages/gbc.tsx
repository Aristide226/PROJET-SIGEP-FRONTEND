import React, { FunctionComponent, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import ChoixDuBudgetGbc from '../components/choix-du-budget-gbc';
import EnteteGbc from '../components/entete-gbc';
import MenuPrincipalGbc from '../components/menu-principal-gbc';
import TableauDeBordGbc from '../components/tableau-de-bord-gbc';

interface IAppProps {
}

const Gbc: FunctionComponent<IAppProps> = (props) => {
  return (
      <div>
        <Row className="fixed-top sticky-top">
          <Col>
            <EnteteGbc />
            <MenuPrincipalGbc />
          </Col>
        </Row>
        <Row  className='m-1'>
          <Col className="m-1 bg-light">
            <ChoixDuBudgetGbc />
          </Col>
          <Col xs={3} className="m-1 bg-light">
            <TableauDeBordGbc />
          </Col>
        </Row>
      </div>
  );
};

export default Gbc;
