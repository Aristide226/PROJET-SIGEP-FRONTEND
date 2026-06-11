import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { BordTransmisRequestDto, BordTransmisResponseDto } from "../models/bord-transmis";
import { InfosPourReceptionnerBordTransmis } from "../models/infos-pour-receptionner-bord-transmis";

export default class BordTransmisService {

    static add(object: BordTransmisRequestDto): Promise<BordTransmisResponseDto> {
        return axios.post(API_URLS.BORD_TRANSMIS_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<BordTransmisResponseDto[]> {
        return axios.get(API_URLS.BORD_TRANSMIS_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<BordTransmisResponseDto> {
        return axios.get(API_URLS.BORD_TRANSMIS_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<BordTransmisResponseDto> {
        return axios.delete(API_URLS.BORD_TRANSMIS_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: BordTransmisRequestDto): Promise<BordTransmisResponseDto> {
        return axios.put(API_URLS.BORD_TRANSMIS_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static getByGestionAndIdBudgetAndExpeditaire(gestion: number, idBudget: number, expeditaire: string): Promise<BordTransmisResponseDto[]> {
        return axios.get(API_URLS.BORD_TRANSMIS_URL + 'getByGestionAndIdBudgetAndExpeditaire/' + gestion + '/' + idBudget + '/' + expeditaire)
        .then( response => response.data);
    }   

    static receptionner(infosPourReceptionnerBordTransmis: InfosPourReceptionnerBordTransmis): Promise<Boolean> {
        return axios.post(API_URLS.BORD_TRANSMIS_URL + 'receptionner', infosPourReceptionnerBordTransmis)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}