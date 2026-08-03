//Aristide
import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { ServiceRequestDto,ServiceResponseDto } from "../models/service";

export default class ServiceService {
    static add(object: ServiceRequestDto) : Promise<ServiceResponseDto> {
        return axios.post(API_URLS.SERVICE_URL + 'add', object)
        .then(response => response.data)
    }

     static getAll(): Promise<ServiceResponseDto[]> {
        return axios.get(API_URLS.SERVICE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<ServiceResponseDto> {
        return axios.get(API_URLS.SERVICE_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<{}> {
        return axios.delete(API_URLS.SERVICE_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: ServiceRequestDto): Promise<ServiceResponseDto> {
        return axios.put(API_URLS.SERVICE_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static findMaxCodServByCodDirect(codDirect: number) {
        return axios.get(API_URLS.SERVICE_URL + 'findMaxCodServByCodDirect/' + codDirect)
        .then(response => response.data)
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}