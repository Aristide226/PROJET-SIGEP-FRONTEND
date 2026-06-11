import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { LignesModifieesRecettesPourAnnulerValidationModificationBudgetViewDto } from "../models/lignes-modifiees-recettes-pour-annuler-validation-modification-view";

export default class LignesModifieesRecettesPourAnnulerValidationModificationBudgetViewService {

    static getLignesModifieesRecettesPourAnnulerValidationModificationBudget(gestion: number, idBudget: number, codBma: number): Promise<LignesModifieesRecettesPourAnnulerValidationModificationBudgetViewDto[]> {
        return axios.get(API_URLS.LIGNES_MODIFIESS_RECETTES_POUR_ANNULER_VALIDATION_MODIFICATION_BUDGET_VIEW_URL + 'getLignesModifieesRecettesPourAnnulerValidationModificationBudget/' + gestion + '/' + idBudget + '/' + codBma)
        .then( response => response.data);
    }
}