//Aristide
import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { CodeBudgetaireRequestDto,CodeBudgetaireResponseDto } from "../models/code-budgetaire";

export default class CodeBudgetaireService {
    static add(object: CodeBudgetaireRequestDto) : Promise<CodeBudgetaireResponseDto> {
        return axios.post(API_URLS.CODE_BUDGETAIRE + 'add', object)
        .then(response => response.data)
    }

     static getAll(): Promise<CodeBudgetaireResponseDto[]> {
        return axios.get(API_URLS.CODE_BUDGETAIRE + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<CodeBudgetaireResponseDto> {
        return axios.get(API_URLS.CODE_BUDGETAIRE + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<{}> {
        return axios.delete(API_URLS.CODE_BUDGETAIRE + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: CodeBudgetaireRequestDto): Promise<CodeBudgetaireResponseDto> {
        return axios.put(API_URLS.CODE_BUDGETAIRE + 'edit/' + id, object)
        .then( response => response.data);
    }

    static getCodeBudgetaireStatistiqueDto(): Promise<[]> {
        return axios.get(API_URLS.CODE_BUDGETAIRE + 'stat')
        .then(response => response.data)
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}