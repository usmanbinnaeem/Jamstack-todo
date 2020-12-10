import React, { useContext } from "react";
import { Container, Flex, NavLink } from "theme-ui";
import { Link } from "gatsby";
import { IdentityContext } from "../../netlifyIdentityContext";

function NavBar() {
  const { user, identity: netlifyIdentity } = useContext(IdentityContext);
  return (
    <div>
      <Container>
        <Flex as="nav">
          <NavLink as={Link} to="/" p={2}>
            Home
          </NavLink>
          <NavLink as={Link} to={"/app"} p={2}>
            Dashboard
          </NavLink>
          {!user && (
            <NavLink
              p={2}
              onClick={() => {
                netlifyIdentity.open();
              }}
            >
              Login
            </NavLink>
          )}
          {user && <NavLink p={2}>{user.user_metadata.full_name}</NavLink>}

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
      </Container>
    </div>
  );
}

export default NavBar;
