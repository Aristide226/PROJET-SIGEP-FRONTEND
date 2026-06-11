import React, { FunctionComponent, useState } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';

interface IAppProps {
  gestionCourante: string,
  gestionProchaine: string,
}

const All: FunctionComponent<IAppProps> = (props) => {

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
     <div style={{ marginLeft: '3px' }}>
       <Navbar.Toggle aria-controls="basic-navbar-nav" />
       <Navbar.Collapse id="basic-navbar-nav">
         <Nav>
           {/* ----------------- */}
           <NavDropdown title="Contrats" id="contrats" menuVariant="dark" className='navbar-link'>
             <NavDropdown title="Plan de passation" id="plan-de-passation" menuVariant="dark" drop='end' className='navbar-link'>
               <NavDropdown.Item href="/gbc/contrats-plan-de-passation-elaborer-le-projet-ppm" className='navbar-link'>Elaborer le projet de PPM de { props.gestionProchaine }</NavDropdown.Item>
               <NavDropdown.Item href="/gbc/contrats-plan-de-passation-mettre-en-place-le-projet-de-ppm" className='navbar-link'>Mettre en place le projet de PPM de { props.gestionProchaine }</NavDropdown.Item>
               <NavDropdown.Item href="/gbc/contrats-plan-de-passation-saisir-maj-une-modification" className='navbar-link'>Saisir / MAJ une modification</NavDropdown.Item>
               <NavDropdown.Item href="/valider-une-modification" className='navbar-link'>Valider une modification</NavDropdown.Item>
               <NavDropdown.Divider />
               <NavDropdown.Item href="/gbc/contrats-plan-de-passation-reediter-le-ppm" className='navbar-link'>Réediter le PPM</NavDropdown.Item>
               <NavDropdown.Divider />
               <NavDropdown.Item href="/gbc/contrats-plan-de-passation-saisir-maj-dac" className='navbar-link'>Saisir / MAJ d'un DAC</NavDropdown.Item>
               <NavDropdown.Item href="/gbc/contrats-plan-de-passation-saisir-maj-execution-physique-contrat" className='navbar-link'>Saisir / MAJ exécution physique d'un contrat</NavDropdown.Item>
             </NavDropdown>
             <NavDropdown.Item href="#" className='navbar-link'>Saisie / MAJ fournisseurs</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Nouvelle saisie / Mise à jour</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown title="Avenant" id="avenant" menuVariant="dark" drop="end" className='navbar-link'>
               <NavDropdown.Item href="#" className='navbar-link'>Nouvelle saisie</NavDropdown.Item>
               <NavDropdown.Item href="#" className='navbar-link'>Correction</NavDropdown.Item>
               <NavDropdown.Divider />
               <NavDropdown.Item href="#" className='navbar-link'>Annulation de saisie</NavDropdown.Item>
             </NavDropdown>
             <NavDropdown title="Dégagement de montant" id="degagement-de-montant" menuVariant="dark" drop="end" className='navbar-link'>
               <NavDropdown.Item href="#" className='navbar-link'>Nouvelle saisie</NavDropdown.Item>
               <NavDropdown.Item href="#" className='navbar-link'>Correction</NavDropdown.Item>
               <NavDropdown.Divider />
               <NavDropdown.Item href="#" className='navbar-link'>Annulation de saisie</NavDropdown.Item>
             </NavDropdown>
             <NavDropdown.Item href="#" className='navbar-link'>Paramètres d'immatriculation</NavDropdown.Item>
           </NavDropdown>

           {/* --------- */}
        </Nav>
       </Navbar.Collapse>
     </div>
   </Navbar>
 );
};

export default All;
