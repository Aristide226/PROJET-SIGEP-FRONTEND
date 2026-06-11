import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { InstitutFinancierRequestDto, InstitutFinancierResponseDto } from "../models/institut-financier";

export default class InstitutFinancierService {

    static add(object: InstitutFinancierRequestDto): Promise<InstitutFinancierResponseDto> {
        return axios.post(API_URLS.INSTITUT_FINANCIER_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<InstitutFinancierResponseDto[]> {
        return axios.get(API_URLS.INSTITUT_FINANCIER_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<InstitutFinancierResponseDto> {
        return axios.get(API_URLS.INSTITUT_FINANCIER_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<InstitutFinancierResponseDto> {
        return axios.delete(API_URLS.INSTITUT_FINANCIER_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: InstitutFinancierRequestDto): Promise<InstitutFinancierResponseDto> {
        return axios.put(API_URLS.INSTITUT_FINANCIER_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}