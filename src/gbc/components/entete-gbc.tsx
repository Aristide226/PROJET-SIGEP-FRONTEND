import React, { FunctionComponent, useEffect, useState } from 'react';
import { Container, Navbar, Row } from 'react-bootstrap';
import { ConnectedUser } from '../helpers/session-storage';
import { useSignOut } from '../helpers/use-sign-out';

interface IEnteteGbcProps {
}

const EnteteGbc: FunctionComponent<IEnteteGbcProps> = (props) => {

  const [connectedUser, SetConnectedUser] = useState<string|null>("");
  const signOut = useSignOut();

  useEffect( () => {
    SetConnectedUser(ConnectedUser());
  }, [])

  return(
    <Navbar bg="dark" variant='dark' style={{ height: '10px'}}>
      <Container>
        <Navbar.Brand href='/gbc'><b><i>Accueil GBC</i></b></Navbar.Brand>
        <Navbar.Brand>
        <i>Utilisateur : { connectedUser }</i> ---------- <b><a href=""><i onClick={signOut} className="text-danger">Déconnexion</i></a></b> 
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default EnteteGbc;
