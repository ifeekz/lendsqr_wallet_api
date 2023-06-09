import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', table => {
    table.bigIncrements('id').unsigned().primary();
    table.string('name', 100).notNullable();
    table.string('email', 100).unique().notNullable();
    table.string('phone_number', 20).unique().notNullable();
    table.string('password', 255).notNullable();
    table.timestamps({ defaultToNow: true });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
