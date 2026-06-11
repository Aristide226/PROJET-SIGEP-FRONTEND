import { PpmExecBudgRequestDto } from "./ppm-exec-budg";

//Aristide
export interface PpmExecRequestDto {
	idPpm : any;
    idPpmExec : any;
	idBudget : any;
	exercice : any;
	nbLot : any;
	num : any;
    montantEstime : any;
	montDepEngNonLiq : any;
	creditDispo : any;
	natPrestation : any;
	dateCreation : any;
	dateButoire : any;
	execution : any;
	montantTtc : any;
	montantHtva : any;
	montantMaxTtc : any;
	montantMaxHtva : any;
	montantMinTtc : any;
	montantMinHtva : any;
	abrevMp : any;

	idLot: any;
	objetLot : any;
	idFourn : any;
	montantAttrib : any;
	dateNotificationProvisoire : any;
	dateApprobContrat : any;
	niveauMiseEnOeuvreEtObservation : any;
	dateReception : any;
	dateLancementMarchePrevisionnel : any;
	dateLanceEffect : any;	
	nbJoursRetardLancement : any;
	dateLancement ?: any;
	lignesBudgetaires?: PpmExecBudgRequestDto[] | null;
	dateRemiseEtOuvertureDesPlis: any;
}

export const emptyPpmExecRequestDto : PpmExecRequestDto = {
	idPpm : null,
    idPpmExec : null,
	idBudget : null,
	exercice : null,
	nbLot : null,
	num : null,
    montantEstime : null,
	montDepEngNonLiq : null,
	creditDispo : null,
	natPrestation : null,
	dateCreation : null,
	dateButoire : null,
	execution : null,
	montantTtc : null,
	montantHtva : null,
	montantMaxTtc : null,
	montantMaxHtva : null,
	montantMinTtc : null,
	montantMinHtva : null,
	abrevMp : null,
	
	idLot: null,
	objetLot : null,
	idFourn : null,
	montantAttrib : null,
	dateNotificationProvisoire : null,
	dateApprobContrat : null,
	niveauMiseEnOeuvreEtObservation :null,
	dateReception : null,
	dateLancementMarchePrevisionnel : null,
	dateLanceEffect : null,
	nbJoursRetardLancement : null,
	lignesBudgetaires : null,
	dateRemiseEtOuvertureDesPlis : null
}

export interface PpmExecResponseDto {
	idPpm : any;
    idPpmExec : any;
	idBudget : any;
	exercice : any;
	nbLot : any;
	num : any;
    montantEstime : any;
	montDepEngNonLiq : any;
	creditDispo : any;
	natPrestation : any;
	dateCreation : any;
	dateButoire : any;
	execution : any;
	montantTtc : any;
	montantHtva : any;
	montantMaxTtc : any;
	montantMaxHtva : any;
	montantMinTtc : any;
	montantMinHtva : any;
	abrevMp : any;

	idLot: number | null;
	objetLot : any;
	idFourn : any;
	montantAttrib : any;
	dateNotificationProvisoire : any;
	dateApprobContrat : any;
	niveauMiseEnOeuvreEtObservation : any;
	dateReception : any;
	dateLancementMarchePrevisionnel : any;
	dateLanceEffect : any;	
	nbJoursRetardLancement : any;
	dateRemiseEtOuvertureDesPlis : any;
}

export const emptyPpmExecResponseDto : PpmExecResponseDto = {
	idPpm : null,
    idPpmExec : null,
	idLot : null,
	idBudget : null,
	exercice : null,
	nbLot :null,
	num : null,
    montantEstime : null,
	montDepEngNonLiq : null,
	creditDispo : null,
	natPrestation : null,
	dateCreation : null,
	dateButoire : null,
	execution : null,
	montantTtc : null,
	montantHtva : null,
	montantMaxTtc : null,
	montantMaxHtva : null,
	montantMinTtc : null,
	montantMinHtva : null,
	abrevMp : null,

	objetLot : null,
	dateLanceEffect : null,
	idFourn : null,
	montantAttrib : null,
	dateNotificationProvisoire : null,
	dateApprobContrat : null,
	niveauMiseEnOeuvreEtObservation : null,
	dateReception : null,
	dateLancementMarchePrevisionnel : null,
	nbJoursRetardLancement : null,
	dateRemiseEtOuvertureDesPlis : null
}