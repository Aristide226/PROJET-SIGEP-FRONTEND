//Aristide
export interface DepartementRequestDto {
    codDepart : any;
	departema : any;
	chefLieuDepart : any;
	codProv : any;
}

export const emptyDepartementRequestDto : DepartementRequestDto = {
    codDepart : null,
	departema : null,
	chefLieuDepart : null,
	codProv : null,
}

export interface DepartementResponseDto {
    idDepart : any;
	codDepart : any;
	departema : any;
	chefLieuDepart : any;
	codProv : any;
}

export const emptyDepartementResponseDto : DepartementResponseDto = {
    idDepart : null,
	codDepart : null,
	departema : null,
	chefLieuDepart : null,
	codProv : null,
}