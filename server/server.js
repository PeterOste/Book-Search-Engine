const express = require('express');
const cors = require('cors'); // Import CORS
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { typeDefs, resolvers } = require('./schemas'); // Import GraphQL schema
const contextMiddleware = require('./utils/auth'); // Import middleware
const db = require('./config/connection');
const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
});

app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

server.applyMiddleware({ app });

// Apollo Server starts asynchronously with the database connection
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
