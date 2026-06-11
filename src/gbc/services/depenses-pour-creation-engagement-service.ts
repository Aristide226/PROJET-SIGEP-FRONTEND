import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { DepensesPourCreationEngagementViewDto } from "../models/depenses-pour-creation-engagement-view";

export default class DepensesPourCreationEngagementViewService {

    static getByGestionAndIdBudget(gestion: number, idBudget: number): Promise<DepensesPourCreationEngagementViewDto[]> {
        return axios.get(API_URLS.DEPENSES_POUR_CREATION_ENGAGEMENT_VIEW_URL + 'getByGestionAndIdBudget/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }
}