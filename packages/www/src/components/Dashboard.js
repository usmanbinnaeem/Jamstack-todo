import React, { useContext, useReducer, useRef, useState } from "react";
import {
  Flex,
  Container,
  NavLink,
  Input,
  Button,
  Label,
  Checkbox,
  Heading,
} from "theme-ui";
import { IdentityContext } from "../../netlifyIdentityContext";
import { Link } from "gatsby";
import { gql, useMutation, useQuery } from "@apollo/client";

const ADD_TODO = gql`
  mutation AddTodo($text: String!) {
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

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      text
      done
    }
  }
`;

const todosReducer = (state, action) => {
  switch (action.type) {
    case "addTodo":
      return [{ done: false, value: action.payload }, ...state];
    case "toggleTodo":
      const newState = [...state];
      newState[action.payload] = {
        done: !state[action.payload].done,
        value: state[action.payload].done,
      };
      return newState;
  }
};

export default () => {
  const { user, identity: netlifyIdentity } = useContext(IdentityContext);
  const [todos, dispatch] = useReducer(todosReducer, []);
  const [addTodo] = useMutation(ADD_TODO);
  const [updateTodoDone] = useMutation(UPDATE_TODO_DONE);
  const { loading, error, data, refetch } = useQuery(GET_TODOS);
  const inputRef = useRef();

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
      <Flex
        as="form"
        onSubmit={async (e) => {
          e.preventDefault();
          await addTodo({ variables: { text: inputRef.current.value } });
          inputRef.current.value = "";
          await refetch();
        }}
      >
        <Label sx={{ display: "flex" }}>
          <span>Add&nbsp;Todo</span>
          <input ref={inputRef} sx={{ marginLeft: 1 }} />
        </Label>
        <Button sx={{ marginLeft: 1 }}>Submit</Button>
      </Flex>
      <Flex sx={{ flexDirection: "column" }}>
        {loading ? <div>loading...</div> : null}
        {error ? <div>{error.message}</div> : null}
        {!loading && !error && (
          <ul sx={{ listStyleType: "none" }}>
            {data.todos.map((todo) => (
              <Flex
                key={todo.id}
                as="li"
                onClick={async () => {
                  await updateTodoDone({ variables: { id: todo.id } });
                  await refetch();
                }}
              >
                <Checkbox checked={todo.done} />
                <span>{todo.text}</span>
              </Flex>
            ))}
          </ul>
        )}
      </Flex>
    </Container>
  );
};
