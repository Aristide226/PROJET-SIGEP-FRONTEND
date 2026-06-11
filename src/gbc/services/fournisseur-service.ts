import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { FournisseurRequestDto, FournisseurResponseDto } from "../models/fournisseur";

export default class FournisseurService {

    static add(object: FournisseurRequestDto): Promise<FournisseurResponseDto> {
        return axios.post(API_URLS.FOURNISSEUR_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<FournisseurResponseDto[]> {
        return axios.get(API_URLS.FOURNISSEUR_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<FournisseurResponseDto> {
        return axios.get(API_URLS.FOURNISSEUR_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<FournisseurResponseDto> {
        return axios.delete(API_URLS.FOURNISSEUR_URL  + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: FournisseurRequestDto): Promise<FournisseurResponseDto> {
        return axios.put(API_URLS.FOURNISSEUR_URL  + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}