//Aristide
import axios from "axios";
import { API_URLS } from "../config/api.url.config";

import { depensesLignesBudgetaireEnFonctionDePpmView } from "../models/depenses-lignes-budgetaire-en-fonction-de-ppm-view";

export default class DepensesLignesBudgetaireEnFonctionDePpmViewService {

    static getByGestionAndIdBudgetAndIdPpm(gestion : string, idBudget : string, idPpm : string) : Promise<depensesLignesBudgetaireEnFonctionDePpmView[]> {
        return axios.get(`${API_URLS.DEPENSES_LIGNES_BUDGETAIRE_EN_FONCTION_DE_PPM_VIEW}getByGestionAndIdBudgetAndIdPpm/${gestion}/${idBudget}/${idPpm}`)
        .then(response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}