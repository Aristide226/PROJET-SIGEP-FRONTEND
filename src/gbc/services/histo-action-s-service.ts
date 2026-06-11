import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { HistoActionSRequestDto, HistoActionSResponseDto } from "../models/histo-action-s";
import { HistoActionSHistoConSDto } from "../models/histo-action-s-histo-con-s-dto";

export default class HistoActionSService {

    static add(object: HistoActionSRequestDto): Promise<HistoActionSResponseDto> {
        return axios.post(API_URLS.HISTO_ACTION_S_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<HistoActionSResponseDto[]> {
        return axios.get(API_URLS.HISTO_ACTION_S_URL + 'getAll')
        .then( response => response.data);
    }

    static getHistoActionSHistoConS(): Promise<HistoActionSHistoConSDto[]> {
        return axios.get(API_URLS.HISTO_ACTION_S_URL + 'getHistoActionSHistoConS')
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}