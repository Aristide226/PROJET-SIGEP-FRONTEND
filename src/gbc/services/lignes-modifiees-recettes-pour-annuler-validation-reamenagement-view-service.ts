import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { LignesModifieesRecettesPourAnnulerValidationReamenagementViewDto } from "../models/lignes-modifiees-recettes-pour-annuler-validation-reamenagement-view";

export default class LignesModifieesRecettesPourAnnulerValidationReamenagementViewService {

    static getLignesModifieesRecettesPourAnnulerValidationReamenagement(gestion: number, idBudget: number, codReam: number): Promise<LignesModifieesRecettesPourAnnulerValidationReamenagementViewDto[]> {
        return axios.get(API_URLS.LIGNES_MODIFIESS_RECETTES_POUR_ANNULER_VALIDATION_REAMENAGEMENT_VIEW_URL + 'getLignesModifieesRecettesPourAnnulerValidationReamenagement/' + gestion + '/' + idBudget + '/' + codReam)
        .then( response => response.data);
    }
}