import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { InstitutFinAgenceDto } from "../models/institut-fin-agence";

export default class InstitutFinAgenceService {

    static add(object: InstitutFinAgenceDto): Promise<InstitutFinAgenceDto> {
        return axios.post(API_URLS.INSTITUT_FIN_AGENCE_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<InstitutFinAgenceDto[]> {
        return axios.get(API_URLS.INSTITUT_FIN_AGENCE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<InstitutFinAgenceDto> {
        return axios.get(API_URLS.INSTITUT_FIN_AGENCE_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<InstitutFinAgenceDto> {
        return axios.delete(API_URLS.INSTITUT_FIN_AGENCE_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: InstitutFinAgenceDto): Promise<InstitutFinAgenceDto> {
        return axios.put(API_URLS.INSTITUT_FIN_AGENCE_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static getByAbreviation(abreviation: string): Promise<InstitutFinAgenceDto[]> {
        return axios.get(API_URLS.INSTITUT_FIN_AGENCE_URL + 'getByAbreviation/' + abreviation)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}