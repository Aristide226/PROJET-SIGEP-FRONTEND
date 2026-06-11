export interface InstitutFinancierRequestDto {
	abreviation: any;
	libelle: any;
	addresseA: any;
	transiArct: any;
	codeBanque: any;
	libCourtMinus: any;
	libCourtMajus: any;
}

export const emptyInstitutFinancierRequestDto: InstitutFinancierRequestDto = {
	abreviation: null,
	libelle: null,
	addresseA: null,
	transiArct: null,
	codeBanque: null,
	libCourtMinus: null,
	libCourtMajus: null,
}

export interface InstitutFinancierResponseDto {
	abreviation: any;
	libelle: any;
	addresseA: any;
	transiArct: any;
	codeBanque: any;
	libCourtMinus: any;
	libCourtMajus: any;
	idDest: any;
	idAgences: any;
}

export const emptyInstitutFinancierResponseDto: InstitutFinancierResponseDto = {
	abreviation: null,
	libelle: null,
	addresseA: null,
	transiArct: null,
	codeBanque: null,
	libCourtMinus: null,
	libCourtMajus: null,
	idDest: null,
	idAgences: null
}