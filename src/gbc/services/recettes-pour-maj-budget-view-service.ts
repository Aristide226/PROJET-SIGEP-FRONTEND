import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { RecettesPourMajBudgetViewDto } from "../models/recettes-pour-maj-budget-view";

export default class RecettesPourMajBudgetViewService {

    static getByGestionAndIdBudget(gestion: number, idBudget: number): Promise<RecettesPourMajBudgetViewDto[]> {
        return axios.get(API_URLS.RECETTES_POUR_MAJ_BUDGET_VIEW_URL + 'getByGestionAndIdBudget/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }
}