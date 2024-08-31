module.exports = app => {
    app.post('/signup', app.controllers.user.save)
    app.post('/signin', app.controllers.user.login)
    app.post('/validate-token', app.controllers.user.validateToken)

    app.route('/posts')
        .get(app.controllers.post.getAll)
    
    app.route('/posts/my-posts')
        .get(app.controllers.post.getByUserId)
        .post(app.middlewares.passport.authenticate(), app.controllers.post.save)

    app.route('/posts/my-posts/:id')
        .all(app.middlewares.passport.authenticate())
        .patch(app.controllers.post.edit)
        .delete(app.controllers.post.remove)

    app.route('/posts/:id')
        .get(app.controllers.post.getByPostId)

    app.route('/comment')
        .all(app.middlewares.passport.authenticate())
        .post(app.controllers.comment.save)

    app.route('/comment/:id')
        .all(app.middlewares.passport.authenticate())
        .patch(app.controllers.comment.edit)
        .delete(app.controllers.comment.remove)
}