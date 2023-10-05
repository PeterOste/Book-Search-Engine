const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { typeDefs, resolvers } = require('./schemas'); // Import GraphQL schema
const contextMiddleware = require('./utils/auth'); // Import middleware
const db = require('./config/connection');
const cors = require('cors');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
});

server.applyMiddleware({ app, path: '/graphql' });

// Apollo Server starts asynchronously with the database connection
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
});
