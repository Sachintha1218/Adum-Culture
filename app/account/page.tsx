"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Container from "@/components/shared/Container";
import LoginForm from "@/components/account/LoginForm";
import RegisterForm from "@/components/account/RegisterForm";
import AccountDashboard from "@/components/account/AccountDashboard";

export default function AccountPage() {
    const { isAuthenticated, user } = useAuth();
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <div className="pt-32 pb-24 min-h-screen">
            <Container>
                {isAuthenticated && user ? (
                    <div>
                        <div className="mb-12 text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-serif font-bold uppercase tracking-widest mb-4">
                                My Account
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl">
                                Manage your profile, track orders, and update settings.
                            </p>
                        </div>
                        <AccountDashboard />
                    </div>
                ) : (
                    <div className="max-w-md mx-auto mt-8">
                        <div className="flex justify-center mb-8 bg-muted/30 p-1 rounded-lg">
                            <button
                                onClick={() => setIsLoginView(true)}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLoginView
                                    ? "bg-background shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setIsLoginView(false)}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLoginView
                                    ? "bg-background shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Create Account
                            </button>
                        </div>

                        <div className="transition-all duration-300">
                            {isLoginView ? <LoginForm /> : <RegisterForm />}
                        </div>
                    </div>
                )}
            </Container>
        </div>
    );
}
