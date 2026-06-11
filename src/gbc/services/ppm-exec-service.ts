//Aristide
import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { PpmExecRequestDto,PpmExecResponseDto } from "../models/ppm-exec";

export default class PpmExecService {

    static add(object: PpmExecRequestDto) : Promise<PpmExecResponseDto[]> {
        return axios.post(API_URLS.PPM_EXEC_URL + 'add', object)
        .then(response => response.data)
    }

    static getAll(): Promise<PpmExecResponseDto[]> {
        return axios.get(API_URLS.PPM_EXEC_URL + 'getAll')
        .then( response => response.data)
    }

    static get(idPpmExec : number,idLot: number, idBudget: number, exercice: number)  {
        return axios.get(API_URLS.PPM_EXEC_URL + `get/${idPpmExec}/${idLot}/${idBudget}/${exercice}`)
        .then(response => response.data)
    }

    static delete(idPpmExec : number, idLot : number, idBudget: number, exercice: number)  {
        return axios.delete(API_URLS.PPM_EXEC_URL + `delete/${idPpmExec}/${idLot}/${idBudget}/${exercice}`)
        .then(response => response.data)
    }

    static edit(idPpmExec : number, idLot : number, idBudget: number, exercice: number, object : PpmExecRequestDto) {
        return axios.put(API_URLS.PPM_EXEC_URL + `edit/${idPpmExec}/${idLot}/${idBudget}/${exercice}`,object)
        .then(response => response.data)
    }

    static getAllLotsByIdPpmAndIdBudgetAndExercice(idPpm:String ,idBudget:number,exercice:number) {
        return axios.get(API_URLS.PPM_EXEC_URL + `getAllLotsByIdPpmAndIdBudgetAndExercice/${idPpm}/${idBudget}/${exercice}`)
        .then(response => response.data)
    }

    static getAllLotsByIdPpmExecAndIdBudgetAndExercice (idPpmExec : number, idBudget: number, exercice: number) : Promise<PpmExecResponseDto[]> {
        return axios.get(API_URLS.PPM_EXEC_URL + `getAllLotsByIdPpmExecAndIdBudgetAndExercice/${idPpmExec}/${idBudget}/${exercice}`)
    }

    static generatePdfReport(annee: number) : Promise<Blob> {
        return axios.get(`${API_URLS.PPM_EXEC_URL}download`, {
            params: {
                annee: annee,
            },
            responseType: 'blob',
        })
        .then(response => {
            return response.data
        })
    }

    static generateVisibilitePrm(annee: number) : Promise<Blob> {
        return axios.get(`${API_URLS.PPM_EXEC_URL}download/visibilitePrm`, {
            params: {
                annee: annee,
            },
            responseType: 'blob',
        })
        .then(response => {
            return response.data
        })
    }

    static isEmpty(data: object): boolean {
        return Object.keys(data).length === 0;
    }

    static handleError(error: Error): void {
    }
}