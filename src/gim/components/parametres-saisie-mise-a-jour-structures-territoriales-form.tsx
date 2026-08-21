// //Aristide
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { emptyRegionRequestDto, emptyRegionResponseDto, RegionRequestDto, RegionResponseDto } from "../models/region";
import { emptyProvinceResponseDto, ProvinceResponseDto } from "../models/province";
import { DepartementResponseDto, emptyDepartementResponseDto } from "../models/departement";
import RegionService from "../services/region-service";
import ProvinceService from "../services/province-service";
import DepartementService from "../services/departement-service";
import DataTable from "react-data-table-component";
import SaveSharpIcon from '@mui/icons-material/SaveSharp';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import { okSuccessDialog, okWarnignDialog } from "../../helpers/dialogs";

type FormulaireRegion = {
    rgion : any;
	chefLieu : any;
	articleRegion : any;
}
type FormulaireProvince = {
    provinc : any;
	chefLieu : any;
	articleProv : any;
	codReg : any;
}
type FormulaireDepartement = {
    codDepart : any;
	departema : any;
	chefLieuDepart : any;
	codProv : any;
}
const ParametresSaisieMiseAjourStructuresTerritorialesForm =()=> {

    const [ligneSection,setLigneSection] = useState<'region'|'province'|'departement'|'aucune'>('aucune');

    //////////GESTION REGIONS//////////
    ////ETATS
    const[allRegions,setAllRegions] = useState<RegionResponseDto[]>([]);
    const[ligneRegionSelectionnee,setLigneRegionSelectionnee] = useState<RegionResponseDto>(emptyRegionResponseDto)
    const[ajouterRegionForm,setAjouterRegionForm] = useState<FormulaireRegion>({
        rgion : {value: ''},
	    chefLieu : {value: ''},
	    articleRegion : {value: 'du'},
    })
    const initAjouterRegionForm =()=> {
        setAjouterRegionForm({
            rgion : {value: ''},
	        chefLieu : {value: ''},
	        articleRegion : {value: ''},
        })
    }
    const[modifierRegionForm,setModifierRegionForm] = useState<FormulaireRegion>({
        rgion : {value: ''},
	    chefLieu : {value: ''},
	    articleRegion : {value: 'du'},
    })
    const initModifierRegionForm =()=> {
        setModifierRegionForm({
            rgion : {value: ''},
	        chefLieu : {value: ''},
	        articleRegion : {value: ''},
        })
    }
    const nouvelleLigneRegion  = [
        ...allRegions,
        {
            codReg : "__NOUVELLE_LIGNE_REGION__", 
            rgion : '', 
            chefLieu : '', 
            articleRegion : ''
        } 
    ]

    ////APPELS SERVICES
    const getALLRegions =async()=> {
        await RegionService.getAll()
        .then((data) => {
            setAllRegions(data)
        })
    }

    const regionsColumn = [
        {
            name: 'Code',
            selector:(row:any) => row.codReg,
            cell:(row:RegionResponseDto) => {
                if(row.codReg === "__NOUVELLE_LIGNE_REGION__") {
                    return (<span></span>)
                }
                return (<span>{row.codReg}</span>)
            }
        },
        {
            name: 'Nom région',
            selector:(row:any) => row.rgion,
            cell:(row:RegionResponseDto) => {
                if(row.codReg === "__NOUVELLE_LIGNE_REGION__") {
                    return (
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={ajouterRegionForm.rgion.value}
                            onChange={(e) => setAjouterRegionForm({...ajouterRegionForm, rgion : {value:e.target.value}})}
                        />
                    )
                }
                if(ligneRegionSelectionnee.codReg === row.codReg) {
                    return (
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={modifierRegionForm.rgion.value}
                            onChange={(e) => setModifierRegionForm({...modifierRegionForm, rgion : {value:e.target.value}})}
                        />
                    )
                }
                return (
                    <span
                        style={{
                            width:'100%',
                            display:'block'
                        }}
                    >
                        {row.rgion}
                    </span>
                )
            }
        },
        {
            name: 'Chef lieu',
            selector:(row:any) => row.chefLieu,
            cell:(row:RegionResponseDto) => {
                if(row.codReg === "__NOUVELLE_LIGNE_REGION__") {
                    return (
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={ajouterRegionForm.chefLieu.value}
                            onChange={(e) => setAjouterRegionForm({...ajouterRegionForm, chefLieu : {value:e.target.value}})}
                        />
                    )
                }
                if(ligneRegionSelectionnee.codReg === row.codReg) {
                    return (
                        <Form.Control
                            size="sm"
                            type="text"
                            autoFocus
                            value={modifierRegionForm.chefLieu.value}
                            onChange={(e) => setModifierRegionForm({...modifierRegionForm, chefLieu : {value:e.target.value}})}
                        />
                    )
                }
                return (
                    <span
                        style={{
                            width:'100%',
                            display:'block'
                        }}
                    >
                        {row.chefLieu}
                    </span>
                )
            }
        },
    ]

    //////////GESTION PROVINCES//////////
    ////ETATS
    const[allProvinces,setAllProvinces] = useState<ProvinceResponseDto[]>([]);
    const[ligneProvinceSelectionnee,setLigneProvinceSelectionnee] = useState<ProvinceResponseDto>(emptyProvinceResponseDto);
    const[ajouterProvinceForm,setAjouterProvinceForm] = useState<FormulaireProvince>({
        provinc : {value: ""},
	    chefLieu : {value: ""},
	    articleProv : {value: "du"},
	    codReg : {value: ""},
    })
    const initAjouterProvinceForm =()=> {
        setAjouterProvinceForm({
            provinc : {value: ""},
	        chefLieu : {value: ""},
	        articleProv : {value: "du"},
	        codReg : {value: ""},
        })
    }
    const[modifierProvinceForm,setModifierProvinceForm] = useState<FormulaireProvince>({
        provinc : {value: ""},
	    chefLieu : {value: ""},
	    articleProv : {value: "du"},
	    codReg : {value: ""},
    })
    const initModifierProvinceForm =()=> {
        setModifierProvinceForm({
            provinc : {value: ""},
	        chefLieu : {value: ""},
	        articleProv : {value: "du"},
	        codReg : {value: ""},
        })
    }
    
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
            cell:(row:ProvinceResponseDto)=> {
                if(row.codProv==="__NOUVELLE_LIGNE_PROVINCE__"){
                    return(<span></span>)
                } 
                return(<span>{row.codProv}</span>)
            }
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
    const donneesFinalaAfficherPourFiltrerProvinceEnFonctionDeRegion =useMemo(() => {
        return [
            ...filtrerProvinceEnFonctionDeRegion,
            {
                codProv : "__NOUVELLE_LIGNE_PROVINCE__", 
                codReg : ligneRegionSelectionnee.codReg,
                provinc : '', 
                chefLieu : '', 
                articleProv : 'du'
            } 
        ]
    },[filtrerProvinceEnFonctionDeRegion])
    const filtrerDepartementEnFonctionDeProvince = useMemo(() => {
        let resultat = allDepartements;
        if(ligneProvinceSelectionnee || ligneProvinceSelectionnee&&ligneRegionSelectionnee) {
            resultat = resultat.filter((item:any) => item.codProv === ligneProvinceSelectionnee.codProv)
        }
        return resultat;
    },[allDepartements,ligneProvinceSelectionnee,ligneRegionSelectionnee])

    const handleEnregistrer =async()=> {
        try {
            if(ligneSection==='region') {
                if(ligneRegionSelectionnee.codReg==="__NOUVELLE_LIGNE_REGION__") {
                    const data:RegionRequestDto = emptyRegionRequestDto;
                    data.rgion = ajouterRegionForm.rgion.value;
                    data.chefLieu = ajouterRegionForm.chefLieu.value;
                    data.articleRegion = "du"
                    await RegionService.add(data)
                    okSuccessDialog("Données enrégistrées avec succès");
                    getALLRegions()
                    initAjouterRegionForm()
                    initModifierRegionForm()
                }else{
                    const data:RegionRequestDto = emptyRegionRequestDto;
                    data.rgion = modifierRegionForm.rgion.value;
                    data.chefLieu = modifierRegionForm.chefLieu.value;
                    data.articleRegion = "du"
                    await RegionService.edit(ligneRegionSelectionnee.codReg,data)
                    okSuccessDialog("Données enrégistrées avec succès");
                    getALLRegions()
                }
            }
            if(ligneSection==='province') {

            }
            if(ligneSection==='departement') {

            }
            if(ligneSection==='aucune') {
                okWarnignDialog("Veuillez sélectionner d'abord saisir des données")
                return;
            }
        }catch(erreur) {
            okWarnignDialog("Une erreur est survenu lors de la saisie/maj")
        }
    }

    const handleSupprimer =async() => {
        try {
            if(ligneSection==='region') {
                await RegionService.delete(ligneRegionSelectionnee.codReg)
                okSuccessDialog("Données supprimées avec succès")
                getALLRegions()
            }
            if(ligneSection=='province') {
                await ProvinceService.delete(ligneProvinceSelectionnee.codProv)
                okSuccessDialog("Données supprimées avec succès")
                getAllProvinces()
            }
            if(ligneSection==='departement') {
                await DepartementService.delete(ligneDepartementSelectionnee.idDepart)
                okSuccessDialog("Données supprimées avec succès")
                getAllDepartements()
            }
            if(ligneSection==='aucune') {
                okWarnignDialog("Veuillez sélectionner d'abord la ligne à supprimmer")
                return;
            }
        } catch(erreur) {
            okWarnignDialog("Une erreur est survenu lors de la suppréssion")
        }
    }

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
                    <Row>
                        <Col>
                            <Button
                                variant="warning"
                                className="me-2"
                                title="Interroger"
                            >
                                <QuestionMarkRoundedIcon/>
                            </Button>
                            <Button
                                variant="danger"
                                className="me-2"
                                title="Supprimer"
                                onClick={handleSupprimer}
                            >
                                <DeleteIcon/>
                            </Button>
                            <Button
                                variant="primary"
                                className="me-2"
                                title="Enregistrer les données"
                                onClick={handleEnregistrer}
                            >
                                <SaveSharpIcon/>
                            </Button>
                            <Button
                                variant="success"
                                className="me-2"
                                title="Imprimer"
                            >
                                <PrintRoundedIcon/>
                            </Button>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <div>
                        <span><b>Régions</b></span>
                        <DataTable
                            columns={regionsColumn}
                            data={nouvelleLigneRegion}
                            customStyles={customStyles}
                            fixedHeader
                            fixedHeaderScrollHeight="130px"
                            noDataComponent="Aucune donnée"
                            highlightOnHover
                            pointerOnHover
                            onRowClicked={(data:any) => {
                                setLigneRegionSelectionnee(data)
                                setModifierRegionForm({
                                    rgion : {value: data.rgion},
	                                chefLieu : {value: data.chefLieu},
	                                articleRegion : {value: data.articleRegion},
                                })
                                setLigneSection('region')
                            }}
                            onRowDoubleClicked={() => {
                                setLigneRegionSelectionnee(emptyRegionResponseDto)
                                initAjouterRegionForm()
                                initModifierRegionForm()
                                setLigneSection('aucune')
                            }}
                        />
                    </div>
                    <div>
                        <span><b>Provinces</b></span>
                        <DataTable
                            columns={provincesColumn}
                            data={donneesFinalaAfficherPourFiltrerProvinceEnFonctionDeRegion}
                            customStyles={customStyles}
                            fixedHeader
                            fixedHeaderScrollHeight="150px"
                            noDataComponent="Aucune donnée"
                            highlightOnHover
                            pointerOnHover
                            onRowClicked={(data:any) => {
                                setLigneProvinceSelectionnee(data)
                                setLigneSection('province')
                            }}
                            onRowDoubleClicked={() => {
                                setLigneProvinceSelectionnee(emptyProvinceResponseDto)
                                setLigneSection('aucune')
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
                                setLigneSection('departement')
                            }}
                            onRowDoubleClicked={() => {
                                setLigneDepartementSelectionnee(emptyDepartementResponseDto)
                                setLigneSection('aucune')
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















//Aristide
// import { useEffect, useMemo, useState } from "react";
// import { Button, Card, Col, Row } from "react-bootstrap";
// import Swal from "sweetalert2";
// import { emptyRegionResponseDto, RegionResponseDto } from "../models/region";
// import { emptyProvinceResponseDto, ProvinceResponseDto } from "../models/province";
// import { DepartementResponseDto, emptyDepartementResponseDto } from "../models/departement";
// import RegionService from "../services/region-service";
// import ProvinceService from "../services/province-service";
// import DepartementService from "../services/departement-service";
// import DataTable from "react-data-table-component";
// import SaveSharpIcon from '@mui/icons-material/SaveSharp';
// import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
// import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { okSuccessDialog, okWarnignDialog } from "../../helpers/dialogs";

// // ---- Ligne éditable générique ----
// interface LigneEditable<T> {
//     idLocal: string;
//     donnees: T;
//     estNouvelle: boolean; // pas encore enregistrée en base
//     estModifiee: boolean; // à envoyer lors du prochain "Enregistrer"
// }

// let compteurId = 0;
// const genererIdLocal = () => `local-${Date.now()}-${compteurId++}`;

// function creerLigneVide<T>(modeleVide: T, valeursParDefaut?: Partial<T>): LigneEditable<T> {
//     return {
//         idLocal: genererIdLocal(),
//         donnees: { ...modeleVide, ...valeursParDefaut },
//         estNouvelle: true,
//         estModifiee: false,
//     };
// }

// function chargerLignes<T>(items: T[], idField: keyof T): LigneEditable<T>[] {
//     return items.map((item) => ({
//         idLocal: String(item[idField]),
//         donnees: item,
//         estNouvelle: false,
//         estModifiee: false,
//     }));
// }

// const inputStyle: React.CSSProperties = {
//     width: '100%',
//     border: '1px solid #ccc',
//     borderRadius: '3px',
//     padding: '2px 4px',
//     fontSize: '14px',
// };

// // ---- Valeurs à préremplir automatiquement (champs non affichés dans le
// // tableau mais requis par le backend). Ajoute ici tout champ à préremplir. ----
// const valeursParDefautRegion: Partial<RegionResponseDto> = { articleRegion: 'du' };
// const valeursParDefautProvince: Partial<ProvinceResponseDto> = { articleProv: 'du' };
// const valeursParDefautDepartement: Partial<DepartementResponseDto> = {};

// // ---- Filet de sécurité : garantit ces valeurs même sur une ligne existante
// // modifiée, avant l'envoi à l'API ----
// const completerRegion = (donnees: RegionResponseDto): RegionResponseDto => ({
//     ...donnees,
//     articleRegion: donnees.articleRegion ?? '',
// });
// const completerProvince = (donnees: ProvinceResponseDto): ProvinceResponseDto => ({
//     ...donnees,
//     articleProv: donnees.articleProv ?? '',
// });
// const completerDepartement = (donnees: DepartementResponseDto): DepartementResponseDto => ({
//     ...donnees,
// });

// const ParametresSaisieMiseAjourStructuresTerritorialesForm = () => {

//     const [ligneASupprimerSection,setLigneASupprimerSection] = useState<'region'|'province'|'departement'|'aucune'>('aucune');

//     //////////GESTION REGIONS//////////
//     const [lignesRegions, setLignesRegions] = useState<LigneEditable<RegionResponseDto>[]>([creerLigneVide(emptyRegionResponseDto, valeursParDefautRegion)]);
//     const [regionEnEdition, setRegionEnEdition] = useState<string | null>(null);
//     const [regionFiltre, setRegionFiltre] = useState<RegionResponseDto | null>(null);

//     const getALLRegions = async () => {
//         await RegionService.getAll().then((data) => {
//             setLignesRegions([...chargerLignes(data, 'codReg'), creerLigneVide(emptyRegionResponseDto, valeursParDefautRegion)]);
//         });
//     };

//     //////////GESTION PROVINCES//////////
//     const [lignesProvinces, setLignesProvinces] = useState<LigneEditable<ProvinceResponseDto>[]>(
//         [creerLigneVide(emptyProvinceResponseDto, valeursParDefautProvince)]
//     );
//     const [provinceEnEdition, setProvinceEnEdition] = useState<string | null>(null);
//     const [provinceFiltre, setProvinceFiltre] = useState<ProvinceResponseDto | null>(null);

//     const getAllProvinces = async () => {
//         await ProvinceService.getAll().then((data) => {
//             // console.log("Provinces : ")
//             // console.table(data)
//             setLignesProvinces([...chargerLignes(data, 'codProv'), creerLigneVide(emptyProvinceResponseDto, valeursParDefautProvince)]);
//         });
//     };

//     //////////GESTION DEPARTEMENTS//////////
//     const [lignesDepartements, setLignesDepartements] = useState<LigneEditable<DepartementResponseDto>[]>(
//         [creerLigneVide(emptyDepartementResponseDto, valeursParDefautDepartement)]
//     );
//     const [departementEnEdition, setDepartementEnEdition] = useState<string | null>(null);
//     const [ligneDepartementASupprimer,setLigneDepartementASupprimer] = useState<DepartementResponseDto>(emptyDepartementResponseDto)
//     const getAllDepartements = async () => {
//         await DepartementService.getAll().then((data) => {
//             // console.log("Départements : ")
//             // console.table(data)
//             setLignesDepartements([...chargerLignes(data, 'codDepart'), creerLigneVide(emptyDepartementResponseDto, valeursParDefautDepartement)]);
//         });
//     };

//     useEffect(() => {
//         getALLRegions();
//         getAllProvinces();
//         getAllDepartements();
//     }, []);

//     // Quand on sélectionne une région, préremplir le codReg de la ligne vide "province" en attente
//     useEffect(() => {
//         if (!regionFiltre) return;
//         setLignesProvinces((prev) => {
//             const derniere = prev[prev.length - 1];
//             if (derniere.estNouvelle && !derniere.estModifiee) {
//                 return [...prev.slice(0, -1), { ...derniere, donnees: { ...derniere.donnees, codReg: regionFiltre.codReg } }];
//             }
//             return prev;
//         });
//     }, [regionFiltre]);

//     // Idem pour la ligne vide "département" en attente
//     useEffect(() => {
//         if (!provinceFiltre) return;
//         setLignesDepartements((prev) => {
//             const derniere = prev[prev.length - 1];
//             if (derniere.estNouvelle && !derniere.estModifiee) {
//                 return [...prev.slice(0, -1), { ...derniere, donnees: { ...derniere.donnees, codProv: provinceFiltre.codProv } }];
//             }
//             return prev;
//         });
//     }, [provinceFiltre]);

//     // ---- Interroger : recharge tout et enlève les filtres ----
//     const handleInterroger = () => {
//         setRegionFiltre(null);
//         setProvinceFiltre(null);
//         setRegionEnEdition(null);
//         setProvinceEnEdition(null);
//         setDepartementEnEdition(null);
//         getALLRegions();
//         getAllProvinces();
//         getAllDepartements();
//     };

//     // ---- Modifie un champ ; crée automatiquement la prochaine ligne vide si on éditait la dernière ----
//     function modifierChampLigne<T>(
//         setLignes: React.Dispatch<React.SetStateAction<LigneEditable<T>[]>>,
//         modeleVide: T,
//         idLocal: string,
//         champ: keyof T,
//         valeur: any,
//         defautsProchaineLigne?: Partial<T>
//     ) {
//         setLignes((prev) => {
//             const estDerniereLigne = prev[prev.length - 1].idLocal === idLocal;
//             const next = prev.map((ligne) =>
//                 ligne.idLocal === idLocal
//                     ? { ...ligne, donnees: { ...ligne.donnees, [champ]: valeur }, estModifiee: true }
//                     : ligne
//             );
//             if (estDerniereLigne) {
//                 next.push(creerLigneVide(modeleVide, defautsProchaineLigne));
//             }
//             return next;
//         });
//     }

//     // ---- Filtrage (garde toujours la ligne vide visible) ----
//     const provincesAffichees = useMemo(() => {
//         if (!regionFiltre) return lignesProvinces;
//         return lignesProvinces.filter((l) => l.donnees.codReg === regionFiltre.codReg);
//     }, [lignesProvinces, regionFiltre]);

//     const departementsAffiches = useMemo(() => {
//         if (!provinceFiltre) return lignesDepartements;
//         return lignesDepartements.filter((l) => l.donnees.codProv === provinceFiltre.codProv);
//     }, [lignesDepartements, provinceFiltre]);

//     // ---- Colonnes ----
//     const regionsColumn = [
//         {
//             name: 'Code',
//             cell: (ligne: LigneEditable<RegionResponseDto>) =>
//                 (ligne.estNouvelle || ligne.idLocal === regionEnEdition) ? (
//                     <input style={inputStyle} value={ligne.donnees.codReg ?? ''}
//                         onChange={(e) => modifierChampLigne(setLignesRegions, emptyRegionResponseDto, ligne.idLocal, 'codReg', e.target.value, valeursParDefautRegion)} />
//                 ) : ligne.donnees.codReg,
//         },
//         {
//             name: 'Nom région',
//             cell: (ligne: LigneEditable<RegionResponseDto>) =>
//                 (ligne.estNouvelle || ligne.idLocal === regionEnEdition) ? (
//                     <input style={inputStyle} value={ligne.donnees.rgion ?? ''}
//                         onChange={(e) => modifierChampLigne(setLignesRegions, emptyRegionResponseDto, ligne.idLocal, 'rgion', e.target.value, valeursParDefautRegion)} />
//                 ) : ligne.donnees.rgion,
//         },
//         {
//             name: 'Chef lieu',
//             cell: (ligne: LigneEditable<RegionResponseDto>) =>
//                 (ligne.estNouvelle || ligne.idLocal === regionEnEdition) ? (
//                     <input style={inputStyle} value={ligne.donnees.chefLieu ?? ''}
//                         onChange={(e) => modifierChampLigne(setLignesRegions, emptyRegionResponseDto, ligne.idLocal, 'chefLieu', e.target.value, valeursParDefautRegion)} />
//                 ) : ligne.donnees.chefLieu,
//         },
//     ];

//     const provincesColumn = [
//         {
//             name: 'Code',
//             cell: (ligne: LigneEditable<ProvinceResponseDto>) =>
//                 (ligne.estNouvelle || ligne.idLocal === provinceEnEdition) ? (
//                     <input style={inputStyle} value={ligne.donnees.codProv ?? ''}
//                         onChange={(e) => modifierChampLigne(setLignesProvinces, emptyProvinceResponseDto, ligne.idLocal, 'codProv', e.target.value, { ...valeursParDefautProvince, ...(regionFiltre ? { codReg: regionFiltre.codReg } : {}) })} />
//                 ) : ligne.donnees.codProv,
//         },
//         {
//             name: 'Nom province',
//             cell: (ligne: LigneEditable<ProvinceResponseDto>) =>
//                 (ligne.estNouvelle || ligne.idLocal === provinceEnEdition) ? (
//                     <input style={inputStyle} value={ligne.donnees.provinc ?? ''}
//                         onChange={(e) => modifierChampLigne(setLignesProvinces, emptyProvinceResponseDto, ligne.idLocal, 'provinc', e.target.value, { ...valeursParDefautProvince, ...(regionFiltre ? { codReg: regionFiltre.codReg } : {}) })} />
//                 ) : ligne.donnees.provinc,
//         },
//         {
//             name: 'Chef lieu',
//             cell: (ligne: LigneEditable<ProvinceResponseDto>) =>
//                 (ligne.estNouvelle || ligne.idLocal === provinceEnEdition) ? (
//                     <input style={inputStyle} value={ligne.donnees.chefLieu ?? ''}
//                         onChange={(e) => modifierChampLigne(setLignesProvinces, emptyProvinceResponseDto, ligne.idLocal, 'chefLieu', e.target.value, { ...valeursParDefautProvince, ...(regionFiltre ? { codReg: regionFiltre.codReg } : {}) })} />
//                 ) : ligne.donnees.chefLieu,
//         },
//     ];

//     const departementsColumn = [
//         {
//             name: 'Code',
//             cell: (ligne: LigneEditable<DepartementResponseDto>) =>
//                 (ligne.estNouvelle || ligne.idLocal === departementEnEdition) ? (
//                     <input style={inputStyle} value={ligne.donnees.codDepart ?? ''}
//                         onChange={(e) => modifierChampLigne(setLignesDepartements, emptyDepartementResponseDto, ligne.idLocal, 'codDepart', e.target.value, { ...valeursParDefautDepartement, ...(provinceFiltre ? { codProv: provinceFiltre.codProv } : {}) })} />
//                 ) : ligne.donnees.codDepart,
//         },
//         {
//             name: 'Nom département',
//             cell: (ligne: LigneEditable<DepartementResponseDto>) =>
//                 (ligne.estNouvelle || ligne.idLocal === departementEnEdition) ? (
//                     <input style={inputStyle} value={ligne.donnees.departema ?? ''}
//                         onChange={(e) => modifierChampLigne(setLignesDepartements, emptyDepartementResponseDto, ligne.idLocal, 'departema', e.target.value, { ...valeursParDefautDepartement, ...(provinceFiltre ? { codProv: provinceFiltre.codProv } : {}) })} />
//                 ) : ligne.donnees.departema,
//         },
//         {
//             name: 'Chef lieu',
//             cell: (ligne: LigneEditable<DepartementResponseDto>) =>
//                 (ligne.estNouvelle || ligne.idLocal === departementEnEdition) ? (
//                     <input style={inputStyle} value={ligne.donnees.chefLieuDepart ?? ''}
//                         onChange={(e) => modifierChampLigne(setLignesDepartements, emptyDepartementResponseDto, ligne.idLocal, 'chefLieuDepart', e.target.value, { ...valeursParDefautDepartement, ...(provinceFiltre ? { codProv: provinceFiltre.codProv } : {}) })} />
//                 ) : ligne.donnees.chefLieuDepart,
//         },
//     ];

//     const customStyles = {
//         headRow: { style: { backgroundColor: '#dce6f1', minHeight: '30px', fontSize: '14px' } },
//         headCells: { style: { color: '#1f3864', fontWeigh: 'bold', fontSize: '14px' } },
//         rows: { style: { minHeight: '30px', fontSize: '14px' } },
//         cells: { style: { paddingLeft: '12px', paddingRight: '12px' } },
//     };

//     // ---- Enregistrer : envoie toutes les lignes créées/modifiées ----
//     const handleEnregistrer = async () => {
//         try {
//             const regionsAEnvoyer = lignesRegions.filter((l) => l.estModifiee);
//             const provincesAEnvoyer = lignesProvinces.filter((l) => l.estModifiee);
//             const departementsAEnvoyer = lignesDepartements.filter((l) => l.estModifiee);

//             if (!regionsAEnvoyer.length && !provincesAEnvoyer.length && !departementsAEnvoyer.length) {
//                 okWarnignDialog("Aucune modification à enregistrer")
//                 return;
//             }

//             await Promise.all([
//                 ...regionsAEnvoyer.map((l) =>
//                     l.estNouvelle
//                         ? RegionService.add(completerRegion(l.donnees))
//                         : RegionService.edit(l.donnees.codReg, completerRegion(l.donnees))
//                 ),
//                 ...provincesAEnvoyer.map((l) =>
//                     l.estNouvelle
//                         ? ProvinceService.add(completerProvince(l.donnees))
//                         : ProvinceService.edit(l.donnees.codProv, completerProvince(l.donnees))
//                 ),
//                 ...departementsAEnvoyer.map((l) =>
//                     l.estNouvelle
//                         ? DepartementService.add(completerDepartement(l.donnees))
//                         : DepartementService.edit(l.donnees.codDepart, completerDepartement(l.donnees))
//                 ),
//             ]);

//             okSuccessDialog("Données enregistrées avec succès")
//             handleInterroger();
//         } catch (erreur) {
//             okWarnignDialog("Une erreur est survenue lors de l'enregistrement.")
//         }
//     };

//     const handleSupprimer =async() => {
//         try {
//             if(ligneASupprimerSection==='region') {
//                 await RegionService.delete(regionFiltre?.codReg)
//                 okSuccessDialog("Données supprimées avec succès")
//                 getALLRegions()
//             }
//             if(ligneASupprimerSection=='province') {
//                 await ProvinceService.delete(provinceFiltre?.codProv)
//                 okSuccessDialog("Données supprimées avec succès")
//                 getAllProvinces()
//             }
//             if(ligneASupprimerSection==='departement') {
//                 await DepartementService.delete(ligneDepartementASupprimer.idDepart)
//                 okSuccessDialog("Données supprimées avec succès")
//                 getAllDepartements()
//             }
//             if(ligneASupprimerSection==='aucune') {
//                 okWarnignDialog("Veuillez sélectionner d'abord la ligne à supprimmer")
//                 return;
//             }
//         } catch(erreur) {
//             okWarnignDialog("Une erreur est survenu lors de la suppréssion")
//         }
//     }

//     return (
//         <div style={{ width: '60%', margin: '0 auto' }}>
//             <h5>Structure territoriale</h5>
//             <Card>
//                 <Card.Header>
//                     <Row>
//                         <Col>
//                             <Button variant="warning" className="me-2" title="Interroger" onClick={handleInterroger}>
//                                 <QuestionMarkRoundedIcon />
//                             </Button>
//                             <Button variant="danger" className="me-2" title="Supprimer" onClick={handleSupprimer}>
//                                 <DeleteIcon />
//                             </Button>
//                             <Button variant="primary" className="me-2" title="Enregistrer les données" onClick={handleEnregistrer}>
//                                 <SaveSharpIcon />
//                             </Button>
//                             <Button variant="success" className="me-2" title="Imprimer">
//                                 <PrintRoundedIcon />
//                             </Button>
//                         </Col>
//                     </Row>
//                 </Card.Header>
//                 <Card.Body>
//                     <div>
//                         <span><b>Régions</b></span>
//                         <DataTable
//                             keyField="idLocal"
//                             columns={regionsColumn}
//                             data={lignesRegions}
//                             customStyles={customStyles}
//                             fixedHeader
//                             fixedHeaderScrollHeight="130px"
//                             noDataComponent="Aucune donnée"
//                             highlightOnHover
//                             pointerOnHover
//                             onRowClicked={(ligne) => {
//                                 setRegionEnEdition(ligne.idLocal);
//                                 if (!ligne.estNouvelle) setRegionFiltre(ligne.donnees);
//                                 setLigneASupprimerSection('region')
//                             }}
//                             onRowDoubleClicked={() => {
//                                 setRegionEnEdition(null);
//                                 setRegionFiltre(null);
//                                 setLigneASupprimerSection('aucune')
//                             }}
//                         />
//                     </div>
//                     <div>
//                         <span><b>Provinces</b></span>
//                         <DataTable
//                             keyField="idLocal"
//                             columns={provincesColumn}
//                             data={provincesAffichees}
//                             customStyles={customStyles}
//                             fixedHeader
//                             fixedHeaderScrollHeight="150px"
//                             noDataComponent="Aucune donnée"
//                             highlightOnHover
//                             pointerOnHover
//                             onRowClicked={(ligne) => {
//                                 setProvinceEnEdition(ligne.idLocal);
//                                 if (!ligne.estNouvelle) setProvinceFiltre(ligne.donnees);
//                                 setLigneASupprimerSection('province')
//                             }}
//                             onRowDoubleClicked={() => {
//                                 setProvinceEnEdition(null);
//                                 setProvinceFiltre(null);
//                                 setLigneASupprimerSection('aucune')
//                             }}
//                         />
//                     </div>
//                     <div>
//                         <span><b>Départements</b></span>
//                         <DataTable
//                             keyField="idLocal"
//                             columns={departementsColumn}
//                             data={departementsAffiches}
//                             customStyles={customStyles}
//                             fixedHeader
//                             fixedHeaderScrollHeight="150px"
//                             noDataComponent="Aucune donnée"
//                             highlightOnHover
//                             pointerOnHover
//                             onRowClicked={(ligne:any) => {
//                                 setDepartementEnEdition(ligne.idLocal)
//                                 setLigneASupprimerSection('departement')
//                                 setLigneDepartementASupprimer(ligne) 
//                                 } 
//                             }
//                             onRowDoubleClicked={() => {
//                                 setDepartementEnEdition(null)
//                                 setLigneASupprimerSection('aucune')
//                                 }
//                             }
//                         />
//                     </div>
//                 </Card.Body>
//                 <Card.Footer></Card.Footer>
//             </Card>
//         </div>
//     );
// };

// export default ParametresSaisieMiseAjourStructuresTerritorialesForm;