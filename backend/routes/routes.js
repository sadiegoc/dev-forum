module.exports = app => {
    app.post('/signup', app.controllers.user.save)
    app.post('/signin', app.controllers.user.login)
    app.post('/validate-token', app.controllers.user.validateToken)

    app.route('/post')
        .get(app.controllers.post.getAll)
        .post(
            app.middlewares.passport.authenticate(),
            app.controllers.post.save
        )
    
    app.route('/post/:id')
        .get(app.controllers.post.getById)
        .patch(
            app.middlewares.passport.authenticate(),
            app.controllers.post.edit
        )
        .delete(
            app.middlewares.passport.authenticate(),
            app.controllers.post.remove
        )

    app.route('/comment')
        .all(app.middlewares.passport.authenticate())
        .post(app.controllers.comment.save)

    app.route('/comment/:id')
        .all(app.middlewares.passport.authenticate())
        .patch(app.controllers.comment.edit)
        .delete(app.controllers.comment.remove)
}