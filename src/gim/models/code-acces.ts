export default interface CodeAccesDto {
	idUser: any;
	userName: any;
	motDePasse: any;
	etat: any;
	nbreConnect: any;
	nbreCpte: any;
	dateChangement: any;
	mleAgent: any;
	idCodeAccessType: any;
}

export const emptyCodeAccesDto: CodeAccesDto = {
	idUser: null,
	userName:  null,
	motDePasse:  null,
	etat:  null,
	nbreConnect:  null,
	nbreCpte:  null,
	dateChangement:  null,
	mleAgent:  null,
	idCodeAccessType:  null,
}