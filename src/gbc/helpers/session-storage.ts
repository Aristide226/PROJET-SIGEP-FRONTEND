// LES SESSION STORAGE SONT DETRUIT AUTOMATIQUEMENT LORSQU'ON FERME L'ONGLET OUI QUI LE NAVIGATEUR
export const ConnectedUser = (userName?: string): string|null => {
    if (userName) sessionStorage.setItem('connectedUser', userName);
    return sessionStorage.getItem('connectedUser');
}

export const UserAuthenticationState = (yesOrNo?: string): string|null => {
    if (yesOrNo) sessionStorage.setItem('userAuthenticationState', yesOrNo);
    return sessionStorage.getItem('userAuthenticationState');
}

export const Gestion = (gestion?: string): string|null => {
    if (gestion) sessionStorage.setItem('gestion', gestion);
    return sessionStorage.getItem('gestion');
}

export const GestionProchaine = (gestionProchaine?: string): string|null => {
    if (gestionProchaine) sessionStorage.setItem('gestionProchaine', gestionProchaine);
    return sessionStorage.getItem('gestionProchaine');
}

export const IdBudget = (idBudget?: string): string|null => {
    if (idBudget) sessionStorage.setItem('idBudget', idBudget);
    return sessionStorage.getItem('idBudget');
}

export const Code = (code?: string): string|null => {
    if (code) sessionStorage.setItem('code', code);
    return sessionStorage.getItem('code');
}

export const Grpe = (grpe?: string): string|null => {
    if (grpe) sessionStorage.setItem('grpe', grpe);
    return sessionStorage.getItem('grpe');
}