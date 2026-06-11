//Aristide
export  interface PpmBudgRequestDto {
    idPpm: any;
    codBud: any;
    idSrceFin:any;
    montantEstime?:any;
    ream : any;

}

export const  emptyPpmBudgRequestDto : PpmBudgRequestDto ={
    idPpm:null,
    codBud:null,
    idSrceFin:null,
    montantEstime:null,
    ream: null
}

export interface  PpmBudgResponseDto{
    idPpm:any,
    codBud:any,
    idSrceFin:any,
    montantEstime?:any,
    ream: any,
}

export const emptyPpmBudgResponseDto:PpmBudgResponseDto = {
    idPpm:null,
    codBud:null,
    idSrceFin:null,
    montantEstime:null,
    ream: null
}