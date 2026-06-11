import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef, GridRowSelectionModel, GridValueFormatterParams } from '@mui/x-data-grid';
import { ConnectedUser, Gestion, IdBudget } from '../helpers/session-storage';
import Stack from '@mui/material/Stack';
import EngagementService from '../services/engagement-service';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { formatDateWithHoursAndMinutes } from '../../helpers/format-date';
import BordTransmisService from '../services/bord-transmis-service';
import { okSuccessDialog } from '../../helpers/dialogs';
import BordTransmisViewService from '../services/bord-transmis-view-service';
import { emptyInfosPourReceptionnerBordTransmis, InfosPourReceptionnerBordTransmis } from '../models/infos-pour-receptionner-bord-transmis';
import ServerDateService from '../../shared/system/services/server-date-service';

// CRITERES DE RECHERCHE BORD TRANSMIS
type FormRBordTransmis = {
  numero: Field,
}

const EngagementsReceptionDEngagementForm: FunctionComponent = () => {

  const [gestionCourante] = useState<string>(Gestion() ?? '');;
  const [idBudget] = useState<string>(IdBudget() ?? '');
  const [utilisateurCourante] = useState<string>(ConnectedUser() ?? '');
  const [isGestionClose, setIsGestionClose] = useState<boolean>(false);
  const dateEnregistrementPourGestionClose: Date = new Date(gestionCourante + '-12-31');   
  const [disableReceptionnerEngagment, setDisableReceptionnerEngagment] = useState<boolean>(true);

  useEffect(() => {
    // On recupere la date du server : si la gestion en cours est strictement inférieur à l'année de la date du serveur alors elle est close :
    ServerDateService.getServerDate().then(data => {
      if (Number(gestionCourante) < new Date(data).getFullYear()) setIsGestionClose(true); else setIsGestionClose(false)   
    }) 
  }, [])   

  ///////////////// GESTION BORD TRANSMIS A RECEPTIONNER
  const [bordTransmis, setBordTransmis] = useState<any[]>([]);
  const [filteredBordTransmis, setFilteredFilteredBordTransmis] = useState<any[]>([]);
  const [loaderBordTransmis, setLoaderLoaderBordTransmis] = useState<boolean>(true);
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const tableBordTransmisColumns: GridColDef[] = [
    {
      field: 'dateCreation',
      headerName: 'Date de creation',
      type: 'Date',
      width: 150,
      align: "center",
      valueFormatter: (params : GridValueFormatterParams<any>) => {
        return formatDateWithHoursAndMinutes(new Date(params.value));
      },
      headerClassName: 'header',
    },    
    {
      field: 'gestion',
      headerName: 'Gestion',
      type: 'string',
      width: 100,
      align: "center",
      headerClassName: 'header',
      headerAlign: 'center'
    }, 
    {
      field: 'numero',
      headerName: 'Numéro',
      type: 'number',
      width: 100,
      align: "center",
      valueFormatter: (params : GridValueFormatterParams<any>) => {
        return String(params.value).padStart(3, '0');
      },
      headerClassName: 'header',
      headerAlign: 'center'
    },
    {
      field: 'nombreEng',
      headerName: 'Nbre Dossier',
      type: 'number',
      width: 100,
      align: "center",
      headerClassName: 'header',
      headerAlign: 'center'
    },
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      width: 100,
      headerClassName: 'header',
    },
    {
      field: '',
      headerName: '',
      type: 'string',
      width: 380,
      headerClassName: 'header',
      headerAlign: 'center'
    },
  ];

  useEffect(() => {
    getBordTransmis()
  }, [])
  
  const getBordTransmis = () => {
    BordTransmisViewService.getBordTransmisEtNonReceptionne(Number(gestionCourante), Number(idBudget)).then(data => {
      setBordTransmis(data) 
      setFilteredFilteredBordTransmis(data)
      setLoaderLoaderBordTransmis(false)
    })
  }
  ///////////////// GESTION BORD TRANSMIS A RECEPTIONNER

  ///////////////// GESTION RECHERCHE BORD TRANSMIS
  const [formRBordTransmis, setFormRBordTransmis] = useState<FormRBordTransmis>({
    numero: { value: ''},
  })

  const handleInputChangeFormRBordTransmis = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormRBordTransmis({ ...formRBordTransmis, ...newField})

    if (fieldName === 'numero') {
      const results = bordTransmis.filter(item => {
        return ((item.numero || '').toString().startsWith(fieldValue))
      })
      setFilteredFilteredBordTransmis(results);
    }
  }
  ///////////////// GESTION RECHERCHE BORD TRANSMIS

  ///////////////// GESTION RECEPTIONNER BORD TRANSMIS
  const handleReceptionnerEngagementButtonClick = () => {
    let codBords : number[] = [];
    selectedRowIds.forEach(id => {
      codBords.push(Number(id.valueOf()));
    });

    let infosPourReceptionnerBordTransmis: InfosPourReceptionnerBordTransmis = emptyInfosPourReceptionnerBordTransmis;
    infosPourReceptionnerBordTransmis.ids = codBords;
    infosPourReceptionnerBordTransmis.date = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
    infosPourReceptionnerBordTransmis.idUser = utilisateurCourante;      

    BordTransmisService.receptionner(infosPourReceptionnerBordTransmis).then(res => {
      if (res) {
        EngagementService.receptionner(codBords).then(res => {
        if (res) {
          setSelectedRowIds([])
          getBordTransmis();
          okSuccessDialog("Bordereau(x) receptionné(s) avec succès !");
        }
      })
      }
    });
  }

  useEffect(() => {
    if (selectedRowIds.length !== 0) setDisableReceptionnerEngagment(false); else setDisableReceptionnerEngagment(true);
  }, [selectedRowIds])
  ///////////////// GESTION RECEPTIONNER BORD TRANSMIS

  //////////////// MESSAGE AFFICHER QUAND IL NY A PAS DE DONNEES
  const NoRowsOverlay = () => {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        Aucun enregistrement à afficher !
      </Stack>
    );
  }
  //////////////// MESSAGE AFFICHER QUAND IL NY A PAS DE DONNEES

  return (
    <Container>
          <div className="mt-1 p-1">
            <h6 className="shadow-sm text-primary text-center rounded">ENGAGEMENTS &gt; RECEPTION DE PROJET D'ENGAGEMENT</h6>
            <Form>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <Form.Group as={Row}>
                    <InputGroup as={Col}>
                      <Form.Control name='' size='sm' value={"Bordereau No :"} type="text" className='me-1' disabled />
                      <Form.Control name='' size='sm' value={gestionCourante} type="text" className='me-1' style={{minWidth:"50px", maxWidth:"50px"}} disabled />
                      <Form.Control name='numero' value={formRBordTransmis.numero.value} size='sm' type="number" onChange={e => handleInputChangeFormRBordTransmis(e)} className='me-2' style={{minWidth:"65px", maxWidth:"65px"}} />
                    </InputGroup>
                    <ButtonGroup as={Col} xs={1} size="sm" className='justify-content-end'>
                      <Button variant="outline-primary" title="Receptionner les bordereaux sélectionnés" className='me-1' style={{maxWidth:"65px", maxHeight:"30px"}} onClick={ () => handleReceptionnerEngagementButtonClick()} disabled={disableReceptionnerEngagment}><SaveRoundedIcon /></Button>
                    </ButtonGroup>
                  </Form.Group>
                </Card.Body>
              </Card>
              <Card className="">
                <Card.Body className='p-1' style={{height: "450px"}}>
                  <DataGrid
                      rows={filteredBordTransmis}
                      loading={loaderBordTransmis}
                      getRowId={(row) => row.codBord}
                      columns={tableBordTransmisColumns}
                      columnHeaderHeight={50}
                      hideFooter={true}
                      rowHeight={25}
                      checkboxSelection
                      keepNonExistentRowsSelected
                      disableRowSelectionOnClick={true}
                      rowSelectionModel={selectedRowIds}
                      onRowSelectionModelChange={(ids) => {
                        setSelectedRowIds(ids)
                      }}
                      slots={{
                        noRowsOverlay: NoRowsOverlay,
                      }}
                      sx={{
                        '& .header': {
                          backgroundColor: '#dc3545',
                          marginTop:'2px',
                        }
                      }}
                    />
                </Card.Body>                        
              </Card>
            </Form>
          </div>
      </Container>
  );
};

export default EngagementsReceptionDEngagementForm;
