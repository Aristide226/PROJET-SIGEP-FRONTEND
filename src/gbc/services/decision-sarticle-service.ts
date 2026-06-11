import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { DecisionSArticleDto } from "../models/decision-sarticle";

export default class DecisionSArticleService {

    static add(object: DecisionSArticleDto): Promise<DecisionSArticleDto> {
        return axios.post(API_URLS.DECISION_SARTICLE_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<DecisionSArticleDto[]> {
        return axios.get(API_URLS.DECISION_SARTICLE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<DecisionSArticleDto> {
        return axios.get(API_URLS.DECISION_SARTICLE_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<DecisionSArticleDto> {
        return axios.delete(API_URLS.DECISION_SARTICLE_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(newId: number, oldId: number, object: DecisionSArticleDto): Promise<DecisionSArticleDto> {
        return axios.put(API_URLS.DECISION_SARTICLE_URL + 'edit/' + newId + '/' + oldId, object)
        .then( response => response.data);
    }    

    static existsById(id: number): Promise<Boolean> {
        return axios.get(API_URLS.DECISION_SARTICLE_URL + 'existsById/' + id)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}