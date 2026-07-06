//Aristide
import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { CodeMaterielRequestDto, CodeMaterielResponseDto } from "../models/code-materiel";

export default class CodeMaterielService {
    static add(object: CodeMaterielRequestDto) : Promise<CodeMaterielResponseDto> {
        return axios.post(API_URLS.CODE_MATERIEL_URL + 'add', object)
        .then(response => response.data)
    }

     static getAll(): Promise<CodeMaterielResponseDto[]> {
        return axios.get(API_URLS.CODE_MATERIEL_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<CodeMaterielResponseDto> {
        return axios.get(API_URLS.CODE_MATERIEL_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<{}> {
        return axios.delete(API_URLS.CODE_MATERIEL_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: CodeMaterielRequestDto): Promise<CodeMaterielResponseDto> {
        return axios.put(API_URLS.CODE_MATERIEL_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}