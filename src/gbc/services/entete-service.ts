import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { EnteteRequestDto, EnteteResponseDto } from "../models/entete";

export default class EnteteService {

    static add(object: EnteteRequestDto): Promise<EnteteResponseDto> {
        return axios.post(API_URLS.ENTETE_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<EnteteResponseDto[]> {
        return axios.get(API_URLS.ENTETE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<EnteteResponseDto> {
        return axios.get(API_URLS.ENTETE_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<EnteteResponseDto> {
        return axios.delete(API_URLS.ENTETE_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: EnteteRequestDto): Promise<EnteteResponseDto> {
        return axios.put(API_URLS.ENTETE_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}