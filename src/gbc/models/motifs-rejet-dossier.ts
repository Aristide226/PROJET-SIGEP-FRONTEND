export interface MotifsRejetDossierRequestDto {
	motifs: any;
	dateSaisie: any;
	numBe: any;
	numMand: any;
	codLiq: any;
	idTitre: any;
	userName: any;
	dateEnreg: any;
	actif: any;
}

export const emptyMotifsRejetDossierRequestDto: MotifsRejetDossierRequestDto = {
	motifs: null,
	dateSaisie: null,
	numBe: null,
	numMand: null,
	codLiq: null,
	idTitre: null,
	userName: null,
	dateEnreg: null,
	actif: null,
}

export interface MotifsRejetDossierResponseDto {
	idMotif: any;
	motifs: any;
	dateSaisie: any;
	numBe: any;
	numMand: any;
	codLiq: any;
	idTitre: any;
	userName: any;
	dateEnreg: any;
	actif: any;
	codBords: any;
}

export const emptyMotifsRejetDossierResponseDto: MotifsRejetDossierResponseDto = {
	idMotif: null,
	motifs: null,
	dateSaisie: null,
	numBe: null,
	numMand: null,
	codLiq: null,
	idTitre: null,
	userName: null,
	dateEnreg: null,
	actif: null,
	codBords: null,
}