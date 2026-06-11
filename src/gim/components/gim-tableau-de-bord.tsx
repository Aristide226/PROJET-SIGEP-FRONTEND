import * as React from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { GimGestion } from '../helpers/session-storage';
import { useState,useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { SitesResponseDto } from '../models/sites';
import SitesService from '../services/sites-service';
import { costumeStyles } from '../../helpers/costume-styles';

interface IAppProps {
}

const GimTableauDeBord: React.FunctionComponent<IAppProps> = (props) => {

    //////////TABLEAUX//////////
    const siteColumn = [
        {name : "Sites", selector:(row:any) => row.nomSite},
        {name : "Bâtiments terrains", selector:(row:any) => row.nombreTotalBatiments},
        {name : "Matériels mobiliers", selector:(row:any) => row.nombreTotalMateriels},
        {name : "Total", selector:(row:any) => row.nombreTotalGeneral},
    ]

    //////////ETATS//////////
    const [gestionCourante, setGestionCourante] = useState<string>(GimGestion() ?? '');
    const [allSites,setAllSites] = useState<SitesResponseDto[]>([])

    //////////FONCTIONS///////////

    //////////APPEL DES SERVICES //////////
    const getAllSites =async()=> {
        await SitesService.getStatistiquesPatrimoineParCategorie()
        .then((data) => {
            setAllSites(data)
            console.table(data)
        })
    }

    useEffect(() => {
        getAllSites();
    },[])

    return(
        <div className="w-100">
            <Row className="mt-1 p-1">
                <h6 className='shadow-sm rounded text-center text-primary mb-1 py-1'><b>GESTION CHOISIE : { gestionCourante }</b></h6>
                <h5 style={{color:'blue'}} className="mb-2"><b>Bienvenu dans SIGEP - GIM</b></h5>
            </Row>
            <Row>
                <h6 className="bg-primary text-dark p-2 mb-1">Site</h6>
                <DataTable
                    columns={siteColumn}
                    data={allSites}
                    fixedHeader
                    fixedHeaderScrollHeight="100px" 
                    dense
                />
            </Row>
        </div>
    )
};

export default GimTableauDeBord;
