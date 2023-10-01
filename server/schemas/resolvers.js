const { User, Book } = require('../models');

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

    },
};

module.exports = resolvers;