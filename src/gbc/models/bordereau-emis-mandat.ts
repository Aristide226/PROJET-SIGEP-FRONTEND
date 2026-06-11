export interface BordereauEmismandatsRequestDto {
	gestion: any;
	journee: any;
	total: any;
	idLogin: any;
	dossier: any;
	actif: any;
	dateReception: any;
	userReception: any;
	identiteRecept: any;
	idBudget: any;
}

export const emptyBordereauEmismandatsRequestDto: BordereauEmismandatsRequestDto = {
	gestion: null,
	journee: null,
	total: null,
	idLogin: null,
	dossier: null,
	actif: null,
	dateReception: null,
	userReception: null,
	identiteRecept: null,
	idBudget: null,
}

export interface BordereauEmismandatsResponseDto {
	id: any;
	gestion: any;
	num: any;
	journee: any;
	total: any;
	totalAnterieur: any;
	totalCumul: any;
	idLogin: any;
	dossier: any;
	actif: any;
	montDeduit: any;
	dateReception: any;
	userReception: any;
	identiteRecept: any;
	idBudget: any;
	numMands: any;
	bordTitreIds: any;
	bordMandIds: any;
	idDetailTitres: any;
}

export const emptyBordereauEmismandatsResponseDto: BordereauEmismandatsResponseDto = {
	id: null,
	gestion: null,
	num: null,
	journee: null,
	total: null,
	totalAnterieur: null,
	totalCumul: null,
	idLogin: null,
	dossier: null,
	actif: null,
	montDeduit: null,
	dateReception: null,
	userReception: null,
	identiteRecept: null,
	idBudget: null,
	numMands: null,
	bordTitreIds: null,
	bordMandIds: null,
	idDetailTitres: null,
}