//Aristide
export interface PpmModPassRequestDto{
    abrevMp: any;
    libelleLongMp : any;
    jrsNecessaireEvalua : any;
    jrsLancemtRemisO : any;
    cod4 : any;
}

export const emptyPpmModPassRequestDto:PpmModPassRequestDto ={
    abrevMp:null,
    libelleLongMp:null,
    jrsNecessaireEvalua:null,
    jrsLancemtRemisO:null,
    cod4: null,
}

export interface PpmModPassResponseDto{
    abrevMp: any;
    libelleLongMp : any;
    jrsNecessaireEvalua : any;
    jrsLancemtRemisO : any;
    cod4 : any;
    idPpms: any
}

export const emptyPpmModPassResponseDto:PpmModPassResponseDto = {
    abrevMp:null,
    libelleLongMp:null,
    jrsNecessaireEvalua:null,
    jrsLancemtRemisO:null,
    cod4: null,
    idPpms: null
}