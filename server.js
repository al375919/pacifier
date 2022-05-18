//server.js

const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const cors = require('cors')

const {root, schema, sse} = require('./controllers')

const app = express()

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

app.use(cors())

app.use('/graphql', graphqlHTTP({
  rootValue: root, 
  schema: schema, 
  graphiql: true //only for testing
}))

//Static content (web app)
app.use('/web',  express.static('public'))

//Endpoint for SSE stream
app.use('/news', sse.eventStream)

app.listen(9000, () => console.log('Listening on 9000'))

