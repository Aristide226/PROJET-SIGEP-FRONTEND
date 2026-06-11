import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { TypeMarcheRequestDto, TypeMarcheResponseDto } from "../models/type-marche";

export default class TypeMarcheService {

    static add(object: TypeMarcheRequestDto): Promise<TypeMarcheResponseDto> {
        return axios.post(API_URLS.TYPE_MARCHE_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<TypeMarcheResponseDto[]> {
        return axios.get(API_URLS.TYPE_MARCHE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<TypeMarcheResponseDto> {
        return axios.get(API_URLS.TYPE_MARCHE_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<TypeMarcheResponseDto> {
        return axios.delete(API_URLS.TYPE_MARCHE_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: TypeMarcheRequestDto): Promise<TypeMarcheResponseDto> {
        return axios.put(API_URLS.TYPE_MARCHE_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}