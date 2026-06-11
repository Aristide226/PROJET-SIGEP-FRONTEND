import React, { FunctionComponent } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';

interface IAppProps {
  gestionCourante: string,
  gestionProchaine: string,
}

const AdInv: FunctionComponent<IAppProps> = (props) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
     <div style={{ marginLeft: '3px' }}>
       <Navbar.Toggle aria-controls="basic-navbar-nav" />
       <Navbar.Collapse id="basic-navbar-nav">
         <Nav>
           <NavDropdown title="Paramètres" id="parametres" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="/gbc/changer-mot-de-passe" className='navbar-link'>Changer le mot de passe</NavDropdown.Item>
             <NavDropdown title="Utilisateurs" id="utilisateur" menuVariant="dark" drop='end' className='navbar-link'>
               <NavDropdown.Item href="/gbc/consultation-utilisateur" className='navbar-link'>Consultation</NavDropdown.Item>
               <NavDropdown.Item href="/gbc/historique-utilisateur" className='navbar-link'>Historique</NavDropdown.Item>
             </NavDropdown>
             <NavDropdown.Divider />
             <NavDropdown.Item href="/gbc/visu-etat-de-dossier" className='navbar-link'>Visu état de dossier</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Budget" id="budget" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="/gbc/budget-maj-le-budget" className='navbar-link'>Mettre à jour le budget { props.gestionCourante }</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="/gbc/budget-mettre-en-place-le-budget" className='navbar-link'>Mettre en place le budget de  { props.gestionProchaine }</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Liste" id="liste" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="#" className='navbar-link'>A partir d'une ligne budgétaire</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>A partir dun réaménagement validé</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>A partir d'un projet de réaménagement</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>A partir d'un engagement</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>A partir d'une liquidation</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>A partir d'un mandat</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>A partir de paiement</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>A partir d'un contrat</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>A partir d'un titre de recttes</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>A partir d'un recouvrement</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>A partir de précompte</NavDropdown.Item>
           </NavDropdown>
         
           <NavDropdown title="Impressions spécifiques" id="impressions-specifiques" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="#" className='navbar-link'>Fiche de controle</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Situation des dépenses par Agent</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Situation des dépenses par Fournisseur</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Archivage" id="archivage" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="#" className='navbar-link'>Numéric de copies scannées</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Aide" id="aide" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="#" className='navbar-link'>Circuit</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Guide de l'utilisateur</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>A propos de SIGEP</NavDropdown.Item>
           </NavDropdown>

        </Nav>
       </Navbar.Collapse>
     </div>
   </Navbar>
 );
};

export default AdInv;
