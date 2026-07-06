//Aristide
export interface CodeMaterielRequestDto {
    codMat : any;
    num : any;
    intituleMateriel : any;
    dureeVieAn : any;
    art : any;
    codBud : any;
}

export const emptyCodeMaterielRequestDto : CodeMaterielRequestDto = {
    codMat : null,
    num : null,
    intituleMateriel : null,
    dureeVieAn : null,
    art : null,
    codBud : null,
} 

export interface CodeMaterielResponseDto {
    codMat : any;
	num : any;
	intituleMateriel : any;
	dureeVieAn : any;
	tauxAmortAn : any;
	art : any;
	codBud : any;
}

export const emptyCodeMaterielResponseDto : CodeMaterielResponseDto = {
    codMat : null,
	num : null,
	intituleMateriel : null,
	dureeVieAn : null,
	tauxAmortAn : null,
	art : null,
	codBud : null,
} 
