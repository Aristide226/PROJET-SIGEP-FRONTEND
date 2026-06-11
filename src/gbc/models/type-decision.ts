export interface TypeDecisionRequestDto {
	libelle: any;
}

export const emptyTypeDecisionRequestDto: TypeDecisionRequestDto = {
	libelle: null
}

export interface TypeDecisionResponseDto {
	idType: any;
	libelle: any;
	rangVisas: any;
}

export const emptyTypeDecisionResponseDto: TypeDecisionResponseDto = {
	idType: null,
	libelle: null,
	rangVisas: null
}