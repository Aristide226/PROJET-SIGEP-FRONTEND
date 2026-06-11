import { useNavigate } from "react-router-dom";
import { GrhCode, GrhGestion, GrhGestionProchaine, GrhGrpe, GrhIdBudget, GrhUserAuthenticationState } from "./session-storage";

export const useGrhSignOut = () => {
    const navigate = useNavigate();

    return () => {
        GrhUserAuthenticationState("No");
        GrhCode(" ");
        GrhGrpe(" ")
        GrhGestion(" ");
        GrhGestionProchaine(" ");
        GrhIdBudget(" ");
        navigate("/grh/login");
    }
}