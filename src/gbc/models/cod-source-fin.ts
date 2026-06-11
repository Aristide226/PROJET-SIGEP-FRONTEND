//Aristide
export interface CodSourceFinRequestDto {
    cod5 ?: any;
    intituleCourt ?:any;
    abrev ?: any;
    intituleLong ?: any;
}

export const emptyCodSourceFinRequestDto:CodSourceFinRequestDto={
    cod5:null,
    intituleCourt:null,
    abrev: null,
    intituleLong: null
}

export interface CodSourceFinResponseDto {
    cod5 ?: any;
    intituleCourt ?:any;
    abrev ?: any;
    intituleLong ?: any;
    ppmBudgIds ?: any;
}

export const emptycodSourceFinResponseDto:CodSourceFinResponseDto={
    cod5: null,
    intituleCourt:null,
    abrev: null,
    intituleLong: null,
    ppmBudgIds: null
}