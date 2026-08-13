//Aristide
import { useEffect, useMemo, useState } from "react";
import { Card } from "react-bootstrap";
import { emptyRegionResponseDto, RegionResponseDto } from "../models/region";
import { emptyProvinceResponseDto, ProvinceResponseDto } from "../models/province";
import { DepartementResponseDto, emptyDepartementResponseDto } from "../models/departement";
import RegionService from "../services/region-service";
import ProvinceService from "../services/province-service";
import DepartementService from "../services/departement-service";
import DataTable from "react-data-table-component";

const ParametresSaisieMiseAjourStructuresTerritorialesForm =()=> {


    //////////GESTION REGIONS//////////
    ////ETATS
    const[allRegions,setAllRegions] = useState<RegionResponseDto[]>([]);
    const[ligneRegionSelectionnee,setLigneRegionSelectionnee] = useState<RegionResponseDto>(emptyRegionResponseDto)
    
    
    ////APPELS SERVICES
    const getALLRegions =async()=> {
        await RegionService.getAll()
        .then((data) => {
            setAllRegions(data)
            console.log("données regions")
            console.table(data)
        })
        
    }

    const regionsColumn = [
        {
            name: 'Code',
            selector:(row:any) => row.codReg,
        },
        {
            name: 'Nom région',
            selector:(row:any) => row.rgion,
        },
        {
            name: 'Chef lieu',
            selector:(row:any) => row.chefLieu,
        },
    ]

    //////////GESTION PROVINCES//////////
    ////ETATS
    const[allProvinces,setAllProvinces] = useState<ProvinceResponseDto[]>([]);
    const[ligneProvinceSelectionnee,setLigneProvinceSelectionnee] = useState<ProvinceResponseDto>(emptyProvinceResponseDto);

    ////APPELS SERVICES
    const getAllProvinces =async()=> {
        await ProvinceService.getAll()
        .then((data) => {
            setAllProvinces(data)
            console.log("données provinces")
            console.table(data)
        })
    }

    const provincesColumn = [
        {
            name: 'Code',
            selector:(row:any) => row.codProv,
        },
        {
            name: 'Nom province',
            selector:(row:any) => row.provinc,
        },
        {
            name: 'Chef lieu',
            selector:(row:any) => row.chefLieu,
        },
    ]

    //////////GESTION DEPARTEMENTS//////////
    ////ETATS
    const[allDepartements,setAllDepartements] = useState<DepartementResponseDto[]>([]);
    const[ligneDepartementSelectionnee,setLigneDepartementSelectionnee] = useState<DepartementResponseDto>(emptyDepartementResponseDto);


    ////APPELS SERVICES
    const getAllDepartements =async()=> {
        await DepartementService.getAll()
        .then((data) => {
            setAllDepartements(data)
            console.log("données departements")
            console.table(data)
        })
    }

    const departementsColumn = [
        {
            name: 'Code',
            selector:(row:any) => row.codDepart,
        },
        {
            name: 'Nom département',
            selector:(row:any) => row.departema,
        },
        {
            name: 'Chef lieu',
            selector:(row:any) => row.chefLieuDepart,
        },
    ]


    const filtrerProvinceEnFonctionDeRegion = useMemo(() => {
        let resultat = allProvinces;
        if(!ligneRegionSelectionnee) {
            resultat = resultat
        }
        if(ligneRegionSelectionnee) {
            resultat = resultat.filter((item:any) => item.codReg === ligneRegionSelectionnee.codReg)
        } 
        return resultat
    },[allProvinces,ligneRegionSelectionnee])
    const filtrerDepartementEnFonctionDeProvince = useMemo(() => {
        let resultat = allDepartements;
        if(ligneProvinceSelectionnee || ligneProvinceSelectionnee&&ligneRegionSelectionnee) {
            resultat = resultat.filter((item:any) => item.codProv === ligneProvinceSelectionnee.codProv)
        }
        return resultat;
    },[allDepartements,ligneProvinceSelectionnee,ligneRegionSelectionnee])


    const customStyles = {
        headRow: {
            style : {
                backgroundColor: '#dce6f1',
                minHeight: '30px',
                fontSize: '14px'
            },
        },
        headCells: {
            style: {
                color: '#1f3864',
                fontWeigh: 'bold',
                fontSize: '14px',
            },
        },
        rows: {
            style: {
                minHeight: '30px',
                fontSize: '14px',
            },
        },
        cells: {
            style: {
                paddingLeft: '12px',
                paddingRight: '12px'
            }
        }
    }
    useEffect(() => {
        getALLRegions();
        getAllProvinces();
        getAllDepartements();
    },[])
    
    return (
        <div style={{width:'60%' , margin:'0 auto'}}>
            <h5>Structure territoriale</h5>
            <Card>
                <Card.Header>

                </Card.Header>
                <Card.Body>
                    <div>
                        <span><b>Régions</b></span>
                        <DataTable
                            columns={regionsColumn}
                            data={allRegions}
                            customStyles={customStyles}
                            fixedHeader
                            fixedHeaderScrollHeight="130px"
                            noDataComponent="Aucune donnée"
                            highlightOnHover
                            pointerOnHover
                            onRowClicked={(data) => {
                                setLigneRegionSelectionnee(data)
                            }}
                            onRowDoubleClicked={() => {
                                setLigneRegionSelectionnee(emptyRegionResponseDto)
                            }}
                        />
                    </div>
                    <div>
                        <span><b>Provinces</b></span>
                        <DataTable
                            columns={provincesColumn}
                            data={filtrerProvinceEnFonctionDeRegion}
                            customStyles={customStyles}
                            fixedHeader
                            fixedHeaderScrollHeight="150px"
                            noDataComponent="Aucune donnée"
                            highlightOnHover
                            pointerOnHover
                            onRowClicked={(data) => {
                                setLigneProvinceSelectionnee(data)
                            }}
                            onRowDoubleClicked={() => {
                                setLigneProvinceSelectionnee(emptyProvinceResponseDto)
                            }}
                        />
                    </div>
                    <div>
                        <span><b>Départements</b></span>
                        <DataTable
                            columns={departementsColumn}
                            data={filtrerDepartementEnFonctionDeProvince}
                            customStyles={customStyles}
                            fixedHeader
                            fixedHeaderScrollHeight="150px"
                            noDataComponent="Aucune donnée"
                            highlightOnHover
                            pointerOnHover
                            onRowClicked={(data) => {
                                setLigneDepartementSelectionnee(data)
                            }}
                            onRowDoubleClicked={() => {
                                setLigneDepartementSelectionnee(emptyDepartementResponseDto)
                            }}
                        />
                    </div>
                </Card.Body>
                <Card.Footer>

                </Card.Footer>
            </Card>
        </div>
    )
}

export default ParametresSaisieMiseAjourStructuresTerritorialesForm;