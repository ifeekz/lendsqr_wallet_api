import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('wallets', table => {
      table.bigIncrements('id').unsigned().primary();
      table.string('wallet_id', 20).unique().notNullable();
      table.float('balance', 8, 2).defaultTo(0);
      table.timestamps({ defaultToNow: true });

      table.foreign('wallet_id').references('phone_number').inTable('users').onDelete('CASCADE');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('wallets');
}

