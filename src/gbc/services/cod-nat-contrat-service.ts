import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { CodNatContratRequestDto, CodNatContratResponseDto } from "../models/cod-nat-contrat";

export default class CodNatContratService {

    static add(object: CodNatContratRequestDto): Promise<CodNatContratResponseDto> {
        return axios.post(API_URLS.COD_NAT_CONTRAT_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<CodNatContratResponseDto[]> {
        return axios.get(API_URLS.COD_NAT_CONTRAT_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<CodNatContratResponseDto> {
        return axios.get(API_URLS.COD_NAT_CONTRAT_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<CodNatContratResponseDto> {
        return axios.delete(API_URLS.COD_NAT_CONTRAT_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: CodNatContratRequestDto): Promise<CodNatContratResponseDto> {
        return axios.put(API_URLS.COD_NAT_CONTRAT_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}