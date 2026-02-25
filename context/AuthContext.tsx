"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Mock Types
export interface Order {
    id: string;
    date: string;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    total: number;
    items: {
        id: string;
        name: string;
        image: string;
        quantity: number;
        price: number;
        size?: string;
        slug?: string;
    }[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    usedCoupons?: string[];
    orders?: Order[];
}

interface AuthContextType {
    user: User | null;
    login: (email: string) => void;
    register: (name: string, email: string, phone?: string) => void;
    logout: () => void;
    updateUser: (data: Partial<User>) => void;
    recordUsedCoupon: (code: string) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("adum_user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                // Silently ignore parse errors
            }
        }
    }, []);

    const login = (email: string) => {
        // In a real app, this would verify credentials
        // For mock purposes, if we have a stored user matching the email, we log them in,
        // otherwise we just mock a successful login to avoid being blocked.

        let mockUser: User = {
            id: "mock-id-123",
            name: "Test User",
            email: email,
            usedCoupons: [],
            orders: [
                {
                    id: "ORD-8X9D2F",
                    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'Processing',
                    total: 12500,
                    items: [
                        {
                            id: "item-1",
                            name: "Silk Evening Gown",
                            image: "https://images.unsplash.com/photo-1566160911598-c923d386c91a?q=80&w=1000&auto=format&fit=crop",
                            quantity: 1,
                            price: 12500,
                            size: "M",
                            slug: "silk-evening-gown"
                        }
                    ]
                },
                {
                    id: "ORD-3B2M1L",
                    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'Delivered',
                    total: 18000,
                    items: [
                        {
                            id: "item-2",
                            name: "Linen Summer Dress",
                            image: "https://images.unsplash.com/photo-1572804013309-8c98e4f5ed33?q=80&w=1000&auto=format&fit=crop",
                            quantity: 1,
                            price: 8500,
                            size: "S",
                            slug: "linen-summer-dress"
                        },
                        {
                            id: "item-3",
                            name: "Cashmere Cardigan",
                            image: "https://images.unsplash.com/photo-1588622171447-0e6e73711913?q=80&w=1000&auto=format&fit=crop",
                            quantity: 1,
                            price: 9500,
                            size: "M",
                            slug: "cashmere-cardigan"
                        }
                    ]
                }
            ]
        };

        const storedUser = localStorage.getItem("adum_user");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed.email === email) {
                    mockUser = parsed;
                }
            } catch (e) {
                // Silently ignore parse errors
            }
        }

        setUser(mockUser);
        localStorage.setItem("adum_user", JSON.stringify(mockUser));
    };

    const register = (name: string, email: string, phone?: string) => {
        const newUser: User = {
            id: Math.random().toString(36).substring(2, 9),
            name,
            email,
            phone,
            usedCoupons: [],
        };
        setUser(newUser);
        localStorage.setItem("adum_user", JSON.stringify(newUser));
    };

    const updateUser = (data: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem("adum_user", JSON.stringify(updatedUser));
    };

    const recordUsedCoupon = (code: string) => {
        if (!user) return;
        const updatedUser = {
            ...user,
            usedCoupons: [...(user.usedCoupons || []), code]
        };
        setUser(updatedUser);
        localStorage.setItem("adum_user", JSON.stringify(updatedUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("adum_user");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                updateUser,
                recordUsedCoupon,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
