import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, Modal, Row, Tab, Tabs } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import Swal from 'sweetalert2';
import DataTable  from 'react-data-table-component'; 
import { costumeStyles } from '../../helpers/costume-styles';
import { okSuccessDialog } from '../../helpers/dialogs';
import { BsEye, BsPencilSquare, BsPlusLg, BsTrash } from 'react-icons/bs';
import StElementsService from '../services/st-elements-service';
import { emptyStElementsRequestDto, StElementsRequestDto } from '../models/st-elements';
import { Gestion } from '../helpers/session-storage';
import PlanComptableService from '../services/plan-comptable-service';
import StElementsNomenclaService from '../services/st-elements-nomencla-service';
import { emptyStElementsNomenclaDto, StElementsNomenclaDto } from '../models/st-elements-nomencla';
import NomenclatureDService from '../services/nomenclatured-service';

type FormSte = {
  idStElts: Field,
	partie: Field,
	rangStElts: Field,
	libelleStElts: Field,
	completLib: Field,
	stElementsNomenclaIds: Field,
}

// ST ELEMENTS NOMENCLA
type FormSten = {
  idStElts: Field,
  partie: Field
}

// CRITERES DE RECHERCHE
type FormRCpteTiers = {
  idPlan: Field,
  intitulePlan: Field
}

// CRITERES DE RECHERCHE
type FormRCpteBudgetaire = {
  chapitre: Field,
  article: Field,
  paragraphe: Field,
  rubrique: Field
}

