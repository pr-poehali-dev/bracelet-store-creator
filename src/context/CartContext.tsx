import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomDesign {
  id: string;
  name: string;
  stones: string[];
  size: number;
  clasp: string;
  createdAt: string;
  price: number;
}

interface CartContextType {
  items: CartItem[];
  savedDesigns: CustomDesign[];
  cartDesigns: CustomDesign[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  saveDesign: (design: CustomDesign) => void;
  deleteDesign: (id: string) => void;
  addDesignToCart: (design: CustomDesign) => void;
  removeDesignFromCart: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedDesigns, setSavedDesigns] = useState<CustomDesign[]>([]);
  const [cartDesigns, setCartDesigns] = useState<CustomDesign[]>([]);

  const addToCart = (product: Product) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId: number, qty: number) => {
    if (qty <= 0) return removeFromCart(productId);
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setItems([]);

  const saveDesign = (design: CustomDesign) => {
    setSavedDesigns(prev => [design, ...prev]);
  };

  const deleteDesign = (id: string) => {
    setSavedDesigns(prev => prev.filter(d => d.id !== id));
  };

  const addDesignToCart = (design: CustomDesign) => {
    setCartDesigns(prev => {
      if (prev.find(d => d.id === design.id)) return prev;
      return [...prev, design];
    });
  };

  const removeDesignFromCart = (id: string) => {
    setCartDesigns(prev => prev.filter(d => d.id !== id));
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0) + cartDesigns.length;
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0) + cartDesigns.reduce((sum, d) => sum + d.price, 0);

  return (
    <CartContext.Provider value={{ items, savedDesigns, cartDesigns, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, saveDesign, deleteDesign, addDesignToCart, removeDesignFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}