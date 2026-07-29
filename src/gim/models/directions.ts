//Aristide
export interface DirectionsRequestDto {
    nomDirection : any;
    abrev : any;
    codeDir : any
}

export const emptyDirectionsRequestDto : DirectionsRequestDto = {
    nomDirection : null,
    abrev : null,
    codeDir : null
}

export interface DirectionsResponseDto {
    codDirect : any;
    nomDirection : any;
    abrev : any;
    codeDir : any
}

export const emptyDirectionsResponseDto :DirectionsResponseDto = {
    codDirect : null,
    nomDirection : null,
    abrev : null,
    codeDir : null
}