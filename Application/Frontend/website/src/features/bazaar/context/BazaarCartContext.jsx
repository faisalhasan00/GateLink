import React, { createContext, useContext, useState, useEffect } from 'react';

const BazaarCartContext = createContext();

export const MORNING_DELIVERY_SLOTS = [
  { id: 'slot-1', label: '5:00 AM - 6:00 AM', tag: 'Early Bird', description: 'Before morning walks' },
  { id: 'slot-2', label: '6:00 AM - 7:00 AM', tag: 'Recommended', description: 'Fresh tea & breakfast prep' },
  { id: 'slot-3', label: '7:00 AM - 8:00 AM', tag: 'Popular', description: 'Morning family breakfast' },
  { id: 'slot-4', label: '8:00 AM - 9:00 AM', tag: 'Standard', description: 'Relaxed morning delivery' }
];

export function BazaarCartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('gatelink_bazaar_cart');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('6:00 AM - 7:00 AM');
  const [selectedSocietyFlat, setSelectedSocietyFlat] = useState({
    society: 'My Home Bhooja',
    locality: 'Hitec City, Hyderabad',
    tower: 'Tower 4',
    flat: 'Flat 1204',
    deliveryTime: 'Tomorrow 5:00 AM - 9:00 AM'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    try {
      localStorage.setItem('gatelink_bazaar_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Cart sync error:', e);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const currentQty = prev[product.id]?.quantity || 0;
      return {
        ...prev,
        [product.id]: {
          ...product,
          quantity: currentQty + 1
        }
      };
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const currentQty = prev[productId]?.quantity || 0;
      if (currentQty <= 1) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: currentQty - 1
        }
      };
    });
  };

  const deleteFromCart = (productId) => {
    setCartItems(prev => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const clearCart = () => {
    setCartItems({});
  };

  const totalItemsCount = Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0);
  const itemsTotalAmount = Object.values(cartItems).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotalAmount = Object.values(cartItems).reduce((sum, item) => sum + ((item.mrp || item.price) * item.quantity), 0);
  const totalSavings = originalTotalAmount - itemsTotalAmount;
  const deliveryFee = itemsTotalAmount >= 99 || itemsTotalAmount === 0 ? 0 : 25;
  const handlingFee = totalItemsCount > 0 ? 3 : 0;
  const grandTotal = itemsTotalAmount + deliveryFee + handlingFee;

  return (
    <BazaarCartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        selectedSlot,
        setSelectedSlot,
        selectedSocietyFlat,
        setSelectedSocietyFlat,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        totalItemsCount,
        itemsTotalAmount,
        originalTotalAmount,
        totalSavings,
        deliveryFee,
        handlingFee,
        grandTotal
      }}
    >
      {children}
    </BazaarCartContext.Provider>
  );
}

export function useBazaarCart() {
  const context = useContext(BazaarCartContext);
  if (!context) {
    throw new Error('useBazaarCart must be used within a BazaarCartProvider');
  }
  return context;
}
