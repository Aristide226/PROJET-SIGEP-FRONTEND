//Aristide
import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { PpmRequestDto, PpmResponseDto, } from "../models/ppm";


export default class PpmService {

    static add(object: PpmRequestDto): Promise<PpmResponseDto[]> {
        return axios.post(API_URLS.PPM_URL + 'add', object)
        .then(response => response.data)
    }
    
    static getAll(): Promise<PpmResponseDto[]> {
        return axios.get(API_URLS.PPM_URL + 'getAll')
        .then( response => response.data);
    }
    

    static get(idPpm: string) {
        return axios.get(API_URLS.PPM_URL + `get/` + idPpm)
        .then(response => response.data);
    }
    
    static delete(idPpm: string): Promise<void> {
        return axios.delete(API_URLS.PPM_URL + `delete/` + idPpm)
        .then(response => response.data);
    }

    static edit(idPpm: string, object:any): Promise<PpmResponseDto[]> {
        return axios.put(API_URLS.PPM_URL + 'edit/' + idPpm, object)
        .then(response => response.data);
    }

    static editReam(idPpm: string, object:any): Promise<PpmResponseDto[]> {
        return axios.put(API_URLS.PPM_URL + 'editReam/' + idPpm, object)
        .then(response => response.data);
    }
    
    static getByExercice(exercice: string) {
        return axios.get(`${API_URLS.PPM_URL}getByExercice/${exercice}`)
            .then(response => response.data);
        }
    
    static getByIdBudgetAndExercice(idBudget:string, exercice: string) {
        return axios.get(`${API_URLS.PPM_URL}getByIdBudgetAndExercice/${idBudget}/${exercice}`)
        .then(response => response.data)
    }
    
    static getNextNum(idBudget: number, exercice: number) {
        return axios.get(`${API_URLS.PPM_URL}getNextNum`,{
            params: {
                idBudget:idBudget,
                exercice: exercice
            }
        })
        .then(response => response.data);
    }

    static addReam(object: PpmRequestDto): Promise<PpmResponseDto[]> {
        return axios.post(API_URLS.PPM_URL + 'addReam', object)
        .then(response => response.data)
    }

    static downloadPpmReport(annee: number): Promise<Blob> {
        return axios.get(`${API_URLS.PPM_URL}download`, {
            params: {
                annee: annee,
            },
            responseType: 'blob',
        })
        .then(response => {
            return response.data;
        })
    }

    static isEmpty(data: object): boolean {
        return Object.keys(data).length === 0;
    }

    static handleError(error: Error): void {
    }
   
}
