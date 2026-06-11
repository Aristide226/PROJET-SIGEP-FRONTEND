import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { DecisionSVisaDto } from "../models/decision-svisa";

export default class DecisionSVisaService {

    static add(object: DecisionSVisaDto): Promise<DecisionSVisaDto> {
        return axios.post(API_URLS.DECISION_SVISA_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<DecisionSVisaDto[]> {
        return axios.get(API_URLS.DECISION_SVISA_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<DecisionSVisaDto> {
        return axios.get(API_URLS.DECISION_SVISA_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<DecisionSVisaDto> {
        return axios.delete(API_URLS.DECISION_SVISA_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(newId: number, oldId: number, object: DecisionSVisaDto): Promise<DecisionSVisaDto> {
        return axios.put(API_URLS.DECISION_SVISA_URL + 'edit/' + newId + '/' + oldId, object)
        .then( response => response.data);
    }

    static existsById(id: number): Promise<Boolean> {
        return axios.get(API_URLS.DECISION_SVISA_URL + 'existsById/' + id)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}