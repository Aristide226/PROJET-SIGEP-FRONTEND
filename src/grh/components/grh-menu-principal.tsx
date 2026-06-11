import { FunctionComponent, useState } from 'react';
import { GrhCode, GrhGestion, GrhGestionProchaine, GrhGrpe} from '../helpers/session-storage';
import AdAdm from './profiles/ad-adm';
import AdAgent from './profiles/ad-agent';
import AdChef from './profiles/ad-chef';
import AdInv from './profiles/ad-inv';
import AcAdm from './profiles/ac-adm';
import AcCom from './profiles/ac-com';
import AcDep from './profiles/ac-dep';
import AcRec from './profiles/ac-rec';
import AcInv from './profiles/ac-inv';
import CfAdm from './profiles/cf-adm';
import CfAgent from './profiles/cf-agent';
import OrAdm from '../../gbc/components/profiles/or-adm';
import OrAgent from './profiles/or-agent';
import OrInv from './profiles/or-inv';
import PrmAdm from './profiles/prm-adm';
import PrmAgent from './profiles/prm-agent';
import PrmInv from './profiles/prm-inv';
import RhAdm from './profiles/rh-adm';
import RhAgent from './profiles/rh-agent';
import RhChef from './profiles/rh-chef';
import RhInv from './profiles/rh-inv';
import All from './profiles/all';
import './grh-menu-principal.css';


const GrhMenuPrincipal: FunctionComponent = () => {
  const [gestionCourante] = useState<string>(GrhGestion() ?? '');
  const [gestionProchaine] = useState<string>(GrhGestionProchaine() ?? '');
  const [code] = useState<string>(GrhCode() ?? '');
  const [grpe] = useState<string>(GrhGrpe() ?? '');
  
  return (
    <>
    {(code === "AD" && grpe === "Adm") && <AdAdm gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "AD" && grpe === "Agent") && <AdAgent gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "AD" && grpe === "Chef") && <AdChef gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "AD" && grpe === "Inv") && <AdInv gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}

    {(code === "AC" && grpe === "Adm") && <AcAdm gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "AC" && grpe === "Com") && <AcCom gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "AC" && grpe === "Dep") && <AcDep gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "AC" && grpe === "Rec") && <AcRec gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "AC" && grpe === "Inv") && <AcInv gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}

    {(code === "CF" && grpe === "Adm") && <CfAdm gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "CF" && grpe === "Agent") && <CfAgent gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    
    {(code === "OR" && grpe === "Adm") && <OrAdm gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "OR" && grpe === "Agent") && <OrAgent gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "OR" && grpe === "Inv") && <OrInv gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}

    {(code === "PRM" && grpe === "Adm") && <PrmAdm gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "PRM" && grpe === "Agent") && <PrmAgent gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "PRM" && grpe === "Inv") && <PrmInv gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}

    {(code === "RH" && grpe === "Adm") && <RhAdm gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "RH" && grpe === "Agent") && <RhAgent gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "RH" && grpe === "Chef") && <RhChef gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "RH" && grpe === "Inv") && <RhInv gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    
    {(code === "All" && grpe === "All") && <All gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    </>
  );
};

export default GrhMenuPrincipal;
