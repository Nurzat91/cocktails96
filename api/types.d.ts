import {Model} from "mongoose";
export interface UserFields {
  email: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
  googleID: string;
  avatar: string;
}

interface UserMethods{
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

type UserModel = Model<UserFields, {}, UserMethods>;

export interface Ingredient {
  name: string;
  amount: string;
}
export interface Cocktails{
  author: Types.ObjectId;
  name: string;
  image: string;
  receipt: string;
  isPublished: boolean;
  ingredients: Ingredient[];
}
