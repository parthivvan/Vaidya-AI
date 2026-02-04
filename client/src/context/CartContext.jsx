import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Load from LocalStorage
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('healthHiveCart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('healthHiveCart', JSON.stringify(cart));
  }, [cart]);

  // 1. Add Item (Push to array)
  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  // 2. Remove ALL instances (Trash Can behavior)
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter(item => item._id !== productId));
  };

  // 3. 🆕 Remove SINGLE instance (Minus button behavior)
  const decreaseCartItem = (productId) => {
    setCart((prev) => {
      const index = prev.findIndex(item => item._id === productId);
      if (index !== -1) {
        const newCart = [...prev];
        newCart.splice(index, 1); // Removes exactly one item at that index
        return newCart;
      }
      return prev;
    });
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, decreaseCartItem, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};