"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

export interface OrderItem {
    id: string;
    name: string;
    image?: string;
    quantity: number;
    price: number;
    size?: string;
    slug?: string;
    sku?: string;
}

export interface Order {
    id: string;
    ormOrderNumber?: string | null;
    createdAt: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    total: number;
    subtotal: number;
    shippingCost: number;
    discount: number;
    items: OrderItem[];
    customerName: string;
    customerEmail?: string | null;
    customerPhone: string;
    shippingAddress: string;
    city: string;
    district: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    emailVerified?: boolean;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (data: Partial<User>) => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function apiFetch(path: string, options?: RequestInit) {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    const res = await fetch(`${API}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options?.headers ?? {}),
        },
    });
    const data = await res.json();
    if (!data.success && res.status >= 400) throw new Error(data.message ?? "Request failed");
    return data;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On mount restore session from httpOnly cookie via /api/auth/me
    useEffect(() => {
        apiFetch("/api/auth/me")
            .then((data) => setUser(data.data.user))
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
    }, []);

    const login = async (email: string, password: string) => {
        const data = await apiFetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
        if (data.data.token) localStorage.setItem("auth_token", data.data.token);
        setUser(data.data.user);
    };

    const register = async (name: string, email: string, password: string, phone?: string) => {
        const data = await apiFetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password, ...(phone ? { phone } : {}) }),
        });
        if (data.data?.token) localStorage.setItem("auth_token", data.data.token);
        if (data.data?.user) setUser(data.data.user);
    };

    const logout = async () => {
        await apiFetch("/api/auth/logout", { method: "POST" }).catch(() => {});
        localStorage.removeItem("auth_token");
        setUser(null);
    };

    const updateUser = (data: Partial<User>) => {
        setUser((prev) => (prev ? { ...prev, ...data } : null));
    };

    const refreshUser = async () => {
        const data = await apiFetch("/api/auth/me");
        setUser(data.data.user);
    };

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateUser, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

// Re-export apiFetch for use in other components
export { apiFetch };
