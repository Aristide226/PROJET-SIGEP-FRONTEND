//Aristide
import axios from "axios";
import { FournisseurTypeRequestDto,FournisseurTypeResponseDto } from "../models/fournisseur-type";
import { API_URLS } from "../config/api.url.config";

export default class FournisseurTypeService {

    static add(object: FournisseurTypeRequestDto) : Promise<FournisseurTypeResponseDto> {
        return axios.post(API_URLS.FOURNISSEUR_TYPE_URL + 'add', object)
        .then(response => response.data)
    }

     static getAll(): Promise<[]> {
        return axios.get(API_URLS.FOURNISSEUR_TYPE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<FournisseurTypeResponseDto> {
        return axios.get(API_URLS.FOURNISSEUR_TYPE_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<{}> {
        return axios.delete(API_URLS.FOURNISSEUR_TYPE_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: FournisseurTypeRequestDto): Promise<FournisseurTypeResponseDto> {
        return axios.put(API_URLS.FOURNISSEUR_TYPE_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}