import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { GrpeCodeRequestDto, GrpeCodeResponseDto } from "../models/grpe-code";

export default class GrpeCodeService {

    static add(object: GrpeCodeRequestDto): Promise<GrpeCodeResponseDto> {
        return axios.post(API_URLS.GRPE_CODE_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<GrpeCodeResponseDto[]> {
        return axios.get(API_URLS.GRPE_CODE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<GrpeCodeResponseDto> {
        return axios.get(API_URLS.GRPE_CODE_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<GrpeCodeResponseDto> {
        return axios.delete(API_URLS.GRPE_CODE_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: GrpeCodeRequestDto): Promise<GrpeCodeResponseDto> {
        return axios.put(API_URLS.GRPE_CODE_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}