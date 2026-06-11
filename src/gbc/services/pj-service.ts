import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { PjRequestDto, PjResponseDto } from "../models/pj";

export default class PjService {

    static add(object: PjRequestDto): Promise<PjResponseDto> {
        return axios.post(API_URLS.PJ_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<PjResponseDto[]> {
        return axios.get(API_URLS.PJ_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<PjResponseDto> {
        return axios.get(API_URLS.PJ_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<PjResponseDto> {
        return axios.delete(API_URLS.PJ_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: PjRequestDto): Promise<PjResponseDto> {
        return axios.put(API_URLS.PJ_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}