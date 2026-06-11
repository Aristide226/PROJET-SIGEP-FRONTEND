import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { LiquidationRequestDto, LiquidationResponseDto } from "../models/liquidation";

export default class LiquidationService {

    static add(object: LiquidationRequestDto): Promise<LiquidationResponseDto> {
        return axios.post(API_URLS.LIQUIDATION_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<LiquidationResponseDto[]> {
        return axios.get(API_URLS.LIQUIDATION_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<LiquidationResponseDto> {
        return axios.get(API_URLS.LIQUIDATION_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<LiquidationResponseDto> {
        return axios.delete(API_URLS.LIQUIDATION_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: LiquidationRequestDto): Promise<LiquidationResponseDto> {
        return axios.put(API_URLS.LIQUIDATION_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}