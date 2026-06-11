import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { DepensesPourReamenagementViewDto } from "../models/depenses-pour-reamenagement-view";

export default class DepensesPourReamenagementViewService {

    static getByGestionAndIdBudget(gestion: number, idBudget: number): Promise<DepensesPourReamenagementViewDto[]> {
        return axios.get(API_URLS.DEPENSES_POUR_REAMENAGEMENT_VIEW_URL + 'getByGestionAndIdBudget/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }
}