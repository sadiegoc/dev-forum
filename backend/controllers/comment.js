module.exports = app => {
    const { existsOrError } = app.controllers.validation

    const save = async (req, res) => {
        const comment = { ...req.body } // recebe o comentário pelo body

        try {
            existsOrError(comment.userId, 'User not given')
            existsOrError(comment.postId, 'Post not given')
            existsOrError(comment.content, 'Content not given')

            const userAffected = await app.db('users').where({ id: comment.userId }).first()
            existsOrError(userAffected, 'User don\'t exists')

            const postAffected = await app.db('posts').where({ id: comment.postId }).first()
            existsOrError(postAffected, 'Post don\'t exists')
        } catch (err) {
            return res.status(400).send(err)
        }

        app.db('comments')
            .insert(comment)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    const edit = async (req, res) => {
        if (!req.params.id) res.status(400).send('Comment not given')
        if (!req.body.content) res.status(400).send('Fields cannot be empty')
        
        const comment = { content: req.body.content }
        const id = req.params.id

        app.db('comments')
            .update(comment)
            .where({ id })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }
    
    const remove = async (req, res) => {
        if (!req.params.id) res.status(400).send('Comment not given')
        const id = req.params.id
        
        try {
            const rowsDeleted = await app.db('comments').where({ id }).del()
            existsOrError(rowsDeleted, 'Comment don\'t exists')

            res.status(204).send()
        } catch (err) {
            return res.status(500).send(err)
        }
    }

    return { save, edit, remove }
}