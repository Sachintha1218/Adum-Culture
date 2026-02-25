"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterForm() {
    const { register } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!name || !email || !password) {
            setError("Please fill in all required fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        // Mock loading state
        setLoading(true);
        setTimeout(() => {
            register(name, email, phone);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-background border rounded-lg shadow-sm">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-serif font-bold uppercase tracking-widest mb-2">Create Account</h2>
                <p className="text-muted-foreground">Join Adum Culture for exclusive access</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center">
                        {error}
                    </div>
                )}
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        required
                        className="w-full"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="register-email">Email Address <span className="text-destructive">*</span></Label>
                    <Input
                        id="register-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="register-password">Password <span className="text-destructive">*</span></Label>
                    <Input
                        id="register-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full"
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? "Creating Account..." : "Create Account"}
                </Button>
            </form>
        </div>
    );
}
