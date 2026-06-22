//Aristide
export interface FournisseursRequestDto {
    fournisseur : any;
	numIfu : any;
	telFourn : any;
	bpfourn : any;
	typF : any;
}

export const emptyFournisseursRequestDto : FournisseursRequestDto = {
    fournisseur : null,
	numIfu : null,
	telFourn : null,
	bpfourn : null,
	typF : null
}

export interface FournisseursResponseDto {
    idFourn : any;
    fournisseur : any;
	numIfu : any;
	telFourn : any;
	bpfourn : any;
	typF : any;
}

export const emptyFournisseursResponsetDto : FournisseursResponseDto = {
    idFourn : null,
    fournisseur : null,
	numIfu : null,
	telFourn : null,
	bpfourn : null,
	typF : null
}