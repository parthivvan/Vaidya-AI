import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. INITIALIZE FROM LOCAL STORAGE
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('vaidya_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  // 2. AUTO-SAVE
  useEffect(() => {
    localStorage.setItem('vaidya_cart', JSON.stringify(cart));
  }, [cart]);

  // Add Item
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Remove Item
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  // 🟢 NEW: INCREMENT / DECREMENT LOGIC
  const updateQuantity = (productId, action) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item._id === productId) {
          let currentQty = item.quantity || 1;

          if (action === 'increase') currentQty += 1;
          if (action === 'decrease' && currentQty > 1) currentQty -= 1; // Prevents going to 0

          return { ...item, quantity: currentQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('vaidya_cart');
  };

  // 🟢 Make sure to export `updateQuantity` here!
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);