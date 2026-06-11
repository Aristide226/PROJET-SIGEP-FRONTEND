import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { ContratTypeRequestDto, ContratTypeResponseDto } from "../models/contrat-type";

export default class ContratTypeService {

    static add(object: ContratTypeRequestDto): Promise<ContratTypeResponseDto> {
        return axios.post(API_URLS.CONTRAT_TYPE_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<ContratTypeResponseDto[]> {
        return axios.get(API_URLS.CONTRAT_TYPE_URL  + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<ContratTypeResponseDto> {
        return axios.get(API_URLS.CONTRAT_TYPE_URL  + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<ContratTypeResponseDto> {
        return axios.delete(API_URLS.CONTRAT_TYPE_URL  + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: ContratTypeRequestDto): Promise<ContratTypeResponseDto> {
        return axios.put(API_URLS.CONTRAT_TYPE_URL  + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}