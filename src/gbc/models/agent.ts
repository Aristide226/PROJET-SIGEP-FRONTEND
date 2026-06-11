export interface AgentRequestDto {
	nom: any;
	prenom: any;
	sexe: any;
	signataire: any;
	titreHonoSign: any;
	actif: any;
	idService: any;
}

export const emptyAgentRequestDto: AgentRequestDto = {
	nom: null,
	prenom: null,
	sexe: null,
	signataire: null,
	titreHonoSign: null,
	actif: null,
	idService: null
}

export interface AgentResponseDto {
	mle: any;
	nom: any;
	prenom: any;
	sexe: any;
	signataire: any;
	titreHonoSign: any;
	actif: any;
	idService: any;
	userNames: any
}

export const emptyAgentResponseDto: AgentResponseDto = {
	mle: null,
	nom: null,
	prenom: null,
	sexe: null,
	signataire: null,
	titreHonoSign: null,
	actif: null,
	idService: null,
	userNames: null
}