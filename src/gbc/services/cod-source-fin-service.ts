//Aristide
import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { CodSourceFinRequestDto,CodSourceFinResponseDto } from "../models/cod-source-fin";

export default class CodSourceFinService {

    static add(object: CodSourceFinRequestDto) : Promise<CodSourceFinResponseDto[]> {
        return axios.post(API_URLS.CODE_SOURCE_FIN_GET_URL + 'add',object)
        .then(response => response.data);
    }

    static getAll(): Promise <CodSourceFinRequestDto[]> {
        return axios.get(API_URLS.CODE_SOURCE_FIN_GET_URL + 'getAll')
        .then(response => response.data);
    }

    static get(id: string): Promise<CodSourceFinResponseDto[]> {
        return axios.get(API_URLS.CODE_SOURCE_FIN_GET_URL + 'get/' + id )
        .then(response => response.data);
    }

    static delete(id:string): Promise<CodSourceFinResponseDto[]> {
        return axios.delete(API_URLS.CODE_SOURCE_FIN_GET_URL + 'delete/' + id)
        .then(response => response.data);
    }

    static edit(id: string, object:CodSourceFinRequestDto): Promise<CodSourceFinResponseDto[]> {
        return axios.put(API_URLS.CODE_SOURCE_FIN_GET_URL + 'edit/' + id, object)
        .then(response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}