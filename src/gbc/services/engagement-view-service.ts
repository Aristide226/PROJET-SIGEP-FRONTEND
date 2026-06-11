import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { EngagementViewDto } from "../models/engagement-view";

export default class EngagementViewService {

    static getEngagementModifiables(gestion: number, idBudget: number): Promise<EngagementViewDto[]> {
        return axios.get(API_URLS.ENGAGEMENT_VIEW_URL + 'getEngagementModifiables/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static getByGestionAndIdBudgetAndMontantGreaterThanOrderByBenumDesc(gestion: number, idBudget: number): Promise<EngagementViewDto[]> {
        return axios.get(API_URLS.ENGAGEMENT_VIEW_URL + 'getByGestionAndIdBudgetAndMontantGreaterThanOrderByBenumDesc/' + gestion + '/' + idBudget)
        .then( response => response.data);
    } 
    
    static getEngagementValidables(gestion: number, idBudget: number): Promise<EngagementViewDto[]> {
        return axios.get(API_URLS.ENGAGEMENT_VIEW_URL + 'getEngagementValidables/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static getEngagementRetrogradables(gestion: number, idBudget: number, idUser: string): Promise<EngagementViewDto[]> {
        return axios.get(API_URLS.ENGAGEMENT_VIEW_URL + 'getEngagementRetrogradables/' + gestion + '/' + idBudget + "/" + idUser)
        .then( response => response.data);
    }

    static getEngagementValideEtNonTransmis(gestion: number, idBudget: number): Promise<EngagementViewDto[]> {
        return axios.get(API_URLS.ENGAGEMENT_VIEW_URL + 'getEngagementValideEtNonTransmis/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static getEngagementValideEtTransmisEtReceptionne(gestion: number, idBudget: number): Promise<EngagementViewDto[]> {
        return axios.get(API_URLS.ENGAGEMENT_VIEW_URL + 'getEngagementValideEtTransmisEtReceptionne/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static getEngagementValideAE2EtNonTransmis(gestion: number, idBudget: number): Promise<EngagementViewDto[]> {
        return axios.get(API_URLS.ENGAGEMENT_VIEW_URL + 'getEngagementValideAE2EtNonTransmis/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static getEngagementRejeteAE3EtNonTransmis(gestion: number, idBudget: number): Promise<EngagementViewDto[]> {
        return axios.get(API_URLS.ENGAGEMENT_VIEW_URL + 'getEngagementRejeteAE3EtNonTransmis/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }    

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
}