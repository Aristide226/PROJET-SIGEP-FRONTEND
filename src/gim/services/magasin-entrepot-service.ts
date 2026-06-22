//Aristide
import axios from "axios";
import { MagasinEntrepotRequestDto, MagasinEntrepotResponseDto } from "../models/magasin-entrepot";
import { API_URLS } from "../config/api.url.config";

export default class MagasinEntrepotService {

    static add(object: MagasinEntrepotRequestDto) : Promise<MagasinEntrepotResponseDto> {
        return axios.post(API_URLS.MAGASIN_ENTREPOT_URL + 'add', object)
        .then(response => response.data)
    }

     static getAll(): Promise<[]> {
        return axios.get(API_URLS.MAGASIN_ENTREPOT_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<MagasinEntrepotResponseDto> {
        return axios.get(API_URLS.MAGASIN_ENTREPOT_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<{}> {
        return axios.delete(API_URLS.MAGASIN_ENTREPOT_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: MagasinEntrepotRequestDto): Promise<MagasinEntrepotResponseDto> {
        return axios.put(API_URLS.MAGASIN_ENTREPOT_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}