import { FunctionComponent, useState } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';

interface IAppProps {
  gestionCourante: string,
  gestionProchaine: string,
}

const AdAdm: FunctionComponent<IAppProps> = (props) => {

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
             <NavDropdown.Item href="/gbc/maj-pieces-justificatives" className='navbar-link'>MAJ pièces justificatives</NavDropdown.Item>
             <NavDropdown title="Nomenclature budgétaire" id="nomenclature-budgetaire" menuVariant="dark" drop='end' className='navbar-link'>
               <NavDropdown.Item href="#" className='navbar-link'>Mettre à jour le texte règlementaire</NavDropdown.Item>
               <NavDropdown.Item href="/gbc/maj-les-comptes-budgetaires-nomenclature-budgetaire" className='navbar-link'>Mettre à jour les comptes budgétaires</NavDropdown.Item>
             </NavDropdown>
             <NavDropdown.Item href="/gbc/saisie-maj-institution-financiere" className='navbar-link'>Sasie / MAJ Institution financière</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown title="Structure" id="structure" menuVariant="dark" drop='end' className='navbar-link'>
               <NavDropdown.Item href="/gbc/structure-maj-l-entete" className='navbar-link'>Mettre à jour l'entete</NavDropdown.Item>
               <NavDropdown.Item href="/gbc/structure-maj-directions-et-service" className='navbar-link'>Mettre à jour directions et services</NavDropdown.Item>
               <NavDropdown.Item href="/gbc/structure-maj-liste-des-agents" className='navbar-link'>Mettre à jour liste des agents</NavDropdown.Item>
             </NavDropdown>
             <NavDropdown.Item href="/gbc/maj-parametre-decision" className='navbar-link'>MAJ paramètres décision</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>MAJ tableau spécifique</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Budget" id="budget" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="/gbc/budget-maj-le-budget" className='navbar-link'>Mettre à jour le budget { props.gestionCourante }</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="/gbc/budget-saisie-du-budget" className='navbar-link'>Saisie du budget de { props.gestionProchaine }</NavDropdown.Item>
             <NavDropdown.Item href="/gbc/budget-mettre-en-place-le-budget" className='navbar-link'>Mettre en place le budget de  { props.gestionProchaine }</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="/gbc/budget-creer-un-projet-de-reamenagement" className='navbar-link'>Créer un projet de réamenagement</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Imprimer un réamenagement</NavDropdown.Item>
             <NavDropdown.Item href="/gbc/budget-annuler-validation-dun-projet-de-reamenagement" className='navbar-link'>Annuler la validation d'un réaménagement</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Contrats" id="contrats" menuVariant="dark" className='navbar-link'>
             <NavDropdown title="Plan de passation" id="plan-de-passation" menuVariant="dark" drop='end' className='navbar-link'>
               <NavDropdown.Item href="/gbc/contrats-plan-de-passation-reediter-le-ppm" className='navbar-link'>Réediter le PPM</NavDropdown.Item>
             </NavDropdown>
             <NavDropdown.Item href="#" className='navbar-link'>Saisie / MAJ fournisseurs</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="/gbc/contrats-nouvelle-saisie-maj" className='navbar-link'>Nouvelle saisie / Mise à jour</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown title="Avenant" id="avenant" menuVariant="dark" drop="end" className='navbar-link'>
               <NavDropdown.Item href="#" className='navbar-link'>Nouvelle saisie</NavDropdown.Item>
               <NavDropdown.Item href="#" className='navbar-link'>Correction</NavDropdown.Item>
               <NavDropdown.Divider />
               <NavDropdown.Item href="#" className='navbar-link'>Annulation de saisie</NavDropdown.Item>
             </NavDropdown>
             <NavDropdown.Item href="#" className='navbar-link'>Paramètres d'immatriculation</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Engagements" id="engagements" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="/gbc/engagements-creer-un-engagment" className='navbar-link'>Créer un engagement</NavDropdown.Item>
             <NavDropdown.Item href="/gbc/engagements-modifier-un-engagment" className='navbar-link'>Modifier un engagement</NavDropdown.Item>
             <NavDropdown.Item href="/gbc/engagements-reediter-bon-d-engagement" className='navbar-link'>Réediter bon d'engagement</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown title="Correction montant" id="correction-de-montant-eng" menuVariant="dark" drop="end" className='navbar-link'>
               <NavDropdown.Item href="/gbc/engagements-correction-montant-creer-un-bon-d-annulation" className='navbar-link'>Créer un bon d'annulation</NavDropdown.Item>
               <NavDropdown.Item href="/gbc/engagements-correction-montant-modifier-un-bon-d-annulation" className='navbar-link'>Modifier un bon d'annulation</NavDropdown.Item>
               <NavDropdown.Item href="/gbc/engagements-correction-montant-reediter-un-bon-d-annulation" className='navbar-link'>Réediter le bon d'annulation</NavDropdown.Item>
               <NavDropdown.Divider />
               <NavDropdown.Item href="/gbc/engagements-correction-montant-abandonner-la-correction" className='navbar-link'>Abandonner la correction</NavDropdown.Item>
             </NavDropdown>
             <NavDropdown.Item href="/gbc/engagements-abandonner-un-engagement" className='navbar-link'>Abandonner un engagement</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="/gbc/engagements-valider-un-engagement" className='navbar-link'>Valider un nouveau engagment</NavDropdown.Item>
             <NavDropdown.Item href="/gbc/engagements-transmettre-projet-d-engagement" className='navbar-link'>Transmettre projet d'engagment</NavDropdown.Item>
             <NavDropdown.Item href="/gbc/engagements-reception-d-engagement" className='navbar-link'>Réception d'engagement</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Liquidation" id="liquidation" menuVariant="dark" className='navbar-link'>
             <NavDropdown title="Demande de liquidation" id="demande-de-liquidation" menuVariant="dark" drop='end' className='navbar-link'>
               <NavDropdown.Item href="/gbc/liquidation-demande-de-liquidation-creer-recu" className='navbar-link'>Créer reçu</NavDropdown.Item>
               <NavDropdown.Item href="/gbc/liquidation-demande-de-liquidation-modifier-recu" className='navbar-link'>Modifier reçcu</NavDropdown.Item>
               <NavDropdown.Item href="/gbc/liquidation-demande-de-liquidation-reediter-recu" className='navbar-link'>Réediter reçu</NavDropdown.Item>
               <NavDropdown.Divider />
               <NavDropdown.Item href="/gbc/liquidation-demande-de-liquidation-annuler-recu" className='navbar-link'>Annuler réçu</NavDropdown.Item>
             </NavDropdown>
             <NavDropdown.Item href="/gbc/liquidation-creer-une-liquidation" className='navbar-link'>Créer une liquidation</NavDropdown.Item>
             <NavDropdown.Item href="/gbc/liquidation-modifier-une-liquidation" className='navbar-link'>Modifier une liquidation</NavDropdown.Item>
             <NavDropdown.Item href="/gbc/liquidation-reediter-bordereau-de-liquidation" className='navbar-link'>Réediter bordereau de liquidation</NavDropdown.Item>
             <NavDropdown title="Correction de montant" id="correction-de-montant-liq" menuVariant="dark" drop='end' className='navbar-link'>
               <NavDropdown.Item href="#" className='navbar-link'>Nouvelle</NavDropdown.Item>
               <NavDropdown.Item href="#" className='navbar-link'>Modification</NavDropdown.Item>
               <NavDropdown.Item href="#" className='navbar-link'>Réedition support</NavDropdown.Item>
               <NavDropdown.Divider />
               <NavDropdown.Item href="#" className='navbar-link'>Abandon</NavDropdown.Item>
             </NavDropdown>
             <NavDropdown.Divider />
             <NavDropdown.Item href="/gbc/liquidation-abandonner-une-liquidation" className='navbar-link'>Abandonner une liquidation</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="/gbc/liquidation-valider-une-liquidation" className='navbar-link'>Valider une liquidation</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Transmettre une liquidation</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Mandat" id="correction-de-montant-liq" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="/gbc/mandat-edition-maj-de-bordereau-d-emission" className='navbar-link'>Edition / MAJ de bordereau d'émission</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Saisie / MAJ justificatif de déblocage de fonds</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Valider saisie de justificatifs de déblocage de fonds</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Annuler validation de saisie de justificatifs</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Consulter saisie de justificatifs</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Facturation" id="facturation" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="#" className='navbar-link'>Proforma ou devis</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Facture définitive</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Réedition</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Validation</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Annulation de validation</NavDropdown.Item>
           </NavDropdown>

           <NavDropdown title="Titre recette" id="titre-recette" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="#" className='navbar-link'>A partir de recouv. sans titre</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>A partir de précompte sur mandat</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>A partir de facture</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Création</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Modification</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Abandon</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Réedition</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Validation d'un projet</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Transmettre un titre à CF</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#" className='navbar-link'>Edition de bord. d'émission</NavDropdown.Item>
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

           <NavDropdown title="Exceptions" id="exception" menuVariant="dark" className='navbar-link'>
             <NavDropdown.Item href="/gbc/exceptions-retrograder-un-engagement" className='navbar-link'>Rétrograder un engagement</NavDropdown.Item>
             <NavDropdown.Item href="/gbc/exceptions-retrograder-une-liquidation" className='navbar-link'>Rétrograder une liquidation</NavDropdown.Item>
             <NavDropdown.Item href="#" className='navbar-link'>Rétrograder un titre de recette</NavDropdown.Item>
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

export default AdAdm;
