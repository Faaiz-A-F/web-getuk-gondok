"use client";

import { createContext, ReactNode, useState } from "react";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
  pickupLocation?: string;
  note?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNote: (id: string, note: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((cartItem) => cartItem.productId === item.productId);

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.productId === item.productId
            ? {
                ...cartItem,
                quantity: cartItem.quantity + item.quantity,
                pickupLocation: item.pickupLocation ?? cartItem.pickupLocation,
              }
            : cartItem
        );
      }

      return [...currentItems, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const updateNote = (id: string, note: string) => {
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, note } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, updateNote, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
