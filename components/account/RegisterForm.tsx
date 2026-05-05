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
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setSuccess("");

        if (password.length < 8) { setError("Password must be at least 8 characters."); return; }

        setLoading(true);
        try {
            await register(name, email, password, phone || undefined);
            setSuccess("Account created! Check your email to verify, then sign in.");
            setName(""); setEmail(""); setPassword(""); setPhone("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-background border rounded-lg shadow-sm">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-serif font-bold uppercase tracking-widest mb-2">Create Account</h2>
                <p className="text-muted-foreground">Join Adum Culture for exclusive access</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center">{error}</div>}
                {success && <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md text-center">{success}</div>}
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="reg-email">Email Address <span className="text-destructive">*</span></Label>
                    <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 7X XXX XXXX" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="reg-password">Password <span className="text-destructive">*</span></Label>
                    <Input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                </Button>
            </form>
        </div>
    );
}
