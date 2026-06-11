import GestionService from "../../shared/services/gestion-service";
import { GimCode, GimConnectedUser, GimGestion, GimGestionProchaine, GimGrpe, GimIdBudget, GimUserAuthenticationState } from "../helpers/session-storage";
import bcrypt from 'bcryptjs-react';
import CodeAccesService from "./code-acces-service";

export default class GimAuthenticationService {
    
    static isAuthenticated: string = "false";

    static login(userName: string, motPasse: string): Promise<string> {
        
        CodeAccesService.getByUserName(userName)
            .then( data => {
                bcrypt.compare(motPasse, data.motDePasse).then( res => {
                    if (res) {
                        if (data.etat === true) {
                            GimUserAuthenticationState('yes');
                            GimConnectedUser(data.userName);
                            GimIdBudget("0");
                            GimCode("GIM");
                            GimGrpe(data.idCodeAccessType.trim());
                            GestionService.getLastByEtat("ACTIF").then(data => {
                                GimGestion(data.courante);
                                GimGestionProchaine(data.courante + 1);
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