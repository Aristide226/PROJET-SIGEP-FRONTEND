import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { EnteteStructureRequestDto, EnteteStructureResponseDto } from "../models/entete-structure";

export default class EnteteStructureService {

    static add(object: EnteteStructureRequestDto): Promise<EnteteStructureResponseDto> {
        return axios.post(API_URLS.ENTETE_STRUCUTRE_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<EnteteStructureResponseDto[]> {
        return axios.get(API_URLS.ENTETE_STRUCUTRE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<EnteteStructureResponseDto> {
        return axios.get(API_URLS.ENTETE_STRUCUTRE_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<EnteteStructureResponseDto> {
        return axios.delete(API_URLS.ENTETE_STRUCUTRE_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(newId: string, oldId: string, object: EnteteStructureRequestDto): Promise<EnteteStructureResponseDto> {
        return axios.put(API_URLS.ENTETE_STRUCUTRE_URL + 'edit/' + newId + '/' + oldId, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}