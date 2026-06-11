import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { ContratsViewDto } from "../models/contrats-view";

export default class ContratsViewService {

    static getByIdBudget(idBudget: number): Promise<ContratsViewDto[]> {
        return axios.get(API_URLS.CONTRATS_VIEW_URL + 'getByIdBudget/' + idBudget)
        .then( response => response.data);
    }

    static getByGestionAndIdBudget(gestion: number, idBudget: number): Promise<ContratsViewDto[]> {
        return axios.get(API_URLS.CONTRATS_VIEW_URL + 'getByGestionAndIdBudget/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static getContratsPartiellementEngages(gestion: number, idBudget: number): Promise<ContratsViewDto[]> {
        return axios.get(API_URLS.CONTRATS_VIEW_URL + 'getContratsPartiellementEngages/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static getByIdContrat(idContrat: number): Promise<ContratsViewDto> {
        return axios.get(API_URLS.CONTRATS_VIEW_URL + 'getByIdContrat/' + idContrat)
        .then( response => response.data);
    }
}