import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { CompteDestinataireRequestDto, CompteDestinataireResponseDto } from "../models/compte-destinataire";
import { CompteDestinataireInstitutFinAgenceDto } from "../models/compte-destinataire-institut-fin-agence-dto";

export default class CompteDestinataireService {

    static add(object: CompteDestinataireRequestDto): Promise<CompteDestinataireResponseDto> {
        return axios.post(API_URLS.COMPTE_DESTINATAIRE_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<CompteDestinataireResponseDto[]> {
        return axios.get(API_URLS.COMPTE_DESTINATAIRE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<CompteDestinataireResponseDto> {
        return axios.get(API_URLS.COMPTE_DESTINATAIRE_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<CompteDestinataireResponseDto> {
        return axios.delete(API_URLS.CONTRAT_TYPE_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: CompteDestinataireRequestDto): Promise<CompteDestinataireResponseDto> {
        return axios.put(API_URLS.COMPTE_DESTINATAIRE_URL  + 'edit/' + id, object)
        .then( response => response.data);
    }

    static getByDestinataires(idDest: number): Promise<CompteDestinataireInstitutFinAgenceDto[]> {
        return axios.get(API_URLS.COMPTE_DESTINATAIRE_URL + 'getByDestinataires/' + idDest)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}