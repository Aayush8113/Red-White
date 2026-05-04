import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  // Load from local storage
  useEffect(() => {
    const cartData = localStorage.getItem('cartItems');
    if (cartData) {
      setCartItems(JSON.parse(cartData));
    }
    const shippingData = localStorage.getItem('shippingAddress');
    if (shippingData) {
      setShippingAddress(JSON.parse(shippingData));
    }
  }, []);

  // Clear cart on logout
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      localStorage.removeItem('cartItems');
    }
  }, [user]);

  const addToCart = (product, qty) => {
    const existItem = cartItems.find((x) => x.book === product._id || x.book === product.book);

    let newItems;
    if (existItem) {
      newItems = cartItems.map((x) =>
        (x.book === product._id || x.book === product.book) ? { ...x, qty } : x
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

  const saveShippingAddress = (data) => {
    setShippingAddress(data);
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  };

  const savePaymentMethod = (data) => {
    setPaymentMethod(data);
    localStorage.setItem('paymentMethod', JSON.stringify(data));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      shippingAddress, 
      paymentMethod,
      addToCart, 
      removeFromCart, 
      saveShippingAddress,
      savePaymentMethod,
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
