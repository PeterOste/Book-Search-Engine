const { AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

const contextMiddleware = ({ req }) => {
  let token = req.headers.authorization || '';

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if (!token) {
    return {};
  }

  try {
    const user = jwt.verify(token, secret, { maxAge: expiration });
    return { user };
  } catch {
    throw new AuthenticationError('Invalid token');
  }
};

module.exports = contextMiddleware;