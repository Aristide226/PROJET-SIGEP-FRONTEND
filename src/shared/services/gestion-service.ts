import axios from "axios";
import { GestionRequestDto, GestionResponseDto } from "../models/gestion";
import { API_URLS } from "../config/api.url.config";

export default class GestionService {

    static add(object: GestionRequestDto): Promise<GestionResponseDto> {
        return axios.post(API_URLS.GESTION_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<GestionResponseDto[]> {
        return axios.get(API_URLS.GESTION_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<GestionResponseDto> {
        return axios.get(API_URLS.GESTION_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<GestionResponseDto> {
        return axios.delete(API_URLS.GESTION_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: GestionRequestDto): Promise<GestionResponseDto> {
        return axios.put(API_URLS.GESTION_URL + 'edit/' + id, object)
        .then( response => response.data);
    }


    static exists(gestion: number): Promise<Boolean> {
        return axios.get(API_URLS.GESTION_URL + 'exists/' + gestion)
        .then( response => response.data);
    }

    static getLastByEtat(etat: string): Promise<GestionResponseDto> {
        return axios.get(API_URLS.GESTION_URL + 'getLastByEtat/' + etat)
        .then( response => response.data);
    }

    static getAllByEtatOrderByCouranteDesc(etat: string): Promise<GestionResponseDto[]> {
        return axios.get(API_URLS.GESTION_URL + 'getAllByEtatOrderByCouranteDesc/' + etat)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}