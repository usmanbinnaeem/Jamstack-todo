import React, { useContext, useRef } from "react";
import {
  Flex,
  Container,
  NavLink,
  Heading,
  Button,
  Input,
  Label,
  Checkbox,
} from "theme-ui";
import { IdentityContext } from "../../netlifyIdentityContext";
import { Link } from "gatsby";
import { gql, useMutation, useQuery } from "@apollo/client";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const GET_TODOS = gql`
  query GetTods {
    todos {
      id
      text
      done
    }
  }
`;

const ADD_TODO = gql`
  mutation($text: String!) {
    addTodo(text: $text) {
      id
    }
  }
`;

const UPDATE_TODO_DONE = gql`
  mutation UpdateTodoDone($id: ID!) {
    updateTodoDone(id: $id) {
      text
      done
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      text
    }
  }
`;


export default () => {
  const { user, identity: netlifyIdentity } = useContext(IdentityContext);
  const inputRef = useRef();
  const [addTodo] = useMutation(ADD_TODO);
  const [updateTodoDone] = useMutation(UPDATE_TODO_DONE);
  const [deleteTodo] = useMutation(DELETE_TODO);
  const { loading, error, data, refetch } = useQuery(GET_TODOS);

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
      <Flex style ={{padding: "5% 35%"}}>
       <Heading as='h1'>Add Your Tasks</Heading>
       </Flex>
      <Flex
        style ={{padding: "3% 15%"}}
        as="form"
        onSubmit={async (e) => {
          e.preventDefault();
          await addTodo({ variables: { text: inputRef.current.value } });
          await refetch();
          inputRef.current.value = "";
        }}
      >
     
        <Label sx={{ display: "flex"}}>
          <Input ref={inputRef} sx={{ marginLeft: 1 }} mr={2} />
        </Label>

        <Button sx={{marginLeft:1,background:"#3E38F2"}}>Submit</Button>
      </Flex>
      <Flex sx={{ flexDirection: "column" }} pt={5}>
        {loading ? <div>Loading...</div> : null}
        {error ? <div>{error.message}</div> : null}
        {!loading && !error && (
          <ul sx={{ listStyleType: "none" }}>
            {data.todos.map((todo) => (
              <Flex
                as="li"
                p={2}
                sx={{ alignItems: "flex-end" }}
                key={todo.id}
                onClick={async () => {
                  await updateTodoDone({ variables: { id: todo.id } });
                  await refetch();
                }}
              >
                <Checkbox checked={todo.done} />
                <Flex
                  pl={2}
                  sx={{ justifyContent: "space-between", width: "100%" }}
                >
                  <span>{todo.text}</span>
                  <DeleteForeverIcon
                    onClick={async () => {
                      await deleteTodo({ variables: { id: todo.id } });
                      await refetch();
                    }}
                  />
                </Flex>
              </Flex>
            ))}
          </ul>
        )}
      </Flex>
    </Container>
  );
};
