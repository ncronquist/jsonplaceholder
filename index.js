const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const rp = require('request-promise');

const typeDefs = `
    type Query {
        hello: String
		users: [User]
        user(id: Int!): User
        posts: [Post]
    }

    type Post {
        id: ID,
        title: String,
        body: String,
        author: User
    }

	type User {
		id: ID,
		name: String,
		email: String,
		address: Address
	}

	type Address {
		street: String,
		suite: String,
		city: String
		zipcode: String
	}
`;

function usersResolver(root, args, context) {
    return rp('https://jsonplaceholder.typicode.com/users')
    .then(response => {
  	    // console.log('RESPONSE:', response)
        let users = JSON.parse(response);
        return users;
    })
	.catch(error => {
        console.log('ERROR:', error)
        throw error;
    })
}

function userResolver(root, args, context) {
    // resolve single user here
}

function postsResolver(root, args, context) {
    rp('https://jsonplaceholder.typicode.com/posts')
    .then(response => {
        // console.log('RESPONSE:', response)
        let posts = JSON.parse(response);
        return posts;
    })
    .catch(error => {
        console.log('ERROR:', error)
        throw error;
    })
}

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        hello: (root, args, context) => {
            return 'Hello world!';
        },
        users: usersResolver,
        user: userResolver,
        posts: postsResolver
    }
};

// Required: Export the GraphQL.js schema object as "schema"
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});


// Initialize the app
const app = express();

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Start the server
app.listen(3000, () => {
    console.log('Go to http://localhost:3000/graphiql to run queries!');
});
