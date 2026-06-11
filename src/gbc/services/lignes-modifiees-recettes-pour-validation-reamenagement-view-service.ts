import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { LignesModifieesRecettesPourValidationReamenagementViewDto } from "../models/lignes-modifiees-recettes-pour-validation-reamenagement-view";

export default class LignesModifieesRecettesPourValidationReamenagementViewService {

    static getLignesModifieesRecettesPourValidationReamenagement(gestion: number, idBudget: number, codReam: number): Promise<LignesModifieesRecettesPourValidationReamenagementViewDto[]> {
        return axios.get(API_URLS.LIGNES_MODIFIESS_RECETTES_POUR_VALIDATION_REAMENAGEMENT_VIEW_URL + 'getLignesModifieesRecettesPourValidationReamenagement/' + gestion + '/' + idBudget + '/' + codReam)
        .then( response => response.data);
    }
}