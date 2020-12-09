import React from "react";
import { Container, Heading, Button, Flex } from "theme-ui";

export default props => (
    <Container>
    <Flex sx = {{flexDirection: "column", padding: 3}}>
        <Heading as = 'h1'>Jamstack Todo App</Heading>
        <Button sx = {{marginTop: 2, color: 'black'}}
        onClick = {() => {alert("login")}}
        >
        Login
        </Button>
    </Flex>
    </Container>
)