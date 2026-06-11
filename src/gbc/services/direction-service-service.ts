import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { DirectionServiceRequestDto, DirectionServiceResponseDto } from "../models/direction-service";

export default class DirectionServiceService {

    static add(object: DirectionServiceRequestDto): Promise<DirectionServiceResponseDto> {
        return axios.post(API_URLS.DIRECTION_SERVICE_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<DirectionServiceResponseDto[]> {
        return axios.get(API_URLS.DIRECTION_SERVICE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<DirectionServiceResponseDto> {
        return axios.get(API_URLS.DIRECTION_SERVICE_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<DirectionServiceResponseDto> {
        return axios.delete(API_URLS.DIRECTION_SERVICE_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: DirectionServiceRequestDto): Promise<DirectionServiceResponseDto> {
        return axios.put(API_URLS.DIRECTION_SERVICE_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}