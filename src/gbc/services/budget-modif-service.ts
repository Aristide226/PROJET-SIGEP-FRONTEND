import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { BudgetModifRequestDto, BudgetModifResponseDto } from "../models/budget-modif";
import { BudgetModifBudgetDto } from "../models/budget-modif-budget-dto";

export default class BudgetModifService {

    static add(object: BudgetModifRequestDto): Promise<BudgetModifResponseDto> {
        return axios.post(API_URLS.BUDGET_MODIF_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<BudgetModifResponseDto[]> {
        return axios.get(API_URLS.BUDGET_MODIF_URL + 'getAll')
        .then( response => response.data);
    }

    static get(codBma: number, codBud: string): Promise<BudgetModifResponseDto> {
        return axios.get(API_URLS.BUDGET_MODIF_URL + 'get/' + codBma + '/' + codBud)
        .then( response => response.data);
    }

    static delete(codBma: number, codBud: string): Promise<BudgetModifResponseDto> {
        return axios.delete(API_URLS.BUDGET_MODIF_URL + 'delete/' + codBma + '/' + codBud)
        .then( response => response.data);
    }

    static edit(codBma: number, codBud: string, object: BudgetModifRequestDto): Promise<BudgetModifResponseDto> {
        return axios.put(API_URLS.BUDGET_TYPE_URL + 'edit/' + codBma + '/' + codBud, object)
        .then( response => response.data);
    }

    static getLigneModifieesRecettesDepenses(codBma: number): Promise<BudgetModifBudgetDto[]> {
        return axios.get(API_URLS.BUDGET_MODIF_URL + 'getLigneModifieesRecettesDepenses/' + codBma)
        .then( response => response.data);
    }

    static addLignesModifiees(list: BudgetModifRequestDto[]): Promise<Boolean> {
        return axios.post(API_URLS.BUDGET_MODIF_URL + 'addLignesModifiees', list)
        .then( response => response.data);
    }

    static deleteLignesModifiees(codBma: number): Promise<Boolean> {
        return axios.get(API_URLS.BUDGET_MODIF_URL + 'deleteLignesModifiees/' + codBma)
        .then( response => response.data);
    }

    static exists(codBma: number, codBud: string): Promise<Boolean> {
        return axios.get(API_URLS.BUDGET_MODIF_URL + 'exists/' + codBma + '/' + codBud)
        .then( response => response.data);
    }

    static editAllCAAjoutCAAnnul(codBma: number): Promise<Boolean> {
        return axios.get(API_URLS.BUDGET_MODIF_URL + 'editAllCAAjoutCAAnnul/' + codBma)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}