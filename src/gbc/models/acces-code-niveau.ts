export interface AccesCodeNiveauRequestDto {
	code: any;
	intituleCode: any;
	nomStruct: any;
	grpes: any;
}

export const emptyAccesCodeNiveauRequestDto: AccesCodeNiveauRequestDto = {
	code: null,
	intituleCode: null,
	nomStruct: null,
	grpes: null
}

export interface AccesCodeNiveauResponseDto {
	code: any;
	intituleCode: any;
	nomStruct: any;
	userNames: any;
	grpes: any;
}

export const emptyAccesCodeNiveauResponseDto: AccesCodeNiveauResponseDto = {
	code: null,
	intituleCode: null,
	nomStruct: null,
	userNames: null,
	grpes: null
}