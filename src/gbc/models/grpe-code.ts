export interface GrpeCodeRequestDto {
	grpe: any;
	libelleGrpe: any;
}

export const emptyGrpeCodeRequestDto: GrpeCodeRequestDto = {
	grpe: null,
	libelleGrpe: null
}

export interface GrpeCodeResponseDto {
	grpe: any;
	libelleGrpe: any;
	userNames: any;
	codes: any;
}

export const emptyGrpeCodeResponseDto: GrpeCodeResponseDto = {
	grpe: null,
	libelleGrpe: null,
	userNames : null,
	codes: null
}