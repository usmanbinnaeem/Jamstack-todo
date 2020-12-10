const { ApolloServer, gql } = require("apollo-server-lambda")
const faunadb = require('faunadb')
const q = faunadb.query

require('dotenv').config()

var client = new faunadb.Client({secret: process.env.FAUNA_SERVER_SECRET})

const typeDefs = gql`
  type Query {
    todos: [Todo]!
  }

  type Todo {
    id: ID!
    text: String!
    done: Boolean!
  }

  type Mutation {
    addTodo(text: String!): Todo
    updateTodoDone(id: ID!): Todo
  }
`;

const resolvers = {
  Query: {
    todos: async (parent, args, {user}) => {
      if(!user){
        return [];
      } else {  
        const results = await client.query(
          q.Paginate(q.Match(q.Index('todos-by-user'), user))
        );
        return results.data.map(([ref, text, done]) => ({
          id: ref.id,
          text,
          done
        }));
       
      }
     
    }
  },
  Mutation: {
    addTodo: async (_, { text }, {user}) => {
      if(!user){
        throw new Error("Must be authenticated to insert todo");
      }
      const results = await client.query(
        q.Create(q.Collection("todos"), {
          data: {
            text,
            done: false,
            owner: user
          }
        })
      );
    
      return {
        ...results.data,
        id: results.ref.id
      }
    },
    updateTodoDone: async (_, { id }) => {
      if(!user){
        throw new Error("Must be authenticated to insert todo");
      }
      const results = await client.query(
        q.Update(q.Ref(q.Collection("todos"), id), {
          data: {
            done: !done
          }
        })
      );
       return {
        ...results.data,
        id: results.ref.id
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ context }) => {
    if(context.clientContext.user){
    return { user: context.clientContext.user.sub };
  } else {
    return {};
  }
  };

  playground: true,
  introspection: true,
});

exports.handler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true,
  },
});
