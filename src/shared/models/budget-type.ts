export interface BudgetTypeRequestDto {
	libelleBudget: any;
	libelleDecision: any;
}

export const emptyBudgetTypeRequestDto: BudgetTypeRequestDto = {
	libelleBudget: null,
	libelleDecision: null,
}

export interface BudgetTypeResponseDto {
	idBudget: any;
	libelleBudget: any;
	libelleDecision: any;
}

export const emptyBudgetTypeResponseDto: BudgetTypeResponseDto = {
	idBudget: null,
	libelleBudget: null,
	libelleDecision: null
}