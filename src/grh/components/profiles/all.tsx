import { FunctionComponent } from "react";
import { Nav,Navbar,NavDropdown } from "react-bootstrap";

interface IAppProps {
    gestionCourante : string,
    gestionProchaine : string
}

const All : FunctionComponent<IAppProps> =()=> {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <div style={{ marginLeft: '3px'}}>
                <Navbar.Toggle aria-controls= "basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <NavDropdown title="Utilisateur" id="utilisateur" menuVariant="dark" className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Changer de mot de passe</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Consulter la liste</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Paramètrage" id="parametrage" menuVariant="dark" className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Visu paramètres non modifiables</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mettre à jour le régime et barèmes</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mettre à jour les éléments de salaire</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mettre à jour compte et mode paie bénéficiaire</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mettre à jour Visas, Ampliataires et article acte</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mettre à jour les informations de la structure</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mettre à jour la liste direction et services</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mettre à jour la liste des tiers autre que perso</NavDropdown.Item>                            
                        </NavDropdown>
                        <NavDropdown title="Traitement administratif" id="traitement-administratif" menuVariant="dark" className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Maj liste d'agent</NavDropdown.Item>
                            <NavDropdown title="Acte d'entrée" id="acte-dentree" menuVariant="dark" drop='end' className="navbar-link">
                                <NavDropdown.Item href="#" className='navbar-link'>Générer / Mettre à jour l'acte d'engagement</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Rééditer un acte d'engagement</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Annuler un acte d'engagement</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Acte modifiant classif." id="acte-modifiant-classif" menuVariant="dark" drop='end' className="navbar-link">
                                <NavDropdown.Item href="#" className='navbar-link'>Saisir / Mettre à jour note</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Générer / Mettre à jour d'acte</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Rééditer un acte</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Annuler saisie d'acte</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Saisir / Mettre à jour acte manuel d'avancement</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Affectation" id="affectation" menuVariant="dark" drop='end' className="navbar-link">
                                <NavDropdown.Item href="#" className='navbar-link'>Générer / Mettre à jour la décision</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Rééditer une décision</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Annuler une décision</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Saisir / Mettre à jour acte manuel</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Prise de service" id="prise-de-service" menuVariant="dark" drop='end' className="navbar-link">
                                <NavDropdown.Item href="#" className='navbar-link'>Générer / Mettre à jour le certificat de prise de service</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Rééditer le certificat de prise de service</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Annuler le certificat de prise de service</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Saisir / Mettre à jour acte manuel de prise de service</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Nomination" id="nomination" menuVariant="dark" drop='end' className="navbar-link">
                                <NavDropdown.Item href="#" className='navbar-link'>Générer / Mettre à jour l'acte</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Rééditer acte</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Annuler acte</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Saisir / Mettre à acte manuel</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Congés" id="conges" menuVariant="dark" drop='end' className="navbar-link">
                                <NavDropdown.Item href="#" className='navbar-link'>Générer / Mettre à jour acte de congé</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Rééditer acte de congé généré</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Annuler acte de congé généré</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Saisir / Mettre à jour acte manuel de congé</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Fin d'engagement" id="fin-dengagement" menuVariant="dark" drop='end' className="navbar-link">
                                <NavDropdown.Item href="#" className='navbar-link'>Générer/Mettre à jour acte</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Rééditer acte de fin</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Annuler acte de fin</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Saisir / Mettre à jour acte de fin manuel</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Cessation de service" id="cessation-de-service" menuVariant="dark" drop='end' className="navbar-link">
                                <NavDropdown.Item href="#" className='navbar-link'>Générer/Mettre à jour acte de cessation</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Rééditer acte de cessation</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Annuler acte de cessation</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Saisir/Mettre à jour acte de cessation manuel</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown.Item href="#" className='navbar-link'>Situation matrimoniale</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Valider acte</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Viser/refuser visa d'acte</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'><b>Marquer un acte signé</b></NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Traitement solde mensuelle" id="traitement-solde-mensuelle" menuVariant="dark" className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>1er salaire indication ou base</NavDropdown.Item>
                            <NavDropdown title="Correct° Salaire indiciaire ou base" id="correct-salaire-indiciaire-ou-base" menuVariant="dark" drop='end' className="navbar-link">
                                <NavDropdown.Item href="#" className='navbar-link'>Saisr / Mettre à jour</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Traiter un rappel ponctuel</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Correction Indemnités" id="correction-indemnites" menuVariant="dark" drop='end' className="navbar-link">
                                <NavDropdown.Item href="#" className='navbar-link'>Saisir / Mettre à jour</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Traiter un rappel ponctuel</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Enfants à charge" id="enfants-a-charge" menuVariant="dark" drop='end' className="navbar-link">
                                <NavDropdown.Item href="#" className='navbar-link'>Saisir / Mettre à jour la liste</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Traiter un rappel ponctuel</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown.Item href="#" className='navbar-link'>MAJ Précompte sur salaire</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>MAJ Classification origine</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Valider Saisie de reversement précpte</NavDropdown.Item>
                            <NavDropdown title="Cessation de paiement" id="cessation-de-paiement" menuVariant="dark" drop='end' className="navbar-link">
                                <NavDropdown.Item href="#" className='navbar-link'>Saisir / Mettre à jour</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Rééditer le certificat</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown.Item href="#" className='navbar-link'>MAJ mode de paie. d'un agent</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'><b>Visu projet livre de paie bulletins</b></NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Validation de traitement</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Vérification de traitement en projet</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Accepter/Refuser pr mandatement</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'><b>Calcul solde mensuelle du mois</b></NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Générer engagements et mandats</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>MAJ engagements et mandants</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'><b>Comptabiliser les engagements</b></NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'><b>Edit° bulletins états et supports</b></NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Prendre en charge les mandants</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Modifier compte du PEC</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Transmission" id="transmission" menuVariant="dark" className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Actes administratif</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Traitement solde mensuelle</NavDropdown.Item>
                            <NavDropdown title="Acte administratif" id="acte-administratif" menuVariant="dark" drop='end' className="navbar-link">
                                <NavDropdown.Item href="#" className='navbar-link'>Visé</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Visa est refusé</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Traitement solde mensuelle" id="traitement-solde-mensuelle" menuVariant="dark" drop='end' className="navbar-link">
                                <NavDropdown.Item href="#" className='navbar-link'>Validé</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Rejeté</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Traitement solde mensuelle" id="traitement-solde-mensuelle" menuVariant="dark" drop='end' className="navbar-link">
                                <NavDropdown.Item href="#" className='navbar-link'>Accepté pour mandatement</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Refusé pour mandatement</NavDropdown.Item>
                            </NavDropdown>
                        </NavDropdown>
                    
                        <NavDropdown title="Traitement hors solde" id="traitement-hors-solde" menuVariant="dark" className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Avance de solde</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Indemnité départ à la retraite</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Indemnité de licenciement</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Indemnité de fin de contrat</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Rappels sur éléments de salaire</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Consultation" id="consultation" menuVariant="dark" className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Bulletin d'un agent</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Rappel d'un agent</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Précompte</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Précompte d'un agent</NavDropdown.Item>                        
                        </NavDropdown>

                        <NavDropdown title="Prévision" id="prevision" menuVariant="dark" className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Charges de personnel</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Exception" id="exception" menuVariant="dark" className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Annuler la Validation d'un acte administratif</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annuler le visa ou le refus de visa d'un acte administratif</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annuler la validation de traitement de la solde mensuelle</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annuler la validation ou le rejet de traitement de la solde mensuelle</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annuler le calcul de la solde mensuelle</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annuler l'acceptation ou le refus pour mandat d'un traitement</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annuler la génération des engagements</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annuler la comptabilisation des engagements</NavDropdown.Item>
                        </NavDropdown>
                        
                        <NavDropdown title="Elèves boursiers" id="eleves-boursiers" menuVariant="dark" className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Mettre à jour la liste</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Saisir / annuler date de sortie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Traiter bourse</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    )
}
export default All;