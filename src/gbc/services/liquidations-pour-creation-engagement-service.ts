import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { LiquidationsPourCreationEngagementViewDto } from "../models/liquidations-pour-creation-engagement-view";

export default class LiquidationsPourCreationEngagementViewService {

    static getByGestion(gestion: number): Promise<LiquidationsPourCreationEngagementViewDto[]> {
        return axios.get(API_URLS.LIQUIDATIONS_POUR_CREATION_ENGAGEMENT_VIEW_URL + 'getByGestion/' + gestion)
        .then( response => response.data);
    }
}