import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { DirectionServiceNiveauRequestDto, DirectionServiceNiveauResponseDto } from "../models/direction-service-niveau";

export default class DirectionServiceNiveauService {

    static add(object: DirectionServiceNiveauRequestDto): Promise<DirectionServiceNiveauResponseDto> {
        return axios.post(API_URLS.DIRECTION_SERVICE_NIVEAU_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<DirectionServiceNiveauResponseDto[]> {
        return axios.get(API_URLS.DIRECTION_SERVICE_NIVEAU_URL  + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<DirectionServiceNiveauResponseDto> {
        return axios.get(API_URLS.DIRECTION_SERVICE_NIVEAU_URL  + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<DirectionServiceNiveauResponseDto> {
        return axios.delete(API_URLS.DIRECTION_SERVICE_NIVEAU_URL  + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: DirectionServiceNiveauRequestDto): Promise<DirectionServiceNiveauResponseDto> {
        return axios.put(API_URLS.DIRECTION_SERVICE_NIVEAU_URL  + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}