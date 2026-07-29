//Aristide
import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import {DirectionsRequestDto,DirectionsResponseDto} from "../models/directions";

export default class DirectionsService {
    static add(object: DirectionsRequestDto) : Promise<DirectionsResponseDto> {
        return axios.post(API_URLS.DIRECTIONS_URL + 'add', object)
        .then(response => response.data)
    }

     static getAll(): Promise<DirectionsResponseDto[]> {
        return axios.get(API_URLS.DIRECTIONS_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<DirectionsResponseDto> {
        return axios.get(API_URLS.DIRECTIONS_URL + 'get/' + id)
        .then( response => response.data);
    }
    
    static delete(id: number): Promise<{}> {
        return axios.delete(API_URLS.DIRECTIONS_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: DirectionsRequestDto): Promise<DirectionsResponseDto> {
        return axios.put(API_URLS.DIRECTIONS_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}