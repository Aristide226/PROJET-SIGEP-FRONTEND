import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { CodEntiteContractRequestDto, CodEntiteContractResponseDto } from "../models/cod-entite-contract";

export default class CodEntiteContractService {

    static add(object: CodEntiteContractRequestDto): Promise<CodEntiteContractResponseDto> {
        return axios.post(API_URLS.COD_ENTITE_CONTRACT_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<CodEntiteContractResponseDto[]> {
        return axios.get(API_URLS.COD_ENTITE_CONTRACT_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<CodEntiteContractResponseDto> {
        return axios.get(API_URLS.COD_ENTITE_CONTRACT_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<CodEntiteContractResponseDto> {
        return axios.delete(API_URLS.COD_ENTITE_CONTRACT_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: CodEntiteContractRequestDto): Promise<CodEntiteContractResponseDto> {
        return axios.put(API_URLS.COD_ENTITE_CONTRACT_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}