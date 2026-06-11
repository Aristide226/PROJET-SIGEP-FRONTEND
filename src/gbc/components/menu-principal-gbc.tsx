import { FunctionComponent, useState } from 'react';
import { Code, Gestion, GestionProchaine, Grpe } from '../helpers/session-storage';
import "./menu-principal-gbc.css";
import AdAgent from './profiles/ad-agent';
import AdChef from './profiles/ad-chef';
import AdFact from './profiles/ad-fact';
import AdInv from './profiles/ad-inv';
import AcAdm from './profiles/ac-adm';
import AcCom from './profiles/ac-com';
import AcDep from './profiles/ac-dep';
import AcRec from './profiles/ac-rec';
import AcInv from './profiles/ac-inv';
import CfAdm from './profiles/cf-adm';
import CfAgent from './profiles/cf-agent';
import CfInv from './profiles/cf-inv';
import OrAdm from './profiles/or-adm';
import OrAgent from './profiles/or-agent';
import OrInv from './profiles/or-inv';
import PrmAdm from './profiles/prm-adm';
import PrmAgent from './profiles/prm-agent';
import PrmInv from './profiles/prm-inv';
import AdAdm from './profiles/ad-adm';
import All from './profiles/all';

const MenuPrincipalGbc: FunctionComponent = () => {
  const [gestionCourante] = useState<string>(Gestion() ?? '');
  const [gestionProchaine] = useState<string>(GestionProchaine() ?? '');
  //const [code] = useState<string>(Code() ?? '');
  //const [grpe] = useState<string>(Grpe() ?? '');
  const [code] = useState<string>('All');
  const [grpe] = useState<string>('All');
  
  return (
    <>
    {(code === "AD" && grpe === "Adm") && <AdAdm gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "AD" && grpe === "Agent") && <AdAgent gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "AD" && grpe === "Chef") && <AdChef gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "AD" && grpe === "Fact") && <AdFact gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "AD" && grpe === "Inv") && <AdInv gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}

    {(code === "AC" && grpe === "Adm") && <AcAdm gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "AC" && grpe === "Com") && <AcCom gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "AC" && grpe === "Dep") && <AcDep gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "AC" && grpe === "Rec") && <AcRec gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "AC" && grpe === "Inv") && <AcInv gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}

    {(code === "CF" && grpe === "Adm") && <CfAdm gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "CF" && grpe === "Agent") && <CfAgent gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "CF" && grpe === "Inv") && <CfInv gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    
    {(code === "OR" && grpe === "Adm") && <OrAdm gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "OR" && grpe === "Agent") && <OrAgent gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "OR" && grpe === "Inv") && <OrInv gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}

    {(code === "PRM" && grpe === "Adm") && <PrmAdm gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "PRM" && grpe === "Agent") && <PrmAgent gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "PRM" && grpe === "Inv") && <PrmInv gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    
    {(code === "All" && grpe === "All") && <All gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    </>
  );
};

export default MenuPrincipalGbc;
