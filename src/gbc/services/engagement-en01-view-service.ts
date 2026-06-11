import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { EngagementEN01ViewDto } from "../models/engagement-en01-view";

export default class EngagementEN01ViewService {

    static getByGestionAndIdBudgetAndMontantGreaterThanOrderByBenumDesc(gestion: number, idBudget: number): Promise<EngagementEN01ViewDto[]> {
        return axios.get(API_URLS.ENGAGEMENT_EN01_VIEW_URL + 'getByGestionAndIdBudgetAndMontantGreaterThanOrderByBenumDesc/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static getByGestionAndIdBudgetAndBenum(gestion: number, idBudget: number, benum: number): Promise<EngagementEN01ViewDto> {
        return axios.get(API_URLS.ENGAGEMENT_EN01_VIEW_URL + 'getByGestionAndIdBudgetAndBenum/' + gestion + '/' + idBudget + '/' + benum)
        .then( response => response.data);
    }

    static getEngagementModifiables(gestion: number, idBudget: number): Promise<EngagementEN01ViewDto[]> {
        return axios.get(API_URLS.ENGAGEMENT_EN01_VIEW_URL + 'getEngagementModifiables/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }
    
    static getLesEngagementsPartiellementLiquides(gestion: number, idBudget: number): Promise<EngagementEN01ViewDto[]> {
        return axios.get(API_URLS.ENGAGEMENT_EN01_VIEW_URL + 'getLesEngagementsPartiellementLiquides/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static getBonDAnnulationModifiables(gestion: number, idBudget: number): Promise<EngagementEN01ViewDto[]> {
        return axios.get(API_URLS.ENGAGEMENT_EN01_VIEW_URL + 'getBonDAnnulationModifiables/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static getByNumBe(numbe: number): Promise<EngagementEN01ViewDto> {
        return axios.get(API_URLS.ENGAGEMENT_EN01_VIEW_URL + 'getByNumBe/' + numbe)
        .then( response => response.data);
    }

    static getEngagementEN01ValideAE2EtTransmisEtPartiellementLiquides(gestion: number, idBudget: number): Promise<EngagementEN01ViewDto[]> {
        return axios.get(API_URLS.ENGAGEMENT_EN01_VIEW_URL + 'getEngagementEN01ValideAE2EtTransmisEtPartiellementLiquides/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
}