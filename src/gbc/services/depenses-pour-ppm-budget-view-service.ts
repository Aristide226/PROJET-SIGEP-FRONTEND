//Aristide
import axios from "axios";
import { API_URLS } from "../config/api.url.config";

import { depensesPourPpmBudgetView } from "../models/depenses-pour-ppm-budget-view";

export default class DepensesPourPpmBudgetViewService {

    static getByGestionAndIdBudget(gestion : string, idBudget : string) : Promise<depensesPourPpmBudgetView[]> {
        return axios.get(`${API_URLS.DEPENSES_POUR_PPM_BUDGET_VIEW}getByGestionAndIdBudget/${gestion}/${idBudget}`)
        .then(response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}