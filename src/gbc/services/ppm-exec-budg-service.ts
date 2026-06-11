//Aristide
import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { PpmExecBudgRequestDto,PpmExecBudgResponseDto } from "../models/ppm-exec-budg";

export default class PpmExecBudgService {

    static add (object : PpmExecBudgRequestDto) : Promise<PpmExecBudgResponseDto[]> {
        return axios.post(API_URLS.PPM_EXEC_BUDG_URL + 'add',object )
        .then(response => response.data);
    }

    static getAll(): Promise<PpmExecBudgResponseDto[]> {
        return axios.get(API_URLS.PPM_EXEC_BUDG_URL + 'getAll')
        .then( response => response.data)
    }

    static get(idPpmExec : number,idLot: number, idBudget: number, exercice: number, codBud:string, idSrceFin:string)  {
        return axios.get(API_URLS.PPM_EXEC_BUDG_URL + `get/${idPpmExec}/${idLot}/${idBudget}/${exercice}/${codBud}/${idSrceFin}`)
        .then(response => response.data)
    }

    static delete(idPpmExec : number, idLot : number, idBudget: number, exercice: number, codBud:string, idSrceFin:string)  {
        return axios.delete(API_URLS.PPM_EXEC_BUDG_URL + `delete/${idPpmExec}/${idLot}/${idBudget}/${exercice}/${codBud}/${idSrceFin}`)
        .then(response => response.data)
    }

    static edit(idPpmExec : number, idLot : number, idBudget: number, exercice: number, codBud:string, idSrceFin:string,object : PpmExecBudgRequestDto) {
        return axios.put(API_URLS.PPM_EXEC_BUDG_URL + `edit/${idPpmExec}/${idLot}/${idBudget}/${exercice}/${codBud}/${idSrceFin}`,object)
        .then(response => response.data)
    }

    static getLignesByLot (idPpmExec : number, idLot : number, idBudget: number, exercice: number) {
        return axios.get(API_URLS.PPM_EXEC_BUDG_URL + `getLignesByLot/${idPpmExec}/${idLot}/${idBudget}/${exercice}`)
    }

    static isEmpty(data: object): boolean {
        return Object.keys(data).length === 0;
    }

    static handleError(error: Error): void {
    } 
}