export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  stock: number;
  brand?: string;
  discount?: number;
  specs: {
    [key: string]: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  address?: string;
}

export interface Review {
  id: number;
  productId: number;
  rating: number;
  comment: string;
  userName: string;
  date: string;
  helpfulCount?: number;
  photos?: string[];
  aspectRatings?: {
    camera?: number;
    battery?: number;
    display?: number;
    design?: number;
  };
}