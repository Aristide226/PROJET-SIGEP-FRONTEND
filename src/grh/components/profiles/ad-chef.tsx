import { FunctionComponent } from "react";
import {Nav,Navbar,NavDropdown} from 'react-bootstrap'

interface IAppProps {
    gestionCourante : string,
    gestionProchaine : string
}

const AdChef : FunctionComponent<IAppProps> =()=> {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <div style={{ marginLeft: '3px'}}>
                <Navbar.Toggle aria-controls= "basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <NavDropdown title="Paramètrage" id="parametrage" menuVariant="dark" className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Visu paramètres non modifiables</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mettre à jour le régime et barèmes</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mettre à jour les éléments de salaire</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mettre à jour compte et mode paie bénéficiaire</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mettre à jour la liste direction et services</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mettre à jour la liste des tiers autre que perso</NavDropdown.Item>                            
                        </NavDropdown>

                        <NavDropdown title="Traitement solde mensuelle" id="traitement-solde-mensuelle" menuVariant="dark" className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'><b>Visu projet livre de paie bulletins</b></NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link' disabled>Vérification de traitement en projet</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link' disabled>Calcul solde mensuelle du mois</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Générer engagements et mandats</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>MAJ engagements et mandants</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'><b>Comptabiliser les engagements</b></NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'><b>Edit° bulletins états et supports</b></NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Transmission" id="transmission" menuVariant="dark" className="navbar-link">
                            <NavDropdown title="Traitement solde mensuelle" id="traitement-solde-mensuelle" menuVariant="dark" drop='end' className="navbar-link">
                                <NavDropdown.Item href="#" className='navbar-link'>Validé</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Rejeté</NavDropdown.Item>
                            </NavDropdown>
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

                        <NavDropdown title="Exception" id="exception" menuVariant="dark" className="navbar-link" disabled>
                            <NavDropdown.Item href="#" className='navbar-link'>Annuler la validation ou le rejet de traitement de la solde mensuelle</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annuler le calcul de la solde mensuelle</NavDropdown.Item>
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
export default AdChef;