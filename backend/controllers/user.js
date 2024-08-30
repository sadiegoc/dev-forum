require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const JWT_SECRET = process.env.JWT_SECRET
const dayTime = 60 * 60 * 24

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.controllers.validation

    // função para aplicar codificação hash na senha antes de salvar no banco de dados
    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    // função para fazer login de usuário
    const login = async (req, res) => {
        if (!req.body.email || !req.body.password) return res.status(400).send('Fields cannot be empty!')

        const user = await app.db('users')
            .where({ email: req.body.email }).first()

        if (!user) return res.status(400).send('User or password are invalids!')
        const isMatch = bcrypt.compareSync(req.body.password, user.password)

        if (!isMatch) return res.status(401).send('User or password are invalids!')

        const now = Math.floor(Date.now() / 1000)
        const payload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            // profilePath: profilesURL + user.profilePath,
            iat: now,
            exp: now + (dayTime * 2)
        }

        res.json({
            ...payload,
            token: jwt.sign(payload, JWT_SECRET)
        })
    }

    // função para cadastrar um novo usuário ou editar um já existente
    const save = async (req, res) => {
        const user = { ...req.body } // recebe o usuário pelo body

        // caso seja passado um id por parâmetro, quer dizer que é um usuário
        // já existente, então vamos atualizar
        if (req.params.id)
            user.id = req.params.id


        // testes de validação das informações
        try {
            existsOrError(user.firstName, 'First name not given')
            existsOrError(user.lastName, 'Last name not given')
            existsOrError(user.email, 'E-mail not given')
            existsOrError(user.password, 'Password not given')
            existsOrError(user.confirmPassword, 'Password confirmation not given')
            equalsOrError(user.password, user.confirmPassword, 'Passwords don\'t match')

            // verificando se já existe o usuário no banco de dados
            const userFromDB = await app.db('users').where({ email: user.email }).first()
            if (!user.id) // caso seja um update de usuário, não é necessário entar aqui
                notExistsOrError(userFromDB, 'This E-mail already exists')
        } catch (err) {
            return res.status(400).send(err)
        }

        // codifica a senha do usuário
        // e deleta o confirmPassword para não ser salvo no banco de dados
        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if (user.id) { // caso seja um update de usuário
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .then(_ => res.status(204).send())
                .catch(err => {res.status(500).send(err)})
        } else { // caso seja um registro de novo usuário
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null

        try {
            if (userData) {
                const token = jwt.verify(userData.token, JWT_SECRET)
                if (new Date(token.exp * 1000) > new Date())
                    return res.send(true)
            }
        } catch (err) {
            // problema com token
        }

        res.send(false)
    }

    return { login, validateToken, save }
}