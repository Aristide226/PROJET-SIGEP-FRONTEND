export interface ActeNatureRequestDto {
	acte: any;
	acteTitre: any;
	acteNumComplema: any;
	dernierArticleDebloc: any;
	dernierArticleReam: any;
}

export const emptyActeNatureRequestDto: ActeNatureRequestDto = {
	acte: null,
	acteTitre: null,
	acteNumComplema: null,
	dernierArticleDebloc: null,
	dernierArticleReam: null,
}

export interface ActeNatureResponseDto {
	idActe: any;
	acte: any;
	acteTitre: any;
	acteNumComplema: any;
	dernierArticleDebloc: any;
	dernierArticleReam: any;
	idReamgmtActes: any;
}

export const emptyActeNatureResponseDto: ActeNatureResponseDto = {
	idActe: null,
	acte: null,
	acteTitre: null,
	acteNumComplema: null,
	dernierArticleDebloc: null,
	dernierArticleReam: null,
	idReamgmtActes: null,
}