import { Route, Routes } from "react-router-dom";
import { GimInactiveProvider } from "./helpers/inactive-provider";
import GimPrivatesRoutes from "./gim-privates-routes";
import PageNotFound from "../pages/page-not-found";
import GimLogin from "./pages/login";
import Gim from "./pages/gim";
import ParametresParametresSystemes from "./pages/parametres-parametres-systemes";
import ParametresSaisieMiseAjourFournisseursOuDonateurs from "./pages/parametres-saisie-mise-a-jour-fournisseurs-ou-donateurs";
import ParametresSaisieMiseAjourMagasinsOuEntrepots from "./pages/parametres-saisie-mise-a-jour-magasins-ou-entrepots";


const GimRoutes = () => {
    return (
        <GimInactiveProvider>
            <Routes>
                <Route path='login' element={<GimLogin />} />
                <Route element={<GimPrivatesRoutes redirectPath='/gim/login' />} >
                    <Route index element={<Gim />} />
                    {/* Les autres routes sans grh*/}
                    <Route path="parametres-parametres-systemes" element= {<ParametresParametresSystemes/>}/>
                    <Route path="parametres-saisie-mise-a-jour-fournisseurs-ou-donateurs" element={<ParametresSaisieMiseAjourFournisseursOuDonateurs/>}/>
                    <Route path="paremetres-saisie-mise-a-jour-magasins-ou-entrepots" element={<ParametresSaisieMiseAjourMagasinsOuEntrepots/>}/>
                </Route> 

                <Route path="*" element={<PageNotFound />} />           
            </Routes>
        </GimInactiveProvider>
    );
};

export default GimRoutes;
