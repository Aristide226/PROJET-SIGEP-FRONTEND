// LES SESSION STORAGE SONT DETRUIT AUTOMATIQUEMENT LORSQU'ON FERME L'ONGLET OUI QUI LE NAVIGATEUR
export const GrhConnectedUser = (userName?: string): string|null => {
    if (userName) sessionStorage.setItem('grhConnectedUser', userName);
    return sessionStorage.getItem('grhConnectedUser');
}

export const GrhUserAuthenticationState = (yesOrNo?: string): string|null => {
    if (yesOrNo) sessionStorage.setItem('grhUserAuthenticationState', yesOrNo);
    return sessionStorage.getItem('grhUserAuthenticationState');
}

export const GrhGestion = (gestion?: string): string|null => {
    if (gestion) sessionStorage.setItem('grhGestion', gestion);
    return sessionStorage.getItem('grhGestion');
}

export const GrhGestionProchaine = (gestionProchaine?: string): string|null => {
    if (gestionProchaine) sessionStorage.setItem('grhGestionProchaine', gestionProchaine);
    return sessionStorage.getItem('grhGestionProchaine');
}

export const GrhIdBudget = (idBudget?: string): string|null => {
    if (idBudget) sessionStorage.setItem('grhIdBudget', idBudget);
    return sessionStorage.getItem('grhIdBudget');
}

export const GrhCode = (code?: string): string|null => {
    if (code) sessionStorage.setItem('grhCode', code);
    return sessionStorage.getItem('grhCode');
}

export const GrhGrpe = (grpe?: string): string|null => {
    if (grpe) sessionStorage.setItem('grhGrpe', grpe);
    return sessionStorage.getItem('grhGrpe');
}