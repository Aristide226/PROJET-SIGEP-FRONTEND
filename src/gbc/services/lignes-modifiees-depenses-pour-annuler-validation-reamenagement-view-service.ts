import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { LignesModifieesDepensesPourAnnulerValidationReamenagementViewDto } from "../models/lignes-modifiees-depenses-pour-annuler-validation-reamenagement-view";

export default class LignesModifieesDepensesPourAnnulerValidationReamenagementViewService {

    static getLignesModifieesDepensesPourAnnulerValidationReamenagement(gestion: number, idBudget: number, codReam: number): Promise<LignesModifieesDepensesPourAnnulerValidationReamenagementViewDto[]> {
        return axios.get(API_URLS.LIGNES_MODIFIESS_DEPENSES_POUR_ANNULER_VALIDATION_REAMENAGEMENT_VIEW_URL+ 'getLignesModifieesDepensesPourAnnulerValidationReamenagement/' + gestion + '/' + idBudget + '/' + codReam)
        .then( response => response.data);
    }
}