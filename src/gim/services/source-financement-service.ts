//Aristide
import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { SourceFinancementRequestDto,SourceFinancementResponseDto } from "../models/source-financement";

export default class SourceFinancementService {

    static add(object: SourceFinancementRequestDto) : Promise<SourceFinancementResponseDto> {
        return axios.post(API_URLS.SOURCE_FINANCEMENT_URL + 'add', object)
        .then(response => response.data)
    }

     static getAll(): Promise<SourceFinancementResponseDto[]> {
        return axios.get(API_URLS.SOURCE_FINANCEMENT_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<SourceFinancementResponseDto> {
        return axios.get(API_URLS.SOURCE_FINANCEMENT_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<{}> {
        return axios.delete(API_URLS.SOURCE_FINANCEMENT_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: SourceFinancementRequestDto): Promise<SourceFinancementResponseDto> {
        return axios.put(API_URLS.SOURCE_FINANCEMENT_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static getFinancementStatistiqueParCategorie(): Promise<[]> {
        return axios.get(API_URLS.SOURCE_FINANCEMENT_URL + 'stat')
        .then(response => response.data)
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}