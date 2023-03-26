import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transfers', table => {
    table.bigIncrements('id').unsigned().primary();
    table.string('sender_wallet_id', 20).notNullable();
    table.string('receiver_wallet_id', 20).notNullable();
    table.float('amount', 8, 2).notNullable();
    table.bigInteger('transaction_id').unsigned().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.foreign('sender_wallet_id').references('wallet_id').inTable('wallets').onDelete('RESTRICT');
    table.foreign('receiver_wallet_id').references('wallet_id').inTable('wallets').onDelete('RESTRICT');
    table.foreign('transaction_id').references('id').inTable('transactions').onDelete('CASCADE');
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transfers');
}

