import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';

import { Field } from '../../helpers/types';
import Swal from 'sweetalert2';
import DataTable  from 'react-data-table-component'; 
import { costumeStyles } from '../../helpers/costume-styles';
import { okSuccessDialog, okWarnignDialog } from '../../helpers/dialogs';
import { BsPencilSquare, BsPlusLg, BsTrash } from 'react-icons/bs';
import NomenclatureDService from '../services/nomenclatured-service';
import { emptyNomenclatureDRequestDto, emptyNomenclatureDResponseDto, NomenclatureDRequestDto, NomenclatureDResponseDto } from '../models/nomenclatured';
import AccesCodeDto, { emptyAccesCodeDto } from '../models/accesCodeDto';
import { ConnectedUser } from '../helpers/session-storage';
import AccesCodeService from '../services/accesCodeService';
import BudgetService from '../services/budget-service';
import bcrypt from 'bcryptjs-react';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import PdfViewer from '../../helpers/pdf-viewer';
import ReportService from '../../shared/report/services/report-service';
import { Report, emptyReport } from '../../shared/report/models/report';

type FormN = {
  titre: Field,
  sectCode: Field,
  sectIntitule: Field,
  sectNumNo: Field,
  sectDotEstExec: Field
  chapCode: Field,
  chapIntitule: Field,
  chapNumNo: Field,
  chapDotEstExec: Field
  artCode: Field,
  artIntitule: Field,
  artNumNo: Field,
  artDotEstExec: Field
  paragCode: Field,
  paragIntitule: Field,
  paragNumNo: Field,
  paragDotEstExec: Field
  rubCode: Field,
  rubIntitule: Field,
  rubNumNo: Field,
  rubDotEstExec: Field
}

type FormR = {
  titreR: Field,
  sectionR: Field,
  chapitreR: Field,
  articleR: Field,
  paragrapheR: Field,
  rubriqueR: Field
}

