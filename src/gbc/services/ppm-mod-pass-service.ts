//Arisitide
import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { PpmModPassRequestDto,PpmModPassResponseDto } from "../models/ppm-mod-pass";

export default class PpmModPassService {

    static add(object: PpmModPassRequestDto): Promise<PpmModPassResponseDto[]> {
        return axios.post(API_URLS.PPM_MOD_PASS_URL + 'add',object)
        .then(response => response.data);
    }

    static getAll(): Promise<PpmModPassRequestDto[]>{
        return axios.get(API_URLS.PPM_MOD_PASS_URL + 'getAll' )
        .then(response => response.data)
    }

    static get(id: string) {
        return axios.get(API_URLS.PPM_MOD_PASS_URL + 'get/' + id)
            .then(response => response.data);
        }

    static delete(id: string) {
        return axios.delete(API_URLS.PPM_MOD_PASS_URL + 'delete/' + id)
        .then(response => response.data);
    }

    static edit(id: string, object:any) :Promise<PpmModPassResponseDto[]> {
        return axios.put(API_URLS.PPM_MOD_PASS_URL + 'edit' + id)
        .then(response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
    }
}