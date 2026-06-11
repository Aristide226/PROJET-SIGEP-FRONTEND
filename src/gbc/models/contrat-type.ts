export interface ContratTypeRequestDto {
	typeContrat: any;
	libelle: any;
	avecMiniMax: any;
}

export const emptyContratTypeRequestDto: ContratTypeRequestDto = {
	typeContrat: null,
	libelle: null,
	avecMiniMax: null,
}

export interface ContratTypeResponseDto {
	typeContrat: any;
	libelle: any;
	avecMiniMax: any;
	idContrats: any;
}

export const emptyContratTypeResponseDto: ContratTypeResponseDto = {
	typeContrat: null,
	libelle: null,
	avecMiniMax: null,
	idContrats: null
}