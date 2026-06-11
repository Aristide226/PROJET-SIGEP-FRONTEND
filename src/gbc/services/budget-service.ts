import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { BudgetDto } from "../models/budget";

export default class BudgetService {

    static add(object: BudgetDto): Promise<BudgetDto> {
        return axios.post(API_URLS.BUDGET_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<BudgetDto[]> {
        return axios.get(API_URLS.BUDGET_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<BudgetDto> {
        return axios.get(API_URLS.BUDGET_URL + 'get/' + id)
        .then( response => response.data);
    }

    static getByGestionAndIdBudget(gestion: number, idBudget: number): Promise<BudgetDto[]> {
        return axios.get(API_URLS.BUDGET_URL + 'get/' + gestion + "/" + idBudget)
        .then( response => response.data);
    }

    static getByNumNo(numNo: string): Promise<BudgetDto[]> {
        return axios.get(API_URLS.BUDGET_URL + 'getByNumNo/' + numNo)
        .then( response => response.data);
    }

    static delete(id: string): Promise<BudgetDto> {
        return axios.delete(API_URLS.BUDGET_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: BudgetDto): Promise<BudgetDto> {
        return axios.put(API_URLS.BUDGET_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static exists(gestion: number, idBudget: number): Promise<Boolean> {
        return axios.get(API_URLS.BUDGET_URL + 'exists/' + gestion + "/" + idBudget)
        .then( response => response.data);
    }

    static creerBudgetSuivantAPartirDuBudgetPrecent(gestion: number, idBudget: number): Promise<BudgetDto[]> {
        return axios.post(API_URLS.BUDGET_URL + 'creerBudgetSuivantAPartirDuBudgetPrecent/' + gestion + "/" + idBudget)
        .then( response => response.data);
    }

    static creerBudgetSuivantAPartirDesRecettesEtDepenses(gestion: number, idBudget: number): Promise<BudgetDto[]> {
        return axios.post(API_URLS.BUDGET_URL + 'creerBudgetSuivantAPartirDesRecettesEtDepenses/' + gestion + "/" + idBudget)
        .then( response => response.data);
    }

    static getRecettes(gestion: number, idBudget: number): Promise<BudgetDto[]> {
        return axios.get(API_URLS.BUDGET_URL + 'getRecettes/' + gestion + "/" + idBudget)
        .then( response => response.data);
    }

    static getDepenses(gestion: number, idBudget: number): Promise<BudgetDto[]> {
        return axios.get(API_URLS.BUDGET_URL + 'getDepenses/' + gestion + "/" + idBudget)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}