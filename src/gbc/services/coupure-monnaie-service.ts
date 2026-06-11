import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { CoupureMonnaieDto } from "../models/coupure-monnaie";

export default class CoupureMonnaieService {

    static add(object: CoupureMonnaieDto): Promise<CoupureMonnaieDto> {
        return axios.post(API_URLS.COUPURE_MONNAIE_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<CoupureMonnaieDto[]> {
        return axios.get(API_URLS.COUPURE_MONNAIE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(designa: string, idCoupure: number): Promise<CoupureMonnaieDto> {
        return axios.get(API_URLS.COUPURE_MONNAIE_URL + 'get/' + designa + '/' + idCoupure)
        .then( response => response.data);
    }

    static delete(designa: string, idCoupure: number): Promise<CoupureMonnaieDto> {
        return axios.delete(API_URLS.COUPURE_MONNAIE_URL + 'delete/' + designa + '/' + idCoupure)
        .then( response => response.data);
    }

    static edit(designa: string, idCoupure: number, object: CoupureMonnaieDto): Promise<CoupureMonnaieDto> {
        return axios.put(API_URLS.COUPURE_MONNAIE_URL + 'edit/' + designa + '/' + idCoupure, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}