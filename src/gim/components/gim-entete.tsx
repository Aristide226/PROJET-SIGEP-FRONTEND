import React, { FunctionComponent, useEffect, useState } from 'react';
import { Container, Navbar, Row } from 'react-bootstrap';
import { GimConnectedUser } from '../helpers/session-storage';
import { useGimSignOut } from '../helpers/use-sign-out';


interface IEnteteGbcProps {
}

const GimEntete: FunctionComponent<IEnteteGbcProps> = (props) => {

  const [connectedUser, SetConnectedUser] = useState<string|null>("");
  const signOut = useGimSignOut();

  useEffect( () => {
    SetConnectedUser(GimConnectedUser());
  }, [])

  return(
    <Navbar bg="dark" variant='dark' style={{ height: '10px'}}>
      <Container>
        <Navbar.Brand href='/gim'><b><i>Accueil GIM</i></b></Navbar.Brand>
        <Navbar.Brand>
        <i>Utilisateur : { connectedUser }</i> ---------- <b><a href=""><i onClick={signOut} className="text-danger">Déconnexion</i></a></b> 
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default GimEntete;
