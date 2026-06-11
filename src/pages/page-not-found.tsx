import React, { FunctionComponent } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
  
const PageNotFound: FunctionComponent = () => {
  
  return (
    <Container className="text-center">
        <Row>
            <Col>
                <img src="http://assets.pokemon.com/assets/cms2/img/pokedex/full/035.png" alt="Page non trouvée"/>
                <h1>Hey, cette page n'existe pas !</h1> 
                
                <Link to="/" className="btn btn-primary">
                    Retourner à l'accueil
                </Link>
            </Col>
        </Row>
    </Container>
  );
}
  
export default PageNotFound;