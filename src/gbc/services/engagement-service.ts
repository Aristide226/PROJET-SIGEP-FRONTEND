import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { EngagementRequestDto, EngagementResponseDto } from "../models/engagement";
import { IdEngAction } from "../models/id-eng-action";
import { IdEngsCodBord } from "../models/id-engs-cod-bord";
import { InfosPourAbandonnerEngagement } from "../models/infos-pour-abandonner-engagement";
import { InfosPourValiderEngagement } from "../models/infos-pour-valider-engagement";
import { InfosPourRetrograderrEngagement } from "../models/infos-pour-retrograder-engagement";
import { InfosPourValiderOuRejeterEngagement } from "../models/infos-pour-valider-ou-rejeter-engagement";

export default class EngagementService {

    static add(object: EngagementRequestDto): Promise<EngagementResponseDto> {
        return axios.post(API_URLS.ENGAGEMENT_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<EngagementResponseDto[]> {
        return axios.get(API_URLS.ENGAGEMENT_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<EngagementResponseDto> {
        return axios.get(API_URLS.ENGAGEMENT_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<EngagementResponseDto> {
        return axios.delete(API_URLS.ENGAGEMENT_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: EngagementRequestDto): Promise<EngagementResponseDto> {
        return axios.put(API_URLS.ENGAGEMENT_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static abandonner(infosPourAbandonnerEngagement: InfosPourAbandonnerEngagement): Promise<Boolean> {
        return axios.post(API_URLS.ENGAGEMENT_URL + 'abandonner', infosPourAbandonnerEngagement)
        .then( response => response.data);
    }

    static valider(infosPourValiderEngagement: InfosPourValiderEngagement): Promise<Boolean> {
        return axios.post(API_URLS.ENGAGEMENT_URL + 'valider', infosPourValiderEngagement)
        .then( response => response.data);
    }

    static retrograder(infosPourRetrograderrEngagement: InfosPourRetrograderrEngagement): Promise<Boolean> {
        return axios.post(API_URLS.ENGAGEMENT_URL + 'retrograder', infosPourRetrograderrEngagement)
        .then( response => response.data);
    }

    static validerOuRejeter(infosPourValiderOuRejeterEngagement: InfosPourValiderOuRejeterEngagement): Promise<Boolean> {
        return axios.post(API_URLS.ENGAGEMENT_URL + 'validerOuRejeter', infosPourValiderOuRejeterEngagement)
        .then( response => response.data);
    }

    static transmettre(idEngsCodBord: IdEngsCodBord): Promise<Boolean> {
        return axios.post(API_URLS.ENGAGEMENT_URL + 'transmettre', idEngsCodBord)
        .then( response => response.data);
    }

    static receptionner(codBords: number[]): Promise<Boolean> {
        return axios.post(API_URLS.ENGAGEMENT_URL + 'receptionner', codBords)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}