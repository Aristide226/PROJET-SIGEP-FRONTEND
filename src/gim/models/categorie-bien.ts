//Aristide
export interface CategorieBienRequestDto {
    libCategorieBien : any;
}

export const emptyCategorieBienRequestDto : CategorieBienRequestDto = {
    libCategorieBien : null,
}

export interface CategorieBienResponseDto {
    codCategorie : any;
	libCategorieBien : any;
}

export const emptyCategorieBienResponseDto : CategorieBienResponseDto = {
    codCategorie : null,
	libCategorieBien : null
}