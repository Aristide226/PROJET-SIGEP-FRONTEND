import * as React from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { GrhGestion } from '../helpers/session-storage';

interface IAppProps {
}

const GrhTableauDeBord: React.FunctionComponent<IAppProps> = (props) => {
  return(
      <Container>
          <Row className="mt-1 p-1">
            <h6 className='shadow-sm rounded text-center text-primary'><b>TABLEAU DE BORD { GrhGestion() }</b></h6>
            <Col className="shadow-sm rounded">
                <h6 className='text-center text-danger'>EXECUTION</h6>
                <Table responsive striped bordered hover variant="" size="sm">
                    <thead className='bg-danger'>
                        <tr>
                            <th>Libéllé</th>
                            <th>Volume</th>
                            <th>Taux</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                    </tbody>
                </Table>

                <h6 className='mt-5 text-center text-warning'>DOSSIER</h6>
                <Table responsive striped bordered hover variant="" size="sm">
                    <thead className='bg-warning'>
                        <tr>
                            <th>Libéllé</th>
                            <th>Volume</th>
                            <th>Nbre</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                    </tbody>
                </Table>

                <h6 className='mt-5 text-center text-success'>DISPONIBILITES : 0</h6>
            </Col>
          </Row>
      </Container>
  );
};

export default GrhTableauDeBord;
