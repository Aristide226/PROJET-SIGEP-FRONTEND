export interface LiquidationRequestDto {
	gestion: any;
	dateLiq: any;
	objet: any;
	montant: any;
	montEngage: any;
	montDjaLiq: any;
	modifiable: any;
	idUser: any;
	dateModif: any;
	actif: any;
	idBudget: any;
	compteFourn: any;
	idContrat: any;
	numBe: any;
	idFourn: any;
}

export const emptyLiquidationRequestDto: LiquidationRequestDto = {
	gestion: null,
	dateLiq: null,
	objet: null,
	montant: null,
	montEngage: null,
	montDjaLiq: null,
	modifiable: null,
	idUser: null,
	dateModif: null,
	actif: null,
	idBudget: null,
	compteFourn: null,
	idContrat: null,
	numBe: null,
	idFourn: null,
}

export interface LiquidationResponseDto {
	codLiq: any;
	gestion: any;
	numBl: any;
	dateLiq: any;
	objet: any;
	montant: any;
	montEngage: any;
	montDjaLiq: any;
	modifiable: any;
	idUser: any;
	numeroDemande: any;
	dateModif: any;
	actif: any;
	idBudget: any;
	compteFourn: any;
	idContrat: any;
	numBe: any;
	idFourn: any;
}

export const emptyLiquidationResponseDto: LiquidationResponseDto = {
	codLiq: null,
	gestion: null,
	numBl: null,
	dateLiq: null,
	objet: null,
	montant: null,
	montEngage: null,
	montDjaLiq: null,
	modifiable: null,
	idUser: null,
	numeroDemande: null,
	dateModif: null,
	actif: null,
	idBudget: null,
	compteFourn: null,
	idContrat: null,
	numBe: null,
	idFourn: null,
}