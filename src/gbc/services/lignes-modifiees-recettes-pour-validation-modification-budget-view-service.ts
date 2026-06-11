import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { LignesModifieesRecettesPourValidationModificationBudgetViewDto } from "../models/lignes-modifiees-recettes-pour-validation-modification-budget-view";

export default class LignesModifieesRecettesPourValidationModificationBudgetViewService {

    static getLignesModifieesRecettesPourValidationModificationBudget(gestion: number, idBudget: number, codBma: number): Promise<LignesModifieesRecettesPourValidationModificationBudgetViewDto[]> {
        return axios.get(API_URLS.LIGNES_MODIFIESS_RECETTES_POUR_VALIDATION_MODIFICATION_BUDGET_VIEW_URL + 'getLignesModifieesRecettesPourValidationModificationBudget/' + gestion + '/' + idBudget + '/' + codBma)
        .then( response => response.data);
    }
}