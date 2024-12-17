export interface IItem {
  id: string;
  category: string;
  brand?: string;
  name: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  age: number;
}

export interface IOrder {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
  orderCode: string;
  quantity: number;
  item: IItem;
  itemId: string;
  user: IUser;
  totalPrice: number;
  createdAt: Date;
}
