export interface BordTransmisRequestDto {
	gestion: any;
	dossier: any;
	expeditaire: any;
	idLogin: any;
	dateReception: any;
	idLoginRecep: any;
	identiteRecept: any;
	idBudget: any;
	numBesBordTransEng: any;
	numMandsBordTransMand: any;
	numMandsBordTransLiq: any;
	idMotifs: any;
}

export const emptyBordTransmisRequestDto: BordTransmisRequestDto = {
	gestion: null,
	dossier: null,
	expeditaire: null,
	idLogin: null,
	dateReception: null,
	idLoginRecep: null,
	identiteRecept: null,
	idBudget: null,
	numBesBordTransEng: null,
	numMandsBordTransMand: null,
	numMandsBordTransLiq: null,
	idMotifs: null,
}

export interface BordTransmisResponseDto {
	codBord: any;
	gestion: any;
	dossier: any;
	dateCreation: any;
	expeditaire: any;
	destinataire: any;
	idLogin: any;
	dateReception: any;
	idLoginRecep: any;
	numero: any;
	bordNumero: any;
	identiteRecept: any;
	idBudget: any;
	numBesBordTransEng: any;
	numMandsBordTransMand: any;
	numMandsBordTransLiq: any;
	idMotifs: any;
	idDetailTitres: any;
	numBes: any;
	numMands: any;
	bordTransRecouvIds: any;
}

export const emptyBordTransmisResponseDto: BordTransmisResponseDto = {
	codBord: null,
	gestion: null,
	dossier: null,
	dateCreation: null,
	expeditaire: null,
	destinataire: null,
	idLogin: null,
	dateReception: null,
	idLoginRecep: null,
	numero: null,
	bordNumero: null,
	identiteRecept: null,
	idBudget: null,
	numBesBordTransEng: null,
	numMandsBordTransMand: null,
	numMandsBordTransLiq: null,
	idMotifs: null,
	idDetailTitres: null,
	numBes: null,
	numMands: null,
	bordTransRecouvIds: null,
}