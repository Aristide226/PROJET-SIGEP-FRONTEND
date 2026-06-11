//Aristide
export interface SitesRequestDto {
    nomSite : any;
	secteurCadastre : any;
	sectionCadastre : any;
	lotCadastre : any;
	parcelleCadastre : any;
	autresPrecision : any;
	dateCreation : any;
	superficie : any;
	coutTerrain : any;
	idTypeAcq : any;
	nombreMaterielH : any;
	nbreBatimentH : any;
	nbreUe : any;
	nbreAutreInfras : any;
	articleSite : any;
	idDepart : any;
}

export const emptySitesRequestDto : SitesRequestDto = {
    nomSite : null,
	secteurCadastre : null,
	sectionCadastre : null,
	lotCadastre : null,
	parcelleCadastre : null,
	autresPrecision : null,
	dateCreation : null,
	superficie : null,
	coutTerrain : null,
	idTypeAcq : null,
	nombreMaterielH : null,
	nbreBatimentH : null,
	nbreUe : null,
	nbreAutreInfras : null,
	articleSite : null,
	idDepart : null
}

export interface SitesResponseDto {
    codeSite : any;
	nomSite : any;
	secteurCadastre : any;
	sectionCadastre : any;
	lotCadastre : any;
	parcelleCadastre : any;
	autresPrecision : any;
	dateCreation : any;
	superficie : any;
	coutTerrain : any;
	idTypeAcq : any;
	nombreMaterielH : any;
	nbreBatimentH : any;
	nbreUe : any;
	nbreAutreInfras : any;
	articleSite : any;
	idDepart : any;
}

export const emptySitesResponseDto : SitesResponseDto = {
    codeSite : null,
	nomSite : null,
	secteurCadastre : null,
	sectionCadastre : null,
	lotCadastre : null,
	parcelleCadastre : null,
	autresPrecision : null,
	dateCreation : null,
	superficie : null,
	coutTerrain : null,
	idTypeAcq : null,
	nombreMaterielH : null,
	nbreBatimentH : null,
	nbreUe : null,
	nbreAutreInfras : null,
	articleSite : null,
	idDepart : null,
}