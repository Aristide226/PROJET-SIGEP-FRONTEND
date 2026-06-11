import React, { FunctionComponent, useEffect, useState } from 'react';
import { Badge, Card, Col, Container, Row } from 'react-bootstrap';



const VisuEtatDeDosssierForm: FunctionComponent = () => {

  return (
    <Container>
          <Row className="mt-1 p-1">
            <h6 className="shadow-sm text-primary text-center rounded">PARAMETRES &gt; VISU ETAT DE DOSSIER</h6>
            <Card className='p-1'>
              <Row className='mb-1'>
                <Col lg={4} md={12} sm={12}>
                  <Card className='bg-light' style={{height:'212px'}}>
                    <Card.Header className='p-1'><b>Engagement</b></Card.Header>
                    <Card.Body className='p-1'>
                      <Badge bg="success" className='me-2'>E0</Badge><span className='label2'>Nouveau engagement</span><br />
                      <Badge bg="success" className='me-2'>E1</Badge><span className='label2'>Projet d'engagement</span><br />
                      <Badge bg="success" className='me-2'>E2</Badge><span className='label2'>Dépense engagée</span><br />
                      <Badge bg="success" className='me-2'>E3</Badge><span className='label2'>Projet d'engagement rejeté</span><br />
                      <Badge bg="success" className='me-2'>E5</Badge><span className='label2'>Engagement refusé</span><br />
                      <Badge bg="success" className='me-2'>E9</Badge><span className='label2'>Engagement abandonné</span><br />
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4} md={12} sm={12}>
                  <Card className='bg-light' style={{height:'212px'}}>
                    <Card.Header className='p-1'><b>Liquidation</b></Card.Header>
                    <Card.Body className='p-1'>
                      <Badge bg="success" className='me-2'>L0</Badge><span className='label2'>Nouveau liquidation</span><br />
                      <Badge bg="success" className='me-2'>L1</Badge><span className='label2'>Projet de liquidation</span><br />
                      <Badge bg="success" className='me-2'>L2</Badge><span className='label2'>Dépense liquidée</span><br />
                      <Badge bg="success" className='me-2'>L3</Badge><span className='label2'>Projet de liquidation rejeté</span><br />
                      <Badge bg="success" className='me-2'>L5</Badge><span className='label2'>Liquidation refusée</span><br />
                      <Badge bg="success" className='me-2'>L9</Badge><span className='label2'>Liquidation abandonnée</span><br />
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4} md={12} sm={12}>
                  <Card className='bg-light' style={{height:'212px'}}>
                    <Card.Header className='p-1'><b>Titre de recette</b></Card.Header>
                    <Card.Body className='p-1'>
                      <Badge bg="success" className='me-2'>T0</Badge><span className='label2'>Nouveau titre</span><br />
                      <Badge bg="success" className='me-2'>T1</Badge><span className='label2'>Projet de titre</span><br />
                      <Badge bg="success" className='me-2'>T2</Badge><span className='label2'>Titre visé /CF</span><br />
                      <Badge bg="success" className='me-2'>T3</Badge><span className='label2'>Projet de titre rejeté /CF</span><br />
                      <Badge bg="success" className='me-2'>T4</Badge><span className='label2'>Titre pris en charge /AC</span><br />
                      <Badge bg="success" className='me-2'>T5</Badge><span className='label2'>Titre rejeté /AC</span><br />
                      <Badge bg="success" className='me-2'>T9</Badge><span className='label2'>Titre abandonné</span><br />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col lg={4} md={12} sm={12}>
                  <Card className='bg-light' style={{height:'212px'}}>
                    <Card.Header className='p-1'><b>Mandat</b></Card.Header>
                    <Card.Body className='p-1'>
                      <Badge bg="success" className='me-2'>M0</Badge><span className='label2'>Nouveau mandat</span><br />
                      <Badge bg="success" className='me-2'>M1</Badge><span className='label2'>Projet de mandat</span><br />
                      <Badge bg="success" className='me-2'>M2</Badge><span className='label2'>Dépense mandatée</span><br />
                      <Badge bg="success" className='me-2'>M3</Badge><span className='label2'>Projet de mandat rejeté</span><br />
                      <Badge bg="success" className='me-2'>M5</Badge><span className='label2'>Mandat refusé</span><br />
                      <Badge bg="success" className='me-2'>M9</Badge><span className='label2'>Mandat abandonné</span><br />
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4} md={12} sm={12}>
                  <Card className='bg-light' style={{height:'212px'}}>
                    <Card.Header className='p-1'><b>Paiement</b></Card.Header>
                    <Card.Body className='p-1'>
                      <Badge bg="success" className='me-2'>P1</Badge><span className='label2'>Mandat pris en charge</span><br />
                      <Badge bg="success" className='me-2'>P2</Badge><span className='label2'>Mandat payé</span><br />
                      <Badge bg="success" className='me-2'>P3</Badge><span className='label2'>Prise en charge du mandat rejeté</span><br />
                      <Badge bg="success" className='me-2'>P5</Badge><span className='label2'>Paiement annulé</span><br />
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4} md={12} sm={12}>
                  <Card className='bg-light' style={{height:'212px'}}>
                    <Card.Header className='p-1'><b>Recouvrement</b></Card.Header>
                    <Card.Body className='p-1'>
                      <Badge bg="success" className='me-2'>R1</Badge><span className='label2'>Projet de recouvrement</span><br />
                      <Badge bg="success" className='me-2'>R2</Badge><span className='label2'>Recouvrement validé</span><br />
                      <Badge bg="success" className='me-2'>M9</Badge><span className='label2'>Recouvrement abandonné</span><br />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>    
            </Card>
          </Row>
      </Container>
  );
};

export default VisuEtatDeDosssierForm;
