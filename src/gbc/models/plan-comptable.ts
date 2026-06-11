export interface PlanComptableRequestDto {
	idPlan: any;
	intitulePlan: any;
	niveau: any;
}

export const emptyPlanComptableRequestDto: PlanComptableRequestDto = {
	idPlan: null,
	intitulePlan: null,
	niveau: null,
}

export interface PlanComptableResponseDto {
	idPlan: any;
	intitulePlan: any;
	niveau: any;
	codBuds: any;
}

export const emptyPlanComptableResponseDto: PlanComptableResponseDto = {
	idPlan: null,
	intitulePlan: null,
	niveau: null,
	codBuds: null
}