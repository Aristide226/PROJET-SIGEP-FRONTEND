//Aristide
export interface ProvinceRequestDto {
    provinc : any;
	chefLieu : any;
	articleProv : any;
	codReg : any;
}

export const emptyProvinceRequestDto : ProvinceRequestDto = {
    provinc : null,
	chefLieu : null,
	articleProv : null,
	codReg : null,
}

export interface ProvinceResponseDto {
    codProv : any;
	provinc : any;
	chefLieu : any;
	articleProv : any;
	codReg : any;
}

export const emptyProvinceResponseDto : ProvinceResponseDto = {
    codProv : null,
	provinc : null,
	chefLieu : null,
	articleProv : null,
	codReg : null,
}