import axios from "axios";
import { FournisseursViewDto } from "../models/fournisseurs-view";
import { API_URLS } from "../config/api.url.config";

export default class FournisseursViewService {

    static getAll(): Promise<FournisseursViewDto[]> {
        return axios.get(API_URLS.FOURNISSEURS_VIEW_URL + 'getAll')
        .then( response => response.data);
    }
}