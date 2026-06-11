export interface NomenclatureDRequestDto {
	titre: any;
	section: any;
	chap: any;
	art: any;
	parag: any;
	rub: any;
	intitule: any;
	dotEstExec: any;	
}

export const emptyNomenclatureDRequestDto: NomenclatureDRequestDto = {
	titre: null,
	section: null,
	chap: null,
	art: null,
	parag: null,
	rub: null,
	intitule: null,
	dotEstExec: null,
}

export interface NomenclatureDResponseDto {
	numNo: any;
	titre: any;
	section: any;
	chap: any;
	art: any;
	parag: any;
	rub: any;
	intitule: any;
	idPlan: any;
	dotEstExec: any;
	codHierarchiq: any;
}

export const emptyNomenclatureDResponseDto: NomenclatureDResponseDto = {
	numNo: null,
	titre: null,
	section: null,
	chap: null,
	art: null,
	parag: null,
	rub: null,
	intitule: null,
	idPlan: null,
	dotEstExec: null,
	codHierarchiq: null,
}