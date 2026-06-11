import { FunctionComponent } from "react";
import {Nav,Navbar,NavDropdown} from 'react-bootstrap'

interface IAppProps {
    gestionCourante : string,
    gestionProchaine : string
}

const AcInv : FunctionComponent<IAppProps> =()=> {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <div style={{ marginLeft: '3px'}}>
                <Navbar.Toggle aria-controls= "basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <NavDropdown title="Paramètrage" id="parametrage" menuVariant="dark" className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Visu paramètres non modifiables</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link' disabled>Mettre à jour compte et mode paie bénéficiaire</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link' disabled>Mettre à jour la liste des tiers autre que perso.</NavDropdown.Item>                            
                        </NavDropdown>

                        <NavDropdown title="Traitement solde mensuelle" id="traitement-solde-mensuelle" menuVariant="dark" className="navbar-link" disabled>
                            <NavDropdown.Item href="#" className='navbar-link'>MAJ Précompte sur salaire</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link' disabled>Valider Saisie de reversement précpte</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'><b>Visu projet livre de paie bulletins</b></NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link' disabled>Accepter/Refuser pr mandatement</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'><b>Edit° bulletins états et supports</b></NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link' disabled>Prendre en charge les mandants</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Modifier compte du PEC</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Transmission" id="transmission" menuVariant="dark" className="navbar-link">
                            <NavDropdown title="Traitement solde mensuelle" id="traitement-solde-mensuelle" menuVariant="dark" drop='end' className="navbar-link" disabled>
                                <NavDropdown.Item href="#" className='navbar-link'>Accepté pour mandatement</NavDropdown.Item>
                                <NavDropdown.Item href="#" className='navbar-link'>Refusé pour mandatement</NavDropdown.Item>
                            </NavDropdown>
                        </NavDropdown>
                    
                        <NavDropdown title="Consultation" id="consultation" menuVariant="dark" className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Bulletin d'un agent</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Rappel d'un agent</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Précompte</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Précompte d'un agent</NavDropdown.Item>                        
                        </NavDropdown>

                        <NavDropdown title="Prévision" id="prevision" menuVariant="dark" className="navbar-link" disabled>
                            <NavDropdown.Item href="#" className='navbar-link'>Charges de personnel</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Exception" id="exception" menuVariant="dark" className="navbar-link" disabled>
                            <NavDropdown.Item href="#" className='navbar-link'>Annuler l'acceptation ou le refus pour mandat d'un traitement</NavDropdown.Item>
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
export default AcInv;