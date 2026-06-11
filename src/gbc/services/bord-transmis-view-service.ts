import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { BordTransmisViewDto } from "../models/bord-transmis-view";

export default class BordTransmisViewService {

    static getBordTransmisEtNonReceptionne(gestion: number, idBudget: number): Promise<BordTransmisViewDto[]> {
        return axios.get(API_URLS.BORD_TRANSMIS_VIEW_URL + 'getBordTransmisEtNonReceptionne/' + gestion + '/' + idBudget)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
}