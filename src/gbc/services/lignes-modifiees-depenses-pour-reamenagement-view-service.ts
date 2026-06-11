import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { LignesModifieesDepensesPourValidationReamenagementViewDto } from "../models/lignes-modifiees-depenses-pour-validation-reamenagement-view";

export default class LignesModifieesDepensesPourValidationReamenagementViewService {

    static getLignesModifieesDepensesPourValidationReamenagement(gestion: number, idBudget: number, codReam: number): Promise<LignesModifieesDepensesPourValidationReamenagementViewDto[]> {
        return axios.get(API_URLS.LIGNES_MODIFIESS_DEPENSES_POUR_VALIDATION_REAMENAGEMENT_VIEW_URL + 'getLignesModifieesDepensesPourValidationReamenagement/' + gestion + '/' + idBudget + '/' + codReam)
        .then( response => response.data);
    }
}