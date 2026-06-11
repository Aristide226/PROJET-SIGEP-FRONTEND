import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { DestinataireRequestDto, DestinataireResponseDto } from "../models/destinataire";

export default class DestinataireService {

    static add(object: DestinataireRequestDto): Promise<DestinataireResponseDto> {
        return axios.post(API_URLS.DESTINATAIRE_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<DestinataireResponseDto[]> {
        return axios.get(API_URLS.DESTINATAIRE_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<DestinataireResponseDto> {
        return axios.get(API_URLS.DESTINATAIRE_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<DestinataireResponseDto> {
        return axios.delete(API_URLS.DESTINATAIRE_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: DestinataireRequestDto): Promise<DestinataireResponseDto> {
        return axios.put(API_URLS.DESTINATAIRE_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static getDestinataireSansAgents(): Promise<DestinataireResponseDto[]> {
        return axios.get(API_URLS.DESTINATAIRE_URL + 'getDestinataireSansAgents')
        .then( response => response.data);
    }

    static existsByIfumleAndIfumleNot(ifumle: string, excludedValue: string): Promise<Boolean> {
        return axios.get(API_URLS.DESTINATAIRE_URL + 'existsByIfumleAndIfumleNot', {
            params: {
                ifumle: ifumle,
                excludedValue: excludedValue,
            }
        })
        .then( response => response.data);
    }

    static existsByIfumleAndIfumleNotOrNom(ifumle: string, excludedValue: string, nom: string): Promise<Boolean> {
        return axios.get(API_URLS.DESTINATAIRE_URL + 'existsByIfumleAndIfumleNotOrNom', {
            params: {
                ifumle: ifumle,
                excludedValue: excludedValue,
                nom: nom
            }
        })
        .then( response => response.data);
    }

    static existsByIfumleAndIfumleNotAndIdDestNotOrNomAndIdDestNot(ifumle: string, excludedValue: string, idDest1: number, nom: string, idDest2: number): Promise<Boolean> {
        return axios.get(API_URLS.DESTINATAIRE_URL + 'existsByIfumleAndIfumleNotAndIdDestNotOrNomAndIdDestNot', {
            params: {
                ifumle: ifumle,
                excludedValue: excludedValue,
                idDest1: idDest1,
                nom: nom,
                idDest2: idDest2,
            }
        })
        .then( response => response.data);
    }

    //Aristide
    static getAllFournisseurs() : Promise<DestinataireResponseDto[]> {
        return axios.get(API_URLS.DESTINATAIRE_URL + 'getAllFournisseurs')
        .then(response => response.data);
    }


    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}