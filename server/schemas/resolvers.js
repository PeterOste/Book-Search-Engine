const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
// Require auth for token authentication

const resolvers = {
    Query: {
        me: async (_, __, context) => {
            // Check user authentication
            if (!context.user) {
                throw new AuthenticationError('Not logged in');
            }

            // Return authenticated user
            return await User.findById(context.user._id).populate('savedBooks');
        },
    },
    Mutation: {
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user || !user.validatePassword(password)) {
                throw new AuthenticationError('Invalid credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        addUser: async (_, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (_, { input }, context) => {
            if (!context.user) {
                throw new AuthenticationError('Not logged in');
            }

            const book = await Book.create(input);
            const updatedUser = await User.findByIdAndUpdate(
                context.user._id,
                { $push: { savedBooks: book._id } },
                { new: true }
            ).populate('savedBooks');

            return updatedUser;
        },
        removeBook: async (_, { bookId }, context) => {
            if (!context.user) {
                throw new AuthenticationError('Not logged in');
            }

            const updatedUser = await User.findByIdAndUpdate(
                context.user._id,
                { $pull: { savedBooks: bookId } },
                { new: true }
            ).populate('savedBooks');
        
            return updatedUser;
        },
    },
};

module.exports = resolvers;