import GestionService from "../../shared/services/gestion-service";
import { GrhCode, GrhConnectedUser, GrhGestion, GrhGestionProchaine, GrhGrpe, GrhIdBudget, GrhUserAuthenticationState } from "../helpers/session-storage";
import AccesCodeService from "./acces-codeService";
import bcrypt from 'bcryptjs-react';

export default class GrhAuthenticationService {
    
    static isAuthenticated: string = "false";

    static login(userName: string, motPasse: string): Promise<string> {
        
        AccesCodeService.get(userName)
            .then( data => {
                bcrypt.compare(motPasse, data.motDePasse).then( res => {
                    if (res) {
                        if (data.statu === "ACTIF") {
                            GrhUserAuthenticationState('yes');
                            GrhConnectedUser(userName);
                            GrhIdBudget("0");
                            GrhCode(data.code.trim());
                            GrhGrpe(data.grpe.trim());
                            GestionService.getLastByEtat("ACTIF").then(data => {
                                GrhGestion(data.courante);
                                GrhGestionProchaine(data.courante + 1);
                            })                            
                            this.isAuthenticated = "true";
                        } else {
                            this.isAuthenticated = "userInactif";
                        }
                    } else {
                        this.isAuthenticated = "false";            
                    }  
                }).catch( err => {
                    throw err;
                }) 
                
            })
            .catch( error => {
                if (error.response.status === 0) this.isAuthenticated = "serverIsOff"; 
                if (error.response.status === 500) this.isAuthenticated = "dataNotExist"; 
            }) 

        return new Promise( resolve => {
            setTimeout(() => {
                resolve(this.isAuthenticated);   
            }, 5000);
        });
    }
}