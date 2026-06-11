import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { RetenuTypeDto } from "../models/retenu-type";

export default class RetenuTypeService {

    static add(object: RetenuTypeDto): Promise<RetenuTypeDto> {
        return axios.post(API_URLS.RETENU_TYPE_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<RetenuTypeDto[]> {
        return axios.get(API_URLS.RETENU_TYPE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<RetenuTypeDto> {
        return axios.get(API_URLS.RETENU_TYPE_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<RetenuTypeDto> {
        return axios.delete(API_URLS.RETENU_TYPE_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: RetenuTypeDto): Promise<RetenuTypeDto> {
        return axios.put(API_URLS.RETENU_TYPE_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}