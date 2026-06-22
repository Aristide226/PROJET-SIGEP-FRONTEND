//Aristide
import axios from "axios";
import { FournisseursRequestDto,FournisseursResponseDto } from "../models/fournisseurs";
import { API_URLS } from "../config/api.url.config";

export default class FournisseursService {

    static add(object: FournisseursRequestDto) : Promise<FournisseursResponseDto> {
        return axios.post(API_URLS.FOURNISSEURS_URL + 'add', object)
        .then(response => response.data)
    }

     static getAll(): Promise<[]> {
        return axios.get(API_URLS.FOURNISSEURS_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<FournisseursResponseDto> {
        return axios.get(API_URLS.FOURNISSEURS_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<{}> {
        return axios.delete(API_URLS.FOURNISSEURS_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: FournisseursRequestDto): Promise<FournisseursResponseDto> {
        return axios.put(API_URLS.FOURNISSEURS_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}