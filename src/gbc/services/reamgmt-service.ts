import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { ReamgmtRequestDto, ReamgmtResponseDto } from "../models/reamgmt";
import { ReamgmtBudgetDto } from "../models/reamgmt-budget-dto";

export default class ReamgmtService {

    static add(object: ReamgmtRequestDto): Promise<ReamgmtResponseDto> {
        return axios.post(API_URLS.REAMGMT_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<ReamgmtResponseDto[]> {
        return axios.get(API_URLS.REAMGMT_URL + 'getAll')
        .then( response => response.data);
    }

    static get(codReam: number, codBud: string): Promise<ReamgmtResponseDto> {
        return axios.get(API_URLS.REAMGMT_URL + 'get/' + codReam + '/' + codBud)
        .then( response => response.data);
    }

    static delete(codReam: number, codBud: string): Promise<ReamgmtResponseDto> {
        return axios.delete(API_URLS.REAMGMT_URL + 'delete/' + codReam + '/' + codBud)
        .then( response => response.data);
    }

    static edit(codReam: number, codBud: string, object: ReamgmtRequestDto): Promise<ReamgmtResponseDto> {
        return axios.put(API_URLS.REAMGMT_URL + 'edit/' + codReam + '/' + codBud, object)
        .then( response => response.data);
    }

    static getLigneModifieesRecettesDepenses(codReam: number): Promise<ReamgmtBudgetDto[]> {
        return axios.get(API_URLS.REAMGMT_URL + 'getLigneModifieesRecettesDepenses/' + codReam)
        .then( response => response.data);
    }

    static addLignesModifiees(list: ReamgmtResponseDto[]): Promise<Boolean> {
        return axios.post(API_URLS.REAMGMT_URL + 'addLignesModifiees', list)
        .then( response => response.data);
    }

    static deleteLignesModifiees(codReam: number): Promise<Boolean> {
        return axios.get(API_URLS.REAMGMT_URL + 'deleteLignesModifiees/' + codReam)
        .then( response => response.data);
    }

    static exists(codReam: number, codBud: string): Promise<Boolean> {
        return axios.get(API_URLS.REAMGMT_URL + 'exists/' + codReam + '/' + codBud)
        .then( response => response.data);
    }
    
    static editAllReam(codReam: number): Promise<Boolean> {
        return axios.get(API_URLS.REAMGMT_URL + 'editAllReam/' + codReam)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}