export interface EnteteRequestDto {
	codUser: any;
	niveau1: any;
	niveau2: any;
	niveau3: any;
	niveau4: any;
	abv1: any;
	abv2: any;
	abv3: any;
	abv4: any;
	complementNum: any;
	abrevEpe: any;
}

export const emptyEnteteRequestDto: EnteteRequestDto = {
	codUser: null,
	niveau1: null,
	niveau2: null,
	niveau3: null,
	niveau4: null,
	abv1: null,
	abv2: null,
	abv3: null,
	abv4: null,
	complementNum: null,
	abrevEpe: null,
}

export interface EnteteResponseDto {
	codUser: any;
	niveau1: any;
	niveau2: any;
	niveau3: any;
	niveau4: any;
	abv1: any;
	abv2: any;
	abv3: any;
	abv4: any;
	complementNum: any;
	abrevEpe: any;
}

export const emptyEnteteResponseDto: EnteteResponseDto = {
	codUser: null,
	niveau1: null,
	niveau2: null,
	niveau3: null,
	niveau4: null,
	abv1: null,
	abv2: null,
	abv3: null,
	abv4: null,
	complementNum: null,
	abrevEpe: null
}