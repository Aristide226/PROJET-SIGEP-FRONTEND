import axios from "axios";
import { BudgetTypeRequestDto, BudgetTypeResponseDto } from "../models/budget-type";
import { API_URLS } from "../config/api.url.config";

export default class BudgetTypeService {

    static add(object: BudgetTypeRequestDto): Promise<BudgetTypeResponseDto> {
        return axios.post(API_URLS.BUDGET_TYPE_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<BudgetTypeResponseDto[]> {
        return axios.get(API_URLS.BUDGET_TYPE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<BudgetTypeResponseDto> {
        return axios.get(API_URLS.BUDGET_TYPE_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<BudgetTypeResponseDto> {
        return axios.delete(API_URLS.BUDGET_TYPE_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: BudgetTypeRequestDto): Promise<BudgetTypeResponseDto> {
        return axios.put(API_URLS.BUDGET_TYPE_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}