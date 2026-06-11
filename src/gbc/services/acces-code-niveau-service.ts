import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { AccesCodeNiveauRequestDto, AccesCodeNiveauResponseDto } from "../models/acces-code-niveau";


export default class AccesCodeNiveauService {

    static add(object: AccesCodeNiveauRequestDto): Promise<AccesCodeNiveauResponseDto> {
        return axios.post(API_URLS.ACCES_CODE_NIVEAU_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<AccesCodeNiveauResponseDto[]> {
        return axios.get(API_URLS.ACCES_CODE_NIVEAU_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<AccesCodeNiveauResponseDto> {
        return axios.get(API_URLS.ACCES_CODE_NIVEAU_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<AccesCodeNiveauResponseDto> {
        return axios.delete(API_URLS.ACCES_CODE_NIVEAU_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: AccesCodeNiveauRequestDto): Promise<AccesCodeNiveauResponseDto> {
        return axios.put(API_URLS.ACCES_CODE_NIVEAU_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}