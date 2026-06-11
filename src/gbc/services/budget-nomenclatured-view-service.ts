import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { BudgetNomenclaturedViewDto } from "../models/budget-nomenclatured-view";

export default class BudgetNomenclaturedViewService {

    static getByGestionAndIdBudget(gestion: number, idBudget: number): Promise<BudgetNomenclaturedViewDto[]> {
        return axios.get(API_URLS.BUDGET_NOMENCLATURED_VIEW_URL + 'getByGestionAndIdBudget/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }
}