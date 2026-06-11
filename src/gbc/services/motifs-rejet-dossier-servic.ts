import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { MotifsRejetDossierRequestDto, MotifsRejetDossierResponseDto } from "../models/motifs-rejet-dossier";

export default class MotifsRejetDossierService {

    static add(object: MotifsRejetDossierRequestDto): Promise<MotifsRejetDossierResponseDto> {
        return axios.post(API_URLS.MOTIFS_REJET_DOSSIER_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<MotifsRejetDossierResponseDto[]> {
        return axios.get(API_URLS.MOTIFS_REJET_DOSSIER_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<MotifsRejetDossierResponseDto> {
        return axios.get(API_URLS.MOTIFS_REJET_DOSSIER_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<MotifsRejetDossierResponseDto> {
        return axios.delete(API_URLS.MOTIFS_REJET_DOSSIER_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: MotifsRejetDossierRequestDto): Promise<MotifsRejetDossierResponseDto> {
        return axios.put(API_URLS.MOTIFS_REJET_DOSSIER_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static setActifToFalse(numBe: number): Promise<Boolean> {
        return axios.get(API_URLS.MOTIFS_REJET_DOSSIER_URL + 'setActifToFalse/' + numBe)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}