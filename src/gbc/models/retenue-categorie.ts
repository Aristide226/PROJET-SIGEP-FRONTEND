export interface RetenueCategorieRequestDto {
	idCategorie: any;
	libelle: any;
}

export const emptyRetenueCategorieRequestDto: RetenueCategorieRequestDto = {
	idCategorie: null,
	libelle: null,
}

export interface RetenueCategorieResponseDto {
	idCategorie: any;
	libelle: any;
	idTypRetenus: any;
}

export const emptyRetenueCategorieResponseDto: RetenueCategorieResponseDto = {
	idCategorie: null,
	libelle: null,
	idTypRetenus: null
}