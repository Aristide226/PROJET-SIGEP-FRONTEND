import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { BordTransmisViewDto } from "../models/bord-transmis-view";
import { BordereauEmismandatsViewDto } from "../models/bordereau-emis-mandat-view";

export default class BordereauEmismandatsViewService {

    static getByGestionAndIdBudgetAndDossier(gestion: number, idBudget: number, dossier: string): Promise<BordereauEmismandatsViewDto[]> {
        return axios.get(API_URLS.BORDEREAU_EMIS_MANDATS_VIEW_URL + 'getByGestionAndIdBudgetAndDossier/' + gestion + '/' + idBudget + '/' + dossier)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
}