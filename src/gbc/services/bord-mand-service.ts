import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { MandatRequestDto } from "../models/mandat";
import { IdMandsIdBordEmis } from "../models/id-mands-id-bord-emis";
import { BordMandDto } from "../models/bord-mand";

export default class BordMandService {

    static add(object: BordMandDto): Promise<BordMandDto> {
        return axios.post(API_URLS.BORD_MAND_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<BordMandDto[]> {
        return axios.get(API_URLS.BORD_MAND_URL + 'getAll')
        .then( response => response.data);
    }

    static get(idBord: string, numMand: number): Promise<BordMandDto> {
        return axios.get(API_URLS.BORD_MAND_URL + 'get/' + idBord + '/' + numMand)
        .then( response => response.data);
    }

    static delete(idBord: string, numMand: number): Promise<BordMandDto> {
        return axios.delete(API_URLS.BORD_MAND_URL + 'delete/' + idBord + '/' + numMand)
        .then( response => response.data);
    }

    static edit(idBord: string, numMand: number, object: MandatRequestDto): Promise<BordMandDto> {
        return axios.put(API_URLS.BORD_MAND_URL + 'edit/' + idBord + '/' + numMand, object)
        .then( response => response.data);
    }

    static adds(idMandsIdBordEmis: IdMandsIdBordEmis): Promise<Boolean> {
        return axios.post(API_URLS.BORD_MAND_URL + 'adds', idMandsIdBordEmis)
        .then( response => response.data);
    } 
    
    static deleteBordereauEmismandats(idBord: string): Promise<Boolean> {
        return axios.post(API_URLS.BORD_MAND_URL + 'deleteBordereauEmismandats/' + idBord )
        .then( response => response.data);
    } 

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}