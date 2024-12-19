import type { User } from './user';

export interface City {
  id: number;
  name: string;
}

export type Town = City;

export interface Category {
  id: number;
  name: string;
  image: string;
  icon: string;
}

export interface BizCategory {
  id: number;
  name: string;
}

export interface Amount {
  id: number;
  amount: number;
  amount_usd: number;
  fee : number;
  commission_usd: number
}

export type AuthState = {
  user: User | null;
  _token: string | null;
};
