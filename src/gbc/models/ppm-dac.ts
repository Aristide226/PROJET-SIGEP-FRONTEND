//Aristide
export interface PpmDacRequestDto{
	refPassation : any
	dateCreation? : any
	dateDac : any
	dateLancement : any
	idPpm : any
}

export const emptyPpmDacRequestDto : PpmDacRequestDto = {
	refPassation : null,
	dateCreation : null,
	dateDac : null,
	dateLancement : null,
	idPpm : null,
}

export interface PpmDacResponseDto {
    idDac : any,
	refPassation : any,
	dateCreation : any,
	dateDac : any,
	dateLancement : any,
	idPpm : any,
    idContrats : any
}

export const emptyPpmDacResponseDto : PpmDacResponseDto = {
    idDac : null,
	refPassation : null,
	dateCreation : null,
	dateDac : null,
	dateLancement : null,
	idPpm : null,
    idContrats : null,
}