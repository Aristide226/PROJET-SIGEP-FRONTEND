import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { MandatRequestDto, MandatResponseDto } from "../models/mandat";
import { InfosPourAbandonnerLiquidation } from "../models/infos-pour-abandonner-liquidation";
import { InfosPourValiderLiquidation } from "../models/infos-pour-valider-liquidation";
import { InfosPourRetrograderLiquidation } from "../models/infos-pour-retrograder-liquidation";
import { IdMandsIdBordEmis } from "../models/id-mands-id-bord-emis";

export default class MandatService {

    static add(object: MandatRequestDto): Promise<MandatResponseDto> {
        return axios.post(API_URLS.MANDAT_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<MandatResponseDto[]> {
        return axios.get(API_URLS.MANDAT_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<MandatResponseDto> {
        return axios.get(API_URLS.MANDAT_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<MandatResponseDto> {
        return axios.delete(API_URLS.MANDAT_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: MandatRequestDto): Promise<MandatResponseDto> {
        return axios.put(API_URLS.MANDAT_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static abandonnerLiquidation(infosPourAbandonnerLiquidation: InfosPourAbandonnerLiquidation): Promise<Boolean> {
        return axios.post(API_URLS.MANDAT_URL + 'abandonnerLiquidation', infosPourAbandonnerLiquidation)
        .then( response => response.data);
    }

    static validerLiquidation(infosPourValiderLiquidation: InfosPourValiderLiquidation): Promise<Boolean> {
        return axios.post(API_URLS.MANDAT_URL + 'validerLiquidation', infosPourValiderLiquidation)
        .then( response => response.data);
    }

    static retrograderLiquidation(infosPourRetrograderLiquidation: InfosPourRetrograderLiquidation): Promise<Boolean> {
        return axios.post(API_URLS.MANDAT_URL + 'retrograderLiquidation', infosPourRetrograderLiquidation)
        .then( response => response.data);
    }

    static transmettre(idMandsIdBordEmis: IdMandsIdBordEmis): Promise<Boolean> {
        return axios.post(API_URLS.MANDAT_URL + 'transmettre', idMandsIdBordEmis)
        .then( response => response.data);
    }    

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}