export interface PjRequestDto {
	pj: any,
	avecMontant: any
}

export const emptyPjRequestDto: PjRequestDto = {
	pj: null,
	avecMontant: null
}

export interface PjResponseDto {
	codPj: any,
	pj: any,
	avecMontant: any
}

export const emptyPjResponseDto: PjResponseDto = {
	codPj: null,
	pj: null,
	avecMontant: null
}