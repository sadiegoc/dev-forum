module.exports = app => {
    const { existsOrError } = app.controllers.validation
    const limit = 3

    const save = async (req, res) => {
        const post = { ...req.body } // recebe o post pelo body

        try {
            existsOrError(post.userId, 'User not given')
            existsOrError(post.title, 'Title not given')
            existsOrError(post.content, 'Content not given')

            const rowsAffected = await app.db('users').where({ id: post.userId }).first()
            existsOrError(rowsAffected, 'User don\'t exists')
        } catch (err) {
            return res.status(400).send(err)
        }

        app.db('posts')
            .insert(post)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    const getByPostId = async (req, res) => {
        if (!req.body.id) res.status(400).send('Post not given')
        const id = req.body.id

        await app.db('posts')
            .leftJoin('comments', 'posts.id', '=', 'comments.postId')
            .leftJoin('users as postUser', 'posts.userId', '=', 'postUser.id')
            .leftJoin('users as commentUser', 'comments.userId', '=', 'commentUser.id')
            .select(
                'posts.id as postId',
                'posts.title as postTitle',
                'posts.content as postContent',
                'posts.userId as postUserId',
                'posts.created_at as postCreatedAt',
                'postUser.firstName as postFirstName',
                'postUser.lastName as postLastName',
                'comments.id as commentId',
                'comments.content as commentContent',
                'comments.userId as commentUserId',
                'commentUser.firstName as commentFirstName',
                'commentUser.lastName as commentLastName'
            )
            .where('posts.id', id)
            .then(results => {
                if (results.legth === 0) return res.status(404).send('Post not found')

                const post = {
                    id: results[0].postId,
                    title: results[0].postTitle,
                    content: results[0].postContent,
                    userId: results[0].postUserId,
                    createdAt: results[0].postCreatedAt,
                    userFirstName: results[0].postFirstName,
                    userLastName: results[0].postLastName,
                    comments: results
                        .filter(row => row.commentId)
                        .map(row => ({
                            id: row.commentId,
                            content: row.commentContent,
                            userId: row.commentUserId,
                            userFirstName: row.commentFirstName,
                            userLastName: row.commentLastName
                        }))
                }

                res.status(200).json(post)
            })
            .catch(err => res.status(500).send(err))
    }

    const getByUserId = async (req, res) => {
        if (!req.query.id) res.status(400).send('User not given')
        const id = req.query.id
        const page = req.query.page || 1

        try {
            const posts = await app.db('posts')
                .leftJoin('users', 'users.id', '=', 'posts.userId')
                .select(
                    'posts.id',
                    'posts.title',
                    'posts.created_at as createdAt',
                    'posts.userId as userId',
                    
                    'users.firstName as userFirstName',
                    'users.lastName as userLastName'
                )
                .limit(limit).offset(page * limit - limit)
                .where({'users.id': id})
                .orderBy('createdAt', 'desc')
            res.status(200).send(posts)
        } catch (err) {
            res.status(500).send(err)
        }
    }

    const getAll = async (req, res) => {
        const page = req.query.page || 1

        app.db('posts')
            .leftJoin('users', 'users.id', '=', 'posts.userId')
            .select(
                'posts.id',
                'posts.title',
                'posts.created_at as createdAt',
                'posts.userId as userId',
                
                'users.firstName as userFirstName',
                'users.lastName as userLastName'
            )
            .limit(limit).offset(page * limit - limit)
            .orderBy('createdAt', 'desc')
            .then(posts => res.status(200).json(posts))
            .catch(err => res.status(500).send(err))
    }

    const edit = async (req, res) => {
        if (!req.params.id) res.status(400).send('Post not given')
        if (!req.body.title || !req.body.content) return res.status(400).send('Fields cannot be empty')
        
        const post = { title: req.body.title, content: req.body.content }
        const id = req.params.id

        app.db('posts')
            .update(post)
            .where({ id })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        if (!req.params.id) res.status(400).send('Post not given')
        const id = req.params.id
        
        try {
            const rowsDeleted = await app.db('posts').where({ id }).del()
            existsOrError(rowsDeleted, 'Post don\'t exists')

            res.status(204).send()
        } catch (err) {
            return res.status(500).send(err)
        }
    }

    return { save, getAll, getByPostId, getByUserId, remove, edit }
}