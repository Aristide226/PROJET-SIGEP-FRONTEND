import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { AgentAccesCodeAccesCodeNiveauGrpeCodeViewDto } from "../models/agent-acces-code-acces-code-niveau-grpe-code-view";

export default class AgentAccesCodeAccesCodeNiveauGrpeCodeViewService {

    static getByCode(code: string): Promise<AgentAccesCodeAccesCodeNiveauGrpeCodeViewDto[]> {
        return axios.get(API_URLS.AGENT_ACCES_CODE_ACCES_CODE_NIVEAU_GRPE_CODE_URL + 'get/' + code)
        .then( response => response.data);
    }
}