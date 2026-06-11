// LES SESSION STORAGE SONT DETRUIT AUTOMATIQUEMENT LORSQU'ON FERME L'ONGLET OUI QUI LE NAVIGATEUR
export const GimConnectedUser = (userName?: string): string|null => {
    if (userName) sessionStorage.setItem('gimConnectedUser', userName);
    return sessionStorage.getItem('gimConnectedUser');
}

export const GimUserAuthenticationState = (yesOrNo?: string): string|null => {
    if (yesOrNo) sessionStorage.setItem('gimUserAuthenticationState', yesOrNo);
    return sessionStorage.getItem('gimUserAuthenticationState');
}

export const GimGestion = (gestion?: string): string|null => {
    if (gestion) sessionStorage.setItem('gimGestion', gestion);
    return sessionStorage.getItem('gimGestion');
}

export const GimGestionProchaine = (gestionProchaine?: string): string|null => {
    if (gestionProchaine) sessionStorage.setItem('gimGestionProchaine', gestionProchaine);
    return sessionStorage.getItem('gimGestionProchaine');
}

export const GimIdBudget = (idBudget?: string): string|null => {
    if (idBudget) sessionStorage.setItem('gimIdBudget', idBudget);
    return sessionStorage.getItem('gimIdBudget');
}

export const GimCode = (code?: string): string|null => {
    if (code) sessionStorage.setItem('gimCode', code);
    return sessionStorage.getItem('gimCode');
}

export const GimGrpe = (grpe?: string): string|null => {
    if (grpe) sessionStorage.setItem('gimGrpe', grpe);
    return sessionStorage.getItem('gimGrpe');
}