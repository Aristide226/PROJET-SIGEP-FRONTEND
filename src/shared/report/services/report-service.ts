import axios from "axios";
import { Report } from "../models/report";
import { BASE_URL } from "../../config/api.base.url.config";

export default class ReportService {

    static createReport(report: Report): Promise<Blob> {
        return axios.post(BASE_URL + "/report/" + 'createReport', report, {
            responseType: 'blob',
            headers: {
               'Content-Type': 'application/json',
            }
        })
        .then( response => {
            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error(response.statusText);
            }
        })
        .catch (error => {
            throw error
        });
    }    
}