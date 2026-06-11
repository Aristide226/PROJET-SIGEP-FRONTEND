import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { RecettesPourReamenagementViewDto } from "../models/recettes-pour-reamenagement-view";

export default class RecettesPourReamenagementViewService {

    static getByGestionAndIdBudget(gestion: number, idBudget: number): Promise<RecettesPourReamenagementViewDto[]> {
        return axios.get(API_URLS.RECETTES_POUR_REAMENAGEMENT_VIEW_URL + 'getByGestionAndIdBudget/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }
}