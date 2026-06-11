import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { BudgetModifActeRequestDto, BudgetModifActeResponseDto } from "../models/budget-modif-acte";
import { ReamgmtActeRequestDto, ReamgmtActeResponseDto } from "../models/reamgmt-acte";

export default class ReamgmtActeService {

    static add(object: ReamgmtActeRequestDto): Promise<ReamgmtActeResponseDto> {
        return axios.post(API_URLS.REAMGMT_ACTE_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<ReamgmtActeResponseDto[]> {
        return axios.get(API_URLS.REAMGMT_ACTE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<ReamgmtActeResponseDto> {
        return axios.get(API_URLS.REAMGMT_ACTE_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<ReamgmtActeResponseDto> {
        return axios.delete(API_URLS.REAMGMT_ACTE_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: ReamgmtActeRequestDto): Promise<ReamgmtActeResponseDto> {
        return axios.put(API_URLS.REAMGMT_ACTE_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static existsByGestionAndIdBudgetAndValide(gestion: number, idBudget: number, valide: boolean): Promise<Boolean> {
        return axios.get(API_URLS.REAMGMT_ACTE_URL + 'existsByGestionAndIdBudgetAndValide/' + gestion + '/' + idBudget + '/' + valide)
        .then( response => response.data);
    }

    static getByGestionAndIdBudgetAndValide(gestion: number, idBudget: number, valide: boolean): Promise<ReamgmtActeResponseDto[]> {
        return axios.get(API_URLS.REAMGMT_ACTE_URL + 'getByGestionAndIdBudgetAndValide/' + gestion + '/' + idBudget + '/' + valide)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}