export interface CompteDestinataireRequestDto {
	codeBanque: any;
	codeAgence: any;
	numCompte: any;
	cleRib: any;
	caissePop: any;
	numCaissePop: any;
	codeBic: any;
	iban: any;
	idCaissePop: any;
	idDest: any;
	abreviation: any;
	idAgence: any;
}

export const emptyCompteDestinataireRequestDto: CompteDestinataireRequestDto = {
	codeBanque: null,
	codeAgence: null,
	numCompte: null,
	cleRib: null,
	caissePop: null,
	numCaissePop: null,
	codeBic: null,
	iban: null,
	idCaissePop: null,
	idDest: null,
	abreviation: null,
	idAgence: null,
}

export interface CompteDestinataireResponseDto {
	id: any;
	codeBanque: any;
	codeAgence: any;
	numCompte: any;
	cleRib: any;
	caissePop: any;
	numCaissePop: any;
	codeBic: any;
	iban: any;
	idCaissePop: any;
	idDest: any;
	abreviation: any;
	idAgence: any;
	codLiqs: any;
	numMands: any;
	isUsed: any;
}

export const emptyCompteDestinataireResponseDto: CompteDestinataireResponseDto = {
	id: null,
	codeBanque: null,
	codeAgence: null,
	numCompte: null,
	cleRib: null,
	caissePop: null,
	numCaissePop: null,
	codeBic: null,
	iban: null,
	idCaissePop: null,
	idDest: null,
	abreviation: null,
	idAgence: null,
	codLiqs: null,
	numMands: null,
	isUsed: null
}