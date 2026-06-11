export interface BudgetModifActeRequestDto {
	valide: any;
	acteBma: any;
	numActeBma: any;
	dateActeBma: any;
	idLogin: any;
	gestion: any;
	dateValid: any;
	idValid: any;
	idBudget: any;
}

export const emptyBudgetModifActeRequestDto: BudgetModifActeRequestDto = {
	valide: null,
	acteBma: null,
	numActeBma: null,
	dateActeBma: null,
	idLogin: null,
	gestion: null,
	dateValid: null,
	idValid: null,
	idBudget: null,
}

export interface BudgetModifActeResponseDto {
	codBma: any;
	dateSaisie: any;
	valide: any;
	acteBma: any;
	numActeBma: any;
	dateActeBma: any;
	idLogin: any;
	gestion: any;
	dateValid: any;
	idValid: any;
	idBudget: any;
	budgetModifIds: any;
}

export const emptyBudgetModifActeResponseDto: BudgetModifActeResponseDto = {
	codBma: null,
	dateSaisie: null,
	valide: null,
	acteBma: null,
	numActeBma: null,
	dateActeBma: null,
	idLogin: null,
	gestion: null,
	dateValid: null,
	idValid: null,
	idBudget: null,
	budgetModifIds: null,
}