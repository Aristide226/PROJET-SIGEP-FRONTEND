import axios from "axios";
import { API_URLS } from "../config/api.url.config";
import { AgentRequestDto, AgentResponseDto } from "../models/agent";

export default class AgentService {

    static add(object: AgentRequestDto): Promise<AgentResponseDto> {
        return axios.post(API_URLS.AGENT_URL + 'add', object)
        .then( response => response.data);
    }

    static getAll(): Promise<AgentResponseDto[]> {
        return axios.get(API_URLS.AGENT_URL + 'getAll')
        .then( response => response.data);
    }

    static get(id: number): Promise<AgentResponseDto> {
        return axios.get(API_URLS.AGENT_URL + 'get/' + id)
        .then( response => response.data);
    }

    static delete(id: number): Promise<AgentResponseDto> {
        return axios.delete(API_URLS.AGENT_URL + 'delete/' + id)
        .then( response => response.data);
    }

    static edit(id: number, object: AgentRequestDto): Promise<AgentResponseDto> {
        return axios.put(API_URLS.AGENT_URL + 'edit/' + id, object)
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}