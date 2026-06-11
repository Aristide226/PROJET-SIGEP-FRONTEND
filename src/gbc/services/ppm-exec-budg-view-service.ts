import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { ContratsViewDto } from "../models/contrats-view";

export default class PpmExecBudgViewService {

    static getByExerciceAndIdBudget(exercice: number, idBudget: number): Promise<ContratsViewDto[]> {
        return axios.get(API_URLS.PPM_EXEC_BUDG_VIEW_URL + 'getByExerciceAndIdBudget/' + exercice + '/' + idBudget)
        .then( response => response.data);
    }
}