import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { StElementsNomenclaDto } from "../models/st-elements-nomencla";

export default class StElementsNomenclaService {

    static add(object: StElementsNomenclaDto): Promise<StElementsNomenclaDto> {
        return axios.post(API_URLS.ST_ELEMENTS_NOMENCLA_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<StElementsNomenclaDto[]> {
        return axios.get(API_URLS.ST_ELEMENTS_NOMENCLA_URL + 'getAll')
        .then( response => response.data);
    }

    static get(idStElts: string, gestion: number, idPlan: string): Promise<StElementsNomenclaDto> {
        return axios.get(API_URLS.ST_ELEMENTS_NOMENCLA_URL + 'get/' + idStElts + '/' + gestion + '/' + idPlan)
        .then( response => response.data);
    }

    static delete(idStElts: string, gestion: number, idPlan: string): Promise<StElementsNomenclaDto> {
        return axios.delete(API_URLS.ST_ELEMENTS_NOMENCLA_URL + 'delete/' + idStElts + '/' + gestion + '/' + idPlan)
        .then( response => response.data);
    }

    static getByIdStEltsAndGestion(idStElts: string, gestion: number): Promise<StElementsNomenclaDto[]> {
        return axios.get(API_URLS.ST_ELEMENTS_NOMENCLA_URL + 'get/' + idStElts + '/' + gestion)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}