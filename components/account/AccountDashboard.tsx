"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth, apiFetch, type Order } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    User, Package, Settings, LogOut, Loader2, CheckCircle2,
    Search, ArrowUpRight, ShieldCheck, Mail, Smartphone, AlertCircle
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AccountDashboard() {
    const { user, logout, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState<"profile" | "orders" | "settings">("profile");

    // Profile/Settings state
    const [name, setName] = useState(user?.name ?? "");
    const [phone, setPhone] = useState(user?.phone ?? "");
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState("");

    // OTP password reset state
    const [otpStep, setOtpStep] = useState<"initial" | "sent" | "verified">("initial");
    const [otpInput, setOtpInput] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isOtpProcessing, setIsOtpProcessing] = useState(false);
    const [otpMessage, setOtpMessage] = useState("");
    const [otpError, setOtpError] = useState("");

    // Orders state
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Load orders when tab opens
    useEffect(() => {
        if (activeTab !== "orders" || orders.length > 0) return;
        setOrdersLoading(true);
        apiFetch("/api/account/orders")
            .then((res) => setOrders(res.data.orders))
            .catch(() => {})
            .finally(() => setOrdersLoading(false));
    }, [activeTab, orders.length]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true); setSaveSuccess(false); setSaveError("");
        try {
            const res = await apiFetch("/api/account/profile", {
                method: "PUT",
                body: JSON.stringify({ name, phone }),
            });
            updateUser(res.data.user);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : "Failed to save.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSendOtp = async () => {
        setIsOtpProcessing(true); setOtpMessage(""); setOtpError("");
        try {
            await apiFetch("/api/auth/otp/send", {
                method: "POST",
                body: JSON.stringify({ email: user?.email, purpose: "password_reset" }),
            });
            setOtpStep("sent");
            setOtpMessage("A 6-digit code has been sent to your email.");
        } catch (err) {
            setOtpError(err instanceof Error ? err.message : "Failed to send OTP.");
        } finally {
            setIsOtpProcessing(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otpInput.length < 6) { setOtpError("Please enter a valid 6-digit code."); return; }
        setIsOtpProcessing(true); setOtpError("");
        try {
            await apiFetch("/api/auth/otp/verify", {
                method: "POST",
                body: JSON.stringify({ email: user?.email, otp: otpInput, purpose: "password_reset" }),
            });
            setOtpStep("verified");
        } catch (err) {
            setOtpError(err instanceof Error ? err.message : "Invalid code.");
        } finally {
            setIsOtpProcessing(false);
        }
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) { setOtpError("Passwords do not match."); return; }
        if (newPassword.length < 8) { setOtpError("Password must be at least 8 characters."); return; }
        setIsOtpProcessing(true); setOtpError("");
        try {
            await apiFetch("/api/auth/otp/verify", {
                method: "POST",
                body: JSON.stringify({ email: user?.email, otp: otpInput, purpose: "password_reset", newPassword }),
            });
            setOtpStep("initial");
            setOtpInput(""); setNewPassword(""); setConfirmPassword("");
            setOtpMessage("Password reset successfully!");
            setTimeout(() => setOtpMessage(""), 4000);
        } catch (err) {
            setOtpError(err instanceof Error ? err.message : "Failed to reset password.");
        } finally {
            setIsOtpProcessing(false);
        }
    };

    const filteredOrders = orders.filter((o) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            o.id.toLowerCase().includes(q) ||
            (o.ormOrderNumber ?? "").toLowerCase().includes(q) ||
            o.items.some((i) => i.name.toLowerCase().includes(q))
        );
    });

    const renderProfile = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold uppercase tracking-widest mb-6 border-b pb-4">Account Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                    { label: "Full Name", value: user?.name },
                    { label: "Email Address", value: user?.email },
                    { label: "Phone Number", value: user?.phone || "Not provided" },
                ].map((f) => (
                    <div key={f.label} className="bg-muted/20 p-6 rounded-xl border">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">{f.label}</h4>
                        <p className="text-xl font-medium">{f.value}</p>
                    </div>
                ))}
            </div>
            <div className="mt-8 pt-8 border-t flex justify-end">
                <Button variant="outline" onClick={() => setActiveTab("settings")} className="gap-2 uppercase tracking-widest">
                    <Settings className="h-4 w-4" /> Edit Profile
                </Button>
            </div>
        </div>
    );

    const renderOrders = () => {
        if (ordersLoading) {
            return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
        }
        if (orders.length === 0) {
            return (
                <div className="bg-muted/30 rounded-lg p-12 text-center border border-dashed">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <h3 className="text-xl font-serif font-bold uppercase tracking-widest mb-2">No Orders Yet</h3>
                    <p className="max-w-md mx-auto mb-6 text-muted-foreground">When you place an order, it will appear here.</p>
                    <Button className="uppercase tracking-widest" onClick={() => (window.location.href = "/shop")}>Start Shopping</Button>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4">
                    <h2 className="text-2xl font-serif font-bold uppercase tracking-widest">Order History</h2>
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by ID or name..."
                            className="pl-9 w-full sm:w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <p className="py-12 text-center text-muted-foreground">No orders matched your search.</p>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="border rounded-xl overflow-hidden transition-all hover:shadow-md">
                                <div className="bg-muted/40 p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="grid grid-cols-2 sm:flex sm:gap-8 gap-4 w-full">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Date</p>
                                            <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total</p>
                                            <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Reference</p>
                                            <p className="text-sm font-medium">{order.ormOrderNumber ?? order.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                                            <p className="text-sm font-medium capitalize">{order.status.replace("_", " ")}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 sm:p-5 space-y-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 sm:gap-6">
                                            {item.image && (
                                                <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-muted rounded-md border">
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                </div>
                                            )}
                                            <div className="flex flex-1 flex-col justify-center">
                                                <h4 className="font-medium text-base mb-1">{item.name}</h4>
                                                <div className="text-sm text-muted-foreground space-y-1">
                                                    {item.size && <p>Size: {item.size}</p>}
                                                    <p>Qty: {item.quantity}</p>
                                                    <p className="font-medium text-foreground mt-1">{formatCurrency(item.price)}</p>
                                                </div>
                                            </div>
                                            {item.slug && (
                                                <div className="hidden sm:flex flex-col justify-center items-end">
                                                    <Button variant="outline" size="sm" className="gap-2" asChild>
                                                        <Link href={`/shop/${item.slug}`}>View <ArrowUpRight className="h-3 w-3" /></Link>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderSettings = () => (
        <div className="space-y-10">
            <div>
                <h2 className="text-2xl font-serif font-bold uppercase tracking-widest mb-6 border-b pb-4">Account Settings</h2>
                <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input value={user?.email ?? ""} disabled className="opacity-60" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 7X XXX XXXX" />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t">
                        {saveSuccess && <p className="text-sm text-green-600 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Saved successfully.</p>}
                        {saveError && <p className="text-sm text-destructive flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {saveError}</p>}
                        {!saveSuccess && !saveError && <p className="text-sm text-muted-foreground">Keep your profile information up to date.</p>}
                        <Button type="submit" className="uppercase tracking-widest min-w-[140px]" disabled={isSaving}>
                            {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Profile"}
                        </Button>
                    </div>
                </form>
            </div>

            <div>
                <h2 className="text-xl font-serif font-bold uppercase tracking-widest mb-6 border-b pb-4 mt-6 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" /> Security & Password
                </h2>
                <div className="max-w-2xl p-6 rounded-xl border bg-muted/10 space-y-6">
                    {otpMessage && (
                        <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" /> {otpMessage}
                        </div>
                    )}
                    {otpError && (
                        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" /> {otpError}
                        </div>
                    )}

                    {otpStep === "initial" && (
                        <>
                            <p className="text-sm text-muted-foreground">
                                We'll send a 6-digit one-time code to your registered email to verify your identity before resetting your password.
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {user?.email}</span>
                                {user?.phone && <span className="flex items-center gap-1"><Smartphone className="h-4 w-4" /> {user.phone}</span>}
                            </div>
                            <Button onClick={handleSendOtp} disabled={isOtpProcessing} className="w-full tracking-widest uppercase">
                                {isOtpProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : "Send OTP to Reset Password"}
                            </Button>
                        </>
                    )}

                    {otpStep === "sent" && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp">Enter 6-digit Code</Label>
                                <Input
                                    id="otp"
                                    maxLength={6}
                                    placeholder="• • • • • •"
                                    value={otpInput}
                                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                                    className="text-center text-lg tracking-[0.5em] font-mono"
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => { setOtpStep("initial"); setOtpInput(""); setOtpError(""); }} className="w-1/3">Cancel</Button>
                                <Button onClick={handleVerifyOtp} disabled={isOtpProcessing || otpInput.length < 6} className="w-2/3 uppercase tracking-widest">
                                    {isOtpProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : "Verify Code"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {otpStep === "verified" && (
                        <div className="space-y-4">
                            <div className="p-3 rounded-md bg-green-50 border border-green-100 text-green-700 text-sm flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" /> Identity Verified
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>
                            </div>
                            <Button onClick={handleResetPassword} disabled={isOtpProcessing} className="w-full tracking-widest uppercase">
                                {isOtpProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save New Password"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 space-y-2 shrink-0">
                    <div className="p-6 bg-muted/20 rounded-xl mb-6 text-center border">
                        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-serif font-bold tracking-widest shadow-inner">
                            {user?.name?.charAt(0) ?? "U"}
                        </div>
                        <h3 className="font-medium text-lg capitalize">{user?.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <nav className="flex flex-col gap-1 p-2 bg-muted/10 rounded-xl border">
                        {(["profile", "orders", "settings"] as const).map((tab) => {
                            const icons = { profile: User, orders: Package, settings: Settings };
                            const Icon = icons[tab];
                            return (
                                <Button
                                    key={tab}
                                    variant={activeTab === tab ? "secondary" : "ghost"}
                                    className={`justify-start gap-3 w-full capitalize ${activeTab === tab ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    <Icon className="h-4 w-4" />
                                    {tab === "orders" ? "Order History" : tab === "profile" ? "My Profile" : "Settings"}
                                </Button>
                            );
                        })}
                        <hr className="my-2 border-border" />
                        <Button
                            variant="ghost"
                            className="justify-start gap-3 w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={logout}
                        >
                            <LogOut className="h-4 w-4" /> Logout
                        </Button>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-background border rounded-xl shadow-sm p-6 md:p-8 min-h-[500px]">
                    {activeTab === "profile" && renderProfile()}
                    {activeTab === "orders" && renderOrders()}
                    {activeTab === "settings" && renderSettings()}
                </div>
            </div>
        </div>
    );
}
