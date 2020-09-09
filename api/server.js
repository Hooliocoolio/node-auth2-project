const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session')
const urouter = require('../routes/userRouter')
const cookieparser = require('cookie-parser')
const sessStore = require('connect-session-knex')(session)
const db = require('../data/dbconfig')

const server = express()

server.use(helmet())
server.use(cors())
server.use(express.json())
server.use(cookieparser())

server.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "Please dont tell no one",
    store: new sessStore({
        knex: db,
        createtable: true
    })
}))

server.use(urouter)

module.exports = server;
