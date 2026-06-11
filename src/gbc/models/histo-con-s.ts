export interface HistoConSRequestDto {
	idl: any;
	pc: any;
	adressMac: any;
}

export const emptyHistoConSRequestDto: HistoConSRequestDto = {
	idl: null,
	pc: null,
	adressMac: null,

}

export interface HistoConSResponseDto {
	codH: any;
	idl: any;
	dateConnexion: any;
	pc: any;
	adressMac: any;
	histoActionSIds: any;
}

export const emptyHistoConSResponseDto: HistoConSResponseDto = {
	codH: null,
	idl: null,
	dateConnexion: null,
	pc: null,
	adressMac: null,
	histoActionSIds: null
}