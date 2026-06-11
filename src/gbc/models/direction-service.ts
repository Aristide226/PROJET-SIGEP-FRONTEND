export interface DirectionServiceRequestDto {
	libelle: any;
	abrev: any;
	idNiveau: any;
	codStruct: any;
	idParent: any;
}

export const emptyDirectionServiceRequestDto: DirectionServiceRequestDto = {
	libelle: null,
	abrev: null,
	idNiveau: null,
	codStruct: null,
	idParent: null,
}

export interface DirectionServiceResponseDto {
	idService: any;
	libelle: any;
	abrev: any;
	idHerachique: any;
	idNiveau: any;
	codStruct: any;
	idParent: any;
	idServices: any;
	mles: any;
}

export const emptyDirectionServiceResponseDto: DirectionServiceResponseDto = {
	idService: null,
	libelle: null,
	abrev: null,
	idHerachique: null,
	idNiveau: null,
	codStruct: null,
	idParent: null,
	idServices: null,
	mles: null
}