import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import { GimGestion } from '../helpers/session-storage';
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { SitesResponseDto } from '../models/sites';
import SitesService from '../services/sites-service';
import SourceFinancementService from '../services/source-financement-service';
import CodeBudgTypeService from '../services/code-Budg-Type-service';
import CodeBudgetaireService from '../services/code-budgetaire-service';

interface IAppProps {}

// ─── Styles des en-têtes de section ────────────────────────────────────────────
const sectionLabelStyle: React.CSSProperties = {
    backgroundColor: '#d6e4f7',
    color: '#333',
    fontSize: '12px',
    fontWeight: 500,
    padding: '2px 6px',
    border: '1px solid #b0c8e8',
    marginBottom: 0,
};

const tableCustomStyles = {
    headRow: {
        style: {
            backgroundColor: '#2c2c2c',
            color: '#fff',
            fontSize: '11px',
            minHeight: '30px',
        },
    },
    headCells: {
        style: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '11px',
            paddingLeft: '8px',
            paddingRight: '8px',
        },
    },
    rows: {
        style: {
            fontSize: '11px',
            minHeight: '24px',
            backgroundColor: '#e8e8e8',
        },
        stripedStyle: {
            backgroundColor: '#f5f5f5',
        },
    },
    cells: {
        style: {
            paddingLeft: '8px',
            paddingRight: '8px',
        },
    },
};

const GimTableauDeBord: React.FunctionComponent<IAppProps> = (props) => {

    // ─── Colonnes ────────────────────────────────────────────────────────────────
    const siteColumn = [
        { name: 'Site',                selector: (row: any) => row.nomSite },
        { name: 'Bâtiments terrain ...', selector: (row: any) => row.nombreTotalBatiments },
        { name: 'Matériels mobiliers',   selector: (row: any) => row.nombreTotalMateriels },
        { name: 'Total',                 selector: (row: any) => row.nombreTotalGeneral },
    ];

    const financementColumn = [
        { name: 'Libellé',               selector: (row: any) => row.codSourceFin },
        { name: 'Bâtiments terrain ...',  selector: (row: any) => row.nombreTotalBatiments },
        { name: 'Matériels mobiliers',    selector: (row: any) => row.nombreTotalMateriels },
        { name: 'Total',                  selector: (row: any) => row.nombreTotalGeneral },
    ];

    const typeBienColumn = [
        { name: 'Libellé',   selector: (row: any) => row.intituleTyp,
            wrap : false,
            cell: (row: any) => (
                <span
                    title={row.intituleTyp}
                    style={{
                        cursor: 'default',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block',
                        width: '100%',
                    }}
                >
                {row.intituleTyp}
                </span>
            ),
        },
        { name: 'Bon',       selector: (row: any) => row.bon },
        { name: 'Passable',  selector: (row: any) => row.passable },
        { name: 'Délabré',   selector: (row: any) => row.delabre },
        { name: 'Mauvais',   selector: (row: any) => row.mauvais },
        { name: 'Total',     selector: (row: any) => row.nombreTotal },
    ];

    const codeBudgetaireColumn = [
        { name: 'Libellé',   selector: (row: any) => row.intituleCodBud,
            wrap : false,
            cell : (row:any) => (
                <span title={row.intituleCodBud} 
                style={{ 
                    cursor: 'default',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                    width: '100%', }}>
                    {row.intituleCodBud}
                </span>
            )
         },
        { name: 'Bon',       selector: (row: any) => row.bon },
        { name: 'Passable',  selector: (row: any) => row.passable },
        { name: 'Délabré',   selector: (row: any) => row.delabre },
        { name: 'Mauvais',   selector: (row: any) => row.mauvais },
        { name: 'Total',     selector: (row: any) => row.nombreTotal },
    ];

    // ─── États ───────────────────────────────────────────────────────────────────
    const [gestionCourante] = useState<string>(GimGestion() ?? '');
    const [allSites,setAllSites] = useState<SitesResponseDto[]>([]);
    const [allSourceFinancement,setAllSourceFinancement] = useState<any[]>([]);
    const [allCodeBudgType,setAllCodeBudgType] = useState<any[]>([]);
    const [allCodeBudgetaire,setAllCodeBudgetaire] = useState<any[]>([]);

    // ─── Appels services ─────────────────────────────────────────────────────────
    const getAllSites = async () => {
        const data = await SitesService.getStatistiquesPatrimoineParCategorie();
        setAllSites(data);
    };
    const getAllSourceFinancement = async () => {
        const data = await SourceFinancementService.getFinancementStatistiqueParCategorie();
        setAllSourceFinancement(data);
    };
    const getAllCodeBudgType = async () => {
        const data = await CodeBudgTypeService.getTypeBienStatistiqueDto();
        setAllCodeBudgType(data);
    };
    const getAllCodeBudgetaire = async () => {
        const data = await CodeBudgetaireService.getCodeBudgetaireStatistiqueDto();
        setAllCodeBudgetaire(data);
    };

    useEffect(() => {
        getAllSites();
        getAllSourceFinancement();
        getAllCodeBudgType();
        getAllCodeBudgetaire();
    }, []);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>

            <h5 className="text-center text-primary fw-bold mb-2">Bienvenue dans SIGEP-GIM</h5>

            <div style={{ width: '100%' }}>
                <p style={sectionLabelStyle}>Site</p>
                <DataTable
                    columns={siteColumn}
                    data={allSites}
                    customStyles={tableCustomStyles}
                    striped
                    dense
                    fixedHeader
                    fixedHeaderScrollHeight="100px"
                    noDataComponent="Aucune donnée"
                />
            </div>

            <div style={{ height: '8px' }} />

            {/* ── Financement ── */}
            <div style={{ width: '100%' }}>
                <p style={sectionLabelStyle}>Financement</p>
                <DataTable
                    columns={financementColumn}
                    data={allSourceFinancement}
                    customStyles={tableCustomStyles}
                    striped
                    dense
                    fixedHeader
                    fixedHeaderScrollHeight="100px"
                    noDataComponent="Aucune donnée"
                />
            </div>

            <div style={{ height: '8px' }} />

            {/* ── Type de bien ── */}
            <div style={{ width: '100%' }}>
                <p style={sectionLabelStyle}>Type de bien</p>
                <DataTable
                    columns={typeBienColumn}
                    data={allCodeBudgType}
                    customStyles={tableCustomStyles}
                    striped
                    dense
                    fixedHeader
                    fixedHeaderScrollHeight="100px"
                    noDataComponent="Aucune donnée"
                />
            </div>

            <div style={{ height: '8px' }} />

            {/* ── Codes budgétaires ── */}
            <div style={{ width: '100%' }}>
                <p style={sectionLabelStyle}>Codes budgétaires</p>
                <DataTable
                    columns={codeBudgetaireColumn}
                    data={allCodeBudgetaire}
                    customStyles={tableCustomStyles}
                    striped
                    dense
                    fixedHeader
                    fixedHeaderScrollHeight="200px"
                    noDataComponent="Aucune donnée"
                />
            </div>

        </div>
    );
};

export default GimTableauDeBord;