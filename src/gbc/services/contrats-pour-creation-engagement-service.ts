import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { ContratsPourCreationEngagementViewDto } from "../models/contrats-pour-creation-engagement-view";

export default class ContratsPourCreationEngagementViewService {

    static getByGestionAndIdBudget(gestion: number, idBudget: number): Promise<ContratsPourCreationEngagementViewDto[]> {
        return axios.get(API_URLS.CONTRATS_POUR_CREATION_ENGAGEMENT_VIEW_URL + 'getByGestionAndIdBudget/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }
}