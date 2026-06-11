import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { ActeNatureRequestDto, ActeNatureResponseDto } from "../models/acte-nature";

export default class ActeNatureService {

    static add(object: ActeNatureRequestDto): Promise<ActeNatureResponseDto> {
        return axios.post(API_URLS.ACTE_NATURE_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<ActeNatureResponseDto[]> {
        return axios.get(API_URLS.ACTE_NATURE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<ActeNatureResponseDto> {
        return axios.get(API_URLS.ACTE_NATURE_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<ActeNatureResponseDto> {
        return axios.delete(API_URLS.ACTE_NATURE_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: ActeNatureRequestDto): Promise<ActeNatureResponseDto> {
        return axios.put(API_URLS.ACTE_NATURE_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}