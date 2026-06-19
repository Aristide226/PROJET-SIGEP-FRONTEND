//Aristide
import axios from "axios";
import { EtatFicheRequestDto,EtatFicheResponseDto } from "../models/etat-fiche";
import { API_URLS } from "../config/api.url.config";

export default class EtatFicheService {

    static add(object: EtatFicheRequestDto) : Promise<EtatFicheResponseDto> {
        return axios.post(API_URLS.ETAT_FICHE_URL + 'add', object)
        .then(response => response.data)
    }

     static getAll(): Promise<EtatFicheResponseDto[]> {
        return axios.get(API_URLS.ETAT_FICHE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<EtatFicheResponseDto> {
        return axios.get(API_URLS.ETAT_FICHE_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<{}> {
        return axios.delete(API_URLS.ETAT_FICHE_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: EtatFicheRequestDto): Promise<EtatFicheResponseDto> {
        return axios.put(API_URLS.ETAT_FICHE_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static etatFicheReport() : Promise<Blob> {
        return axios.get(API_URLS.ETAT_FICHE_URL + 'etatFicheReport',
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