import type { Amount, BizCategory, City, Town } from './common';

export interface Card {
  id: number;
  merchant_id: Merchant['id'];
  amount_id: number;
  amount: Amount;
}

export interface Merchant {
  id: number;
  name: string;
  image: string;
  city_id: number;
  category_id: string;
  category: BizCategory;
  city: City;
  town: Town;
  cards?: Card[];
  images?: string[];
  currency_type?:string;
}


export interface Cart {
  id: number;
  image: string;
  bizitem : object;
  description : string
  amount : object;
}