const MajParametresSituaTresorerieForm: FunctionComponent = () => {

  ///////////////// GESTION STELEMENTS
  const [key, setKey] = useState<any>('liste-des-stelements');
  const naviagteToTab = (key: any) => {
    if (key === "liste-des-stelements") {
      setKey("liste-des-stelements")
    }
  }
  
  const [stes, setStes] = useState<any[]>([]);
  const [filteredStes, setFilteredStes] = useState<any[]>([]);
  const [operationSte, setOperationSte] = useState<string>("add");
  const [termSte, setTermSte] = useState<string>('');

  const tableSteColumns = [
    {
      name: "Partie",
      selector: (row: any) => getLibellePartie(row.partie),
      sortable: true,
      width: "100px",
    },
    {
      name: "Rang",
      selector: (row: any) => row.rangStElts,
      sortable: true,
      width: "100px",
    },
    {
      name: "Libellé",
      selector: (row: any) => row.libelleStElts,
      sortable: true,
      wrap: true,
    },
    {
      name: "Marqué",
      selector: (row: any) => row.completLib,
      sortable: true,
      width: "100px",
    },
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            <Button variant="outline-warning" title="Modifier" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleEditSte(row)}><BsPencilSquare /></Button>
            <Button variant="outline-danger" title="Supprimer" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleDeleteSte(row)}><BsTrash /></Button>
            <Button variant="outline-primary" title="Cliquez pour voir le(s) compte(s) correspnondant(s)" style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleComptesCorrespondantsButtonClick(row)}><BsEye /></Button>
        </ButtonGroup>
      ),
      width: "100px",
      center: true,
    }
  ]

  const [formSte, setFormSte] = useState<FormSte>({
    idStElts: { value: '' },
    partie: { value: '' },
    rangStElts: { value: '' },
    libelleStElts: { value: '' },
    completLib: { value: '' },
    stElementsNomenclaIds: { value: '' }
  })

  const initFormSte = () => {
    setOperationSte('add');
    setFormSte({
      idStElts: { value: '' },
      partie: { value: '' },
      rangStElts: { value: '' },
      libelleStElts: { value: '' },
      completLib: { value: '' },
      stElementsNomenclaIds: { value: '' }
    })
  }

  const handleInputChangeFormSte = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormSte({ ...formSte, ...newField}); 
  }

  const validateFormSte = () => {
    let newForm: FormSte = formSte;

    // partie
    if(formSte.partie.value === "") {
      const errorMsg: string = 'partie obligatoire !';
      const newField: Field = { value: formSte.partie.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ partie: newField } };
    } else {
      const newField: Field = { value: formSte.partie.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ partie: newField } };
    }

    // rangStElts
    if(formSte.partie.value === "") {
      const errorMsg: string = 'rangStElts obligatoire !';
      const newField: Field = { value: formSte.rangStElts.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ rangStElts: newField } };
    } else {
      const newField: Field = { value: formSte.rangStElts.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ rangStElts: newField } };
    }

    // libelleStElts
    if(formSte.libelleStElts.value === "") {
      const errorMsg: string = 'libelleStElts obligatoire !';
      const newField: Field = { value: formSte.libelleStElts.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ libelleStElts: newField } };
    } else {
      const newField: Field = { value: formSte.libelleStElts.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ libelleStElts: newField } };
    }

    // completLib
    if(formSte.completLib.value === "") {
      const errorMsg: string = 'completLib obligatoire !';
      const newField: Field = { value: formSte.completLib.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ completLib: newField } };
    } else {
      const newField: Field = { value: formSte.completLib.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ completLib: newField } };
    }

    setFormSte(newForm);
    return newForm.partie.isValid && newForm.rangStElts.isValid && newForm.libelleStElts.isValid && newForm.completLib.isValid;
  }

  const handleSubmitFormSte = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormSte()) {
      Swal.fire({
        title: 'GesBud',
        text: "Tout les champs sont obligatoires !",
        icon: 'warning',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
      });
      return;
    }

    if (operationSte === 'add') addSte();
    if (operationSte === 'edit') editSte(); 
  }

  const libelleOperationSte = () => {
    if (operationSte === 'add') return "Ajouter elément"
    if (operationSte === 'edit') return "Modifier elément"
  }

  const libelleButtonSumbitSte = () => {
    if (operationSte === 'add') return "Ajouter"
    if (operationSte === 'edit') return "Modifier"
  }

  const handleAddSte = () => {
    initFormSte();
  }

  const handleEditSte = (row: any) => {
    setOperationSte("edit");
    setFormSte({
      idStElts: { value: row.idStElts, isValid: true },
      partie: { value: row.partie, isValid: true },
      rangStElts: { value: row.rangStElts, isValid: true },
      libelleStElts: { value: row.libelleStElts, isValid: true  },
      completLib: { value: row.completLib, isValid: true  },
      stElementsNomenclaIds: { value: row.stElementsNomenclaIds, isValid: true  }
    })
  }

  const handleDeleteSte = (row: any) => {
    initFormSte()
    Swal.fire({
      title: 'GesBud',
      text: "Supprimer cet enregistrement ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      allowOutsideClick: false,
      confirmButtonColor: '#007E33' 
    }).then( (result) => {
      if (result.isConfirmed) {
        StElementsService.delete(row.idStElts).then(() => {
          getStes();
          okSuccessDialog("Elements supprimé avec succès !")
        });
      }
    });
  }

  const addSte = () => {
    let newObject: StElementsRequestDto = emptyStElementsRequestDto;
    newObject.partie = formSte.partie.value;
    newObject.rangStElts = formSte.rangStElts.value;
    newObject.libelleStElts = formSte.libelleStElts.value;
    newObject.completLib = formSte.completLib.value;
    StElementsService.add(newObject).then(data => {
      initFormSte()
      getStes()
      okSuccessDialog("Elément ajouté avec succès !");
    })
  }

  const editSte = () => {
    let newObject: StElementsRequestDto = emptyStElementsRequestDto;
    newObject.partie = formSte.partie.value;
    newObject.rangStElts = formSte.rangStElts.value;
    newObject.libelleStElts = formSte.libelleStElts.value;
    newObject.completLib = formSte.completLib.value;
    StElementsService.edit(formSte.idStElts.value, newObject).then(data => {
      initFormSte()
      getStes()
      okSuccessDialog("Elément modifiée avec succès !");
    })
  }

  useEffect(() => {
    initFormSte();
    getStes()
    getPcs()
  }, [])

  const getStes = () => {
    StElementsService.getAll().then(data => {
      setStes(data)
      setFilteredStes(data)
    })
  }

  const handleSearchInputChangeSte = (e: any): void => {
    const term = e.target.value.toLowerCase();
    setTermSte(term);

    if(!term) {
      setFilteredStes(stes);
    } else {
      const results = stes.filter(item => {
        return Object.keys(item).some(key => {
          return item[key] && item[key].toString().toLowerCase().includes(term);
        })
      })
      setFilteredStes(results);
    }
  }

  const handleComptesCorrespondantsButtonClick = (row: any) => {
    setKey("liste-des-comptes-correspondants")
    getStens(row.idStElts, Number(gestionCourante))
    formSten.idStElts.value = row.idStElts;
    formSten.partie.value = row.partie;
  }

  const getLibellePartie = (partie: number): string => {
    if (partie === 2) return "Encaissement"; else return "Décaissement"
  }
  ///////////////// GESTION STELEMENTS

  ///////////////// GESTION STEMELENT NOMENCLA
  const [gestionCourante] = useState<string>(Gestion() ?? '');
  const [stens, setStens] = useState<any[]>([]);
  const [filteredStens, setFilteredStens] = useState<any[]>([]);
  const [termSten, setTermSten] = useState<string>('');
  const [pcs, setPcs] = useState<any[]>([]);

  const tableStenColumns = [
    {
      name: "Compte",
      selector: (row: any) => row.idPlan,
      sortable: true,
      width: "100px",
    },
    {
      name: "Intitulé",
      selector: (row: any) => row.intitulePlan,
      sortable: true,
      wrap: true,
    },
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            <Button variant="outline-danger" title="Supprimer" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleDeleteSten(row)}><BsTrash /></Button>
        </ButtonGroup>
      ),
      width: "33px",
      center: true,
    }
  ]

  const [formSten, setFormSten] = useState<FormSten>({
    idStElts: { value: '' },
    partie: { value: '' }
  })

  const handleDeleteSten = (row: any) => {
    Swal.fire({
      title: 'GesBud',
      text: "Supprimer cet enregistrement ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      allowOutsideClick: false,
      confirmButtonColor: '#007E33' 
    }).then( (result) => {
      if (result.isConfirmed) {
        StElementsNomenclaService.delete(row.idStElts, row.gestion, row.idPlan).then(() => {
          getStens(row.idStElts, Number(gestionCourante));
          okSuccessDialog("Compte supprimé avec succès !");
        });
      }
    });
  }

  const getPcs = () => {
    PlanComptableService.getAll().then(data => {
      setPcs(data)
    })
  }

  const getStens = (idStElts: string, gestion: number) => {
    StElementsNomenclaService.getByIdStEltsAndGestion(idStElts, gestion).then(data => {
      setStens(data)
    })
  }

  useEffect( () => {
    stens.forEach(sten => {
      const planComptable = pcs.find(pc => pc.idPlan.trim() === sten.idPlan.trim());
      sten.intitulePlan = planComptable?.intitulePlan;
    })
    setFilteredStens(stens)
  }, [stens, pcs])

  const handleSearchInputChangeSten = (e: any): void => {
    const term = e.target.value.toLowerCase();
    setTermSten(term);

    if(!term) {
      setFilteredStens(stens);
    } else {
      const results = stens.filter(item => {
        return Object.keys(item).some(key => {
          return item[key] && item[key].toString().toLowerCase().includes(term);
        })
      })
      setFilteredStens(results);
    }
  }
  ///////////////// GESTION STEMELENT NOMENCLA

  ///////////////// GESTION AJOUT COMPTE BUDGETAIRE
  const [showModalCpteBudgetaire, setShowModalCpteBudgetaire] = useState(false);
  const [cpteBugetaires, setCpteBudgetaires] = useState<any[]>([]);
  const [filteredCpteBudgetaires, setFilteredCpteBudgetaires] = useState<any[]>([]);

  const tableCpteBudgetairesColumns = [
    {
      name: "Chap",
      selector: (row: any) => row.chap,
      sortable: true,
      width: "80px"
    },
    {
      name: "Art",
      selector: (row: any) => row.art,
      sortable: true,
      width: "80px",
    },
    {
      name: "Parag",
      selector: (row: any) => row.parag,
      sortable: true,
      width: "80px",
    },
    {
      name: "Rub",
      selector: (row: any) => row.rub,
      sortable: true,
      width: "80px",
    },
    {
      name: "Intitulé",
      selector: (row: any) => row.intitule,
      sortable: true,
      wrap: true
    },
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            <Button variant="outline-primary" title="Cliquez pour ajouter" className='' style={{maxHeight:'30px'}} onClick={() => handleAjouterCpteBudgetaire(row)}>Ajouter</Button>
        </ButtonGroup>
      ),
      width: "100px",
    }
  ]

  const [formRCpteBudgetaire, setFormRCpteBudgetaire] = useState<FormRCpteBudgetaire>({
    chapitre: { value: ''},
    article: { value: ''},
    paragraphe: { value: ''},
    rubrique: { value: ''}
  })

  const initFormCpteBudgetaire = () => {
    setFormRCpteBudgetaire({
      chapitre: { value: ''},
      article: { value: ''},
      paragraphe: { value: ''},
      rubrique: { value: ''}
    })
  }

  const handleInputChangeFormRCpteBudgetaire = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormRCpteBudgetaire({ ...formRCpteBudgetaire, ...newField})

    if (fieldName === 'chapitre') {
      const results = cpteBugetaires.filter(item => {
        return ((item.chap || '').toString().includes(fieldValue))
        && ((item.art || '').toString().includes(formRCpteBudgetaire.article.value))
        && ((item.parag || '').toString().includes(formRCpteBudgetaire.paragraphe.value))
        && ((item.rub || '').toString().includes(formRCpteBudgetaire.rubrique.value))
      })
      setFilteredCpteBudgetaires(results);
    }

    if (fieldName === 'article') {
      const results = cpteBugetaires.filter(item => {
        return((item.chap || '').toString().includes(formRCpteBudgetaire.chapitre.value))
        && ((item.art || '').toString().includes(fieldValue))
        && ((item.parag || '').toString().includes(formRCpteBudgetaire.paragraphe.value))
        && ((item.rub || '').toString().includes(formRCpteBudgetaire.rubrique.value))
      })
      setFilteredCpteBudgetaires(results);
    }

    if (fieldName === 'paragraphe') {
      const results = cpteBugetaires.filter(item => {
        return((item.chap || '').toString().includes(formRCpteBudgetaire.chapitre.value))
        && ((item.art || '').toString().includes(formRCpteBudgetaire.article.value))
        && ((item.parag || '').toString().includes(fieldValue))
        && ((item.rub || '').toString().includes(formRCpteBudgetaire.rubrique.value))
      })
      setFilteredCpteBudgetaires(results);
    }

    if (fieldName === 'rubrique') {
      const results = cpteBugetaires.filter(item => {
        return ((item.chap || '').toString().includes(formRCpteBudgetaire.chapitre.value))
        && ((item.art || '').toString().includes(formRCpteBudgetaire.article.value))
        && ((item.parag || '').toString().includes(formRCpteBudgetaire.paragraphe.value))
        && ((item.rub || '').toString().includes(fieldValue))
      })
      setFilteredCpteBudgetaires(results);
    }
  }

  const handleAjouterCpteBudgetaire = (row: any) => {
    let newObject: StElementsNomenclaDto = emptyStElementsNomenclaDto;
    newObject.idStElts = formSten.idStElts.value;
    newObject.gestion = gestionCourante;
    if (row.chap && row.art === null && row.parag === null && row.rub === null) newObject.idPlan = row.chap;
    if (row.chap && row.art && row.parag === null && row.rub === null) newObject.idPlan = row.art;
    if (row.chap && row.art && row.parag && row.rub === null) newObject.idPlan = row.parag;
    if (row.chap && row.art && row.parag && row.rub) newObject.idPlan = row.rub;

    StElementsNomenclaService.add(newObject).then(data => {
      getStens(formSten.idStElts.value, Number(gestionCourante))
      setCpteBudgetaires([])
      initFormCpteBudgetaire()
    })
  }

  useEffect( () => {
    getCpteBudgetaires()
  }, [stens])

  // RETOURNE LES RECETTES QUON PEUT AFFECTER UN MONTANT
  const getCpteBudgetaires = () => {
    initFormCpteBudgetaire()
    let results: any[] = [];

    NomenclatureDService.getRecettesEtDepenses().then(data => {
      results = data.filter(item => {
        if (formSten.partie.value === 2) {
          return (item.titre === '1' && item.chap !== null)
        }
        if (formSten.partie.value === 3) {
          return (item.titre === '2' && item.chap !== null)
        }
      })
      
      stens.forEach(sten => {
        
        // CHAPITRE
        if (sten.idPlan.trim().length === 2) {
          results = results.filter(_sten => !_sten.chap.trim().startsWith(sten.idPlan.trim()));
        }

        // ARTICLE
        if (sten.idPlan.trim().length === 3) {
          results = results.filter(_sten => _sten.art !== sten.idPlan.trim());
          const chapASupprimer = results.find(_sten => _sten.chap === sten.idPlan.trim().substring(0, 2) && _sten.art === null && _sten.parag === null && _sten.rub === null);
          results = results.filter(_sten => _sten !== chapASupprimer);
        }

        // PARAGRAPHE
        if (sten.idPlan.trim().length === 4) {
          results = results.filter(_sten => _sten.parag !== sten.idPlan.trim());
          const chapASupprimer = results.find(_sten => _sten.chap === sten.idPlan.trim().substring(0, 2) && _sten.art === null && _sten.parag === null && _sten.rub === null);
          const artASupprimer = results.find(_sten => _sten.chap === sten.idPlan.trim().substring(0, 2) && _sten.art === sten.idPlan.trim().substring(0, 3) && _sten.parag === null && _sten.rub === null);
          results = results.filter(_sten => _sten !== chapASupprimer && _sten !== artASupprimer);
        }

        // RUBRIQUE
        if (sten.idPlan.trim().length === 5 || sten.idPlan.trim().length === 6) {
          results = results.filter(_sten => _sten.rub !== sten.idPlan.trim());
          const chapASupprimer = results.find(_sten => _sten.chap === sten.idPlan.trim().substring(0, 2) && _sten.art === null && _sten.parag === null && _sten.rub === null);
          const artASupprimer = results.find(_sten => _sten.chap === sten.idPlan.trim().substring(0, 2) && _sten.art === sten.idPlan.trim().substring(0, 3) && _sten.parag === null && _sten.rub === null);
          const paragASupprimer = results.find(_sten => _sten.chap === sten.idPlan.trim().substring(0, 2) && _sten.art === sten.idPlan.trim().substring(0, 3) && _sten.parag === sten.idPlan.trim().substring(0, 4) && _sten.rub === null);
          results = results.filter(_sten => _sten !== chapASupprimer && _sten !== artASupprimer && _sten !== paragASupprimer);
        }
      })

      setCpteBudgetaires(results)
      setFilteredCpteBudgetaires(results)
    })
  }

  const handleCloseModalCpteBudgetaire = () => {
    setShowModalCpteBudgetaire(false);
    setCpteBudgetaires([])
    initFormCpteBudgetaire()
  }

  const handleShowModalCpteBudgetaire = () => {
    setShowModalCpteBudgetaire(true);
    getCpteBudgetaires()
  }

  const handleAjouterCompteBudgetaireButtonClick= () => {
    handleShowModalCpteBudgetaire()
  }
  ///////////////// GESTION AJOUT COMPTE BUDGETAIRES

  ///////////////// GESTION AJOUT COMPTE TIERS
  const [showModalCpteTiers, setShowModalCpteTiers] = useState(false);
  const [cpteTiers, setCpteTiers] = useState<any[]>([]);
  const [filteredCpteTiers, setFilteredCpteTiers] = useState<any[]>([]);

  const tableCpteTiersColumns = [
    {
      name: "Code",
      selector: (row: any) => row.idPlan,
      sortable: true,
      width: "100px",
    },
    {
      name: "Intitulé",
      selector: (row: any) => row.intitulePlan,
      sortable: true,
      wrap: true,
    },
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            <Button variant="outline-primary" title="Cliquez pour ajouter" className='' style={{maxHeight:'30px'}} onClick={() => handleAjouterCpteTiers(row)}>Ajouter</Button>
        </ButtonGroup>
      ),
      width: "100px",
    }
  ]

  const [formRCpteTiers, setFormRCpteTiers] = useState<FormRCpteTiers>({
    idPlan: { value: ''},
    intitulePlan: { value: ''}
  })

  const handleInputChangeFormRCpteTiers = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormRCpteTiers({ ...formRCpteTiers, ...newField})
  }

  useEffect(() => {
    const results = cpteTiers.filter(item => {
      return (item.intitulePlan.toString().toLowerCase().includes(formRCpteTiers.intitulePlan.value.toLowerCase()))
      && (item.idPlan.toString().startsWith(formRCpteTiers.idPlan.value))
    })
    setFilteredCpteTiers(results);
  }, [formRCpteTiers])

  const handleAjouterCpteTiers = (row: any) => {
    let newObject: StElementsNomenclaDto = emptyStElementsNomenclaDto;
    newObject.idStElts = formSten.idStElts.value;
    newObject.gestion = gestionCourante;
    newObject.idPlan = row.idPlan;
    StElementsNomenclaService.add(newObject).then(data => {
      getStens(formSten.idStElts.value, Number(gestionCourante))
      setCpteTiers([])
    })
  }

  useEffect( () => {
    getCpteTiers()
  }, [stens])

  const getCpteTiers = () => {
    PlanComptableService.getCompteTiers().then(data => {
      let results: any[] = data;
      
      stens.forEach(sten => {
        // CLASSE
        if (sten.idPlan.trim().length === 1) {
          results = results.filter(_sten => !_sten.idPlan.trim().startsWith(sten.idPlan.trim()));
        }

        // CHAPITRE
        if (sten.idPlan.trim().length === 2) {
          results = results.filter(_sten => !_sten.idPlan.trim().startsWith(sten.idPlan.trim()));
        }
        if (sten.idPlan.trim().length === 2) {
          results = results.filter(_sten => _sten.idPlan.trim() !== sten.idPlan.trim().charAt(0));
        }

        // ARTICLE
        if (sten.idPlan.trim().length === 3) {
          results = results.filter(_sten => !_sten.idPlan.trim().startsWith(sten.idPlan.trim()));
        }
        if (sten.idPlan.trim().length === 3) {
          results = results.filter(_sten => _sten.idPlan.trim() !== sten.idPlan.trim().substring(0, 2));
        }
        if (sten.idPlan.trim().length === 3) {
          results = results.filter(_sten => _sten.idPlan.trim() !== sten.idPlan.trim().substring(0, 1));
        }

        // PARAGRAPHE
        if (sten.idPlan.trim().length === 4) {
          results = results.filter(_sten => !_sten.idPlan.trim().startsWith(sten.idPlan.trim()));
        }
        if (sten.idPlan.trim().length === 4) {
          results = results.filter(_sten => _sten.idPlan.trim() !== sten.idPlan.trim().substring(0, 3));
        }
        if (sten.idPlan.trim().length === 4) {
          results = results.filter(_sten => _sten.idPlan.trim() !== sten.idPlan.trim().substring(0, 2));
        }
        if (sten.idPlan.trim().length === 4) {
          results = results.filter(_sten => _sten.idPlan.trim() !== sten.idPlan.trim().substring(0, 1));
        }

        // RUBRIQUE
        if (sten.idPlan.trim().length === 5 || sten.idPlan.trim().length === 6) {
          results = results.filter(_sten => !_sten.idPlan.trim().startsWith(sten.idPlan.trim()));
        }
        if (sten.idPlan.trim().length === 5 || sten.idPlan.trim().length === 6) {
          results = results.filter(_sten => _sten.idPlan.trim() !== sten.idPlan.trim().substring(0, 4));
        }
        if (sten.idPlan.trim().length === 5 || sten.idPlan.trim().length === 6) {
          results = results.filter(_sten => _sten.idPlan.trim() !== sten.idPlan.trim().substring(0, 3));
        }
        if (sten.idPlan.trim().length === 5 || sten.idPlan.trim().length === 6) {
          results = results.filter(_sten => _sten.idPlan.trim() !== sten.idPlan.trim().substring(0, 2));
        }
        if (sten.idPlan.trim().length === 5 || sten.idPlan.trim().length === 6) {
          results = results.filter(_sten => _sten.idPlan.trim() !== sten.idPlan.trim().substring(0, 1));
        }
      })
      
      setCpteTiers(results)
      setFilteredCpteTiers(results)
    })
  }

  const handleCloseModalCpteTiers = () => {
    setShowModalCpteTiers(false);
    setCpteTiers([])
  }

  const handleShowModalCpteTiers = () => {
    setShowModalCpteTiers(true);
    getCpteTiers()
  }

  const handleAjouterCompteTiersButtonClick= () => {
    handleShowModalCpteTiers()
  }

  ///////////////// GESTION AJOUT COMPTE TIERS

  return (
    <Container>
          <div className="mt-1 p-1">
            <h6 className="shadow-sm text-primary text-center rounded">PARAMETRES &gt; MISE A JOUR DES ELEMENTS DU PALN DE TRESORERIE</h6>
            <Tabs id="controlled-tab-example" activeKey={key}  onSelect={(k) => naviagteToTab(k)} className="mb-1">
              {/* GESTION ELEMENTS */}
              <Tab eventKey="liste-des-stelements" title="Eléments">
                <Form onSubmit={(e) => handleSubmitFormSte(e)}>
                  <Card className="mb-1">
                    <Card.Header className='p-1'>
                    { libelleOperationSte() }
                    </Card.Header>
                    <Card.Body className=''>
                      <Row>
                        <Col>
                          <Form.Group controlId="partie" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Partie :</Form.Label></Col>
                            <Col>
                              <Form.Select name='partie' value={formSte.partie.value} size="sm" onChange={e => handleInputChangeFormSte(e)}>
                                <option value=''></option>
                                <option value='2'>Encaissement</option>
                                <option value='3'>Decaisement</option>
                              </Form.Select>
                            </Col>
                          </Form.Group>
                          <Form.Group controlId="rangStElts" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Rang :</Form.Label></Col>
                            <Col><Form.Control name='rangStElts' value={formSte.rangStElts.value} size='sm' type="number" onChange={e => handleInputChangeFormSte(e)} /></Col>
                          </Form.Group>
                          <Form.Group controlId="libelleStElts" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Libellé :</Form.Label></Col>
                            <Col><Form.Control name='libelleStElts' value={formSte.libelleStElts.value} size='sm' type="text" onChange={e => handleInputChangeFormSte(e)} /></Col>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="completLib" as={Row} className="mb-1">
                            <Col xs={4}><Form.Label className="label2">Marqué :</Form.Label></Col>
                            <Col><Form.Control name='completLib' value={formSte.completLib.value} size='sm' type="text" onChange={e => handleInputChangeFormSte(e)} /></Col>
                          </Form.Group>
                        </Col>
                      </Row>                  
                    </Card.Body>
                    <Card.Footer className='p-1'>
                      <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>{ libelleButtonSumbitSte() }</Button>
                      <Button size='sm' variant="outline-success" title="Ajouter Nouveau" className='ms-1' style={{width: "100px"}} onClick={ () => handleAddSte()}><BsPlusLg /></Button>
                    </Card.Footer>
                  </Card>
                </Form>
                <Card>
                  <Card.Body className='p-1'>
                    <DataTable
                      customStyles={costumeStyles}
                      columns={tableSteColumns}
                      data={filteredStes}
                      noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                      fixedHeader
                      responsive
                      striped
                      fixedHeaderScrollHeight='300px'
                      highlightOnHover
                      subHeader
                      subHeaderComponent={
                        <Form.Control size='sm' type="text" placeholder="Recherche elément" value={termSte} className='w-25'  onChange={e => handleSearchInputChangeSte(e)} />
                      }
                      />
                  </Card.Body>
                </Card>
              </Tab>

              {/* GESTION COMPTES */}
              <Tab eventKey="liste-des-comptes-correspondants" title="Compte(s) correspondant(s)">
                <Card>
                  <Card.Body className='p-1'>
                    <DataTable
                      customStyles={costumeStyles}
                      columns={tableStenColumns}
                      data={filteredStens}
                      noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                      fixedHeader
                      responsive
                      striped
                      fixedHeaderScrollHeight='300px'
                      highlightOnHover
                      subHeader
                      subHeaderComponent={
                        <ButtonGroup as={Col} size="sm">
                          <Button size='sm' variant='outline-success' title="Cliquez pour ajouter un compte budgétaire" style={{width: "100px"}} onClick={() => handleAjouterCompteBudgetaireButtonClick()} >Ajouter cpte budgétaire</Button>
                          <Button size='sm' variant="outline-success" title="Cliquez pour ajouter un compte de tiers pour les opérations de trésorerie" style={{width: "100px"}} onClick={() => handleAjouterCompteTiersButtonClick()} className='ms-1 me-5'>Ajouter cpte tiers</Button>
                          <Form.Control size='sm' type="text" placeholder="Recherche un compte" value={termSten} className='w-25'  onChange={e => handleSearchInputChangeSten(e)} />
                        </ButtonGroup>
                      }
                      />
                  </Card.Body>
                </Card>
              </Tab>   
            </Tabs>  
          </div>

          {/* GESTION AJOUT COMPTE BUDGETAIRE */}
          <Modal show={showModalCpteBudgetaire} onHide={handleCloseModalCpteBudgetaire} backdrop="static" keyboard={false} size="lg">
            <Modal.Header className='p-1'>
                <Modal.Title as="h6">Lignes Budgetaires</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2'>
              <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tableCpteBudgetairesColumns}
                    data={filteredCpteBudgetaires}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    fixedHeaderScrollHeight='450px'
                    highlightOnHover
                    responsive
                    striped
                    subHeader
                    subHeaderComponent={                       
                      <ButtonGroup as={Col} size="sm">
                        <Form.Control name="chapitre" value={formRCpteBudgetaire.chapitre.value}  size='sm' type="number" placeholder='chapitre' onChange={e => handleInputChangeFormRCpteBudgetaire(e)} className='me-1' style={{width:"100px"}}  />
                        <Form.Control name="article" value={formRCpteBudgetaire.article.value}  size='sm' type="number" placeholder='article' onChange={e => handleInputChangeFormRCpteBudgetaire(e)} className='me-1' style={{width:"100px"}}  />
                        <Form.Control name="paragraphe" value={formRCpteBudgetaire.paragraphe.value}  size='sm' type="number" placeholder='paragraphe' onChange={e => handleInputChangeFormRCpteBudgetaire(e)} className='me-1' style={{width:"100px"}}  />
                        <Form.Control name="rubrique" value={formRCpteBudgetaire.rubrique.value}  size='sm' type="number" placeholder='rubrique' className='me-5' onChange={e => handleInputChangeFormRCpteBudgetaire(e)} style={{width:"100px"}}  />
                      </ButtonGroup>
                    }
                    />
                </Card.Body>
              </Card>
            </Modal.Body>

            <Modal.Footer className='p-1'>
              <Button variant="outline-danger" size='sm' onClick={handleCloseModalCpteBudgetaire}>Fermer</Button>
            </Modal.Footer>
          </Modal>

          {/* GESTION AJOUT COMPTE TIERS */}
          <Modal show={showModalCpteTiers} onHide={handleCloseModalCpteTiers} backdrop="static" keyboard={false} size="lg">
            <Modal.Header className='p-1'>
                <Modal.Title as="h6">Plan comptable</Modal.Title>
            </Modal.Header>

            <Modal.Body className='p-2'>
              <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tableCpteTiersColumns}
                    data={filteredCpteTiers}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    fixedHeaderScrollHeight='450px'
                    highlightOnHover
                    responsive
                    striped
                    subHeader
                    subHeaderComponent={
                      <ButtonGroup as={Col} size="sm">
                        <Form.Control name="idPlan" size='sm' type="number" placeholder="Code commençant par" value={formRCpteTiers.idPlan.value} className='w-25 me-1'  onChange={e => handleInputChangeFormRCpteTiers(e)} />
                        <Form.Control name="intitulePlan" size='sm' type="text" placeholder="Intitulé" value={formRCpteTiers.intitulePlan.value} className='w-25'  onChange={e => handleInputChangeFormRCpteTiers(e)} />
                      </ButtonGroup>
                    } 
                     />
                </Card.Body>
              </Card>
            </Modal.Body>

            <Modal.Footer className='p-1'>
              <Button variant="outline-danger" size='sm' onClick={handleCloseModalCpteTiers}>Fermer</Button>
            </Modal.Footer>
          </Modal>
      </Container>
  );
};

export default MajParametresSituaTresorerieForm;
