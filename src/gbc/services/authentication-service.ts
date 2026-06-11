
import { Code, ConnectedUser, Gestion, GestionProchaine, Grpe, IdBudget, UserAuthenticationState } from '../helpers/session-storage';
import AccesCodeService from './accesCodeService';
import GestionService from './gestion-service';
import bcrypt from 'bcryptjs-react';

export default class AuthenticationService {
    
    static isAuthenticated: string = "false";

    static login(userName: string, motPasse: string): Promise<string> {
        
        AccesCodeService.get(userName)
            .then( data => {
                bcrypt.compare(motPasse, data.motDePasse).then( res => {
                    if (res) {
                        if (data.statu === "ACTIF") {
                            UserAuthenticationState('yes');
                            ConnectedUser(userName);
                            IdBudget("0");
                            Code(data.code.trim());
                            Grpe(data.grpe.trim())
                            GestionService.getLastByEtat("ACTIF").then(data => {
                                Gestion(data.courante);
                                GestionProchaine(data.courante + 1);
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