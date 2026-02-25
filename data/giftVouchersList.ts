export interface GiftVoucher {
    code: string;
    balance: number;
    initialValue: number;
}

export const giftVouchers: GiftVoucher[] = [
    {
        code: "GIFT5000",
        balance: 5000,
        initialValue: 5000,
    },
    {
        code: "GIFT10000",
        balance: 10000,
        initialValue: 10000,
    },
    {
        code: "GIFT25000",
        balance: 25000,
        initialValue: 25000,
    },
];
