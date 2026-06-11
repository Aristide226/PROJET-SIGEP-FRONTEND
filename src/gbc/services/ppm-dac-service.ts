//Aristide
import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { PpmDacRequestDto,PpmDacResponseDto } from "../models/ppm-dac";

export default class PpmDacService {

    static add(object:PpmDacRequestDto) : Promise<PpmDacResponseDto> {
        return axios.post(API_URLS.PPM_DAC_URL + 'add',object)
        .then(response => response.data);
    }

    static getAll() : Promise<PpmDacResponseDto[]> {
        return axios.get(API_URLS.PPM_DAC_URL + 'getAll')
        .then(response => response.data)
    }

    static get(id:string) : Promise<PpmDacResponseDto> {
        return axios.get(API_URLS.PPM_DAC_URL + 'get/' + id)
        .then(response => response.data);
    }

    static delete(id:string) : Promise<PpmDacResponseDto> {
        return axios.delete(API_URLS.PPM_DAC_URL + 'delete/' + id)
        .then(response => response.data);
    }

    static edit(id:string, object:PpmDacRequestDto) : Promise<PpmDacResponseDto> {
        return axios.put(API_URLS.PPM_DAC_URL + 'edit/' + id, object)
        .then(response => response.data);
    }

    static isEmpty(data : Object): boolean {
        return Object.keys(data).length === 0;
    }

    static handleError(error: Error): void {
    }
}