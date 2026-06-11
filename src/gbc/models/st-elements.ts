export interface StElementsRequestDto {
	partie: any;
	rangStElts: any;
	libelleStElts: any;
	completLib: any;
}

export const emptyStElementsRequestDto: StElementsRequestDto = {
	partie: null,
	rangStElts: null,
	libelleStElts: null,
	completLib: null
}

export interface StElementsResponseDto {
	idStElts: any;
	partie: any;
	rangStElts: any;
	libelleStElts: any;
	completLib: any;
	stElementsNomenclaIds: any;
}

export const emptyStElementsResponseDto: StElementsResponseDto = {
	idStElts: null,
	partie: null,
	rangStElts: null,
	libelleStElts: null,
	completLib: null,
	stElementsNomenclaIds: null
}