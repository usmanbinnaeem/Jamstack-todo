import React, { useContext } from "react";
import { Router } from "@reach/router";
import { Container,Heading, Flex } from "theme-ui";
import { IdentityContext } from "../../netlifyIdentityContext";
import Dashboard from "../components/Dashboard"
import NavBar from "../components/NavBar"

let DashLoggedOut = () => {
  return (
    <Container>
    <NavBar/>
      <Flex sx={{ flexDirection: "column", padding: 3 }}>
        <Heading as="h1">Jamstack Todo App</Heading>
         <Heading as="h3">first make sure you are login</Heading>
      </Flex>
    </Container>
  );
};

export default (props) => {
  const { user } = useContext(IdentityContext);
  if (!user) {
    return (
      <Router>
        <DashLoggedOut path="/app" />
      </Router>
    );
  }
  return (
        <Dashboard/>
    )
};
