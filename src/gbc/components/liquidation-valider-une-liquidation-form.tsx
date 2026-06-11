import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef, GridRowSelectionModel, GridValueFormatterParams } from '@mui/x-data-grid';
import { ConnectedUser, Gestion, IdBudget } from '../helpers/session-storage';
import Stack from '@mui/material/Stack';
import { okSuccessDialog } from '../../helpers/dialogs';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { formatDateWithHoursAndMinutes } from '../../helpers/format-date';
import LiquidationViewService from '../services/liquidation-view-service';
import MandatService from '../services/mandat-service';
import { emptyInfosPourValiderLiquidation, InfosPourValiderLiquidation } from '../models/infos-pour-valider-liquidation';
import ServerDateService from '../../shared/system/services/server-date-service';

// CRITERES DE RECHERCHE LIQUIDATION
type FormRLiquidation = {
  benum: Field,
  numBlMand: Field,
  chapitre: Field,
  article: Field,
  paragraphe: Field,
  rubrique: Field
}

const LiquidationValiderUneLiquidationForm: FunctionComponent = () => {

  const [gestionCourante] = useState<string>(Gestion() ?? '');
  const [idBudget] = useState<string>(IdBudget() ?? '');
  const [utilisateurCourante] = useState<string>(ConnectedUser() ?? '');
  const [isGestionClose, setIsGestionClose] = useState<boolean>(false);
  const dateEnregistrementPourGestionClose: Date = new Date(gestionCourante + '-12-31');  
  const [disableValiderLiquidation, setDisableValiderLiquidation] = useState<boolean>(true);

  useEffect(() => {
    // On recupere la date du server : si la gestion en cours est strictement inférieur à l'année de la date du serveur alors elle est close :
    ServerDateService.getServerDate().then(data => {
      if (Number(gestionCourante) < new Date(data).getFullYear()) setIsGestionClose(true); else setIsGestionClose(false)   
    }) 
  }, [])   

  ///////////////// GESTION LIQUIDATION A VALIDER
  const [liquidations, setLiquidations] = useState<any[]>([]);
  const [filteredLiquidations, setFilteredLiquidations] = useState<any[]>([]);
  const [loaderLiquidations, setLoaderLiquidations] = useState<boolean>(true);
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const tableLiquidationColumns: GridColDef[] = [
    {
      field: 'dateEtatMand',
      headerName: 'Date de MAJ',
      type: 'Date',
      width: 150,
      align: "center",
      valueFormatter: (params : GridValueFormatterParams<any>) => {
        return formatDateWithHoursAndMinutes(new Date(params.value));
      },
      headerClassName: 'header',
    },
    {
      field: 'nbl',
      headerName: 'N°BL',
      type: 'string',
      width: 120,
      align: "center",
      headerClassName: 'header',
    },
    {
      field: 'nom',
      headerName: 'Fournisseur / Bénéficiaire',
      type: 'string',
      width: 280,
      headerClassName: 'header',
      headerAlign: 'center'
    },
    {
      field: 'montant',
      headerName: 'Montant',
      type: 'number',
      width: 120,
      headerClassName: 'header',
      headerAlign: 'center'
    }, 
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      width: 100,
      headerClassName: 'header',
    },
    {
      field: 'motifs',
      headerName: 'Motif de rejet',
      type: 'string',
      width: 180,
      headerClassName: 'header',
      headerAlign: 'center'
    },
  ];

  useEffect(() => {
    getLiquidations()
  }, [])
  
  const getLiquidations = () => {
    LiquidationViewService.getLiquidationValidables(Number(gestionCourante), Number(idBudget)).then(data => {
      data.forEach(element => {
        (element as any).nbl = element.gestion + "-" + element.benum + "-" + String(element.numBlMand).padStart(4, '0');
      });
      setLiquidations(data) 
      setFilteredLiquidations(data)
      setLoaderLiquidations(false)
    })
  }
  ///////////////// GESTION LIQUIDAIONS A VILIDER

  ///////////////// GESTION RECHERCHE LIQUIDATION
  const [formRLiquidation, setFormRLiquidation] = useState<FormRLiquidation>({
    benum: { value: ''},
    numBlMand: { value: ''},
    chapitre: { value: ''},
    article: { value: ''},
    paragraphe: { value: ''},
    rubrique: { value: ''},
  })

  const handleInputChangeFormRLiquidation = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormRLiquidation({ ...formRLiquidation, ...newField})

    if (fieldName === 'benum') {
      const results = liquidations.filter(item => {
        return ((item.benum || '').toString().startsWith(fieldValue))
        && ((item.numBlMand || '').toString().startsWith(formRLiquidation.numBlMand.value))
        && ((item.chap || '').toString().startsWith(formRLiquidation.chapitre.value))
        && ((item.art || '').toString().startsWith(formRLiquidation.article.value))
        && ((item.parag || '').toString().startsWith(formRLiquidation.paragraphe.value))
        && ((item.rub || '').toString().startsWith(formRLiquidation.rubrique.value))
      })
      setFilteredLiquidations(results);
    }

    if (fieldName === 'numBlMand') {
      const results = liquidations.filter(item => {
        return ((item.benum || '').toString().startsWith(formRLiquidation.benum.value))
        && ((item.numBlMand || '').toString().startsWith(fieldValue))
        && ((item.chap || '').toString().startsWith(formRLiquidation.chapitre.value))
        && ((item.chap || '').toString().startsWith(formRLiquidation.chapitre.value))
        && ((item.art || '').toString().startsWith(formRLiquidation.article.value))
        && ((item.parag || '').toString().startsWith(formRLiquidation.paragraphe.value))
        && ((item.rub || '').toString().startsWith(formRLiquidation.rubrique.value))
      })
      setFilteredLiquidations(results);
    }    

    if (fieldName === 'chapitre') {
      const results = liquidations.filter(item => {
        return ((item.benum || '').toString().startsWith(formRLiquidation.benum.value))
        && ((item.numBlMand || '').toString().startsWith(formRLiquidation.numBlMand.value))
        && ((item.chap || '').toString().startsWith(fieldValue))
        && ((item.art || '').toString().startsWith(formRLiquidation.article.value))
        && ((item.parag || '').toString().startsWith(formRLiquidation.paragraphe.value))
        && ((item.rub || '').toString().startsWith(formRLiquidation.rubrique.value))
      })
      setFilteredLiquidations(results);
    }

    if (fieldName === 'article') {
      const results = liquidations.filter(item => {
        return ((item.benum || '').toString().startsWith(formRLiquidation.benum.value))
        && ((item.numBlMand || '').toString().startsWith(formRLiquidation.numBlMand.value))
        && ((item.chap || '').toString().startsWith(formRLiquidation.chapitre.value))
        && ((item.art || '').toString().startsWith(fieldValue))
        && ((item.parag || '').toString().startsWith(formRLiquidation.paragraphe.value))
        && ((item.rub || '').toString().startsWith(formRLiquidation.rubrique.value))
      })
      setFilteredLiquidations(results);
    }

    if (fieldName === 'paragraphe') {
      const results = liquidations.filter(item => {
        return ((item.benum || '').toString().startsWith(formRLiquidation.benum.value))
        && ((item.numBlMand || '').toString().startsWith(formRLiquidation.numBlMand.value))
        && ((item.chap || '').toString().startsWith(formRLiquidation.chapitre.value))
        && ((item.art || '').toString().startsWith(formRLiquidation.article.value))
        && ((item.parag || '').toString().startsWith(fieldValue))
        && ((item.rub || '').toString().startsWith(formRLiquidation.rubrique.value))
      })
      setFilteredLiquidations(results);
    }

    if (fieldName === 'rubrique') {
      const results = liquidations.filter(item => {
        return ((item.benum || '').toString().startsWith(formRLiquidation.benum.value))
        && ((item.numBlMand || '').toString().startsWith(formRLiquidation.numBlMand.value))
        && ((item.chap || '').toString().startsWith(formRLiquidation.chapitre.value))
        && ((item.art || '').toString().startsWith(formRLiquidation.article.value))
        && ((item.parag || '').toString().startsWith(formRLiquidation.paragraphe.value))
        && ((item.rub || '').toString().startsWith(fieldValue))
      })
      setFilteredLiquidations(results);
    }
  }
  ///////////////// GESTION RECHERCHE LIQUIDATION

  ///////////////// GESTION VALIDER LIQUIDATION
  const handleValiderLiquidationButtonClick = () => {
    let ids : number[] = [];
    selectedRowIds.forEach(id => {
      ids.push(Number(id.valueOf()));
    });

    let infosPourValiderLiquidation: InfosPourValiderLiquidation = emptyInfosPourValiderLiquidation;
    infosPourValiderLiquidation.ids = ids;
    infosPourValiderLiquidation.date = (isGestionClose)? dateEnregistrementPourGestionClose : new Date();
    infosPourValiderLiquidation.idUser = utilisateurCourante;      

    MandatService.validerLiquidation(infosPourValiderLiquidation).then(res => {
      if (res) {
        setSelectedRowIds([])
        getLiquidations();
        okSuccessDialog("Liquidation validé(s) avec succès !");
      }
    })
  }

  useEffect(() => {
    if (selectedRowIds.length !== 0) setDisableValiderLiquidation(false); else setDisableValiderLiquidation(true);
  }, [selectedRowIds])
  ///////////////// GESTION VALIDER LIQUIDATION

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
            <h6 className="shadow-sm text-primary text-center rounded">LIQUIDATION &gt; VALIDER UNE LIQUIDATION</h6>
            <Form>
              <Card className="mb-1">
                <Card.Body className='p-1'>
                  <Form.Group as={Row}>
                    <InputGroup as={Col}>
                      <Form.Control name='' value={"BL N° :"} size='sm' type="text" className='me-1 text-end fw-bold text-primary' disabled />
                      <Form.Control name='' value={gestionCourante} type="text" size='sm' className='me-1 fw-bold' style={{maxWidth:"50px", maxHeight:"30px"}} disabled />
                      <Form.Control name='benum' value={formRLiquidation.benum.value} size='sm' type="text" onChange={e => handleInputChangeFormRLiquidation(e)} className='me-1 fw-bold' style={{maxWidth:"50px", maxHeight:"30px"}} />
                      <Form.Control name='numBlMand' value={formRLiquidation.numBlMand.value} size='sm' type="text" onChange={e => handleInputChangeFormRLiquidation(e)} className=' me-2 fw-bold' style={{maxWidth:"50px", maxHeight:"30px"}} />                      
                      <Form.Control name='chapitre' value={formRLiquidation.chapitre.value} size='sm' type="number" placeholder='chapitre' onChange={e => handleInputChangeFormRLiquidation(e)} className='me-1' style={{minWidth:"80px", maxWidth:"80px"}} />
                      <Form.Control name='article' value={formRLiquidation.article.value} size='sm' type="number" placeholder='article' onChange={e => handleInputChangeFormRLiquidation(e)} className='me-1' style={{minWidth:"80px", maxWidth:"80px"}} />
                      <Form.Control name='paragraphe' value={formRLiquidation.paragraphe.value} size='sm' type="number" placeholder='paragraphe' onChange={e => handleInputChangeFormRLiquidation(e)} className='me-1' style={{minWidth:"80px", maxWidth:"80px"}} />
                      <Form.Control name='rubrique' value={formRLiquidation.rubrique.value} size='sm' type="number" placeholder='rubrique' onChange={e => handleInputChangeFormRLiquidation(e)} className='me-1' style={{minWidth:"80px", maxWidth:"80px"}} />
                    </InputGroup>
                    <ButtonGroup as={Col} xs={1} size="sm" className='justify-content-end'>
                      <Button variant="outline-primary" title="Valider les engagements sélectionnés" className='me-1' style={{maxWidth:"65px", maxHeight:"30px"}} onClick={ () => handleValiderLiquidationButtonClick()} disabled={disableValiderLiquidation}><SaveRoundedIcon /></Button>
                    </ButtonGroup>
                  </Form.Group>
                </Card.Body>
              </Card>
              <Card className="">
                <Card.Body className='p-1' style={{height: "450px"}}>
                  <DataGrid
                      rows={filteredLiquidations}
                      loading={loaderLiquidations}
                      getRowId={(row) => row.numMand}
                      columns={tableLiquidationColumns}
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

export default LiquidationValiderUneLiquidationForm;
