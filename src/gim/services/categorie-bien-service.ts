//Aristide
import axios from "axios";
import { CategorieBienRequestDto,CategorieBienResponseDto } from "../models/categorie-bien";
import { API_URLS } from "../config/api.url.config";

export default class CategorieBienService {

    static add(object: CategorieBienRequestDto) : Promise<CategorieBienResponseDto> {
        return axios.post(API_URLS.CATEGORIE_BIEN_URL + 'add', object)
        .then(response => response.data)
    }

     static getAll(): Promise<CategorieBienResponseDto[]> {
        return axios.get(API_URLS.CATEGORIE_BIEN_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<CategorieBienResponseDto> {
        return axios.get(API_URLS.CATEGORIE_BIEN_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<{}> {
        return axios.delete(API_URLS.CATEGORIE_BIEN_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: CategorieBienRequestDto): Promise<CategorieBienResponseDto> {
        return axios.put(API_URLS.CATEGORIE_BIEN_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static categorieBienReport() : Promise<Blob> {
        return axios.get(API_URLS.CATEGORIE_BIEN_URL + 'categorieBienReport',
            {
                responseType : 'blob'
            }
        )
        .then(response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}