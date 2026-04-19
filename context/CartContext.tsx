"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, Product } from "@/types";

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity: number, selectedSize: string) => void;
    removeFromCart: (productId: string, selectedSize: string) => void;
    updateQuantity: (productId: string, selectedSize: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    shippingCharge: number;
    finalTotal: number;
    discount: number;
    appliedCouponCode: string | null;
    applyDiscount: (code: string, amount: number) => void;
    removeDiscount: () => void;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
    const [discount, setDiscount] = useState<number>(0);

    // Load from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setCartItems(parsedCart.items || []);
                setAppliedCouponCode(parsedCart.appliedCouponCode || null);
                setDiscount(parsedCart.discount || 0);
            } catch (error) {
                console.error("Failed to parse cart from local storage", error);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage whenever cart changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("cart", JSON.stringify({ items: cartItems, appliedCouponCode, discount }));
        }
    }, [cartItems, appliedCouponCode, discount, isLoaded]);

    const addToCart = (product: Product, quantity: number, selectedSize: string) => {
        setCartItems((prevItems) => {
            const productId = product._id ?? product.id;
            const existingItemIndex = prevItems.findIndex(
                (item) => (item._id ?? item.id) === productId && item.selectedSize === selectedSize
            );

            if (existingItemIndex > -1) {
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                return [...prevItems, { ...product, quantity, selectedSize }];
            }
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: string, selectedSize: string) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => !((item._id ?? item.id) === productId && item.selectedSize === selectedSize))
        );
    };

    const updateQuantity = (productId: string, selectedSize: string, quantity: number) => {
        if (quantity < 1) return;
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                (item._id ?? item.id) === productId && item.selectedSize === selectedSize
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        setAppliedCouponCode(null);
        setDiscount(0);
    };

    const applyDiscount = (code: string, amount: number) => {
        setAppliedCouponCode(code);
        setDiscount(amount);
    };

    const removeDiscount = () => {
        setAppliedCouponCode(null);
        setDiscount(0);
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingCharge = cartTotal > 0 && cartTotal < 10000 ? 250 : 0;
    const finalTotal = Math.max(0, cartTotal - discount) + shippingCharge;

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,
                shippingCharge,
                finalTotal,
                discount,
                appliedCouponCode,
                applyDiscount,
                removeDiscount,
                isCartOpen,
                openCart,
                closeCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