const MajLesComptesBudgetairesNomenclatureBudgetaireForm: FunctionComponent = () => {

  const [nomenclatures, setNomenclatures] = useState<any[]>([]);
  const [filteredNomenclatures, setFilteredNomenclatures] = useState<any[]>([]);
  const [operationN, setOperationN] = useState<string>("add");
  const [showModalMotPasseConnexion, setShowModalMotPasseConnexion] = useState(false);
  const [accesCodeCourante, setAccesCodeCourante] = useState<AccesCodeDto>(emptyAccesCodeDto);
  const [motPasseCourant, setMotPasseCourant] = useState("");
  const [rowToDelete, setRowToDelete] = useState<any>(emptyNomenclatureDResponseDto);

  const [sectCodeDisabled, setSectCodeDisabled] = useState(true);
  const [chapCodeDisabled, setChapCodeDisabled] = useState(true);
  const [artCodeDisabled, setArtCodeDisabled] = useState(true);
  const [paragCodeDisabled, setParagCodeDisabled] = useState(true);
  const [rubCodeDisabled, setRubCodeDisabled] = useState(true);
  const [sectIntituleDisabled, setSectIntituleDisabled] = useState(true);
  const [chapIntituleDisabled, setChapIntituleDisabled] = useState(true);
  const [artIntituleDisabled, setArtIntituleDisabled] = useState(true);
  const [paragIntituleDisabled, setParagIntituleDisabled] = useState(true);
  const [rubIntituleDisabled, setRubIntituleDisabled] = useState(true);
  const [sectDotEstExecDisabled, setSectDotEstExecDisabled] = useState(true);
  const [chapDotEstExecDisabled, setchapDotEstExecDisabled] = useState(true);
  const [artDotEstExecDisabled, setArtDotEstExecDisabled] = useState(true);
  const [paragDotEstExecDisabled, setParagDotEstExecDisabled] = useState(true);
  const [rubDotEstExecDisabled, setRubDotEstExecDisabled] = useState(true);

  const [borderColorSectCode, setBorderColorSectCode] = useState<string>("");
  const [borderColorChapCode, setBorderColorChapCode] = useState<string>("");
  const [borderColorArtCode, setBorderColorArtCode] = useState<string>("");
  const [borderColorParagCode, setBorderColorParagCode] = useState<string>("");
  const [borderColorRubCode, setBorderColorRubCode] = useState<string>("");
  const [borderColorSectIntitule, setBorderColorSectIntitule] = useState<string>("");
  const [borderColorChapIntitule, setBorderColorChapIntitule] = useState<string>("");
  const [borderColorArtIntitule, setBorderColorArtIntitule] = useState<string>("");
  const [borderColorParagIntitule, setBorderColorParagIntitule] = useState<string>("");
  const [borderColorRubIntitule, setBorderColorRubIntitule] = useState<string>("");


  const [autoCompleteAllowed, setAutoCompleteAllowed] = useState(true); // Utiliser pour bloquer handleAutoComplete lorsque l'utilsateur
  const sectCodeRef = useRef<HTMLInputElement>(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<any>();
  const [pdfNameForDownload, setPdfNameForDownload] = useState("");

  const tableNomenclatureColumns = [
    {
      name: "Sect",
      selector: (row: any) => row.section,
      sortable: true,
      width: "70px",
    },
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
      name: "Dot=Exéc",
      cell: (row: any) => <Form.Check type='checkbox' checked={row.dotEstExec === true} disabled className='label2' />,
      width: "90px",
      center: true,
    },
    {
      name: "",
      cell: (row: any) => (
        <ButtonGroup size="sm">
            <Button variant="outline-warning" title="Modifier" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleEditN(row)}><BsPencilSquare /></Button>
            <Button variant="outline-danger" title="Supprimer" className='me-1' style={{maxWidth:'30px', maxHeight:'30px'}} onClick={() => handleDeleteN(row)}><BsTrash /></Button>
        </ButtonGroup>
      ),
      width: "90px",
      center: true,
    }
  ]

  const [formN, setFormN] = useState<FormN>({
    titre: { value: '1'},
    sectCode: { value: ''},
    sectIntitule: { value: ''},
    sectNumNo: { value: ''},
    sectDotEstExec: { value: false},
    chapCode: { value: ''},
    chapIntitule: { value: ''},
    chapNumNo: { value: ''},
    chapDotEstExec: { value: false},
    artCode: { value: ''},
    artIntitule: { value: ''},
    artNumNo: { value: ''},
    artDotEstExec: { value: false},
    paragCode: { value: ''},
    paragIntitule: { value: ''},
    paragNumNo: { value: ''},
    paragDotEstExec: { value: false},
    rubCode: { value: ''},
    rubIntitule: { value: ''},
    rubNumNo: { value: ''},
    rubDotEstExec: { value: false}
  })

  const [formR, setFormR] = useState<FormR>({
    titreR: { value: '1'},
    sectionR: { value: ''},
    chapitreR: { value: ''},
    articleR: { value: ''},
    paragrapheR: { value: ''},
    rubriqueR: { value: ''}
  })

  const initFormN = () => {
    setOperationN('add');
    setFormN({
      titre: { value: '1'},
      sectCode: { value: ''},
      sectIntitule: { value: ''},
      sectNumNo: { value: ''},
      sectDotEstExec: { value: false},
      chapCode: { value: ''},
      chapIntitule: { value: ''},
      chapNumNo: { value: ''},
      chapDotEstExec: { value: false},
      artCode: { value: ''},
      artIntitule: { value: ''},
      artNumNo: { value: ''},
      artDotEstExec: { value: false},
      paragCode: { value: ''},
      paragIntitule: { value: ''},
      paragNumNo: { value: ''},
      paragDotEstExec: { value: false},
      rubCode: { value: ''},
      rubIntitule: { value: ''},
      rubNumNo: { value: ''},
      rubDotEstExec: { value: false}
    })

    setSectCodeDisabled(false);
    setChapCodeDisabled(true);
    setArtCodeDisabled(true);
    setParagCodeDisabled(true);
    setRubCodeDisabled(true);
    setSectIntituleDisabled(true);
    setChapIntituleDisabled(true);
    setArtIntituleDisabled(true);
    setParagIntituleDisabled(true);
    setRubIntituleDisabled(true);
    setSectDotEstExecDisabled(true);
    setchapDotEstExecDisabled(true);
    setArtDotEstExecDisabled(true);
    setParagDotEstExecDisabled(true);
    setRubDotEstExecDisabled(true);
  }

  const handleInputChangeFormN = (e: any): void => {
    const fieldName: string = e.target.name;
    let fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };

    // Reactivation de l'auto complétion si nécessaire
    if (!autoCompleteAllowed) setAutoCompleteAllowed(true);

    // Les champs codes qui seront valides
    const codeFields = ["sectCode", "chapCode", "artCode", "paragCode", "rubCode"];

    // Map des parents pour startswith
    const parentMap: Record<string, string | undefined> = {
      artCode: formN.chapCode.value,
      paragCode: formN.artCode.value,
      rubCode: formN.paragCode.value,
    };

    // Map des longueurs max
    const maxLengthMap: Record<string, number> = {
      sectCode: 1,
      chapCode: 2,
      artCode: 3,
      paragCode: 4,
      rubCode: 6,
    };

    // On valide uniquement les champs qui sont dans codeFields
    if (codeFields.includes(fieldName)) {
      // sectCode 1 ou 2
      if (fieldName === "sectCode") {
        //if (fieldValue.length > 1) return;
        if (fieldValue !== "" && fieldValue !== "1" && fieldValue !== "2") return;
      }

      // Limiter la longueur max
      if (fieldValue.length > (maxLengthMap[fieldName] || 10)) return;
      // Verifier parent si nécessaire
      const parentValue = parentMap[fieldName];
      if (parentValue) {
        for (let i = 0; i < fieldValue.length; i++) {
          if (i >= parentValue.length) break; // Ok si on tape apres parent
          if (fieldValue[i] !== parentValue[i]) return; // Bloque si different
        }
      }      
    }

    setFormN({ ...formN, ...newField}); 
    
    if (fieldName === "sectCode") {
      if (fieldValue !== '' && fieldValue.length === 1) {
        formN.sectIntitule.value = '';
        const nomenclature = nomenclatures.find(item => {
          return item.titre === formN.titre.value && item.section === fieldValue && item.chap === null && item.art === null && item.parag === null && item.rub === null
        })
        if (nomenclature) {
          formN.sectIntitule.value = nomenclature.intitule
          formN.sectDotEstExec.value = nomenclature.dotEstExec

          setChapCodeDisabled(false);
        } else {
          okWarnignDialog("Cette section n'existe pas dans la nomenclature budgétaire. Veuillez saisir 1 ou 2 !");
        } 
      } else {
        formN.sectIntitule.value = '';
        formN.sectDotEstExec.value = false;

        setChapCodeDisabled(true);
        setChapIntituleDisabled(true);
        setChapCodeDisabled(true);
        setArtCodeDisabled(true);
        setArtIntituleDisabled(true);
        setArtCodeDisabled(true);
        setParagCodeDisabled(true);
        setParagIntituleDisabled(true);
        setParagDotEstExecDisabled(true);
        setRubCodeDisabled(true);
        setRubIntituleDisabled(true);
        setRubDotEstExecDisabled(true);
        formN.chapCode.value = "";
        formN.chapIntitule.value = "";
        formN.chapDotEstExec.value = false;
        formN.artCode.value = "";
        formN.artIntitule.value = "";
        formN.artDotEstExec.value = false;
        formN.paragCode.value = "";
        formN.paragIntitule.value = "";
        formN.paragDotEstExec.value = false;
        formN.rubCode.value = "";
        formN.rubIntitule.value = "";
        formN.rubDotEstExec.value = false;
      }
    }
   
    if (fieldName === "chapCode") {
      if (fieldValue !== '' && fieldValue.length === 2) {
        formN.chapIntitule.value = '';
        const nomenclature = nomenclatures.find(item => {
          return item.titre === formN.titre.value && item.section === formN.sectCode.value && item.chap === fieldValue && item.art === null && item.parag === null && item.rub === null
        })
        if (nomenclature) {
          formN.chapIntitule.value = nomenclature.intitule
          formN.chapDotEstExec.value = nomenclature.dotEstExec

          setArtCodeDisabled(false);
        } else {
          Swal.fire({
            title: 'GesBud',
            text: "Ce chapitre n'existe pas dans la section " + formN.sectCode.value + ". Voulez-vous le créer ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
            allowOutsideClick: false,
            confirmButtonColor: '#007E33' 
          }).then( (result) => {
            if (result.isConfirmed) {
              setChapIntituleDisabled(false);
              setchapDotEstExecDisabled(false);
              setArtCodeDisabled(false);
            } else {
              setFormN({
                ...formN, 
                chapCode: {value: ""}
              })
              setChapIntituleDisabled(true);
              setchapDotEstExecDisabled(true);
              setArtCodeDisabled(true);
            }
          });
        } 
      } else {
        formN.chapIntitule.value = '';
        formN.chapDotEstExec.value = false;

        setArtCodeDisabled(true);
        setArtIntituleDisabled(true);
        setArtCodeDisabled(true);
        setParagCodeDisabled(true);
        setParagIntituleDisabled(true);
        setParagDotEstExecDisabled(true);
        setRubCodeDisabled(true);
        setRubIntituleDisabled(true);
        setRubDotEstExecDisabled(true);
        formN.artCode.value = "";
        formN.artIntitule.value = "";
        formN.artDotEstExec.value = false;
        formN.paragCode.value = "";
        formN.paragIntitule.value = "";
        formN.paragDotEstExec.value = false;
        formN.rubCode.value = "";
        formN.rubIntitule.value = "";
        formN.rubDotEstExec.value = false;
      }
    }

    if (fieldName === "artCode") {
      if (fieldValue !== '' && fieldValue.length === 3) {
        formN.artIntitule.value = '';
        const nomenclature = nomenclatures.find(item => {
          return item.titre === formN.titre.value && item.section === formN.sectCode.value && item.chap === formN.chapCode.value  && item.art === fieldValue && item.parag === null && item.rub === null
        })
        if (nomenclature) {
          formN.artIntitule.value = nomenclature.intitule
          formN.artDotEstExec.value = nomenclature.dotEstExec

          setParagCodeDisabled(false);
        } else {
          Swal.fire({
            title: 'GesBud',
            text: "Ce article n'existe pas dans le chapitre " + formN.chapCode.value + ". Voulez-vous le créer ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
            allowOutsideClick: false,
            confirmButtonColor: '#007E33' 
          }).then( (result) => {
            if (result.isConfirmed) {
              setArtIntituleDisabled(false);
              setArtDotEstExecDisabled(false);
              setParagCodeDisabled(false);
            } else {
              setAutoCompleteAllowed(false);
              setFormN({
                ...formN, 
                artCode: {value: ""}
              })
              setArtIntituleDisabled(true);
              setArtDotEstExecDisabled(true);
              setParagCodeDisabled(true);
            }
          });
        } 
      } else {
        formN.artIntitule.value = '';
        formN.artDotEstExec.value = false;

        setParagCodeDisabled(true);
        setParagIntituleDisabled(true);
        setParagDotEstExecDisabled(true);
        setRubCodeDisabled(true);
        setRubIntituleDisabled(true);
        setRubDotEstExecDisabled(true);
        formN.paragCode.value = "";
        formN.paragIntitule.value = "";
        formN.paragDotEstExec.value = false;
        formN.rubCode.value = "";
        formN.rubIntitule.value = "";
        formN.rubDotEstExec.value = false;
      }
    }

    if (fieldName === "paragCode") {
      if (fieldValue !== '' && fieldValue.length === 4) {
        formN.paragIntitule.value = '';
        const nomenclature = nomenclatures.find(item => {
          return item.titre === formN.titre.value && item.section === formN.sectCode.value && item.chap === formN.chapCode.value  && item.art === formN.artCode.value && item.parag === fieldValue && item.rub === null
        })
        if (nomenclature) {
          formN.paragIntitule.value = nomenclature.intitule
          formN.paragDotEstExec.value = nomenclature.dotEstExec

          setRubCodeDisabled(false);
        } else {
          Swal.fire({
            title: 'GesBud',
            text: "Ce paragraphe n'existe pas dans l'article " + formN.artCode.value + ". Voulez-vous le créer ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
            allowOutsideClick: false,
            confirmButtonColor: '#007E33' 
          }).then( (result) => {
            if (result.isConfirmed) {
              setParagIntituleDisabled(false);
              setParagDotEstExecDisabled(false);
              setRubCodeDisabled(false);
            } else {
              setAutoCompleteAllowed(false);
              setFormN({
                ...formN, 
                paragCode: {value: ""}
              })
              setParagIntituleDisabled(true);
              setParagDotEstExecDisabled(true);
              setRubCodeDisabled(true);
            }
          });
        } 
      } else {
        formN.paragIntitule.value = '';
        formN.paragDotEstExec.value = false;

        setRubCodeDisabled(true);
        setRubIntituleDisabled(true);
        setRubDotEstExecDisabled(true);
        formN.rubCode.value = "";
        formN.rubIntitule.value = "";
        formN.rubDotEstExec.value = false;
      }
    }

    if (fieldName === "rubCode") {
      if (fieldValue !== '' && fieldValue.length === 5 || fieldValue.length === 6) {
        formN.rubIntitule.value = '';
        const nomenclature = nomenclatures.find(item => {
          return item.titre === formN.titre.value && item.section === formN.sectCode.value && item.chap === formN.chapCode.value  && item.art === formN.artCode.value && item.parag === formN.paragCode.value && item.rub === fieldValue
        })
        if (nomenclature) {
          formN.rubIntitule.value = nomenclature.intitule
          formN.rubDotEstExec.value = nomenclature.dotEstExec
        } else {
          Swal.fire({
            title: 'GesBud',
            text: "Cette rubrique n'existe pas dans le paragraphe " + formN.paragCode.value + ". Voulez-vous le créer ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
            allowOutsideClick: false,
            confirmButtonColor: '#007E33' 
          }).then( (result) => {
            if (result.isConfirmed) {
              setRubIntituleDisabled(false);
              setRubDotEstExecDisabled(false);
            } else {
              setAutoCompleteAllowed(false);
              setFormN({
                ...formN, 
                rubCode: {value: ""}
              })
              setRubIntituleDisabled(true);
              setRubDotEstExecDisabled(true);
            }
          });
        } 
      } else {
        formN.rubIntitule.value = '';
        formN.rubDotEstExec.value = false;
      }
    }

  }

  const handleAutoCompleteCode = (fieldName: string) => {
    if (!autoCompleteAllowed) return;
    let updateForm = { ...formN};
    if (fieldName === "artCode" && formN.chapCode.value && !formN.artCode.value) updateForm.artCode.value = formN.chapCode.value;
    if (fieldName === "paragCode" && formN.artCode.value && !formN.paragCode.value) updateForm.paragCode.value = formN.artCode.value;
    if (fieldName === "rubCode" && formN.paragCode.value && !formN.rubCode.value) updateForm.rubCode.value = formN.paragCode.value;
    setFormN(updateForm);
  }

  const handleDotEstExecInputChangeFormN = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.checked;
    
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormN({ ...formN, ...newField}); 
  }
  
  const validateFormN = () => {
    let newForm: FormN = formN;
   
    // SI C'EST UNE RUBRIQUE
    if (formN.rubCode.value) {
      // Section
      if(!formN.sectCode.value) {
        const errorMsg: string = 'Section code obligatoire !';
        const newField: Field = { value: formN.sectCode.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ sectCode: newField } };
        setBorderColorSectCode("red");
      } else {
        const newField: Field = { value: formN.sectCode.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ sectCode: newField } };
        setBorderColorSectCode("");
      }

      if(!formN.sectIntitule.value) {
        const errorMsg: string = 'sectIntitule code obligatoire !';
        const newField: Field = { value: formN.sectIntitule.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ sectIntitule: newField } };
        setBorderColorSectIntitule("red");
      } else {
        const newField: Field = { value: formN.sectIntitule.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ sectIntitule: newField } };
        setBorderColorSectIntitule("");
      }

      // Chapitre
      if(!formN.chapCode.value || formN.chapCode.value.length !== 2) {
        const errorMsg: string = 'chapCode code obligatoire !';
        const newField: Field = { value: formN.chapCode.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ chapCode: newField } };
        setBorderColorChapCode("red");
      } else {
        const newField: Field = { value: formN.chapCode.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ chapCode: newField } };
        setBorderColorChapCode("");
      }

      if(!formN.chapIntitule.value) {
        const errorMsg: string = 'chapIntitule code obligatoire !';
        const newField: Field = { value: formN.chapIntitule.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ chapIntitule: newField } };
        setBorderColorChapIntitule("red");
      } else {
        const newField: Field = { value: formN.chapIntitule.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ chapIntitule: newField } };
        setBorderColorChapIntitule("");
      }

      // Article
      if(!formN.artCode.value || formN.artCode.value.length !== 3) {
        const errorMsg: string = 'artCode code obligatoire !';
        const newField: Field = { value: formN.artCode.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ artCode: newField } };
        setBorderColorArtCode("red");
      } else {
        const newField: Field = { value: formN.artCode.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ artCode: newField } };
        setBorderColorArtCode("");
      }

      if(!formN.artIntitule.value) {
        const errorMsg: string = 'artIntitule code obligatoire !';
        const newField: Field = { value: formN.artIntitule.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ artIntitule: newField } };
        setBorderColorArtIntitule("red");
      } else {
        const newField: Field = { value: formN.artIntitule.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ artIntitule: newField } };
        setBorderColorArtIntitule("");
      }

      // Paragraphe
      if(!formN.paragCode.value || formN.paragCode.value.length !== 4) {
        const errorMsg: string = 'paragCode code obligatoire !';
        const newField: Field = { value: formN.paragCode.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ paragCode: newField } };
        setBorderColorParagCode("red");
      } else {
        const newField: Field = { value: formN.paragCode.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ paragCode: newField } };
        setBorderColorParagCode("");
      }

      if(!formN.paragIntitule.value) {
        const errorMsg: string = 'paragIntitule code obligatoire !';
        const newField: Field = { value: formN.paragIntitule.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ paragIntitule: newField } };
        setBorderColorParagIntitule("red");
      } else {
        const newField: Field = { value: formN.paragIntitule.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ paragIntitule: newField } };
        setBorderColorParagIntitule("");
      }

      // Rubrique
      if(formN.rubCode.value.length !== 5 && formN.rubCode.value.length !== 6) {
        const errorMsg: string = 'rubCode code obligatoire !';
        const newField: Field = { value: formN.rubCode.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ rubCode: newField } };
        setBorderColorRubCode("red");
      } else {
        const newField: Field = { value: formN.rubCode.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ rubCode: newField } };
        setBorderColorRubCode("");
      }

      if(!formN.rubIntitule.value) {
        const errorMsg: string = 'rubIntitule code obligatoire !';
        const newField: Field = { value: formN.rubIntitule.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ rubIntitule: newField } };
        setBorderColorRubIntitule("red");
      } else {
        const newField: Field = { value: formN.rubIntitule.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ rubIntitule: newField } };
        setBorderColorRubIntitule("");
      }

      setFormN(newForm);
      return  newForm.sectCode.isValid && newForm.chapCode.isValid && newForm.artCode.isValid && newForm.paragCode.isValid && newForm.rubCode.isValid
      && newForm.sectIntitule.isValid && newForm.chapIntitule.isValid && newForm.artIntitule.isValid && newForm.paragIntitule.isValid && newForm.rubIntitule.isValid;
    }

    // SI C'EST UN PARAGRAPHE
    if (formN.paragCode.value) {
      // Section
      if(!formN.sectCode.value) {
        const errorMsg: string = 'Section code obligatoire !';
        const newField: Field = { value: formN.sectCode.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ sectCode: newField } };
        setBorderColorSectCode("red");
      } else {
        const newField: Field = { value: formN.sectCode.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ sectCode: newField } };
        setBorderColorSectCode("");
      }

      if(!formN.sectIntitule.value) {
        const errorMsg: string = 'sectIntitule code obligatoire !';
        const newField: Field = { value: formN.sectIntitule.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ sectIntitule: newField } };
        setBorderColorSectIntitule("red");
      } else {
        const newField: Field = { value: formN.sectIntitule.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ sectIntitule: newField } };
        setBorderColorSectIntitule("");
      }

      // Chapitre
      if(!formN.chapCode.value || formN.chapCode.value.length !== 2) {
        const errorMsg: string = 'chapCode code obligatoire !';
        const newField: Field = { value: formN.chapCode.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ chapCode: newField } };
        setBorderColorChapCode("red");
      } else {
        const newField: Field = { value: formN.chapCode.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ chapCode: newField } };
        setBorderColorChapCode("");
      }

      if(!formN.chapIntitule.value) {
        const errorMsg: string = 'chapIntitule code obligatoire !';
        const newField: Field = { value: formN.chapIntitule.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ chapIntitule: newField } };
        setBorderColorChapIntitule("red");
      } else {
        const newField: Field = { value: formN.chapIntitule.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ chapIntitule: newField } };
        setBorderColorChapIntitule("");
      }

      // Article
      if(!formN.artCode.value || formN.artCode.value.length !== 3) {
        const errorMsg: string = 'artCode code obligatoire !';
        const newField: Field = { value: formN.artCode.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ artCode: newField } };
        setBorderColorArtCode("red");
      } else {
        const newField: Field = { value: formN.artCode.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ artCode: newField } };
        setBorderColorArtCode("");
      }

      if(!formN.artIntitule.value) {
        const errorMsg: string = 'artIntitule code obligatoire !';
        const newField: Field = { value: formN.artIntitule.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ artIntitule: newField } };
        setBorderColorArtIntitule("red");
      } else {
        const newField: Field = { value: formN.artIntitule.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ artIntitule: newField } };
        setBorderColorArtIntitule("");
      }

      // Paragraphe
      if(formN.paragCode.value.length !== 4) {
        const errorMsg: string = 'paragCode code obligatoire !';
        const newField: Field = { value: formN.paragCode.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ paragCode: newField } };
        setBorderColorParagCode("red");
      } else {
        const newField: Field = { value: formN.paragCode.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ paragCode: newField } };
        setBorderColorParagCode("");
      }

      if(!formN.paragIntitule.value) {
        const errorMsg: string = 'paragIntitule code obligatoire !';
        const newField: Field = { value: formN.paragIntitule.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ paragIntitule: newField } };
        setBorderColorParagIntitule("red");
      } else {
        const newField: Field = { value: formN.paragIntitule.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ paragIntitule: newField } };
        setBorderColorParagIntitule("");
      }

      setFormN(newForm);
      return  newForm.sectCode.isValid && newForm.chapCode.isValid && newForm.artCode.isValid && newForm.paragCode.isValid
      && newForm.sectIntitule.isValid && newForm.chapIntitule.isValid && newForm.artIntitule.isValid && newForm.paragIntitule.isValid;
    }

    // SI C'EST UN ARTICLE
    if (formN.artCode.value) {
      // Section
      if(!formN.sectCode.value) {
        const errorMsg: string = 'Section code obligatoire !';
        const newField: Field = { value: formN.sectCode.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ sectCode: newField } };
        setBorderColorSectCode("red");
      } else {
        const newField: Field = { value: formN.sectCode.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ sectCode: newField } };
        setBorderColorSectCode("");
      }

      if(!formN.sectIntitule.value) {
        const errorMsg: string = 'sectIntitule code obligatoire !';
        const newField: Field = { value: formN.sectIntitule.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ sectIntitule: newField } };
        setBorderColorSectIntitule("red");
      } else {
        const newField: Field = { value: formN.sectIntitule.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ sectIntitule: newField } };
        setBorderColorSectIntitule("");
      }

      // Chapitre
      if(!formN.chapCode.value || formN.chapCode.value.length !== 2) {
        const errorMsg: string = 'chapCode code obligatoire !';
        const newField: Field = { value: formN.chapCode.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ chapCode: newField } };
        setBorderColorChapCode("red");
      } else {
        const newField: Field = { value: formN.chapCode.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ chapCode: newField } };
        setBorderColorChapCode("");
      }

      if(!formN.chapIntitule.value) {
        const errorMsg: string = 'chapIntitule code obligatoire !';
        const newField: Field = { value: formN.chapIntitule.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ chapIntitule: newField } };
        setBorderColorChapIntitule("red");
      } else {
        const newField: Field = { value: formN.chapIntitule.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ chapIntitule: newField } };
        setBorderColorChapIntitule("");
      }

      // Article
      if(formN.artCode.value.length !== 3) {
        const errorMsg: string = 'artCode code obligatoire !';
        const newField: Field = { value: formN.artCode.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ artCode: newField } };
        setBorderColorArtCode("red");
      } else {
        const newField: Field = { value: formN.artCode.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ artCode: newField } };
        setBorderColorArtCode("");
      }

      if(!formN.artIntitule.value) {
        const errorMsg: string = 'artIntitule code obligatoire !';
        const newField: Field = { value: formN.artIntitule.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ artIntitule: newField } };
        setBorderColorArtIntitule("red");
      } else {
        const newField: Field = { value: formN.artIntitule.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ artIntitule: newField } };
        setBorderColorArtIntitule("");
      }

      setFormN(newForm);
      return  newForm.sectCode.isValid && newForm.chapCode.isValid && newForm.artCode.isValid
      && newForm.sectIntitule.isValid && newForm.chapIntitule.isValid && newForm.artIntitule.isValid;
    }

    // SI C'EST UN CHAPITRE
    if (formN.chapCode.value) {
      // Section
      if(!formN.sectCode.value) {
        const errorMsg: string = 'Section code obligatoire !';
        const newField: Field = { value: formN.sectCode.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ sectCode: newField } };
        setBorderColorSectCode("red");
      } else {
        const newField: Field = { value: formN.sectCode.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ sectCode: newField } };
        setBorderColorSectCode("");
      }

      if(!formN.sectIntitule.value) {
        const errorMsg: string = 'sectIntitule code obligatoire !';
        const newField: Field = { value: formN.sectIntitule.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ sectIntitule: newField } };
        setBorderColorSectIntitule("red");
      } else {
        const newField: Field = { value: formN.sectIntitule.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ sectIntitule: newField } };
        setBorderColorSectIntitule("");
      }

      // Chapitre
      if(formN.chapCode.value.length !== 2) {
        const errorMsg: string = 'chapCode code obligatoire !';
        const newField: Field = { value: formN.chapCode.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ chapCode: newField } };
        setBorderColorChapCode("red");
      } else {
        const newField: Field = { value: formN.chapCode.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ chapCode: newField } };
        setBorderColorChapCode("");
      }

      if(!formN.chapIntitule.value) {
        const errorMsg: string = 'chapIntitule code obligatoire !';
        const newField: Field = { value: formN.chapIntitule.value, error: errorMsg, isValid: false };
        newForm = { ...newForm, ...{ chapIntitule: newField } };
        setBorderColorChapIntitule("red");
      } else {
        const newField: Field = { value: formN.chapIntitule.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ chapIntitule: newField } };
        setBorderColorChapIntitule("");
      }

      setFormN(newForm);
      return  newForm.sectCode.isValid && newForm.chapCode.isValid
      && newForm.sectIntitule.isValid && newForm.chapIntitule.isValid;
    }

    // DONC IL S'AGIT D'UNE SECTION
    // Section
    if(!formN.sectCode.value) {
      const errorMsg: string = 'Section code obligatoire !';
      const newField: Field = { value: formN.sectCode.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ sectCode: newField } };
      setBorderColorSectCode("red");
    } else {
      const newField: Field = { value: formN.sectCode.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ sectCode: newField } };
      setBorderColorSectCode("");
    }

    if(!formN.sectIntitule.value) {
      const errorMsg: string = 'sectIntitule code obligatoire !';
      const newField: Field = { value: formN.sectIntitule.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ sectIntitule: newField } };
      setBorderColorSectIntitule("red");
    } else {
      const newField: Field = { value: formN.sectIntitule.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ sectIntitule: newField } };
      setBorderColorSectIntitule("");
    }

    setFormN(newForm);
    return  newForm.sectCode.isValid && newForm.sectIntitule.isValid;
  }

  const handleSubmitFormN = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formulaire invalide
    if(!validateFormN()) {
      Swal.fire({
        title: 'GesBud',
        text: "Veuillez renseigner les parties encadrées en rouge !",
        icon: 'warning',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
      });
      return;
    }

    if (operationN === 'add') addN();
    if (operationN === 'edit') editN(); 
  }

  const libelleOperationN = () => {
    if (operationN === 'add') return "Ajouter ligne budgétaire"
    if (operationN === 'edit') return "Modifier ligne budgétaire"
  }

  const libelleButtonSumbitN = () => {
    if (operationN === 'add') return "Enregistrer"
    if (operationN === 'edit') return "Enregistrer"
  }

  const handleAddN = () => {
    initFormN();
  }

  const handleEditN = (row: any) => {
    setOperationN('edit');
    
    if (row.section && row.chap === null && row.art === null && row.parag === null && row.rub === null) {
      setFormN({
        titre: { value: row.titre},
        sectCode: { value: row.section},
        sectIntitule: { value: getSection(row).intitule},
        sectNumNo: { value: getSection(row).numNo},
        sectDotEstExec: { value: getSection(row).dotEstExec},
        chapCode: { value: ''},
        chapIntitule: { value: ''},
        chapNumNo: { value: ''},
        chapDotEstExec: { value: ''},
        artCode: { value: ''},
        artIntitule: { value: ''},
        artNumNo: { value: ''},
        artDotEstExec: { value: ''},
        paragCode: { value: ''},
        paragIntitule: { value: ''},
        paragNumNo: { value: ''},
        paragDotEstExec: { value: ''},
        rubCode: { value: ''},
        rubIntitule: { value: ''},
        rubNumNo: { value: ''},
        rubDotEstExec: { value: ''}
      })

      setSectCodeDisabled(true);
      setSectIntituleDisabled(true);
      setSectDotEstExecDisabled(true);
      setChapCodeDisabled(true);
      setChapIntituleDisabled(true);
      setchapDotEstExecDisabled(true);
      setArtCodeDisabled(true);
      setArtIntituleDisabled(true);
      setArtDotEstExecDisabled(true);
      setParagCodeDisabled(true);
      setParagIntituleDisabled(true);
      setParagDotEstExecDisabled(true);
      setRubCodeDisabled(true);
      setRubIntituleDisabled(true);
      setRubDotEstExecDisabled(true);
    }

    if (row.section && row.chap && row.art === null && row.parag === null && row.rub === null) {
      setFormN({
        titre: { value: row.titre},
        sectCode: { value: row.section},
        sectIntitule: { value: getSection(row).intitule},
        sectNumNo: { value: getSection(row).numNo},
        sectDotEstExec: { value: getSection(row).dotEstExec},
        chapCode: { value: row.chap},
        chapIntitule: { value: getChapitre(row).intitule},
        chapNumNo: { value: getChapitre(row).numNo},
        chapDotEstExec: { value: getChapitre(row).dotEstExec},
        artCode: { value: ''},
        artIntitule: { value: ''},
        artNumNo: { value: ''},
        artDotEstExec: { value: ''},
        paragCode: { value: ''},
        paragIntitule: { value: ''},
        paragNumNo: { value: ''},
        paragDotEstExec: { value: ''},
        rubCode: { value: ''},
        rubIntitule: { value: ''},
        rubNumNo: { value: ''},
        rubDotEstExec: { value: ''}
      })

      setSectCodeDisabled(true);
      setSectIntituleDisabled(true);
      setSectDotEstExecDisabled(true);
      setChapCodeDisabled(true);
      setChapIntituleDisabled(false);
      setchapDotEstExecDisabled(false);
      setArtCodeDisabled(true);
      setArtIntituleDisabled(true);
      setArtDotEstExecDisabled(true);
      setParagCodeDisabled(true);
      setParagIntituleDisabled(true);
      setParagDotEstExecDisabled(true);
      setRubCodeDisabled(true);
      setRubIntituleDisabled(true);
      setRubDotEstExecDisabled(true);
    }

    if (row.section && row.chap && row.art && row.parag === null && row.rub === null) {
      setFormN({
        titre: { value: row.titre},
        sectCode: { value: row.section},
        sectIntitule: { value: getSection(row).intitule},
        sectNumNo: { value: getSection(row).numNo},
        sectDotEstExec: { value: getSection(row).dotEstExec},
        chapCode: { value: row.chap},
        chapIntitule: { value: getChapitre(row).intitule},
        chapNumNo: { value: getChapitre(row).numNo},
        chapDotEstExec: { value: getChapitre(row).dotEstExec},
        artCode: { value: row.art},
        artIntitule: { value: getArticle(row).intitule},
        artNumNo: { value: getArticle(row).numNo},
        artDotEstExec: { value: getArticle(row).dotEstExec},
        paragCode: { value: ''},
        paragIntitule: { value: ''},
        paragNumNo: { value: ''},
        paragDotEstExec: { value: ''},
        rubCode: { value: ''},
        rubIntitule: { value: ''},
        rubNumNo: { value: ''},
        rubDotEstExec: { value: ''}
      })

      setSectCodeDisabled(true);
      setSectIntituleDisabled(true);
      setSectDotEstExecDisabled(true);
      setChapCodeDisabled(true);
      setChapIntituleDisabled(false);
      setchapDotEstExecDisabled(false);
      setArtCodeDisabled(true);
      setArtIntituleDisabled(false);
      setArtDotEstExecDisabled(false);
      setParagCodeDisabled(true);
      setParagIntituleDisabled(true);
      setParagDotEstExecDisabled(true);
      setRubCodeDisabled(true);
      setRubIntituleDisabled(true);
      setRubDotEstExecDisabled(true);
    }

    if (row.section && row.chap && row.art && row.parag && row.rub === null) {
      setFormN({
        titre: { value: row.titre},
        sectCode: { value: row.section},
        sectIntitule: { value: getSection(row).intitule},
        sectNumNo: { value: getSection(row).numNo},
        sectDotEstExec: { value: getSection(row).dotEstExec},
        chapCode: { value: row.chap},
        chapIntitule: { value: getChapitre(row).intitule},
        chapNumNo: { value: getChapitre(row).numNo},
        chapDotEstExec: { value: getChapitre(row).dotEstExec},
        artCode: { value: row.art},
        artIntitule: { value: getArticle(row).intitule},
        artNumNo: { value: getArticle(row).numNo},
        artDotEstExec: { value: getArticle(row).dotEstExec},
        paragCode: { value: row.parag},
        paragIntitule: { value: getParag(row).intitule},
        paragNumNo: { value: getParag(row).numNo},
        paragDotEstExec: { value: getParag(row).dotEstExec},
        rubCode: { value: ''},
        rubIntitule: { value: ''},
        rubNumNo: { value: ''},
        rubDotEstExec: { value: ''}
      })

      setSectCodeDisabled(true);
      setSectIntituleDisabled(true);
      setSectDotEstExecDisabled(true);
      setChapCodeDisabled(true);
      setChapIntituleDisabled(false);
      setchapDotEstExecDisabled(false);
      setArtCodeDisabled(true);
      setArtIntituleDisabled(false);
      setArtDotEstExecDisabled(false);
      setParagCodeDisabled(true);
      setParagIntituleDisabled(false);
      setParagDotEstExecDisabled(false);
      setRubCodeDisabled(true);
      setRubIntituleDisabled(true);
      setRubDotEstExecDisabled(true);
    }

    if (row.section && row.chap && row.art && row.parag && row.rub) {
      setFormN({
        titre: { value: row.titre},
        sectCode: { value: row.section},
        sectIntitule: { value: getSection(row).intitule},
        sectNumNo: { value: getSection(row).numNo},
        sectDotEstExec: { value: getSection(row).dotEstExec},
        chapCode: { value: row.chap},
        chapIntitule: { value: getChapitre(row).intitule},
        chapNumNo: { value: getChapitre(row).numNo},
        chapDotEstExec: { value: getChapitre(row).dotEstExec},
        artCode: { value: row.art},
        artIntitule: { value: getArticle(row).intitule},
        artNumNo: { value: getArticle(row).numNo},
        artDotEstExec: { value: getArticle(row).dotEstExec},
        paragCode: { value: row.parag},
        paragIntitule: { value: getParag(row).intitule},
        paragNumNo: { value: getParag(row).numNo},
        paragDotEstExec: { value: getParag(row).dotEstExec},
        rubCode: { value: row.rub},
        rubIntitule: { value: getRub(row).intitule},
        rubNumNo: { value: getRub(row).numNo},
        rubDotEstExec: { value: getRub(row).dotEstExec}
      })

      setSectCodeDisabled(true);
      setSectIntituleDisabled(true);
      setSectDotEstExecDisabled(true);
      setChapCodeDisabled(true);
      setChapIntituleDisabled(false);
      setchapDotEstExecDisabled(false);
      setArtCodeDisabled(true);
      setArtIntituleDisabled(false);
      setArtDotEstExecDisabled(false);
      setParagCodeDisabled(true);
      setParagIntituleDisabled(false);
      setParagDotEstExecDisabled(false);
      setRubCodeDisabled(true);
      setRubIntituleDisabled(false);
      setRubDotEstExecDisabled(false);
    }
  }

  const handleDeleteN = (row: any) => {
    setRowToDelete(row)
    initFormN()
    Swal.fire({
      title: 'GesBud',
      text: "Supprimer cet enregistrement ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      allowOutsideClick: false,
      confirmButtonColor: '#007E33' 
    }).then( async (result) => {
      if (result.isConfirmed) {
        const subdivise = estSubdivise(row);
        const utilise = await estUtiliseDansBudget(row);
        if (subdivise || utilise) {
          okWarnignDialog("Cette ligne ne peut pas etre supprimé car elle est : soit utilisée dans un budget; soit subdivisée.")
        } else {
          handleShowModalMotPasseConnexion()
        }
      }
    });
  }

  const addN = async () => {
    let addSuccess: boolean = false;

    if (formN.sectCode.value && formN.sectIntitule.value) {
      let section: NomenclatureDRequestDto = emptyNomenclatureDRequestDto;
      section.titre = formN.titre.value;
      section.section = formN.sectCode.value;
      section.chap = null;
      section.art = null;
      section.parag = null;
      section.rub = null;
      section.intitule = formN.sectIntitule.value;
      section.dotEstExec = formN.sectDotEstExec.value;
      let sectionExist = await NomenclatureDService.exists(section);
      if (!sectionExist) {
        await NomenclatureDService.add(section);
        addSuccess = true;
      } else {
        addSuccess = false;
      }        
    }

    if (formN.chapCode.value && formN.chapIntitule.value) {
      let chapitre: NomenclatureDRequestDto = emptyNomenclatureDRequestDto;
      chapitre.titre = formN.titre.value;
      chapitre.section = formN.sectCode.value;
      chapitre.chap = formN.chapCode.value;
      chapitre.art = null;
      chapitre.parag = null;
      chapitre.rub = null;
      chapitre.intitule = formN.chapIntitule.value;
      chapitre.dotEstExec = formN.chapDotEstExec.value;
      let chapitreExist = await NomenclatureDService.exists(chapitre);
      if (!chapitreExist) {
        await NomenclatureDService.add(chapitre);
        addSuccess = true;
      } else {
        addSuccess = false;
      }
    }

    if (formN.artCode.value && formN.artIntitule.value) {
      let article: NomenclatureDRequestDto = emptyNomenclatureDRequestDto;
      article.titre = formN.titre.value;
      article.section = formN.sectCode.value;
      article.chap = formN.chapCode.value;
      article.art = formN.artCode.value;
      article.parag = null;
      article.rub = null;
      article.intitule = formN.artIntitule.value;
      article.dotEstExec = formN.artDotEstExec.value;
      let articleExist = await NomenclatureDService.exists(article);
      if (!articleExist) {
        await NomenclatureDService.add(article);
        addSuccess = true;
      } else {
        addSuccess = false;
      }
    }

    if (formN.paragCode.value && formN.paragIntitule.value) {
      let paragraphe: NomenclatureDRequestDto = emptyNomenclatureDRequestDto;
      paragraphe.titre = formN.titre.value;
      paragraphe.section = formN.sectCode.value;
      paragraphe.chap = formN.chapCode.value;
      paragraphe.art = formN.artCode.value;
      paragraphe.parag = formN.paragCode.value;
      paragraphe.rub = null;
      paragraphe.intitule = formN.paragIntitule.value;
      paragraphe.dotEstExec = formN.paragDotEstExec.value;
      let paragrapheExist = await NomenclatureDService.exists(paragraphe);
      if (!paragrapheExist) {
        await NomenclatureDService.add(paragraphe);
        addSuccess = true;
      } else {
        addSuccess = false;
      }
    }

    if (formN.rubCode.value && formN.rubIntitule.value) {
      let rubrique: NomenclatureDRequestDto = emptyNomenclatureDRequestDto;
      rubrique.titre = formN.titre.value;
      rubrique.section = formN.sectCode.value;
      rubrique.chap = formN.chapCode.value;
      rubrique.art = formN.artCode.value;
      rubrique.parag = formN.paragCode.value;
      rubrique.rub = formN.rubCode.value;
      rubrique.intitule = formN.rubIntitule.value;
      rubrique.dotEstExec = formN.rubDotEstExec.value;
      let rubriqueExist = await NomenclatureDService.exists(rubrique);
      if (!rubriqueExist) {
        await NomenclatureDService.add(rubrique);
        addSuccess = true;
      } else {
        addSuccess = false;
      }
    }

    if (addSuccess === true) {
      Swal.fire({
        title: 'GesBud',
        text: "Comptes budgétaire ajouté avec succès !",
        icon: 'success',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        confirmButtonColor: '#007E33' 
      }).then( (result) => {
        if (result.isConfirmed) {
          addSuccess = false;
          getNomenclatures()
          initFormN()
        }
      });
    } else {
      okWarnignDialog("Ce compte existe déja");
    }  
  }

  const editN = () => {

    if (formN.chapCode.value) {
      let chapitre: NomenclatureDRequestDto = emptyNomenclatureDRequestDto;
      chapitre.intitule = formN.chapIntitule.value;
      chapitre.dotEstExec = formN.chapDotEstExec.value;
      NomenclatureDService.edit(formN.chapNumNo.value, chapitre).then(data => {
      })
    }

    if (formN.artCode.value) {
      let article: NomenclatureDRequestDto = emptyNomenclatureDRequestDto;
      article.intitule = formN.artIntitule.value;
      article.dotEstExec = formN.artDotEstExec.value;
      NomenclatureDService.edit(formN.artNumNo.value, article).then(data => {
      })
    }

    if (formN.paragCode.value) {
      let paragraphe: NomenclatureDRequestDto = emptyNomenclatureDRequestDto;
      paragraphe.intitule = formN.paragIntitule.value;
      paragraphe.dotEstExec = formN.paragDotEstExec.value;
      NomenclatureDService.edit(formN.paragNumNo.value, paragraphe).then(data => {
      })
    }

    if (formN.rubCode.value) {
      let rubrique: NomenclatureDRequestDto = emptyNomenclatureDRequestDto;
      rubrique.intitule = formN.rubIntitule.value;
      rubrique.dotEstExec = formN.rubDotEstExec.value;
      NomenclatureDService.edit(formN.rubNumNo.value, rubrique).then(data => {
      })
    }

    okSuccessDialog("Comptes budgétaire modifié avec succès !");
    getNomenclatures();
  }

  useEffect(() => {
    initFormN();
    getNomenclatures();
    getAccesCodeCourante();
    sectCodeRef.current?.focus();
  }, [])

  const getNomenclatures = () => {
    NomenclatureDService.getRecettesEtDepenses().then(data => {
      setNomenclatures(data)
      const results = data.filter(item => {
        return (item.titre.includes(formR.titreR.value))
        && (item.section.includes(formR.sectionR.value))
        && ((item.chap || '').toString().includes(formR.chapitreR.value))
        && ((item.art || '').toString().includes(formR.articleR.value))
        && ((item.parag || '').toString().includes(formR.paragrapheR.value))
        && ((item.rub || '').toString().includes(formR.rubriqueR.value))
      })
      setFilteredNomenclatures(results);      
    })
  }

  const getSection = (row: any): NomenclatureDResponseDto => {
    const nomenclature = nomenclatures.find(item => {
      return item.titre === row.titre && item.section === row.section && item.chap === null  && item.art === null && item.parag === null && item.rub === null
    })
    return nomenclature;
  }

  const getChapitre = (row: any): NomenclatureDResponseDto => {
    const nomenclature = nomenclatures.find(item => {
      return item.titre === row.titre && item.section === row.section && item.chap === row.chap  && item.art === null && item.parag === null && item.rub === null
    })
    return nomenclature;
  }

  const getArticle = (row: any): NomenclatureDResponseDto => {
    const nomenclature = nomenclatures.find(item => {
      return item.titre === row.titre && item.section === row.section && item.chap === row.chap  && item.art === row.art && item.parag === null && item.rub === null
    })
    return nomenclature;
  }

  const getParag = (row: any): NomenclatureDResponseDto => {
    const nomenclature = nomenclatures.find(item => {
      return item.titre === row.titre && item.section === row.section && item.chap === row.chap  && item.art === row.art && item.parag === row.parag && item.rub === null
    })
    return nomenclature;
  }

  const getRub = (row: any): NomenclatureDResponseDto => {
    const nomenclature = nomenclatures.find(item => {
      return item.titre === row.titre && item.section === row.section && item.chap === row.chap  && item.art === row.art && item.parag === row.parag && item.rub === row.rub
    })
    return nomenclature;
  }

  const handleInputChangeFormR = (e: any): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };
    setFormR({ ...formR, ...newField})
  }

  useEffect(() => {
      const results = nomenclatures.filter(item => {
        return (item.titre.includes(formR.titreR.value))
        && (item.section.includes(formR.sectionR.value))
        && ((item.chap || '').toString().includes(formR.chapitreR.value))
        && ((item.art || '').toString().includes(formR.articleR.value))
        && ((item.parag || '').toString().includes(formR.paragrapheR.value))
        && ((item.rub || '').toString().includes(formR.rubriqueR.value))
      })
      setFilteredNomenclatures(results);
  }, [formR])

  const handleCloseModalMotPasseConnexion = () => {
    setShowModalMotPasseConnexion(false);
  }

  const handleShowModalMotPasseConnexion = () => {
    setShowModalMotPasseConnexion(true);
  }

  const handleMotPasseCourantInputChange = (e: any): void => {
    setMotPasseCourant(e.target.value);
  }

  const getAccesCodeCourante = () => {
    AccesCodeService.get(ConnectedUser()).then( data => {
      setAccesCodeCourante(data)
    });
  }

  const handleConfirmerSuppression = () => {
    bcrypt.compare(motPasseCourant, accesCodeCourante.motDePasse).then( res => {
      if (!res) {
        okWarnignDialog("Mot de passe incorrect !")
      } else {
        // DELETE NOMENCLATURE BUDGETAIRE
        NomenclatureDService.delete(rowToDelete.numNo).then(res => {
          getNomenclatures()
          handleCloseModalMotPasseConnexion()
          setMotPasseCourant("")
          okSuccessDialog("Ligne budgétaire supprimé avec succès !")
        })
      }
    })    
  }

  const estSubdivise = (row: NomenclatureDResponseDto): Boolean => {
    let res = false;
    if (row.section && row.chap === null && row.art === null && row.parag === null && row.rub === null) {
      const results = nomenclatures.filter(item => {
        return item.titre.includes(row.titre) && item.section.includes(row.section)
      })
      res = (results.length > 1)? true : false;
    }

    if (row.section && row.chap && row.art === null && row.parag === null && row.rub === null) {
      const results = nomenclatures.filter(item => {
        return (item.titre.includes(row.titre))
        && (item.section.includes(row.section))
        && ((item.chap || '').toString().includes(row.chap))
      })
      res = (results.length > 1)? true : false;
    }

    if (row.section && row.chap && row.art && row.parag === null && row.rub === null) {
      const results = nomenclatures.filter(item => {
        return (item.titre.includes(row.titre))
        && (item.section.includes(row.section))
        && ((item.chap || '').toString().includes(row.chap))
        && ((item.art || '').toString().includes(row.art))
      })
      res = (results.length > 1)? true : false;
    }

    if (row.section && row.chap && row.art && row.parag && row.rub === null) {
      const results = nomenclatures.filter(item => {
        return (item.titre.includes(row.titre))
        && (item.section.includes(row.section))
        && ((item.chap || '').toString().includes(row.chap))
        && ((item.art || '').toString().includes(row.art))
        && ((item.parag || '').toString().includes(row.parag))
      })
      res = (results.length > 1)? true : false;
    }

    if (row.section && row.chap && row.art && row.parag && row.rub) {
      const results = nomenclatures.filter(item => {
        return (item.titre.includes(row.titre))
        && (item.section.includes(row.section))
        && ((item.chap || '').toString().includes(row.chap))
        && ((item.art || '').toString().includes(row.art))
        && ((item.parag || '').toString().includes(row.parag))
        && ((item.rub || '').toString().includes(row.rub))
      })
      res = (results.length > 1)? true : false;
    }
    
    return res;
  }

  const estUtiliseDansBudget = async (row: NomenclatureDResponseDto): Promise<boolean> => {
    const data = await BudgetService.getByNumNo(row.numNo);
    return data.length !== 0;
  }

  ///////////////// GESTION EDITER NOMENCLATURE
  const handleEditerNomenclatureButtonClick = () => {
    let report: Report = emptyReport;
    report.name = "fiche_nomenclature_budgetaire";
    report.params = [
      {key: "TITRE", value: formR.titreR.value},
      {key: "SECTION", value: formR.sectionR.value},
      {key: "CHAP", value: formR.chapitreR.value},
      {key: "ART", value: formR.articleR.value},
      {key: "PARAG", value: formR.paragrapheR.value},
      {key: "RUB", value: formR.rubriqueR.value}
    ];
    ReportService.createReport(report)
      .then(pdfBlob => {
        setPdfBlob(pdfBlob);
        setShowPdfViewer(true);
        setPdfNameForDownload("fiche_nomenclature_budgetaire");
      })
      .catch(error => {
        okWarnignDialog("Erreur lors de l'impression");
      }); 
  }  
  ///////////////// GESTION EDITER NOMENCLATURE  

  return (
    <Container>
          <div className="mt-1 p-1">
            <h6 className="shadow-sm text-primary text-center rounded">PARAMETRES &gt; NOMENCLATURE BUDGETAIRE &gt; METTRE A JOUR LES COMPTES BUDGETAIRES</h6>
            <Form onSubmit={(e) => handleSubmitFormN(e)}>
              <Card className="mb-3">
                <Card.Header className='p-1'>
                { libelleOperationN() }
                </Card.Header>
                <Card.Body className='p-1'>
                  <Form.Group controlId="titre" as={Row} className="text-center">
                    <Col xs={4}></Col>
                    <Col xs={2}><Form.Label className="label2"><b>BUDGET TITRE :</b></Form.Label></Col>
                    <Col>
                      <Form.Select name='titre' value={formN.titre.value} onChange={e => handleInputChangeFormN(e)} size='sm' style={{fontSize:"0.72em"}}>
                        <option value='1'>RECETTES</option> 
                        <option value='2'>DEPENSES</option> 
                      </Form.Select>
                    </Col>
                    <Col xs={4}></Col>
                  </Form.Group>
                  <Table responsive bordered variant="" size="sm" className='mb-0'>
                    <thead className=''>
                        <tr>
                            <th style={{width:"120px"}}></th>
                            <th style={{width:"120px"}}>Code</th>
                            <th>Intitulé</th>
                            <th style={{width:"120px"}}>Dot=Exéc</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><b>Section</b></td>
                            <td className='p-0'><Form.Control name="sectCode" ref={sectCodeRef} value={formN.sectCode.value} size='sm' type="number" style={{ borderColor: borderColorSectCode }} onChange={e => handleInputChangeFormN(e)} disabled={sectCodeDisabled} /></td>
                            <td className='p-0'><Form.Control name="sectIntitule" value={formN.sectIntitule.value}  size='sm' type="text" autoComplete='off' style={{ borderColor: borderColorSectIntitule }} onChange={e => handleInputChangeFormN(e)} disabled={sectIntituleDisabled} /></td>
                            <td className='text-center'><Form.Check type='checkbox' name='sectDotEstExec' aria-label="" checked={formN.sectDotEstExec.value} onChange={e => handleDotEstExecInputChangeFormN(e)} disabled={sectDotEstExecDisabled}  /></td>
                        </tr>
                        <tr>
                            <td><b>Chapitre</b></td>
                            <td className='p-0'><Form.Control name="chapCode" value={formN.chapCode.value} size='sm' type="number" style={{ borderColor: borderColorChapCode }} onChange={e => handleInputChangeFormN(e)} disabled={chapCodeDisabled}  /></td>
                            <td className='p-0'><Form.Control name="chapIntitule" value={formN.chapIntitule.value} size='sm' type="text" autoComplete='off' style={{ borderColor: borderColorChapIntitule }} onChange={e => handleInputChangeFormN(e)} disabled={chapIntituleDisabled} /></td>
                            <td className='text-center'><Form.Check type='checkbox' name='chapDotEstExec' aria-label="" checked={formN.chapDotEstExec.value} onChange={e => handleDotEstExecInputChangeFormN(e)} disabled={chapDotEstExecDisabled}  /></td>
                        </tr>
                        <tr>
                            <td><b>Article</b></td>
                            <td className='p-0'><Form.Control name="artCode" value={formN.artCode.value} size='sm' type="number" style={{ borderColor: borderColorArtCode }} onChange={e => handleInputChangeFormN(e)} onFocus={() => handleAutoCompleteCode("artCode")} disabled={artCodeDisabled}  /></td>
                            <td className='p-0'><Form.Control name="artIntitule" value={formN.artIntitule.value} size='sm' type="text" autoComplete='off' style={{ borderColor: borderColorArtIntitule }} onChange={e => handleInputChangeFormN(e)} disabled={artIntituleDisabled}  /></td>
                            <td className='text-center'><Form.Check type='checkbox' name='artDotEstExec' aria-label="" checked={formN.artDotEstExec.value} onChange={e => handleDotEstExecInputChangeFormN(e)} disabled={artDotEstExecDisabled}  /></td>
                        </tr>
                        <tr>
                            <td><b>Paragraphe</b></td>
                            <td className='p-0'><Form.Control name="paragCode" value={formN.paragCode.value} size='sm' type="number" style={{ borderColor: borderColorParagCode }} onChange={e => handleInputChangeFormN(e)} onFocus={() => handleAutoCompleteCode("paragCode")} disabled={paragCodeDisabled}  /></td>
                            <td className='p-0'><Form.Control name="paragIntitule" value={formN.paragIntitule.value} size='sm' type="text" autoComplete='off' style={{ borderColor: borderColorParagIntitule }} onChange={e => handleInputChangeFormN(e)} disabled={paragIntituleDisabled}  /></td>
                            <td className='text-center'><Form.Check type='checkbox' name='paragDotEstExec' aria-label="" checked={formN.paragDotEstExec.value} onChange={e => handleDotEstExecInputChangeFormN(e)} disabled={paragDotEstExecDisabled}  /></td>
                        </tr>
                        <tr>
                            <td><b>Rubrique</b></td>
                            <td className='p-0'><Form.Control name="rubCode" value={formN.rubCode.value} size='sm' type="number" style={{ borderColor: borderColorRubCode }} onChange={e => handleInputChangeFormN(e)} onFocus={() => handleAutoCompleteCode("rubCode")} disabled={rubCodeDisabled}  /></td>
                            <td className='p-0'><Form.Control name="rubIntitule" value={formN.rubIntitule.value} size='sm' type="text" autoComplete='off' style={{ borderColor: borderColorRubIntitule }} onChange={e => handleInputChangeFormN(e)} disabled={rubIntituleDisabled}  /></td>
                            <td className='text-center'><Form.Check type='checkbox' name='rubDotEstExec' aria-label="" checked={formN.rubDotEstExec.value} onChange={e => handleDotEstExecInputChangeFormN(e)} disabled={rubDotEstExecDisabled}  /></td>
                        </tr>
                    </tbody>
                  </Table>                 
                </Card.Body>
                <Card.Footer className='p-1'>
                  <Button size='sm' variant='outline-success' type='submit' style={{width: "100px"}}>{ libelleButtonSumbitN() }</Button>
                  <Button size='sm' variant="outline-success" title="Ajouter Nouveau" className='ms-1' style={{width: "100px"}} onClick={ () => handleAddN()}><BsPlusLg /></Button>
                </Card.Footer>
              </Card>
            </Form>  

            <Card>
                <Card.Body className='p-1'>
                  <DataTable
                    customStyles={costumeStyles}
                    columns={tableNomenclatureColumns}
                    data={filteredNomenclatures}
                    noDataComponent={"Il n'y à pas d'enregistrement à afficher"}
                    fixedHeader
                    responsive
                    striped
                    highlightOnHover
                    subHeader
                    subHeaderComponent={   
                      <Row className='w-100'>
                        <ButtonGroup as={Col} size="sm">
                          <Form.Select name='titreR' value={formR.titreR.value} onChange={e => handleInputChangeFormR(e)} size='sm' className='me-1' style={{width:"100px"}}>
                            <option value='1'>RECETTES</option> 
                            <option value='2'>DEPENSES</option> 
                          </Form.Select>
                          <Form.Control name="sectionR" value={formR.sectionR.value}  size='sm' type="number" placeholder='section' onChange={e => handleInputChangeFormR(e)} className='me-1' style={{width:"100px"}}  />
                          <Form.Control name="chapitreR" value={formR.chapitreR.value}  size='sm' type="number" placeholder='chapitre' onChange={e => handleInputChangeFormR(e)} className='me-1' style={{width:"100px"}}  />
                          <Form.Control name="articleR" value={formR.articleR.value}  size='sm' type="number" placeholder='article' onChange={e => handleInputChangeFormR(e)} className='me-1' style={{width:"100px"}}  />
                          <Form.Control name="paragrapheR" value={formR.paragrapheR.value}  size='sm' type="number" placeholder='paragraphe' onChange={e => handleInputChangeFormR(e)} className='me-1' style={{width:"100px"}}  />
                          <Form.Control name="rubriqueR" value={formR.rubriqueR.value}  size='sm' type="number" placeholder='rubrique' onChange={e => handleInputChangeFormR(e)} className='me-1' style={{width:"100px"}}  />
                        </ButtonGroup>
                        <Col className='text-end'>
                          <Button variant="outline-primary" size='sm' title="Imprimer" style={{width:"60px", maxHeight:"30px"}} onClick={ () => handleEditerNomenclatureButtonClick()} disabled={filteredNomenclatures.length === 0}><LocalPrintshopIcon /></Button>
                        </Col>
                      </Row>                    
                    }
                    />
                </Card.Body>
              </Card> 

              {/* MOT DE PASSE DE CONNEXION */}
              <Modal show={showModalMotPasseConnexion} onHide={handleCloseModalMotPasseConnexion} backdrop="static" keyboard={false}>
                <Modal.Header className='p-1'>
                    <Modal.Title as="h6"></Modal.Title>
                </Modal.Header>

                <Modal.Body className='p-2'>
                  <Form.Group className="" controlId="motPasseCourant">
                    <Form.Label className="label2">Mot de passe de connexion</Form.Label>
                    <Form.Control name="motPasseCourant" size='sm' type="password" value={motPasseCourant} onChange={e => handleMotPasseCourantInputChange(e)} autoFocus />
                  </Form.Group>
                </Modal.Body>

                <Modal.Footer className='p-1'>
                  <Button variant="outline-success" size='sm' onClick={handleConfirmerSuppression}>OK</Button>
                  <Button variant="outline-danger" size='sm' onClick={handleCloseModalMotPasseConnexion}>Fermer</Button>
                </Modal.Footer>
              </Modal>

              {/* PDF VIEWER */}
              { showPdfViewer && <PdfViewer blob={pdfBlob} name={pdfNameForDownload} />}
          </div>
      </Container>
  );
};

export default MajLesComptesBudgetairesNomenclatureBudgetaireForm;
