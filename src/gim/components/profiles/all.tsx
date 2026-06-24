import { FunctionComponent } from "react";
import {Nav,Navbar,NavDropdown} from "react-bootstrap"

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
                    <NavDropdown title="Paramètres" id="parametres" menuVariant="dark" className="navbar-link">
                        <NavDropdown.Item href="/gim/parametres-parametres-systemes">Paramètres systèmes</NavDropdown.Item>
                        <NavDropdown title="Saisie / Mise à jour" id="saisie-mise-a-jour" menuVariant="dark" drop='end' className="navbar-link">
                            <NavDropdown.Item href="/gim/parametres-saisie-mise-a-jour-fournisseurs-ou-donateurs" className='navbar-link'>Fournisseurs ou Donateurs</NavDropdown.Item>
                            <NavDropdown.Item href="/gim/paremetres-saisie-mise-a-jour-magasins-ou-entrepots" className='navbar-link'>Magasins ou entrepôts</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Nomenclature Budgétaire</NavDropdown.Item>
                            <NavDropdown.Item href="/gim/paremetres-saisie-mise-a-jour-parametres-genereaux" className='navbar-link'>Paramètres généraux</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>structures Administratives</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Structures Territoriales</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Site</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown.Item href="#" className='navbar-link'>Mise à jour Agents</NavDropdown.Item>
                        <NavDropdown title="Utilisateur" id="utilisateur" menuVariant="dark" drop='end' className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Saisir /MAJ</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Changer le mot de passe</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Consulter</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown.Item href="#" className='navbar-link'>MAJ Entête</NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="Entrée de Bien" id="entree-de-bien" menuVariant="dark" className="navbar-link">
                        <NavDropdown title="En magasin ou entrepôt" id="en-magasin-ou-entrepot" menuVariant="dark" drop='end' className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Nouvelle saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mise à jour de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annulation de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Consultation/Réédition de OEM</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown.Item href="#" className='navbar-link'>Visue Ordre d'entrée en Magasin</NavDropdown.Item>
                        <NavDropdown title="En affectation directe" id="en-affectation-directe" menuVariant="dark" drop='end' className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Nouvelle saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mise à jour de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annulation de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Consultation/Réédition de OEM</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown.Item href="#" className='navbar-link'>Visue Ordre d'entrée en Affectation</NavDropdown.Item>
                        <NavDropdown title="Autorisation de mandatement" id="autorisation-de-mandatement" menuVariant="dark" drop='end' className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Nouvelle saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mise à jour de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annulation de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Consultation/Réédition autorisation</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown.Item href="#" className='navbar-link'>Validation de saisie</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link'>Validation / Rejet de OEM</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link'>Annuler une validation de OEM</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link'>Visue / Edition matricule de bien</NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="Mouvements de Biens" id="mouvement-de-biens" menuVariant="dark" className="navbar-link">
                        <NavDropdown title="Affectation de biens" id="affectation-de-biens" menuVariant="dark" drop='end' className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Nouvelle Saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mise à jour de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annulation de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Validation de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Consultation/Réédition de BAM</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Validation / Rejet de BAM</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annuler une validation de BAM</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Mutation de biens" id="mutation-de-biens" menuVariant="dark" drop='end' className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Nouvelle saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mise à jour de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annulation de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Validation de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Consultation/Réédition de BMM</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Validation / Rejet de BMM</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annuler une validation de BMM</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Transfert de biens en magasin" id="transfert-de-biens-en-magasin" menuVariant="dark" drop='end' className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Nouvelle saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mise à jour de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annulation de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Validation de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Consultation/Réédition de BSMM</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Validation / Rejet de BSMM</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annuler une validation de BSMM</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Sortie temporaire de biens" id="sortie-temporaire-de-biens" menuVariant="dark" drop='end' className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Nouvelle saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mise à jour de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annulation de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Validation de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Consultation/Réédition de BSTM</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Validation / Rejet de BSTM</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annuler une validation de BSTM</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Sortie définitive de biens" id="sortie-definitive-de-biens" menuVariant="dark" drop='end' className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Nouvelle saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mise à jour de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annulation de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Validation de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Consultation/Réédition de OSDM</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Validation / Rejet de OSDM</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annuler une validation de OSDM</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Retour de bien après sortie temporaire" id="retour-de-bien-apres-sortie-temporaire" menuVariant="dark" drop='end' className="navbar-link">
                            <NavDropdown.Item href="#" className='navbar-link'>Nouvelle saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Mise à jour de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annulation de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Validation de saisie</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Consultation/Réédition de BRM</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Validation / Rejet de BRM</NavDropdown.Item>
                            <NavDropdown.Item href="#" className='navbar-link'>Annuler une validation de BRM</NavDropdown.Item>
                        </NavDropdown>
                    </NavDropdown>

                    <NavDropdown title="Inventaire" id="inventaire" menuVariant="dark" className="navbar-link">
                        <NavDropdown.Item href="#" className='navbar-link'>Mettre en place l'inventaire</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link'>Saisir/MAJ des biens inventoriés</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link'>Consulter/Editer la fiche d'inventaire</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link'>Valider la saisie des biens inventoriés</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link'>Annuler la saisie des biens inventoriés</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link'>Valider/Rejeter la fiche d'inventaire</NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="Edition" id="edition" menuVariant="dark" className="navbar-link">
                        <NavDropdown.Item href="#" className='navbar-link'>Livre Journal des matières</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link'>Fiche de stock</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link'>Fiche Détenteur</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link'>Fiches de codification</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link'>Etats statistiques</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link'>Tableau d'amortissement d'un bien</NavDropdown.Item>
                        <NavDropdown.Item href="#" className='navbar-link'>Relévé du bien</NavDropdown.Item>
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
export default All;