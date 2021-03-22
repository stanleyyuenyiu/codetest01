import { Document, Types } from 'mongoose';

export interface IUserEntity extends Document {
  _id: string;
  userName: string;
  age: number;
  height: number;
  gender: string;
  saleAmount: number;
  lastPurchaseDate: Date;
}
