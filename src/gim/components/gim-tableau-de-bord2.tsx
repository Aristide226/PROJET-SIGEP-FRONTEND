import * as React from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { GimGestion } from '../helpers/session-storage';
import { useState,useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { SitesResponseDto } from '../models/sites';
import SitesService from '../services/sites-service';
import SourceFinancementService from '../services/source-financement-service';
import CodeBudgTypeService from '../services/code-Budg-Type-service';
import CodeBudgetaireService from '../services/code-budgetaire-service';
import { costumeStyles } from '../../helpers/costume-styles';

interface IAppProps {
}

const GimTableauDeBord2: React.FunctionComponent<IAppProps> = (props) => {

    //////////TABLEAUX//////////
    const financementColumn = [
        {name : "Libellé", selector:(row:any) => row.codSourceFin},
        {name : "Bâtiments terrains", selector:(row:any) => row.nombreTotalBatiments},
        {name : "Matériels mobiliers", selector:(row:any) => row.nombreTotalMateriels},
        {name : "Total", selector:(row:any) => row.nombreTotalGeneral},
    ]

    const typeBienColumn = [
        {name : "Libellé", selector:(row:any) => row.intituleTyp},
        {name : "Bon", selector:(row:any) => row.bon},
        {name : "Passable", selector:(row:any) => row.passable},
        {name : "Délabré", selector:(row:any) => row.delabre},
        {name : "Mauvais", selector:(row:any) => row.mauvais},
        {name : "Total", selector:(row:any) => row.nombreTotal},
    ]

    const codeBudgetaireColumn = [
        {name : "Libellé", selector:(row:any) => row.intituleCodBud},
        {name : "Bon", selector:(row:any) => row.bon},
        {name : "Passable", selector:(row:any) => row.passable},
        {name : "Délabré", selector:(row:any) => row.delabre},
        {name : "Mauvais", selector:(row:any) => row.mauvais},
        {name : "Total", selector:(row:any) => row.nombreTotal},
    ]

    //////////ETATS//////////
    const [gestionCourante, setGestionCourante] = useState<string>(GimGestion() ?? '');
    const [allSourceFinancement,setAllSourceFinancement] = useState<SitesResponseDto[]>([])
    const [allCodeBudgType,setAllCodeBudgType] = useState<[]>([]);
    const [allCodeBudgetaire,setAllCodeBudgetaire] = useState<[]>([]);

    //////////FONCTIONS///////////

    //////////APPEL DES SERVICES //////////
    const getAllSites =async()=> {
        await SourceFinancementService.getFinancementStatistiqueParCategorie()
        .then((data) => {
            setAllSourceFinancement(data)
        })
    }
    const getAllCodeBudg =async()=> {
        await CodeBudgTypeService.getTypeBienStatistiqueDto()
        .then((data) => {
            setAllCodeBudgType(data)
        })
    }
    const getAllCodeBudgetaire =async()=> {
        await CodeBudgetaireService.getCodeBudgetaireStatistiqueDto()
        .then((data) => {
            setAllCodeBudgetaire(data)
        })
    }

    useEffect(() => {
        getAllSites();
        getAllCodeBudg();
        getAllCodeBudgetaire();
    },[])

    return(
        <div className="w-100">
            <Row className="mt-1 p-1">
                
            </Row>
            <Row>
                <h6 className="bg-primary text-dark p-2 mb-1">Financement</h6>
                <DataTable
                    columns={financementColumn}
                    data={allSourceFinancement}
                    fixedHeader
                    fixedHeaderScrollHeight="100px" 
                    dense
                />
            </Row><p/>
            <Row>
                <h6 className="bg-primary text-dark p-2 mb-1">Type de bien</h6>
                <DataTable
                    columns={typeBienColumn}
                    data={allCodeBudgType}
                    fixedHeader
                    fixedHeaderScrollHeight="100px" 
                    dense
                />
            </Row>
            <Row>
                <h6 className="bg-primary text-dark p-2 mb-1">Codes budgétaires </h6>
                <DataTable
                    columns={codeBudgetaireColumn}
                    data={allCodeBudgetaire}
                    fixedHeader
                    fixedHeaderScrollHeight="200px" 
                    dense
                />
            </Row>
        </div>
    )
};

export default GimTableauDeBord2;
