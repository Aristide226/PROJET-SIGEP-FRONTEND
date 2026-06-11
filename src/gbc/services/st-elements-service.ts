import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { StElementsRequestDto, StElementsResponseDto } from "../models/st-elements";
import { TypeDecisionRequestDto, TypeDecisionResponseDto } from "../models/type-decision";

export default class StElementsService {

    static add(object: StElementsRequestDto): Promise<StElementsResponseDto> {
        return axios.post(API_URLS.ST_ELEMENTS_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<StElementsResponseDto[]> {
        return axios.get(API_URLS.ST_ELEMENTS_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<StElementsResponseDto> {
        return axios.get(API_URLS.ST_ELEMENTS_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<StElementsResponseDto> {
        return axios.delete(API_URLS.ST_ELEMENTS_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: StElementsRequestDto): Promise<StElementsResponseDto> {
        return axios.put(API_URLS.ST_ELEMENTS_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}