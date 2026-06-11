import { FunctionComponent } from "react";
import {Nav,Navbar,NavDropdown} from "react-bootstrap"

interface IAppProps {
    gestionCourante : string,
    gestionProchaine : string
}

const GimC : FunctionComponent<IAppProps> =()=> {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <div style={{ marginLeft: '3px'}}>
            <Navbar.Toggle aria-controls= "basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav>
                    <NavDropdown title="Paramètres" id="parametres" menuVariant="dark" className="navbar-link">
                        <NavDropdown.Item>Paramètres systèmes</NavDropdown.Item>
                        <NavDropdown title="Saisie / Mise à jour" id="saisie-mise-a-jour" menuVariant="dark" drop='end' className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Paramètres généraux</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Utilisateur" id="utilisateur" menuVariant="dark" drop='end' className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Changer le mot de passe</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Consulter</NavDropdown.Item>
                        </NavDropdown>
                    </NavDropdown>

                    <NavDropdown title="Edition" id="edition" menuVariant="dark" className="navbar-link">
                        <NavDropdown.Item href="#" className='navbar-link' disabled>Livre Journal des matières</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link'>Fiche de stock</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link'>Fiche Détenteur</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link'>Fiches de codification</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link'>Etats statistiques</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link' disabled>Tableau d'amortissement d'un bien</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link' disabled>Relévé du bien</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link'>Fiche recapitulative selon critères</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link'>Etait détaillé des biens</NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="Gestion de biens fongibles" id="gestion-de-biens-fongibles" menuVariant="dark" className="navbar-link">
                        <NavDropdown.Item href="#" className='navbar-link'>Paramètres</NavDropdown.Item>
                        <NavDropdown title="Entrée" id="entree" menuVariant="dark" drop='end' className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Créer un bon d'entrée</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Modifier un bon d'entrée</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annuler un bon d'entrée</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Réimprimer un bon d'entrée</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Valider un bon d'entrée</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annuler une validation de bon</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown.Item href="#" className='navbar-link'>Sortie</NavDropdown.Item>
                        <NavDropdown title="Liste" id="liste" menuVariant="dark" drop='end' className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Des bons d'entrée</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Des bons de sortie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Des biens fongibles</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Situation" id="situation" menuVariant="dark" drop='end' className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Livre journal</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Approvisionnement par direction et service</NavDropdown.Item>
                        </NavDropdown>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
            </div>
        </Navbar>
    )
}
export default GimC;