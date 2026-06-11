import { FunctionComponent, useState } from 'react';
import { GimCode, GimGestion, GimGestionProchaine, GimGrpe } from '../helpers/session-storage';
import GimC from './profiles/gim-c';
import GimT from './profiles/gim-t';
import GimV from './profiles/gim-v';
import All from './profiles/all';
import './gim-menu-principal.css';


const GimMenuPrincipal: FunctionComponent = () => {
  const [gestionCourante] = useState<string>(GimGestion() ?? '');
  const [gestionProchaine] = useState<string>(GimGestionProchaine() ?? '');
  const [code] = useState<string>(GimCode() ?? '');
  const [grpe] = useState<string>(GimGrpe() ?? '');
  
  return (
    <>
    {(code === "GIM" && grpe === "C") && <GimC gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "GIM" && grpe === "T") && <GimT gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    {(code === "GIM" && grpe === "V") && <GimV gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    
    {(code === "All" && grpe === "All") && <All gestionCourante={gestionCourante} gestionProchaine={gestionProchaine} />}
    </>
  );
};

export default GimMenuPrincipal;
