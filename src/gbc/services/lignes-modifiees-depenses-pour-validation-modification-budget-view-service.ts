import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { LignesModifieesDepensesPourValidationModificationBudgetViewDto } from "../models/lignes-modifiees-depenses-pour-validation-modification-budget-view";

export default class LignesModifieesDepensesPourValidationModificationBudgetViewService {

    static getLignesModifieesDepensesPourValidationModificationBudget(gestion: number, idBudget: number, codBma: number): Promise<LignesModifieesDepensesPourValidationModificationBudgetViewDto[]> {
        return axios.get(API_URLS.LIGNES_MODIFIESS_DEPENSES_POUR_VALIDATION_MODIFICATION_BUDGET_VIEW_URL + 'getLignesModifieesDepensesPourValidationModificationBudget/' + gestion + '/' + idBudget + '/' + codBma)
        .then( response => response.data);
    }
}