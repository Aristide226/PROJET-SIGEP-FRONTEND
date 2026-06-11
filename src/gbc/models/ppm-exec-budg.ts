//Aristide
export interface PpmExecBudgRequestDto {
    idPpmExe : any;
    idLot : any;
    idBudget : any;
    exercice : any;
    codBud : any;
    idSrceFin : any;
    montantEstime : any;

    montantMaxHtva : any;
    montantMinHtva : any;
    montantMaxTtc : any;
    montantMinTtc : any;
    avecTVA : any;
    avecMiniMax : any;
}

export const emptyPpmExecBudgRequestDto : PpmExecBudgRequestDto = {
    idPpmExe : null,
    idLot : null,
    idBudget : null,
    exercice : null,
    codBud : null,
    idSrceFin : null,
    montantEstime : null,

    montantMaxHtva : null,
    montantMinHtva : null,
    montantMaxTtc : null,
    montantMinTtc : null,
    avecTVA : null,
    avecMiniMax : null,
}

export interface PpmExecBudgResponseDto {
    idPpmExe : any;
    idLot : any;
    idBudget : any;
    exercice : any;
    codBud : any;
    idSrceFin : any;
    montantEstime : any;

    montantMaxHtva : any;
    montantMinHtva : any;
    montantMaxTtc : any;
    montantMinTtc : any;
    avecTVA : any;
    avecMiniMax : any;
}

export const emptyPpmExecBudgResponseDto : PpmExecBudgResponseDto = {
    idPpmExe : null,
    idLot : null,
    idBudget : null,
    exercice : null,
    codBud : null,
    idSrceFin : null,
    montantEstime : null,

    montantMaxHtva : null,
    montantMinHtva : null,
    montantMaxTtc : null,
    montantMinTtc : null,
    avecTVA : null,
    avecMiniMax : null,
}