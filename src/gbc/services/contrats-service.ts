import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { ContratsRequestDto, ContratsResponseDto } from "../models/contrats";

export default class ContratsService {

    static add(object: ContratsRequestDto): Promise<ContratsResponseDto> {
        return axios.post(API_URLS.CONTRATS_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<ContratsResponseDto[]> {
        return axios.get(API_URLS.CONTRATS_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<ContratsResponseDto> {
        return axios.get(API_URLS.CONTRATS_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<ContratsResponseDto> {
        return axios.delete(API_URLS.CONTRATS_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: ContratsRequestDto): Promise<ContratsResponseDto> {
        return axios.put(API_URLS.CONTRATS_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}