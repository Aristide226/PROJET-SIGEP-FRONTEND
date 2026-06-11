//Aristide
export interface PpmRequestDto{
    idPpm :any;
    exercice:any;
    num: any;
    montantEstime:any;
    montDepEngNonLiq:any;
    creditDispo:any;
    natPrestation:any;
    nbLot: any;
    dateLancement:any;
    dateRemiseOffre:any;
    nbJrsEvaluation:any;
    dateProbDemar:any;
    delaiExecJrs:any;
    dateButoire:any;
    dateEffectLance:any;
    dateAttribution:any;
    montantPasse:any;
    idPpmM:any;
    abrevMp:any;
    idBudget:any;
    ream:any;
}

export const emptyPpmRequestDto: PpmRequestDto={
    idPpm :null,
    exercice:null,
    num: null,
    montantEstime:null,
    montDepEngNonLiq:null,
    creditDispo:null,
    natPrestation:null,
    nbLot: null,
    dateLancement:null,
    dateRemiseOffre:null,
    nbJrsEvaluation:null,
    dateProbDemar:null,
    delaiExecJrs:null,
    dateButoire:null,
    dateEffectLance:null,
    dateAttribution:null,
    montantPasse:null,
    idPpmM:null,
    abrevMp:null,
    idBudget:null, 
    ream:null  
}

export interface PpmResponseDto{
    idPpm:any;
    exercice:any;
    num:any;
    montantEstime:any;
    montDepEngNonLiq:any;
    creditDispo:any;
    natPrestation:any;
    nbLot:any;
    dateLancement:any;
    dateRemiseOffre:any;
    nbJrsEvaluation:any;
    dateProbDemar:any;
    delaiExecJrs:any;
    dateButoire:any;
    dateEffectLance:any;
    dateAttribution:any;
    montantPasse:any;
    idPpmM:any;
    abrevMp:any;
    idBudget:any;
    ppmOldIds:any;
    idDacs:any;
    ppmBudgIds:any;
    ream:any
}

export const emptyPpmResponseDto: PpmResponseDto ={
    idPpm:null,
    exercice:null,
    num:null,
    montantEstime:null,
    montDepEngNonLiq:null,
    creditDispo:null,
    natPrestation:null,
    nbLot:null,
    dateLancement:null,
    dateRemiseOffre:null,
    nbJrsEvaluation:null,
    dateProbDemar:null,
    delaiExecJrs:null,
    dateButoire:null,
    dateEffectLance:null,
    dateAttribution:null,
    montantPasse:null,
    idPpmM:null,
    abrevMp:null,
    idBudget:null,
    ppmOldIds:null,
    idDacs:null,
    ppmBudgIds:null,
    ream:null
}