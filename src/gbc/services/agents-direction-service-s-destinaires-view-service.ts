import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { AgentsDirectionServiceSDestinatairesViewDto } from "../models/agents-direction-service-s-destinataires-view";

export default class AgentsDirectionServiceSDestinatairesViewService {

    static getAll(): Promise<AgentsDirectionServiceSDestinatairesViewDto[]> {
        return axios.get(API_URLS.AGENT_DIRECTION_SERVICE_DESTINATAIRE_VIEW_URL + 'getAll')
        .then( response => response.data);
    }
}