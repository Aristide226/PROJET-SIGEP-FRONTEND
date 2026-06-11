import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { BordereauEmismandatsRequestDto, BordereauEmismandatsResponseDto } from "../models/bordereau-emis-mandat";

export default class BordereauEmisMandatsService {

    static add(object: BordereauEmismandatsRequestDto): Promise<BordereauEmismandatsResponseDto> {
        return axios.post(API_URLS.BORDEREAU_EMIS_MANDATS_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<BordereauEmismandatsResponseDto[]> {
        return axios.get(API_URLS.BORDEREAU_EMIS_MANDATS_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<BordereauEmismandatsResponseDto> {
        return axios.get(API_URLS.BORDEREAU_EMIS_MANDATS_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<BordereauEmismandatsResponseDto> {
        return axios.delete(API_URLS.BORDEREAU_EMIS_MANDATS_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: BordereauEmismandatsRequestDto): Promise<BordereauEmismandatsResponseDto> {
        return axios.put(API_URLS.BORDEREAU_EMIS_MANDATS_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static getByGestionAndIdBudgetAndDossier(gestion: number, idBudget: number, dossier: string): Promise<BordereauEmismandatsResponseDto[]> {
        return axios.get(API_URLS.BORDEREAU_EMIS_MANDATS_URL + 'getByGestionAndIdBudgetAndDossier/' + gestion + '/' + idBudget + '/' + dossier)
        .then( response => response.data);
    }    

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}