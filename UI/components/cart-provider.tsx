"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCart, addToCartApi, updateCartItemApi, removeFromCartApi, clearCartApi } from "@/services/cart";
import type { Product } from "@/lib/types";

type CartItem = {
  cartItemId: string; // Add cartItemId property
  product: Product;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchLatestCart: () => Promise<void>; // Add fetchLatestCart to the type
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const fetchLatestCart = async () => {
    try {
      const cartItems = await fetchCart();
      console.log("Updated Cart Items:", cartItems); // Log updated cart items for debugging
      setItems(cartItems);
    } catch (error) {
      console.error("Failed to fetch latest cart:", error); // Log error details
    }
  };

  useEffect(() => {
    fetchLatestCart(); // Load cart data on component mount
  }, []);

  const addItem = async (product: Product, quantity?: number) => {
    const finalQuantity = quantity ?? 1; // Default to 1 if quantity is undefined
    if (finalQuantity <= 0) {
      console.error("Invalid quantity:", finalQuantity); // Log invalid quantity for debugging
      return;
    }
    await addToCartApi(product.productId, finalQuantity);
    await fetchLatestCart(); // Fetch updated cart data
  };

  const removeItem = async (cartItemId: string) => {
    await removeFromCartApi(cartItemId);
    await fetchLatestCart(); // Fetch updated cart data
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    try {
      await updateCartItemApi(cartItemId, newQuantity);
      await fetchLatestCart(); // Fetch updated cart data
    } catch (error) {
      console.error("Failed to update quantity:", error); // Log error for debugging
    }
  };

  const clearCart = async () => {
    await clearCartApi();
    await fetchLatestCart(); // Fetch updated cart data
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => {
    if (!item.product || !item.product.price) {
      console.warn("Invalid product data:", item.product); // Log invalid product data for debugging
      return total;
    }
    return total + item.product.price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        fetchLatestCart, // Include fetchLatestCart in the provider
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
