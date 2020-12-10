import React,{useContext} from "react";
import { Container, Heading, Flex } from "theme-ui";
import NavBar from "../components/NavBar";


export default (props) => {

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
