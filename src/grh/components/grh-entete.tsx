import React, { FunctionComponent, useEffect, useState } from 'react';
import { Container, Navbar, Row } from 'react-bootstrap';
import { GrhConnectedUser } from '../helpers/session-storage';
import { useGrhSignOut } from '../helpers/use-sign-out';

interface IEnteteGbcProps {
}

const GrhEntete: FunctionComponent<IEnteteGbcProps> = (props) => {

  const [connectedUser, SetConnectedUser] = useState<string|null>("");
  const signOut = useGrhSignOut();

  useEffect( () => {
    SetConnectedUser(GrhConnectedUser());
  }, [])

  return(
    <Navbar bg="dark" variant='dark' style={{ height: '10px'}}>
      <Container>
        <Navbar.Brand href='/grh'><b><i>Accueil GRH</i></b></Navbar.Brand>
        <Navbar.Brand>
        <i>Utilisateur : { connectedUser }</i> ---------- <b><a href=""><i onClick={signOut} className="text-danger">Déconnexion</i></a></b> 
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default GrhEntete;
