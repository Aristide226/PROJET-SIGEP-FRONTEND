import { Route, Routes } from "react-router-dom";
import Gbc from "./pages/gbc";
import ContratsPlanDePassationMajExecutionPhysiqueContrat from "./pages/contrats-plan-de-passation-saisir-maj-execution-physique-dun-contrat";
import ContratsPlanDePassationSaisirMajDac from "./pages/contrats-plan-de-passation-saisir-maj-d'un-dac";
import ContratsPlanDePassationValiderUneModification from "./components/contrats-plan-de-passation-valider-une-modification";
import ContratsPlanDePassationSaisirMajUneModification from "./pages/contrats-plan-de-passation-saisir-maj-une-modification";
import ContratsPlanDePassationReediterLePpm from "./pages/contrats-plan-de-passation-reediter-le-ppm";
import ContratsPlanDePassationElaborerLeProjetDePpm from "./pages/contrats-plan-de-passation-elaborer-le-projet-de-ppm";
import ContratsPlanDePassationMettreEnPlaceLeProjetDePpm from "./pages/contrats-plan-de-passation-mettre-en-place-le-projet-de-ppm";
import Login from "./pages/login";
import GbcPrivatesRoutes from "./gbc-privates-routes";
import PageNotFound from "../pages/page-not-found";
import { InactiveProvider } from "./helpers/inactive-provider";


const GbcRoutes = () => {
    return (
        <InactiveProvider>
            <Routes>
                <Route path='login' element={<Login />} />
                <Route element={<GbcPrivatesRoutes redirectPath='/gbc/login' />} >
                    <Route index element={<Gbc />} />
                
                    {/** Aristide */}
                    <Route path="contrats-plan-de-passation-elaborer-le-projet-ppm" element={<ContratsPlanDePassationElaborerLeProjetDePpm/>}/>
                    <Route path="contrats-plan-de-passation-mettre-en-place-le-projet-de-ppm" element= {<ContratsPlanDePassationMettreEnPlaceLeProjetDePpm/>}/>
                    <Route path="contrats-plan-de-passation-saisir-maj-une-modification" element = {< ContratsPlanDePassationSaisirMajUneModification/>}/>
                    <Route path='contrats-plan-de-passation-valider-une-modification' element ={<ContratsPlanDePassationValiderUneModification/>}/>
                    <Route path="contrats-plan-de-passation-reediter-le-ppm" element = {<ContratsPlanDePassationReediterLePpm/>}/>
                    <Route path="contrats-plan-de-passation-saisir-maj-dac" element= {<ContratsPlanDePassationSaisirMajDac/>}/>
                    <Route path="contrats-plan-de-passation-saisir-maj-execution-physique-contrat" element= {<ContratsPlanDePassationMajExecutionPhysiqueContrat/>}/>
                    {/** Aristide */}

                </Route> 

                <Route path="*" element={<PageNotFound />} />           
            </Routes>
        </InactiveProvider>
    );
};

export default GbcRoutes;
