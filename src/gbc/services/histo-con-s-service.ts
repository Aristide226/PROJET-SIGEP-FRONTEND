import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { HistoConSRequestDto, HistoConSResponseDto } from "../models/histo-con-s";

export default class HistoConSService {

    static add(object: HistoConSRequestDto): Promise<HistoConSResponseDto> {
        return axios.post(API_URLS.HISTO_CON_S_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<HistoConSResponseDto[]> {
        return axios.get(API_URLS.HISTO_CON_S_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<HistoConSResponseDto> {
        return axios.get(API_URLS.HISTO_CON_S_URL + 'get/' + id)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}