export interface BudgetModifRequestDto {
	codBma: any;
	codBud: any;
	ajoute: any;
	annule: any;
	nouvelle: any;
}

export const emptyBudgetModifRequestDto: BudgetModifRequestDto = {
	codBma: null,
	codBud: null,
	ajoute: null,
	annule: null,
	nouvelle: null
}

export interface BudgetModifResponseDto {
	codBma: any;
	codBud: any;
	ajoute: any;
	annule: any;
	nouvelle: any;
}

export const emptyBudgetModifResponseDto: BudgetModifResponseDto = {
	codBma: null,
	codBud: null,
	ajoute: null,
	annule: null,
	nouvelle: null
}