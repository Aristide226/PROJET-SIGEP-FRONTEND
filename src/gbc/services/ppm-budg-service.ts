//Aristide
import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { PpmBudgRequestDto, PpmBudgResponseDto } from "../models/ppm-budget";


export default class PpmBudgService {

    static add(object:PpmBudgRequestDto): Promise<PpmBudgResponseDto[]> {
        return axios.post(API_URLS.PPM_BUDG_URL + 'add', object)
        .then(response => response.data)
    }

    static getAll(): Promise<PpmBudgResponseDto[]> {
        return axios.get(API_URLS.PPM_BUDG_URL + `getAll`)
        .then(response => response.data)
    }

    static get(idPpm: string, codBud: string, idSrceFin: string): Promise<PpmBudgResponseDto[]> {
        return axios.get(`${API_URLS.PPM_BUDG_URL}get/${idPpm}/${codBud}/${idSrceFin}`)
        .then(response => response.data)
    }

    static delete(idPpm: string, codBud: string, idSrceFin: string): Promise<PpmBudgResponseDto[]> {
        return axios.delete(`${API_URLS.PPM_BUDG_URL}delete/${idPpm}/${codBud}/${idSrceFin}`)
        .then(response => response.data)
    }

    static edit(idPpm: string, codBud: string, idSrceFin: string, object:PpmBudgRequestDto): Promise<PpmBudgResponseDto[]> {
        return axios.put(`${API_URLS.PPM_BUDG_URL}edit/${idPpm}/${codBud}/${idSrceFin}`,object)
        .then(response => response.data)
    }

    static getByIdPpm(idPpm: string) {
        if(!idPpm) throw new Error("L'ID est requis pour récupérer un ligne budgétaire.")
        return axios.get(API_URLS.PPM_BUDG_URL + `getByIdPpm/` + idPpm)
        .then(response => response.data)
    }

    static addReam(object:PpmBudgRequestDto): Promise<PpmBudgResponseDto[]>{
        return axios.post(API_URLS.PPM_BUDG_URL + 'addReam',object)
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
    }
}