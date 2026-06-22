//Aristide
export interface MagasinEntrepotRequestDto {
    libelleMagasin : any;
}

export const emptyMagasinEntrepotRequestDto : MagasinEntrepotRequestDto = {
    libelleMagasin : null
}

export interface MagasinEntrepotResponseDto {
    idMagasin : any;
	libelleMagasin : any
}

export const emptyMagasinEntrepotResponseDto : MagasinEntrepotResponseDto = {
    idMagasin : null,
	libelleMagasin : null
}