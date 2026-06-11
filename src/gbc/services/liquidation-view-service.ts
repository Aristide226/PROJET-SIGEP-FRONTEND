import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { LiquidationViewDto } from "../models/liquidation-view";

export default class LiquidationViewService {

    static getByGestionAndIdBudgetOrderByNumBlDesc(gestion: number, idBudget: number): Promise<LiquidationViewDto[]> {
        return axios.get(API_URLS.LIQUIDATION_VIEW_URL+ 'getByGestionAndIdBudgetOrderByNumBlDesc/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static getReçuModifiables(gestion: number, idBudget: number): Promise<LiquidationViewDto[]> {
        return axios.get(API_URLS.LIQUIDATION_VIEW_URL+ 'getReçuModifiables/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static getReçuSansMandats(gestion: number, idBudget: number): Promise<LiquidationViewDto[]> {
        return axios.get(API_URLS.LIQUIDATION_VIEW_URL+ 'getReçuSansMandats/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static getLiquidationModifiables(gestion: number, idBudget: number): Promise<LiquidationViewDto[]> {
        return axios.get(API_URLS.LIQUIDATION_VIEW_URL+ 'getLiquidationModifiables/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static getByGestionAndIdBudgetOrderByNumBeDesc(gestion: number, idBudget: number): Promise<LiquidationViewDto[]> {
        return axios.get(API_URLS.LIQUIDATION_VIEW_URL+ 'getByGestionAndIdBudgetOrderByNumBeDesc/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static getLiquidationValidables(gestion: number, idBudget: number): Promise<LiquidationViewDto[]> {
        return axios.get(API_URLS.LIQUIDATION_VIEW_URL+ 'getLiquidationValidables/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static getLiquidationRetrogradables(gestion: number, idBudget: number, idUser: string): Promise<LiquidationViewDto[]> {
        return axios.get(API_URLS.LIQUIDATION_VIEW_URL+ 'getLiquidationRetrogradables/' + gestion + '/' + idBudget + '/' + idUser)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
}