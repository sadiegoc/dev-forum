const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

module.exports = app => {
    const corsOptions = { origin: process.env.CORS_ORIGIN } // origem da conexão (frontend)
    app.use(bodyParser.json()) // requisições e respostas em json
    app.use(cors(corsOptions))
}