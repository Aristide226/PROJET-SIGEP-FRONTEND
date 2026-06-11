import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { AccesLigneBudgetaireNomenclaturedBudgetViewDto } from "../models/acces-ligne-budgetaire-nomenclatured-budget-view";

export default class AccesLigneBudgetaireNomenclaturedBudgetViewService {

    static getByUserNameAndGestionAndIdBudget(userName: string, gestion: number, idBudget: number): Promise<AccesLigneBudgetaireNomenclaturedBudgetViewDto[]> {
        return axios.get(API_URLS.ACCES_LIGNE_BUDGETAIRE_NOMENCLATURED_BUDGET_URL + 'get/' + userName + '/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }
}