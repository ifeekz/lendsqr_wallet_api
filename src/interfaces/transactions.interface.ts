export interface Transaction {
  id: number;
  wallet_id: string;
  description: string;
  amount: number;
  type: string;
  status: string;
}
