export interface DirectionServiceNiveauRequestDto {
	idNiveau: any;
	libelleNiveau: any;
}

export const emptyDirectionServiceNiveauRequestDto: DirectionServiceNiveauRequestDto = {
	idNiveau: null,
	libelleNiveau: null
}

export interface DirectionServiceNiveauResponseDto {
	idNiveau: any;
	libelleNiveau: any;
	idServices: any;
}

export const emptyDirectionServiceNiveauResponseDto: DirectionServiceNiveauResponseDto = {
	idNiveau: null,
	libelleNiveau: null,
	idServices: null
}