import { Param } from "./param";

export interface Report {
	name: any;
	params: Param[];
}

export const emptyReport: Report = {
	name: null,
	params: [],
}