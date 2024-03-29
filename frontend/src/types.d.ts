export interface User {
  _id: string;
  email: string;
  displayName: string;
  token: string;
  role: string;
  avatar: string | null;
}
export interface LoginMutation {
  email: string;
  password: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    }
  },
  message: string;
  name: string;
  _message: string;
}
export interface GlobalError {
  error: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
}
export interface RegisterMutation {
  email: string;
  password: string;
  displayName: string;
  avatar: File | null;
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Cocktail{
  _id: string;
  author: string;
  name: string;
  image: string;
  receipt: string;
  isPublished: boolean;
  ingredients: Ingredient[];
}

export interface CocktailMutation {
  name: string;
  image: File | null;
  receipt: string;
  ingredients: Ingredient[];
}