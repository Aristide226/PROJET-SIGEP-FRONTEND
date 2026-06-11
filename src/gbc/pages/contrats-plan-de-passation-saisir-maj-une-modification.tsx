//Aristide
import { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';
import EnteteGbc from '../components/entete-gbc';
import MenuPrincipalGbc from '../components/menu-principal-gbc';
import TableauDeBordGbc from '../components/tableau-de-bord-gbc';
import ContratsPlanDePassationSaisirMajUneModificationForm from '../components/contrats-plan-de-passation-saisir-maj-une-modification-form';


interface IAppProps {
}

const ContratsPlanDePassationSaisirMajUneModification: FunctionComponent<IAppProps> = (props) => {
  return (
      <div>
        <Row className="fixed-top sticky-top">
          <Col>
            <EnteteGbc />
            <MenuPrincipalGbc />
          </Col>
        </Row>
        <Row  className='m-1'>
          <Col xs={9} className="m-1 bg-light">
            <ContratsPlanDePassationSaisirMajUneModificationForm/>
          </Col>
          <Col className="m-1 bg-light">
            <TableauDeBordGbc />
          </Col>
        </Row>
      </div>
  );
};

export default ContratsPlanDePassationSaisirMajUneModification;
