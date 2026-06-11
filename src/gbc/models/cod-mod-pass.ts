export interface CodModPassRequestDto {
	cod4: any,
	intitule: any,
	libelleCourt: any,
	idProc: any,
}

export const emptyCodModPassRequestDto: CodModPassRequestDto = {
	cod4: null,
	intitule: null,
	libelleCourt: null,
	idProc: null,
}

export interface CodModPassResponseDto {
    cod4: any,
	intitule: any,
	libelleCourt: any,
	idProc: any,
	idPpmModePasss: any,
}

export const emptyCodModPassResponseDto: CodModPassResponseDto = {
    cod4: null,
	intitule: null,
	libelleCourt: null,
	idProc: null,
	idPpmModePasss: null,
}