import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { CodModPassRequestDto, CodModPassResponseDto } from "../models/cod-mod-pass";

export default class CodModPassService {

    static add(object: CodModPassRequestDto): Promise<CodModPassResponseDto> {
        return axios.post(API_URLS.COD_MOD_PASS_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<CodModPassResponseDto[]> {
        return axios.get(API_URLS.COD_MOD_PASS_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<CodModPassResponseDto> {
        return axios.get(API_URLS.COD_MOD_PASS_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<CodModPassResponseDto> {
        return axios.delete(API_URLS.COD_MOD_PASS_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: CodModPassRequestDto): Promise<CodModPassResponseDto> {
        return axios.put(API_URLS.COD_MOD_PASS_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}