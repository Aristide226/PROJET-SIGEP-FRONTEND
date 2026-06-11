import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { AccesLigneBudgetaireRequestDto, AccesLigneBudgetaireResponseDto } from "../models/acces-ligne-budgetaire";

export default class AccesLigneBudgetaireService {

    static add(object: AccesLigneBudgetaireRequestDto): Promise<AccesLigneBudgetaireResponseDto> {
        return axios.post(API_URLS.ACCES_LIGNE_BUDGEATAIRE_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<AccesLigneBudgetaireResponseDto[]> {
        return axios.get(API_URLS.ACCES_LIGNE_BUDGEATAIRE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(userName: string, gestion: number, numNo: string): Promise<AccesLigneBudgetaireResponseDto> {
        return axios.get(API_URLS.ACCES_LIGNE_BUDGEATAIRE_URL + 'get/' + userName + '/' + gestion + '/' + numNo)
        .then( response => response.data);
    }

    static delete(userName: string, gestion: number, numNo: string): Promise<AccesLigneBudgetaireResponseDto> {
        return axios.delete(API_URLS.ACCES_LIGNE_BUDGEATAIRE_URL + 'delete/' + userName + '/' + gestion + '/' + numNo)
        .then( response => response.data);
    }

    static deleteByUserNameAndGestionAndIdBudget(userName: string, gestion: number, idBudget: number): Promise<{}> {
        return axios.delete(API_URLS.ACCES_LIGNE_BUDGEATAIRE_URL + 'deleteByUserNameAndGestionAndIdBudget/' + userName + '/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static getByUserNameAndGestion(userName: string, gestion: number): Promise<AccesLigneBudgetaireResponseDto[]> {
        return axios.get(API_URLS.ACCES_LIGNE_BUDGEATAIRE_URL + 'get/' + userName + '/' + gestion)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}