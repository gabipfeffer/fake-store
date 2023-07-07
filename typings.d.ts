import { FieldValue } from "@firebase/firestore-types";
import { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";
import { BankAccount } from "@stripe/stripe-js";

export type SortDirection = "asc" | "desc";

export type NavItem = {
  url: string;
  title: string;
  icon: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & RefAttributes<SVGSVGElement>
  >;
};

export type User = {
  id: string;
  name: string;
  emailVerified: boolean | null;
  email: string;
  image: string;
};

export type Product = {
  id: string;
  title: string;
  images: { name: string; imageUrl: string }[];
  price: number;
  inventory: number;
  ranking: number;
  description: string;
  category: string;
  image: string;
  status: "active" | "inactive";
  last_updated_at: number | FieldValue;
  created_at: number | FieldValue;
  rating?: {
    rate: number;
    count: number;
  };
};

export type Order = {
  id: string;
  amount: number;
  amount_shipping: number;
  images: string[];
  timestamp: number | FieldValue;
  items?: any[];
  user_id: string;
};

export type PrometeoBankLogin = {
  username: string;
  rut?: string;
  password: string;
};

export type PrometeoSession = {
  key: string;
  status: string;
};
export type PrometeoBankAccount = {
  balance: number;
  branch: string;
  currency: string;
  id: string;
  name: string;
  number: string;
};

export type Address = {
  Country: string;
  City: string;
  State: string;
  PostalCode: string;
  AddressDetail: string;
};

export type Customer = {
  Email: string;
  DocNumber: string;
  PhoneNumber: string;
  FirstName: string;
  LastName: string;
  DocumentTypeId: number;
  ShippingAddress?: Address;
  BillingAddress?: Address;
};

export type BambooCardDetails = {
  CardHolderName: string;
  Pan: string;
  CVV: string;
  Expiration: string;
  Email: string;
  Document: string;
};

export type CartItem = { quantity: number; product: Product };

export type CartShipping = {
  name: string;
  price: number | string;
};

export type CardData = {
  CardHolderName: string;
  Pan: string;
  CVV: string;
  Expiration: string;
  Email: string;
  Document: string;
};

export type PaymentType = "bank_transfer" | "card";

export type PaymentData = {
  Description: string;
  Amount: number;
  TaxableAmount: string;
  Order: string;
  Invoice: string;
  PaymentType: PaymentType;
  ShippingAddress: Address;
  BillingAddress: Address;
  Customer: Customer;
  CardData?: CardData;
  session?: PrometeoSession;
  accounts?: BankAccount[];
  request_id?: string;
  pre_process_approved?: string;
  account?: BankAccount;
  authorization_type: string;
  authorization_data: string;
  authorization_device_number: string;
};
