import { useState, useContext, createContext, useEffect } from "react";

const cartContext = createContext();
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    let prevCart = localStorage.getItem("cart");

    if (prevCart) setCart(JSON.parse(prevCart));
  }, []);

  return (
    <cartContext.Provider value={[cart, setCart]}>
      {children}
    </cartContext.Provider>
  );
};

// custom hook
const useCart = () => useContext(cartContext);

export { useCart, CartProvider };
