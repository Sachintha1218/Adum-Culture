"use client";

import { useState } from "react";
import { useAuth, apiFetch } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ForgotStep = "idle" | "email" | "otp";

export default function LoginForm() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Forgot password state
    const [forgotStep, setForgotStep] = useState<ForgotStep>("idle");
    const [forgotEmail, setForgotEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [forgotError, setForgotError] = useState("");
    const [forgotSuccess, setForgotSuccess] = useState("");
    const [forgotLoading, setForgotLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setForgotError(""); setForgotSuccess("");
        if (!forgotEmail.trim()) { setForgotError("Please enter your email address."); return; }
        setForgotLoading(true);
        try {
            await apiFetch("/api/public/auth/otp/send", {
                method: "POST",
                body: JSON.stringify({ email: forgotEmail.trim(), purpose: "password_reset" }),
            });
            setForgotSuccess("A 6-digit code has been sent to your email.");
            setForgotStep("otp");
        } catch (err) {
            setForgotError(err instanceof Error ? err.message : "Failed to send code. Please try again.");
        } finally {
            setForgotLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setForgotError(""); setForgotSuccess("");
        if (otp.length !== 6) { setForgotError("Please enter the 6-digit code."); return; }
        if (newPassword.length < 8) { setForgotError("Password must be at least 8 characters."); return; }
        if (newPassword !== confirmPassword) { setForgotError("Passwords do not match."); return; }
        setForgotLoading(true);
        try {
            await apiFetch("/api/public/auth/otp/verify", {
                method: "POST",
                body: JSON.stringify({ email: forgotEmail.trim(), otp, purpose: "password_reset", newPassword }),
            });
            setForgotSuccess("Password reset successfully! You can now sign in.");
            setForgotStep("idle");
            setForgotEmail(""); setOtp(""); setNewPassword(""); setConfirmPassword("");
        } catch (err) {
            setForgotError(err instanceof Error ? err.message : "Invalid or expired code. Please try again.");
        } finally {
            setForgotLoading(false);
        }
    };

    const cancelForgot = () => {
        setForgotStep("idle");
        setForgotEmail(""); setOtp(""); setNewPassword(""); setConfirmPassword("");
        setForgotError(""); setForgotSuccess("");
    };

    // Forgot password — step 1: enter email
    if (forgotStep === "email") {
        return (
            <div className="w-full max-w-md mx-auto p-6 bg-background border rounded-lg shadow-sm">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-serif font-bold uppercase tracking-widest mb-2">Reset Password</h2>
                    <p className="text-muted-foreground">Enter your email and we&apos;ll send you a code</p>
                </div>
                <form onSubmit={handleSendOtp} className="space-y-4">
                    {forgotError && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center">{forgotError}</div>}
                    {forgotSuccess && <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md text-center">{forgotSuccess}</div>}
                    <div className="space-y-2">
                        <Label htmlFor="forgot-email">Email Address</Label>
                        <Input
                            id="forgot-email"
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            autoFocus
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={forgotLoading}>
                        {forgotLoading ? "Sending..." : "Send Reset Code"}
                    </Button>
                    <button type="button" onClick={cancelForgot} className="w-full text-sm text-muted-foreground hover:text-foreground text-center">
                        Back to Sign In
                    </button>
                </form>
            </div>
        );
    }

    // Forgot password — step 2: enter OTP + new password
    if (forgotStep === "otp") {
        return (
            <div className="w-full max-w-md mx-auto p-6 bg-background border rounded-lg shadow-sm">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-serif font-bold uppercase tracking-widest mb-2">Reset Password</h2>
                    <p className="text-muted-foreground text-sm">
                        Enter the 6-digit code sent to <strong>{forgotEmail}</strong>
                    </p>
                </div>
                <form onSubmit={handleResetPassword} className="space-y-4">
                    {forgotError && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center">{forgotError}</div>}
                    {forgotSuccess && <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md text-center">{forgotSuccess}</div>}
                    <div className="space-y-2">
                        <Label htmlFor="otp">6-Digit Code</Label>
                        <Input
                            id="otp"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            placeholder="000000"
                            className="text-center text-2xl tracking-widest"
                            required
                            autoFocus
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min 8 characters"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat new password"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={forgotLoading}>
                        {forgotLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <button type="button" onClick={() => setForgotStep("email")} className="hover:text-foreground">
                            Resend code
                        </button>
                        <button type="button" onClick={cancelForgot} className="hover:text-foreground">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // Normal login form
    return (
        <div className="w-full max-w-md mx-auto p-6 bg-background border rounded-lg shadow-sm">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-serif font-bold uppercase tracking-widest mb-2">Login</h2>
                <p className="text-muted-foreground">Welcome back to Adum Culture</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center">{error}</div>
                )}
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <button
                            type="button"
                            onClick={() => { setForgotEmail(email); setForgotStep("email"); }}
                            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                        >
                            Forgot password?
                        </button>
                    </div>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                </Button>
            </form>
        </div>
    );
}
