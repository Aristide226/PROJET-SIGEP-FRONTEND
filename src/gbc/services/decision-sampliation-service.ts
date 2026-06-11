import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { DecisionSAmpliationRequestDto, DecisionSAmpliationResponseDto } from "../models/decision-sampliation";

export default class DecisionSAmpliationService {

    static add(object: DecisionSAmpliationRequestDto): Promise<DecisionSAmpliationResponseDto> {
        return axios.post(API_URLS.DECISION_SAMPLIATION_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<DecisionSAmpliationResponseDto[]> {
        return axios.get(API_URLS.DECISION_SAMPLIATION_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<DecisionSAmpliationResponseDto> {
        return axios.get(API_URLS.DECISION_SAMPLIATION_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<DecisionSAmpliationResponseDto> {
        return axios.delete(API_URLS.DECISION_SAMPLIATION_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: DecisionSAmpliationRequestDto): Promise<DecisionSAmpliationResponseDto> {
        return axios.put(API_URLS.DECISION_SAMPLIATION_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static existsById(id: number): Promise<Boolean> {
        return axios.get(API_URLS.DECISION_SAMPLIATION_URL + 'existsById/' + id)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}