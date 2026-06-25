//Aristide
import axios from "axios";
import { TypeAcquisitionRequestDto,TypeAcquisitionResponseDto } from "../models/type-acquisition";
import { API_URLS } from "../config/api.url.config";

export default class TypeAcquisitionService {

    static add(object: TypeAcquisitionRequestDto) : Promise<TypeAcquisitionResponseDto> {
        return axios.post(API_URLS.TYPE_ACQUISITION_URL + 'add', object)
        .then(response => response.data)
    }

     static getAll(): Promise<TypeAcquisitionResponseDto[]> {
        return axios.get(API_URLS.TYPE_ACQUISITION_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<TypeAcquisitionResponseDto> {
        return axios.get(API_URLS.TYPE_ACQUISITION_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<{}> {
        return axios.delete(API_URLS.TYPE_ACQUISITION_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: TypeAcquisitionRequestDto): Promise<TypeAcquisitionResponseDto> {
        return axios.put(API_URLS.TYPE_ACQUISITION_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}