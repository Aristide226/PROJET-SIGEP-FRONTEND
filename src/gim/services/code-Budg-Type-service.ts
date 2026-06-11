//Aristide
import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { CodeBudgTypeRequestDto, CodeBudgTypeResponseDto } from "../models/code-Budg-Type";

export default class CodeBudgTypeService {
    static add(object: CodeBudgTypeRequestDto) : Promise<CodeBudgTypeResponseDto> {
        return axios.post(API_URLS.CODE_BUDG_TYPE + 'add', object)
        .then(response => response.data)
    }

     static getAll(): Promise<CodeBudgTypeResponseDto[]> {
        return axios.get(API_URLS.CODE_BUDG_TYPE + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<CodeBudgTypeResponseDto> {
        return axios.get(API_URLS.CODE_BUDG_TYPE + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<{}> {
        return axios.delete(API_URLS.CODE_BUDG_TYPE + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: CodeBudgTypeRequestDto): Promise<CodeBudgTypeResponseDto> {
        return axios.put(API_URLS.CODE_BUDG_TYPE + 'edit/' + id, object)
        .then( response => response.data);
    }

    static getTypeBienStatistiqueDto(): Promise<[]> {
        return axios.get(API_URLS.CODE_BUDG_TYPE + 'stat')
        .then(response => response.data)
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}