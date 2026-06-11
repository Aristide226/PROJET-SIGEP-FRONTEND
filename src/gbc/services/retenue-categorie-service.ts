import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { RetenueCategorieRequestDto, RetenueCategorieResponseDto } from "../models/retenue-categorie";

export default class RetenueCategorieService {

    static add(object: RetenueCategorieRequestDto): Promise<RetenueCategorieResponseDto> {
        return axios.post(API_URLS.RETENUE_CATEGORIE_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<RetenueCategorieResponseDto[]> {
        return axios.get(API_URLS.RETENUE_CATEGORIE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<RetenueCategorieResponseDto> {
        return axios.get(API_URLS.RETENUE_CATEGORIE_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<RetenueCategorieResponseDto> {
        return axios.delete(API_URLS.RETENUE_CATEGORIE_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: RetenueCategorieRequestDto): Promise<RetenueCategorieResponseDto> {
        return axios.put(API_URLS.RETENUE_CATEGORIE_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}