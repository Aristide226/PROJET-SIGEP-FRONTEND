import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { CompteDto } from "../models/compte";

export default class CompteService {

    static add(object: CompteDto): Promise<CompteDto> {
        return axios.post(API_URLS.COMPTE_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<CompteDto[]> {
        return axios.get(API_URLS.COMPTE_URL  + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<CompteDto> {
        return axios.get(API_URLS.COMPTE_URL  + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<CompteDto> {
        return axios.delete(API_URLS.COMPTE_URL  + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: CompteDto): Promise<CompteDto> {
        return axios.put(API_URLS.COMPTE_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}