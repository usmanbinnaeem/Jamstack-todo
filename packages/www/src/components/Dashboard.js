import React, { useContext } from "react";
import { Container, Flex, NavLink } from "theme-ui";
import { IdentityContext } from "../../netlifyIdentityContext";
import { Link } from "gatsby";

export default () => {
  const { user, identity: netlifyIdentity } = useContext(IdentityContext);

  return (
    <Container>
      <Flex as="nav">
        <NavLink as={Link} to="/" p={2}>
          Home
        </NavLink>
        <NavLink as={Link} to={"/app"} p={2}>
          Dashboard
        </NavLink>
        {user && <NavLink p={2}>{user.user_metadata.full_name}</NavLink>}
        {!user && (
          <NavLink
            p={2}
            onClick={() => {
              netlifyIdentity.open();
            }}
          >
            login
          </NavLink>
        )}
        {user && (
          <NavLink
            p={2}
            onClick={() => {
              netlifyIdentity.logout();
            }}
          >
            Logout
          </NavLink>
        )}
      </Flex>
      <span>User: {user && user.user_metadata.full_name} </span>
    </Container>
  );
};
