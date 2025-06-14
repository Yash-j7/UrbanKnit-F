import { useState, useContext, createContext, useEffect } from "react";

const cartContext = createContext();

// Helper function to validate cart item
const isValidCartItem = (item) => {
  return (
    item &&
    typeof item === 'object' &&
    item._id &&
    typeof item.price === 'number' &&
    item.price > 0 &&
    typeof item.quantity === 'number' &&
    item.quantity > 0 &&
    (item.name || item.title) // Ensure item has a name or title
  );
};

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const prevCart = localStorage.getItem("cart");
      if (prevCart) {
        const parsedCart = JSON.parse(prevCart);
        // Validate that parsedCart is an array
        if (Array.isArray(parsedCart)) {
          // Filter out invalid items
          const validCart = parsedCart.filter(isValidCartItem);
          setCart(validCart);
          // If some items were invalid, update localStorage
          if (validCart.length !== parsedCart.length) {
            localStorage.setItem("cart", JSON.stringify(validCart));
          }
        } else {
          // If parsedCart is not an array, reset to empty cart
          setCart([]);
          localStorage.removeItem("cart");
        }
      } else {
        // If no cart in localStorage, ensure empty cart
        setCart([]);
        localStorage.removeItem("cart");
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      // Reset cart on error
      setCart([]);
      localStorage.removeItem("cart");
    }
  }, []);

  // Wrap setCart to ensure data validation
  const updateCart = (newCart) => {
    if (Array.isArray(newCart)) {
      const validCart = newCart.filter(isValidCartItem);
      setCart(validCart);
      localStorage.setItem("cart", JSON.stringify(validCart));
    } else {
      console.error("Invalid cart data:", newCart);
      setCart([]);
      localStorage.removeItem("cart");
    }
  };

  return (
    <cartContext.Provider value={[cart, updateCart]}>
      {children}
    </cartContext.Provider>
  );
};

// custom hook
const useCart = () => useContext(cartContext);

export { useCart, CartProvider };
