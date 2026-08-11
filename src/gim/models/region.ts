//Aristide
export interface RegionRequestDto {
    rgion : any;
	chefLieu : any;
	articleRegion : any;
}

export const emptyRegionRequestDto : RegionRequestDto = {
    rgion : null,
	chefLieu : null,
	articleRegion : null,
}

export interface RegionResponseDto {
    codReg : any;
	rgion : any;
	chefLieu : any;
	articleRegion : any;
}

export const emptyRegionResponseDto : RegionResponseDto = {
    codReg : null,
	rgion : null,
	chefLieu : null,
	articleRegion : null,
}