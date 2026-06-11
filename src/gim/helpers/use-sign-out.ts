import { useNavigate } from "react-router-dom";
import { GimCode, GimGestion, GimGestionProchaine, GimGrpe, GimIdBudget, GimUserAuthenticationState } from "./session-storage";

export const useGimSignOut = () => {
    const navigate = useNavigate();

    return () => {
        GimUserAuthenticationState("No");
        GimCode(" ");
        GimGrpe(" ")
        GimGestion(" ");
        GimGestionProchaine(" ");
        GimIdBudget(" ");
        navigate("/gim/login");
    }
}