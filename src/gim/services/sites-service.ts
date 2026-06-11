//Aristide
import axios from "axios";
import { SitesRequestDto, SitesResponseDto } from "../models/sites";
import { API_URLS } from "../config/api.url.config";

export default class SitesService {

    static add(object: SitesRequestDto) : Promise<SitesResponseDto> {
        return axios.post(API_URLS.SITES + 'add', object)
        .then(response => response.data)
    }

     static getAll(): Promise<SitesResponseDto[]> {
        return axios.get(API_URLS.SITES + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<SitesResponseDto> {
        return axios.get(API_URLS.SITES + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<{}> {
        return axios.delete(API_URLS.SITES + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: SitesRequestDto): Promise<SitesResponseDto> {
        return axios.put(API_URLS.SITES + 'edit/' + id, object)
        .then( response => response.data);
    }

    static getStatistiquesPatrimoineParCategorie(): Promise<[]> {
        return axios.get(API_URLS.SITES + 'stat')
        .then(response => response.data)
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}