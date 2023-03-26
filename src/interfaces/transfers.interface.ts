export interface Transfer {
  id: number;
  sender_wallet_id: string;
  receiver_wallet_id: string;
  amount: number;
  transaction_id: number;
}
