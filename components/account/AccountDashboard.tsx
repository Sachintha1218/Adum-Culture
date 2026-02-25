"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Package, Settings, LogOut, Loader2, CheckCircle2, Search, ArrowUpRight, ShieldCheck, Mail, Smartphone } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AccountDashboard() {
    const { user, logout, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile');

    // Settings Profile State
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Settings Password Reset OTP Flow State
    const [otpStep, setOtpStep] = useState<'initial' | 'sent' | 'verified'>('initial');
    const [otpInput, setOtpInput] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isOtpProcessing, setIsOtpProcessing] = useState(false);
    const [otpMessage, setOtpMessage] = useState("");

    // Orders Filter State
    const [searchQuery, setSearchQuery] = useState("");

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveSuccess(false);

        // Simulate API call
        await new Promise(r => setTimeout(r, 800));

        updateUser({ name, email, phone });
        setIsSaving(false);
        setSaveSuccess(true);

        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handleSendOtp = async () => {
        setIsOtpProcessing(true);
        setOtpMessage("");
        await new Promise(r => setTimeout(r, 1200)); // Simulate sending OTP
        setOtpStep('sent');
        setIsOtpProcessing(false);
        setOtpMessage("A 6-digit OTP has been sent to your email and phone.");
    };

    const handleVerifyOtp = async () => {
        if (otpInput.length < 6) {
            setOtpMessage("Please enter a valid 6-digit OTP.");
            return;
        }
        setIsOtpProcessing(true);
        await new Promise(r => setTimeout(r, 1000)); // Simulate verifying OTP
        setOtpStep('verified');
        setIsOtpProcessing(false);
        setOtpMessage("");
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setOtpMessage("Passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setOtpMessage("Password must be at least 6 characters.");
            return;
        }

        setIsOtpProcessing(true);
        await new Promise(r => setTimeout(r, 1200)); // Simulate saving new password

        setOtpStep('initial');
        setOtpInput("");
        setNewPassword("");
        setConfirmPassword("");
        setIsOtpProcessing(false);
        setOtpMessage("Password has been reset successfully!");

        setTimeout(() => setOtpMessage(""), 4000);
    };


    const renderProfile = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold uppercase tracking-widest mb-6 border-b pb-4">
                Account Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-muted/20 p-6 rounded-xl border">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Full Name</h4>
                    <p className="text-xl font-medium">{user?.name}</p>
                </div>
                <div className="bg-muted/20 p-6 rounded-xl border">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Email Address</h4>
                    <p className="text-xl font-medium">{user?.email}</p>
                </div>
                <div className="bg-muted/20 p-6 rounded-xl border">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Phone Number</h4>
                    <p className="text-xl font-medium">{user?.phone || "Not provided"}</p>
                </div>
                <div className="bg-muted/20 p-6 rounded-xl border">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Member Since</h4>
                    <p className="text-xl font-medium">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t flex justify-end">
                <Button variant="outline" onClick={() => setActiveTab('settings')} className="gap-2 uppercase tracking-widest">
                    <Settings className="h-4 w-4" /> Edit Profile
                </Button>
            </div>
        </div>
    );

    const renderOrders = () => {
        const rawOrders = user?.orders || [];

        // Filter logic based on the Search string
        const filterStr = searchQuery.trim().toLowerCase();
        const orders = rawOrders.filter(order => {
            if (!filterStr) return true;
            // Check Order ID
            if (order.id.toLowerCase().includes(filterStr)) return true;
            // Check items list inside order
            return order.items.some(item => item.name.toLowerCase().includes(filterStr));
        });

        if (rawOrders.length === 0) {
            return (
                <div className="mt-4 pt-4">
                    <div className="bg-muted/30 rounded-lg p-12 text-center text-muted-foreground border border-dashed">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <h3 className="text-xl font-serif font-bold uppercase tracking-widest text-foreground mb-2">No Orders Yet</h3>
                        <p className="max-w-md mx-auto mb-6">When you place an order, it will appear here so you can track its status.</p>
                        <Button className="uppercase tracking-widest" onClick={() => window.location.href = '/shop'}>
                            Start Shopping
                        </Button>
                    </div>
                </div>
            )
        }

        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4">
                    <h2 className="text-2xl font-serif font-bold uppercase tracking-widest">
                        Order History
                    </h2>
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

                {orders.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                        <p>No orders matched your search criteria.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="border rounded-xl overflow-hidden bg-white/5 transition-all hover:shadow-md">
                                <div className="bg-muted/40 p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="grid grid-cols-2 sm:flex sm:gap-8 gap-4 w-full">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Order Placed</p>
                                            <p className="text-sm font-medium">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total</p>
                                            <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Order ID</p>
                                            <p className="text-sm font-medium">{order.id}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 sm:p-5">
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex gap-4 sm:gap-6">
                                                <div className="relative h-24 w-20 sm:h-28 sm:w-24 shrink-0 overflow-hidden bg-muted rounded-md border">
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex flex-1 flex-col justify-center">
                                                    <h4 className="font-medium text-base mb-1">{item.name}</h4>
                                                    <div className="text-sm text-muted-foreground space-y-1">
                                                        {item.size && <p>Size: {item.size}</p>}
                                                        <p>Qty: {item.quantity}</p>
                                                        <p className="font-medium text-foreground mt-1">{formatCurrency(item.price)}</p>
                                                    </div>
                                                </div>
                                                <div className="hidden sm:flex flex-col justify-center items-end">
                                                    {item.slug ? (
                                                        <Button variant="outline" size="sm" className="gap-2" asChild>
                                                            <Link href={`/shop/${item.slug}`}>
                                                                View Item <ArrowUpRight className="h-3 w-3" />
                                                            </Link>
                                                        </Button>
                                                    ) : (
                                                        <Button variant="outline" size="sm" className="gap-2" disabled>
                                                            Item Unavailable
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-5 pt-4 border-t flex sm:hidden">
                                        <Button variant="outline" className="w-full gap-2">
                                            View Order Details
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    };

    const renderSettings = () => (
        <div className="space-y-10">
            <div>
                <h2 className="text-2xl font-serif font-bold uppercase tracking-widest mb-6 border-b pb-4">
                    Account Settings
                </h2>

                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+94 7X XXX XXXX"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t">
                        {saveSuccess ? (
                            <p className="text-sm text-green-600 flex items-center gap-2 font-medium">
                                <CheckCircle2 className="h-4 w-4" /> Settings updated successfully
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground">Keep your profile information up to date.</p>
                        )}
                        <Button
                            type="submit"
                            className="uppercase tracking-widest min-w-[140px]"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                            ) : (
                                "Save Profile"
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            {/* OTP Password Reset Section */}
            <div>
                <h2 className="text-xl font-serif font-bold uppercase tracking-widest mb-6 border-b pb-4 mt-6 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" /> Security & Password
                </h2>

                <div className="max-w-2xl p-6 rounded-xl border bg-muted/10 space-y-6">
                    {otpMessage && otpStep === 'initial' && (
                        <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm font-medium flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" /> {otpMessage}
                        </div>
                    )}

                    {otpStep === 'initial' && (
                        <>
                            <p className="text-sm text-muted-foreground">
                                Need a new password? We can send a 6-digit One Time Password (OTP) to your registered email and phone number to verify your identity.
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {user?.email || "Email"}</span>
                                <span className="flex items-center gap-1"><Smartphone className="h-4 w-4" /> {user?.phone || "Phone"}</span>
                            </div>
                            <Button onClick={handleSendOtp} disabled={isOtpProcessing} className="w-full tracking-widest uppercase">
                                {isOtpProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparing...</> : "Send OTP to Reset Password"}
                            </Button>
                        </>
                    )}

                    {otpStep === 'sent' && (
                        <div className="space-y-4">
                            {otpMessage && <p className="text-sm text-green-600 font-medium">{otpMessage}</p>}
                            <div className="space-y-2">
                                <Label htmlFor="otp">Enter 6-digit OTP</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    maxLength={6}
                                    placeholder="• • • • • •"
                                    value={otpInput}
                                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                                    className="text-center text-lg tracking-[0.5em] font-mono"
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setOtpStep('initial')} className="w-1/3">Cancel</Button>
                                <Button onClick={handleVerifyOtp} disabled={isOtpProcessing || otpInput.length < 6} className="w-2/3 uppercase tracking-widest">
                                    {isOtpProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : "Verify OTP"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {otpStep === 'verified' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="p-3 rounded-md bg-green-50 border border-green-100 text-green-700 text-sm font-medium flex items-center gap-2 mb-4">
                                <CheckCircle2 className="h-4 w-4" /> Identity Verified
                            </div>
                            <div className="gap-6 grid md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            {otpMessage && <p className="text-sm text-red-500 font-medium">{otpMessage}</p>}
                            <div className="pt-2">
                                <Button onClick={handleResetPassword} disabled={isOtpProcessing} className="w-full tracking-widest uppercase">
                                    {isOtpProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save New Password"}
                                </Button>
                            </div>
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
                            {user?.name?.charAt(0) || "U"}
                        </div>
                        <h3 className="font-medium text-lg capitalize">{user?.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    </div>

                    <nav className="flex flex-col gap-1 p-2 bg-muted/10 rounded-xl border">
                        <Button
                            variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
                            className={`justify-start gap-3 w-full ${activeTab === 'profile' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <User className="h-4 w-4" />
                            My Profile
                        </Button>
                        <Button
                            variant={activeTab === 'orders' ? 'secondary' : 'ghost'}
                            className={`justify-start gap-3 w-full ${activeTab === 'orders' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            <Package className="h-4 w-4" />
                            Order History
                        </Button>
                        <Button
                            variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
                            className={`justify-start gap-3 w-full ${activeTab === 'settings' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <Settings className="h-4 w-4" />
                            Settings
                        </Button>
                        <hr className="my-2 border-border" />
                        <Button
                            variant="ghost"
                            className="justify-start gap-3 w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={logout}
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-background border rounded-xl shadow-sm p-6 md:p-8 min-h-[500px]">
                    {activeTab === 'profile' && renderProfile()}
                    {activeTab === 'orders' && renderOrders()}
                    {activeTab === 'settings' && renderSettings()}
                </div>
            </div>
        </div>
    );
}
