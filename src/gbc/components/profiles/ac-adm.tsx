import React, { FunctionComponent } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';

interface IAppProps {
  gestionCourante: string,
  gestionProchaine: string,
}

const AcAdm: FunctionComponent<IAppProps> = (props) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
     <div style={{ marginLeft: '3px' }}>
       <Navbar.Toggle aria-controls="basic-navbar-nav" />
       <Navbar.Collapse id="basic-navbar-nav">
         <Nav>
           <NavDropdown title="Paramètres" id="parametres" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="/gbc/changer-mot-de-passe" className='navbar-link'>Changer le mot de passe</NavDropdown.Item>
             <NavDropdown title="Utilisateurs" id="utilisateur" menuVariant="dark" drop='end' className='navbar-link'>
               <NavDropdown.Item href="/gbc/creation-maj-utilisateur" className='navbar-link'>Création/Mise à jour</NavDropdown.Item>
               <NavDropdown.Item href="/gbc/consultation-utilisateur" className='navbar-link'>Consultation</NavDropdown.Item>
               <NavDropdown.Item href="/gbc/historique-utilisateur" className='navbar-link'>Historique</NavDropdown.Item>
             </NavDropdown>
             <NavDropdown.Divider />
             <NavDropdown.Item href="/gbc/visu-etat-de-dossier" className='navbar-link'>Visu état de dossier</NavDropdown.Item>
             <NavDropdown.Item href="/gbc/saisie-maj-plan-comptable" className='navbar-link'>Sasie / MAJ Plan comptable</NavDropdown.Item>
             <NavDropdown.Item href="/gbc/saisie-maj-institution-financiere" className='navbar-link'>Sasie / MAJ Institution financière</NavDropdown.Item>
             <NavDropdown.Item href="/gbc/saisie-maj-type-de-precomptes" className='navbar-link'>Saisie / MAJ Type de précomptes</NavDropdown.Item>
             <NavDropdown.Item href="/gbc/maj-coupure-de-monnaie" className='navbar-link'>MAJ Coupure de monnaie</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown title="Structure" id="structure" menuVariant="dark" drop='end' className='navbar-link'>
               <NavDropdown.Item href="/gbc/structure-maj-l-entete" className='navbar-link'>Mettre à jour l'entete</NavDropdown.Item>
               <NavDropdown.Item href="/gbc/structure-maj-directions-et-service" className='navbar-link'>Mettre à jour directions et services</NavDropdown.Item>
               <NavDropdown.Item href="/gbc/structure-maj-liste-des-agents" className='navbar-link'>Mettre à jour liste des agents</NavDropdown.Item>
             </NavDropdown>
             <NavDropdown.Item href="/gbc/maj-parametres-situa-tresorerie" className='navbar-link'>MAJ paramètres Situa. trésorerie</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>MAJ tableau spécifique</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Comptes" id="comptes" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="#" className='navbar-link'>Sélection compte utilisable</NavDropdown.Item>
             <NavDropdown title="Etat de rapprochement" id="etat-de-rapprochement" menuVariant="dark" drop='end' className='navbar-link'>
               <NavDropdown.Item href="#" className='navbar-link'>Nouvel état</NavDropdown.Item>
               <NavDropdown.Item href="#" className='navbar-link'>Modification et réedition d'état</NavDropdown.Item>
               <NavDropdown.Item href="#" className='navbar-link'>Annulation d'état</NavDropdown.Item>
             </NavDropdown>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>MAJ report solde</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Cloture de l'exercice</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Dépenses" id="comptes" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="#" className='navbar-link'>Prendre en charge un mandat</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Rejeter un mandat</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Modifier une prise en charge de mandat</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Transmettre mandat(s) PEC</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Transmettre mandat(s) rejeté(s)</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Saisie / MAJ précompte sur mandat PEC</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Edition / Réedition de quittance d'ordre</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Nouveau paiement de mandat PEC</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Modifier paiement de mandat PEC</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Annuler paiement de mandat PEC</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Réediter le bordereau d'émission de mandat</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Saisie / MAJ de paiement pour lettrage</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Nouveau lettrage de paiement</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Modifier lettrage de paiement</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Annuler un lettrage de paiement</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Nouveau paiement à partir d'une retenue</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Modifier un paiement à partir d'une retenue</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Annuler un paiement à partir d'une retenue</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Réediter l'ordre de paiement</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Validation de paiement à partir d'une retenue</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Recettes" id="recettes" menuVariant="dark" className='navbar-link'>
             <NavDropdown title="Titre de recettes" id="titre-de-recettes" menuVariant="dark" drop='end' className='navbar-link'>
               <NavDropdown.Item href="#" className='navbar-link'>Prendre en charge / Rejeter</NavDropdown.Item>
               <NavDropdown.Item href="#" className='navbar-link'>Modifier compte de prise en charge</NavDropdown.Item>
               <NavDropdown.Divider />
               <NavDropdown.Item href="#" className='navbar-link'>Transmettre titre rejeté</NavDropdown.Item>
               <NavDropdown.Item href="#" className='navbar-link'>Marquer recouvré un titre PEC</NavDropdown.Item>
             </NavDropdown>
             <NavDropdown title="Recouvrement de recettes" id="recouvrement-de-recettes" menuVariant="dark" drop='end' className='navbar-link'>
               <NavDropdown.Item href="#" className='navbar-link'>Nouveau enregistrement</NavDropdown.Item>
               <NavDropdown.Item href="#" className='navbar-link'>Modifier un enregistrement</NavDropdown.Item>
               <NavDropdown.Divider />
               <NavDropdown.Item href="#" className='navbar-link'>Annuler un enregistrement</NavDropdown.Item>
             </NavDropdown>
             <NavDropdown title="Considération de précompte" id="consideration-de-precompte" menuVariant="dark" drop='end' className='navbar-link'>
               <NavDropdown.Item href="#" className='navbar-link'>Nouvelle considération</NavDropdown.Item>
               <NavDropdown.Item href="#" className='navbar-link'>Modification de considération</NavDropdown.Item>
             </NavDropdown>
             <NavDropdown.Item href="#" className='navbar-link'>Editer bord. titre à regulariser</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="caisse" id="caisse" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="#" className='navbar-link'>Saisir / Mettre à jour les paramètres</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Saisir / Mettre à jour opération d'encaissement</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Comptabiliser les recettes encaissées</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Annuler la comptabilisation des recettes encaissées</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Consulter recettes de caisses comptabilisées</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Opération de trésorerie" id="operation-de-tresorerie" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="#" className='navbar-link'>Nouvel état de versement</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Modification d'état de versement</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Réedition d'état de versement</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Annulation d'état de versement</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Nouvel enregistrement de reversement</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Modification d'enregistrement de reversement</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Réedition de quittance de reversement</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Annulation d'enregistrement de reversement</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Nouvelle saisie autre opération de trésorerie</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Modification de saisie autre opération de trésorerie</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Réedition de bordereau de mouvement</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Annulation de saisie autre opération de trésorerie</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Validation d'opération de trésorerie</NavDropdown.Item>
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
             <NavDropdown.Item href="#" className='navbar-link'>A partir d'une opération de trésorerie</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>A partir de chèque</NavDropdown.Item>
           </NavDropdown>
         
           <NavDropdown title="Impressions spécifiques" id="impressions-specifiques" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="#" className='navbar-link'>Plan comptable</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Nomenclature budgétaire</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Budget initial</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Budget définitif</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Réaménagements enregistrés</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Fiche de compte</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Situation des dépenses par Agent</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Situation des dépenses par Fournisseur</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link text-danger'>Situation d'éxecution budgétaire</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Journaux balance et grand livre des comptes</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Situation de trésorerie</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Archivage" id="archivage" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="#" className='navbar-link'>Numéric de copies scannées</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Exceptions" id="exception" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="#" className='navbar-link'>Rétrograder un mandat pris en charge ou rejeté</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Rétrograder un titre pris en charge</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Rétrograder une opération de trésorerie validé</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Rétrograder paiement de retenue validé</NavDropdown.Item>
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

export default AcAdm;
