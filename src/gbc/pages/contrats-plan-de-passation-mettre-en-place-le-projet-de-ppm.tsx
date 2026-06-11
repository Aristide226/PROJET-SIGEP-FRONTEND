//Aristide
import { FunctionComponent} from 'react';
import { Col, Row } from 'react-bootstrap';
import EnteteGbc from '../components/entete-gbc';
import MenuPrincipalGbc from '../components/menu-principal-gbc';
import TableauDeBordGbc from '../components/tableau-de-bord-gbc';
import MettreEnPlaceLeLeProjetDePpmForm from '../components/contrats-plan-de-passation-mettre-en-place-le-projet-de-ppm-form';

interface IAppProps {
}

const ContratsPlanDePassationMettreEnPlaceLeProjetDePpm: FunctionComponent<IAppProps> = (props) => {
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
            <MettreEnPlaceLeLeProjetDePpmForm/>
          </Col>
          <Col className="m-1 bg-light">
            <TableauDeBordGbc />
          </Col>
        </Row>
      </div>
  );
};

export default ContratsPlanDePassationMettreEnPlaceLeProjetDePpm;
