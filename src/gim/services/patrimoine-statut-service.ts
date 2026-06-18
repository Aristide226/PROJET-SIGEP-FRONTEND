//Aristide
import axios from "axios";
import { PatrimoineStatutRequestDto,PatrimoineStatutResponseDto } from "../models/paptrimoine-statut";
import { API_URLS } from "../config/api.url.config";

export default class PatrimoineStatutService {

    static add(object: PatrimoineStatutRequestDto) : Promise<PatrimoineStatutResponseDto> {
        return axios.post(API_URLS.PATRIMOINE_STATUT + 'add', object)
        .then(response => response.data)
    }

     static getAll(): Promise<PatrimoineStatutResponseDto[]> {
        return axios.get(API_URLS.PATRIMOINE_STATUT + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<PatrimoineStatutResponseDto> {
        return axios.get(API_URLS.PATRIMOINE_STATUT + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<{}> {
        return axios.delete(API_URLS.PATRIMOINE_STATUT + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: PatrimoineStatutRequestDto): Promise<PatrimoineStatutResponseDto> {
        return axios.put(API_URLS.PATRIMOINE_STATUT + 'edit/' + id, object)
        .then( response => response.data);
    }

    static statutBienReport() : Promise<Blob> {
        return axios.get(API_URLS.PATRIMOINE_STATUT + 'statutBienReport',
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