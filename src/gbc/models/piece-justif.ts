export interface PieceJustifRequestDto {
	numBe: any;
	codLiq: any;
	numMand: any;
	pieceJustificative: any;
	numero: any;
	datePj: any;
	montant: any;
	idRetenu: any;
	idBord: any;
}

export const emptyPieceJustifRequestDto: PieceJustifRequestDto = {
	numBe: null,
	codLiq: null,
	numMand: null,
	pieceJustificative: null,
	numero: null,
	datePj: null,
	montant: null,
	idRetenu: null,
	idBord: null,
}

export interface PieceJustifResponseDto {
	codPj: any;
	numBe: any;
	codLiq: any;
	numMand: any;
	pieceJustificative: any;
	numero: any;
	datePj: any;
	montant: any;
	idRetenu: any;
	idBord: any;
}

export const emptyPieceJustifResponseDto: PieceJustifResponseDto = {
	codPj: null,
	numBe: null,
	codLiq: null,
	numMand: null,
	pieceJustificative: null,
	numero: null,
	datePj: null,
	montant: null,
	idRetenu: null,
	idBord: null,
}