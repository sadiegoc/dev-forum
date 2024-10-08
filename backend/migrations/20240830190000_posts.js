/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('posts', table => {
        table.increments('id').primary()
        table.string('title', 255).notNullable()
        table.binary('content').notNullable()

        table.integer('userId')
            .unsigned().notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')

        table.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('posts')
};
