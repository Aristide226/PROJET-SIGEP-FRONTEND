//Aristide
import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { ppmActeRequestDto,ppmActeResponseDto } from "../models/ppm-acte";

export default class PpmActeService {

    static add(object:ppmActeRequestDto) : Promise<ppmActeResponseDto[]> {
        return axios.post(API_URLS.PPM_ACTE_URL + 'add' ,object)
        .then(response => response.data);
    }

    static getAll() : Promise<ppmActeResponseDto[]> {
        return axios.get(API_URLS.PPM_ACTE_URL + 'getAll')
        .then(response => response.data);
    }

    static get(id: string) : Promise<ppmActeResponseDto[]> {
        return axios.get(API_URLS.PPM_ACTE_URL + 'get/' + id)
        .then(response => response.data);
    }

    static delete(id: string) : Promise<ppmActeResponseDto[]> {
        return axios.delete(API_URLS.PPM_ACTE_URL + 'delete/' + id)
        .then(response => response.data);
    }

    static edit(id:string, object:ppmActeRequestDto) : Promise<ppmActeResponseDto[]> {
        return axios.put(API_URLS.PPM_ACTE_URL + 'edit/' + id, object)
        .then(response => response.data);
    }

    static getByGestion(gestion: string) : Promise < ppmActeRequestDto[]> {
        return axios.get(API_URLS.PPM_ACTE_URL + 'getByGestion/' + gestion)
        .then(response => response.data);
    }

    static getByGestionAndIdBudget(gestion: string, idBudget: string) : Promise <ppmActeResponseDto[]> {
        return axios.get(API_URLS.PPM_ACTE_URL + `getByGestionAndIdBudget/${gestion}/${idBudget}`)
        .then(response => response.data)
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
    }
}