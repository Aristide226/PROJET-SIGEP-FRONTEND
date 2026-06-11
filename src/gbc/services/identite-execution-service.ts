import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { IdentiteExecutionRequestDto, IdentiteExecutionResponseDto } from "../models/identite-execution";

export default class IdentiteExecutionService {

    static add(object: IdentiteExecutionRequestDto): Promise<IdentiteExecutionResponseDto> {
        return axios.post(API_URLS.IDENTITE_EXECUTION_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<IdentiteExecutionResponseDto[]> {
        return axios.get(API_URLS.IDENTITE_EXECUTION_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<IdentiteExecutionResponseDto> {
        return axios.get(API_URLS.IDENTITE_EXECUTION_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<IdentiteExecutionResponseDto> {
        return axios.delete(API_URLS.IDENTITE_EXECUTION_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: IdentiteExecutionRequestDto): Promise<IdentiteExecutionResponseDto> {
        return axios.put(API_URLS.IDENTITE_EXECUTION_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}