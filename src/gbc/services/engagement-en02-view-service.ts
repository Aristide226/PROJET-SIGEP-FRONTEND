import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { EngagementEN02ViewDto } from "../models/engagement-en02-view";

export default class EngagementEN02ViewService {

    static getByGestionAndIdBudgetAndMontantGreaterThanOrderByBenumDesc(gestion: number, idBudget: number): Promise<EngagementEN02ViewDto[]> {
        return axios.get(API_URLS.ENGAGEMENT_EN02_VIEW_URL + 'getByGestionAndIdBudgetAndMontantGreaterThanOrderByBenumDesc/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static getByGestionAndIdBudgetAndBenum(gestion: number, idBudget: number, benum: number): Promise<EngagementEN02ViewDto> {
        return axios.get(API_URLS.ENGAGEMENT_EN02_VIEW_URL + 'getByGestionAndIdBudgetAndBenum/' + gestion + '/' + idBudget + '/' + benum)
        .then( response => response.data);
    }

    static getEngagementModifiables(gestion: number, idBudget: number): Promise<EngagementEN02ViewDto[]> {
        return axios.get(API_URLS.ENGAGEMENT_EN02_VIEW_URL + 'getEngagementModifiables/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
}