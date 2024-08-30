/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('comments', table => {
        table.increments('id').primary()
        table.text('content').notNullable()

        table.integer('userId')
            .unsigned().notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')

        table.integer('postId')
            .unsigned().notNullable()
            .references('id')
            .inTable('posts')
            .onDelete('CASCADE')

        table.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('comments')
};
