//Aristide
import axios from "axios";
import { EtatBienRequestDto,EtatBienResponseDto } from "../models/etat-bien";
import { API_URLS } from "../config/api.url.config";

export default class EtatBienService {

    static add(object: EtatBienRequestDto) : Promise<EtatBienResponseDto> {
        return axios.post(API_URLS.ETAT_BIEN_URL + 'add', object)
        .then(response => response.data)
    }

     static getAll(): Promise<EtatBienResponseDto[]> {
        return axios.get(API_URLS.ETAT_BIEN_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<EtatBienResponseDto> {
        return axios.get(API_URLS.ETAT_BIEN_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<{}> {
        return axios.delete(API_URLS.ETAT_BIEN_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: EtatBienRequestDto): Promise<EtatBienResponseDto> {
        return axios.put(API_URLS.ETAT_BIEN_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}