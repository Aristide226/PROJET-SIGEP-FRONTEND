import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { DepensesPourMajBudgetViewDto } from "../models/depenses-pour-maj-budget-view";

export default class DepensesPourMajBudgetViewService {

    static getByGestionAndIdBudget(gestion: number, idBudget: number): Promise<DepensesPourMajBudgetViewDto[]> {
        return axios.get(API_URLS.DEPENSES_POUR_MAJ_BUDGET_VIEW_URL + 'getByGestionAndIdBudget/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }
}