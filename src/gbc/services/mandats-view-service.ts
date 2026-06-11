import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { MandatsViewDto } from "../models/mandats-view";

export default class MandatsViewService {

    static getMandatValideAE2EtSansBordereaus(gestion: number, idBudget: number): Promise<MandatsViewDto[]> {
        return axios.get(API_URLS.MANDATS_VIEW_URL+ 'getMandatValideAE2EtSansBordereaus/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
}