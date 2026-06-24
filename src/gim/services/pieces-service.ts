//Aristide
import axios from "axios";
import { PiecesRequestDto,PiecesResponseDto } from "../models/pieces";
import { API_URLS } from "../config/api.url.config";

export default class PiecesService {

    static add(object: PiecesRequestDto) : Promise<PiecesResponseDto> {
        return axios.post(API_URLS.PIECES_URL + 'add', object)
        .then(response => response.data)
    }

     static getAll(): Promise<PiecesResponseDto[]> {
        return axios.get(API_URLS.PIECES_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<PiecesResponseDto> {
        return axios.get(API_URLS.PIECES_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<{}> {
        return axios.delete(API_URLS.PIECES_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: PiecesRequestDto): Promise<PiecesResponseDto> {
        return axios.put(API_URLS.PIECES_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}