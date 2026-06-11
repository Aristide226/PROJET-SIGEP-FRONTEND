import axios from "axios";
import AccesCodeDto from "../models/acces-code";
import { API_URLS } from "../config/api.url.config";

export default class AccesCodeService {

    static add(object: AccesCodeDto): Promise<AccesCodeDto> {
        return axios.post(API_URLS.ACCES_CODE_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<AccesCodeDto[]> {
        return axios.get(API_URLS.ACCES_CODE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string|null): Promise<AccesCodeDto> {
        return axios.get(API_URLS.ACCES_CODE_URL + 'get/' + id)
        .then( response => response.data);
    }
    static getByAccesCodeNiveau(code: string): Promise<AccesCodeDto[]> {
        return axios.get(API_URLS.ACCES_CODE_URL + 'getByAccesCodeNiveau/' + code)
        .then( response => response.data);
    }

    static delete(id: string): Promise<{}> {
        return axios.delete(API_URLS.ACCES_CODE_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: AccesCodeDto): Promise<AccesCodeDto> {
        return axios.put(API_URLS.ACCES_CODE_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    //static getUtilisateur(): Promise<AccesCodeAgentDto[]> {
    //    return axios.get(API_URLS.ACCES_CODE_URL + 'getUtilisateur')
    //    .then( response => response.data);
    //}

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}