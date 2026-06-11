import axios from "axios";
import CodeAccesDto from "../models/code-acces";
import { API_URLS } from "../config/api.url.config";

export default class CodeAccesService {

    static add(object: CodeAccesDto): Promise<CodeAccesDto> {
        return axios.post(API_URLS.CODE_ACCES_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<CodeAccesDto[]> {
        return axios.get(API_URLS.CODE_ACCES_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<CodeAccesDto> {
        return axios.get(API_URLS.CODE_ACCES_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<{}> {
        return axios.delete(API_URLS.CODE_ACCES_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: CodeAccesDto): Promise<CodeAccesDto> {
        return axios.put(API_URLS.CODE_ACCES_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static getByUserName(userName: string): Promise<CodeAccesDto> {
        return axios.get(API_URLS.CODE_ACCES_URL + 'getByUserName/' + userName)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}