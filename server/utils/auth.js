const { AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

function signToken(user) {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
  };

  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

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

module.exports = signToken, contextMiddleware;