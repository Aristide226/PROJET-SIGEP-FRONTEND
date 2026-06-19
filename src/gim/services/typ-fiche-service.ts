//Aristide
import axios from "axios";
import { TypFicheRequestDto,TypFicheResponseDto } from "../models/typ-fiche";
import { API_URLS } from "../config/api.url.config";

export default class TypFicheService {

    static add(object: TypFicheRequestDto) : Promise<TypFicheResponseDto> {
        return axios.post(API_URLS.TYP_FICHE_URL + 'add', object)
        .then(response => response.data)
    }

     static getAll(): Promise<TypFicheResponseDto[]> {
        return axios.get(API_URLS.TYP_FICHE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<TypFicheResponseDto> {
        return axios.get(API_URLS.TYP_FICHE_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<{}> {
        return axios.delete(API_URLS.TYP_FICHE_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: TypFicheRequestDto): Promise<TypFicheResponseDto> {
        return axios.put(API_URLS.TYP_FICHE_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static typFicheReport() : Promise<Blob> {
        return axios.get(API_URLS.TYP_FICHE_URL + 'typFicheReport',
            {
                responseType : 'blob'
            }
        )
        .then(response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}