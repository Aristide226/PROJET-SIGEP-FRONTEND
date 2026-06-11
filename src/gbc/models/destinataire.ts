export interface DestinataireRequestDto {
	ifumle: any;
	ftype: any;
	contactTel: any;
	contactEmail: any;
}

export const emptyDestinataireRequestDto: DestinataireRequestDto = {
	ifumle: null,
	ftype: null,
	contactTel: null,
	contactEmail: null
}

export interface DestinataireResponseDto {
	idDest: any;
	ifumle: any;
	ftype: any;
	contactTel: any;
	contactEmail: any;
	nom: any;
	mle: any;
}

export const emptyDestinataireResponseDto: DestinataireResponseDto = {
	idDest: null,
	ifumle: null,
	ftype: null,
	contactTel: null,
	contactEmail: null,
	nom: null,
	mle: null
}