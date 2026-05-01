import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cartData = localStorage.getItem('cartItems');
    if (cartData) {
      setCartItems(JSON.parse(cartData));
    }
  }, []);

  const addToCart = (product, qty) => {
    const existItem = cartItems.find((x) => x.book === product._id);

    let newItems;
    if (existItem) {
      newItems = cartItems.map((x) =>
        x.book === existItem.book ? { ...x, qty } : x
      );
    } else {
      newItems = [...cartItems, {
        book: product._id,
        title: product.title,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty
      }];
    }
    
    setCartItems(newItems);
    localStorage.setItem('cartItems', JSON.stringify(newItems));
  };

  const removeFromCart = (id) => {
    const newItems = cartItems.filter((x) => x.book !== id);
    setCartItems(newItems);
    localStorage.setItem('cartItems', JSON.stringify(newItems));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
