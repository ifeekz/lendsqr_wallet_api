import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('transactions', table => {
      table.bigIncrements('id').unsigned().primary();
      table.string('wallet_id', 20).notNullable();
      table.string('description').nullable();
      table.float('amount', 8, 2).notNullable();
      table.string('type').notNullable();
      table.string('status').notNullable();
      table.timestamps({ defaultToNow: true });

      table.foreign('wallet_id').references('wallet_id').inTable('wallets').onDelete('CASCADE');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('transactions');
}

