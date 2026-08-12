//Aristtide
import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { DepartementRequestDto,DepartementResponseDto } from "../models/departement";
export default class DepartementService {

    static add(object:DepartementRequestDto) : Promise<DepartementResponseDto> {
        return axios.post(API_URLS.DEPARTEMENT_URL + 'add',object)
        .then(response => response.data)
    }

    static getAll(): Promise<DepartementResponseDto[]> {
        return axios.get(API_URLS.DEPARTEMENT_URL + 'getAll')
        .then(response => response.data)
    }

    static get(id:number):Promise<DepartementResponseDto> {
        return axios.get(API_URLS.DEPARTEMENT_URL + 'get/' +id)
        .then(response => response.data)
    }

    static delete(id:number): Promise<{}> {
        return axios.delete(API_URLS.DEPARTEMENT_URL + 'delete/' + id)
        .then(response => response.data)
    }

    static edit(id:number, object:DepartementRequestDto):Promise<DepartementResponseDto> {
        return axios.put(API_URLS.DEPARTEMENT_URL + 'edit/' + id,object)
        .then(response => response.data)
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }

    static handleError(error: Error) : void {
        console.error("Response failure : ",error)
    }
}