import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
    uri: '/graphql', // Use relative path for the proxy to work
    credentials: 'include', // Required for sending cookies/credentials
    headers: {
        'Content-Type': 'application/json',
    },
});

export const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});
