export interface FournisseurRequestDto {
	raisonSociale: any;
	bp: any;
	profession: any;
	telephone: any;
}

export const emptyFournisseurRequestDto: FournisseurRequestDto = {
	raisonSociale: null,
	bp: null,
	profession: null,
	telephone: null,
}

export interface FournisseurResponseDto {
	idFourn: any;
	raisonSociale: any;
	bp: any;
	profession: any;
	telephone: any;
}

export const emptyFournisseurResponseDto: FournisseurResponseDto = {
	idFourn: null,
	raisonSociale: null,
	bp: null,
	profession: null,
	telephone: null,
}