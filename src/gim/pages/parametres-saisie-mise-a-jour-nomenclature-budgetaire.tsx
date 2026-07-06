//Aristide
import React, { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';
import GimMenuPrincipal from '../components/gim-menu-principal';
import GimEntete from '../components/gim-entete';
import ParametresSaisieMiseAjourNomenclatureBudgetaireForm from '../components/parametres-saisie-mise-a-jour-nomenclature-budgetaire-form';

interface IAppProps {
}

const ParametresSaisieMiseAjourNomenclatureBudgetaire : FunctionComponent<IAppProps> = (props) => {
  return (
      <div>
        <Row className="fixed-top sticky-top">
          <Col>
            <GimEntete />
            <GimMenuPrincipal />
          </Col>
        </Row>
        <Row  className='m-1 bg-light'>
            {<ParametresSaisieMiseAjourNomenclatureBudgetaireForm/>}
        </Row>
      </div>
  );
};

export default ParametresSaisieMiseAjourNomenclatureBudgetaire;
