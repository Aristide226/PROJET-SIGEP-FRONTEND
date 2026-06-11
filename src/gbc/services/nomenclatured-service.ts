import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { NomenclatureDRequestDto, NomenclatureDResponseDto } from "../models/nomenclatured";

export default class NomenclatureDService {

    static add(object: NomenclatureDRequestDto): Promise<NomenclatureDResponseDto> {
        return axios.post(API_URLS.NOMENCLATURED_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<NomenclatureDResponseDto[]> {
        return axios.get(API_URLS.NOMENCLATURED_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<NomenclatureDResponseDto> {
        return axios.get(API_URLS.NOMENCLATURED_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<NomenclatureDResponseDto> {
        return axios.delete(API_URLS.NOMENCLATURED_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: NomenclatureDRequestDto): Promise<NomenclatureDResponseDto> {
        return axios.put(API_URLS.NOMENCLATURED_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static exists(object: NomenclatureDRequestDto): Promise<Boolean> {
        return axios.get(API_URLS.NOMENCLATURED_URL + 'exists/titre/' + object.titre + '/sect/' + object.section + '/chap/' + object.chap + '/art/' + object.art + '/parag/' + object.parag + '/rub/' + object.rub)
        .then( response => response.data);
    }

    static getRecettesEtDepenses(): Promise<NomenclatureDResponseDto[]> {
        return axios.get(API_URLS.NOMENCLATURED_URL + 'getRecettesEtDepenses')
        .then( response => response.data);
    }

    static getRecettes(): Promise<NomenclatureDResponseDto[]> {
        return axios.get(API_URLS.NOMENCLATURED_URL + 'getRecettes')
        .then( response => response.data);
    }

    static getDepenses(): Promise<NomenclatureDResponseDto[]> {
        return axios.get(API_URLS.NOMENCLATURED_URL + 'getDepenses')
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}