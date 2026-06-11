import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { PlanComptableRequestDto, PlanComptableResponseDto } from "../models/plan-comptable";

export default class PlanComptableService {

    static add(object: PlanComptableRequestDto): Promise<PlanComptableResponseDto> {
        return axios.post(API_URLS.PLAN_COMPTABLE_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<PlanComptableResponseDto[]> {
        return axios.get(API_URLS.PLAN_COMPTABLE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<PlanComptableResponseDto> {
        return axios.get(API_URLS.PLAN_COMPTABLE_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<PlanComptableResponseDto> {
        return axios.delete(API_URLS.PLAN_COMPTABLE_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: PlanComptableRequestDto): Promise<PlanComptableResponseDto> {
        return axios.put(API_URLS.PLAN_COMPTABLE_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static getCompteTiers(): Promise<PlanComptableResponseDto[]> {
        return axios.get(API_URLS.PLAN_COMPTABLE_URL + 'getCompteTiers')
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}