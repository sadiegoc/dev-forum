const express = require('express')
const app = express()
const consign = require('consign')
require('dotenv').config()

app.db = require('./config/database')

const HOST = process.env.APP_HOST
const PORT = process.env.APP_PORT

consign()
    .then('./middlewares/connection.js')
    .then('./controllers/validation.js')
    .then('./controllers')
    .then('./routes/routes.js')
    .into(app)

app.listen(PORT, () => {
    console.log(`backend listenning on http://${HOST}:${PORT}`)
})