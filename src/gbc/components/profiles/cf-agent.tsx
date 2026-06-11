import { FunctionComponent } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';

interface IAppProps {
  gestionCourante: string,
  gestionProchaine: string,
}

const CfAdm: FunctionComponent<IAppProps> = (props) => {
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
             <NavDropdown.Divider />
             <NavDropdown title="Structure" id="structure" menuVariant="dark" drop='end' className='navbar-link'>
               <NavDropdown.Item href="/gbc/structure-maj-l-entete" className='navbar-link'>Mettre à jour l'entete</NavDropdown.Item>
               <NavDropdown.Item href="/gbc/structure-maj-directions-et-service" className='navbar-link'>Mettre à jour directions et services</NavDropdown.Item>
               <NavDropdown.Item href="/gbc/structure-maj-liste-des-agents" className='navbar-link'>Mettre à jour liste des agents</NavDropdown.Item>
             </NavDropdown>
             <NavDropdown.Item href="#" className='navbar-link'>MAJ tableau spécifique</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Budget" id="budget" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="/gbc/budget-annuler-validation-de-la-modification-du-budget" className='navbar-link'>Annuler validation de la modification du budget { props.gestionCourante }</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Contrats" id="contrats" menuVariant="dark" className='navbar-link'>
             <NavDropdown title="Plan de passation" id="plan-de-passation" menuVariant="dark" drop='end' className='navbar-link'>
              <NavDropdown.Item href="/gbc/contrats-plan-de-passation-reediter-le-ppm" className='navbar-link'>Réediter le PPM</NavDropdown.Item>
             </NavDropdown>
           </NavDropdown>

           <NavDropdown title="Engagements" id="engagements" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="#" className='navbar-link'>Saisir motif de rejet</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Liquidation" id="liquidation" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="#" className='navbar-link'>Saisir motif de rejet</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Titre recette" id="titre-recette" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="#" className='navbar-link'>Saisir motif de rejet</NavDropdown.Item>
             <NavDropdown title="Transmettre un titre" id="transmettre-un-titre" menuVariant="dark" drop='end' className='navbar-link'>
               <NavDropdown.Item href="#" className='navbar-link'>Validé à l'Adm. de Crédits</NavDropdown.Item>
               <NavDropdown.Item href="#" className='navbar-link'>Rejeté à l'Adm. de Crédits</NavDropdown.Item>
             </NavDropdown>
           </NavDropdown>

           <NavDropdown title="Pénalités de retard" id="penalites-de-retard" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="#" className='navbar-link'>Nouvelle liquidaton</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Modification</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Réimpression</NavDropdown.Item>
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
             <NavDropdown.Item href="#" className='navbar-link'>A partir d'un titre de recettes</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>A partir d'un recouvrement</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>A partir de précompte</NavDropdown.Item>
           </NavDropdown>
         
           <NavDropdown title="Impressions spécifiques" id="impressions-specifiques" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="#" className='navbar-link'>Plan comptable</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Nomenclature budgétaire</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Budget initial</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Budget définitif</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Réaménagements enregistrés</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Fiche de controle</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Situation des dépenses par Agent</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Situation des dépenses par Fournisseur</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link text-danger'>Situation d'éxecution budgétaire</NavDropdown.Item>
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

export default CfAdm;
