export interface GestionRequestDto {
	courante: any;
	libelle: any;
	etat: any;
	utilisation: any;
}

export const emptyGestionRequestDto: GestionRequestDto = {
	courante: null,
	libelle: null,
	etat: null,
	utilisation: null
}

export interface GestionResponseDto {
	courante: any;
	libelle: any;
	etat: any;
	utilisation: any;
	idAccesLigneBudgetaires: any;
}

export const emptyGestionResponseDto: GestionResponseDto = {
	courante: null,
	libelle: null,
	etat: null,
	utilisation: null,
	idAccesLigneBudgetaires: null,
}