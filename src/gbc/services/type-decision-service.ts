import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { TypeDecisionRequestDto, TypeDecisionResponseDto } from "../models/type-decision";

export default class TypeDecisionService {

    static add(object: TypeDecisionRequestDto): Promise<TypeDecisionResponseDto> {
        return axios.post(API_URLS.TYPE_DECISION_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<TypeDecisionResponseDto[]> {
        return axios.get(API_URLS.TYPE_DECISION_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<TypeDecisionResponseDto> {
        return axios.get(API_URLS.TYPE_DECISION_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<TypeDecisionResponseDto> {
        return axios.delete(API_URLS.TYPE_DECISION_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: TypeDecisionRequestDto): Promise<TypeDecisionResponseDto> {
        return axios.put(API_URLS.TYPE_DECISION_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}