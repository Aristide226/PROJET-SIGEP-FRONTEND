import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { PieceJustifRequestDto, PieceJustifResponseDto } from "../models/piece-justif";

export default class PieceJustifService {

    static add(object: PieceJustifRequestDto): Promise<PieceJustifResponseDto> {
        return axios.post(API_URLS.PIECE_JUSTIF_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<PieceJustifResponseDto[]> {
        return axios.get(API_URLS.PIECE_JUSTIF_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: string): Promise<PieceJustifResponseDto> {
        return axios.get(API_URLS.PIECE_JUSTIF_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: string): Promise<PieceJustifResponseDto> {
        return axios.delete(API_URLS.PIECE_JUSTIF_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: string, object: PieceJustifRequestDto): Promise<PieceJustifResponseDto> {
        return axios.put(API_URLS.PIECE_JUSTIF_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static addPiecesJustificatives(numBe: number, list: PieceJustifRequestDto[]): Promise<Boolean> {
        return axios.post(API_URLS.PIECE_JUSTIF_URL + 'addPiecesJustificatives/' + numBe, list)
        .then( response => response.data);
    }

    static getByNumBeOrderByPieceJustificative(numBe: number): Promise<PieceJustifResponseDto[]> {
        return axios.get(API_URLS.PIECE_JUSTIF_URL + 'getByNumBeOrderByPieceJustificative/' + numBe)
        .then( response => response.data);
    }

    static deleteByNumBe(numBe: number): Promise<PieceJustifResponseDto[]> {
        return axios.get(API_URLS.PIECE_JUSTIF_URL + 'deleteByNumBe/' + numBe)
        .then( response => response.data);
    }

    static addPiecesJustificativesRDL(codLiq: number, list: PieceJustifRequestDto[]): Promise<Boolean> {
        return axios.post(API_URLS.PIECE_JUSTIF_URL + 'addPiecesJustificativesRDL/' + codLiq, list)
        .then( response => response.data);
    }

    static getByCodLiqOrderByPieceJustificative(codLiq: number): Promise<PieceJustifResponseDto[]> {
        return axios.get(API_URLS.PIECE_JUSTIF_URL + 'getByCodLiqOrderByPieceJustificative/' + codLiq)
        .then( response => response.data);
    }

    static deleteByCodLiq(codLiq: number): Promise<PieceJustifResponseDto[]> {
        return axios.get(API_URLS.PIECE_JUSTIF_URL + 'deleteByCodLiq/' + codLiq)
        .then( response => response.data);
    }

    static addPiecesJustificativesLiquidation(numMand: number, list: PieceJustifRequestDto[]): Promise<Boolean> {
        return axios.post(API_URLS.PIECE_JUSTIF_URL + 'addPiecesJustificativesLiquidation/' + numMand, list)
        .then( response => response.data);
    }

    static getByNumMandOrderByPieceJustificative(numMand: number): Promise<PieceJustifResponseDto[]> {
        return axios.get(API_URLS.PIECE_JUSTIF_URL + 'getByNumMandOrderByPieceJustificative/' + numMand)
        .then( response => response.data);
    }

    static deleteByNumMand(numMand: number): Promise<PieceJustifResponseDto[]> {
        return axios.get(API_URLS.PIECE_JUSTIF_URL + 'deleteByNumMand/' + numMand)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}