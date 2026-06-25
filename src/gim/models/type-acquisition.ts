//Aristide
export interface TypeAcquisitionRequestDto {
    libTypeAcq : any;
    exigerEngagement : any;
}

export const emptyTypeAcquisitionRequestDto : TypeAcquisitionRequestDto = {
    libTypeAcq : null,
    exigerEngagement : null
}

export interface TypeAcquisitionResponseDto {
    idTypeAcq : any;
    libTypeAcq : any;
    exigerEngagement : any;
}

export const emptyTypeAcquisitionResponseDto : TypeAcquisitionResponseDto = {
    idTypeAcq : null,
    libTypeAcq : null,
    exigerEngagement : null
}