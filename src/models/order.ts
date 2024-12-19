import type { Merchant } from './gift-card';

export interface iOrder {
  payment_id: string;
  merchant: Merchant;
  name: string;
  email: string;
  message: string;
  amount: number;
  status: number;
  created_at: string;
  deliver_order : number;
  delivery_status : number;
}

export interface iNotification {
  id: number;
  title: string;
  message: string;
  order?: iOrder;
  created_at: string;
}
