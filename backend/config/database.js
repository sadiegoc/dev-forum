// conexão com o banco de dados

// configuração do banco de dados
const config = require('../knexfile')

// passando a configuração para o require, já criamos uma conexão
const knex = require('knex')(config)

// exportamos a conexão para ser usada em outros contextos
module.exports = knex