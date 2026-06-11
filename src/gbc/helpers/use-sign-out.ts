import { useNavigate } from "react-router-dom";
import { Code, Gestion, GestionProchaine, Grpe, IdBudget, UserAuthenticationState } from "./session-storage";

export const useSignOut = () => {
    const navigate = useNavigate();

    return () => {
        UserAuthenticationState("No");
        // JE NE METTE A " " POUR PERMETTRE A L'UTILISATEUR DE NE PLUS AVOIR A SAISIR LE USERNAME
        //ConnectedUser(" "); 
        Code(" ");
        Grpe(" ")
        Gestion(" ");
        GestionProchaine(" ");
        IdBudget(" ");
        navigate("/gbc/login");
    }
}