import axios from "axios";
import { BASE_URL } from "../../config/api.base.url.config";

export default class ServerDateService {

    static getServerDate(): Promise<string> {
        return axios.get(BASE_URL + '/serverDate/' + 'getServerDate')
        .then( response => response.data);
    }

    static getServerTimeMillis(): Promise<number> {
        return axios.get(BASE_URL + '/serverDate/' + 'getServerTimeMillis')
        .then( response => response.data);
    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }
      
    static handleError(error: Error): void {
        console.error("Response faillure : ", error);
    }
}