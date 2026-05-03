// Define your types here
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin";
}
