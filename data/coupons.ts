export interface Coupon {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    description: string;
}

export const coupons: Coupon[] = [
    {
        code: "WELCOME10",
        discountType: "percentage",
        discountValue: 10,
        description: "10% off your first order",
    },
    {
        code: "SAVE2000",
        discountType: "fixed",
        discountValue: 2000,
        description: "Rs. 2,000 off on your order",
    },
    {
        code: "FESTIVE25",
        discountType: "percentage",
        discountValue: 25,
        description: "25% off festive season sale",
    },
    {
        code: "NEWYEAR20",
        discountType: "percentage",
        discountValue: 20,
        description: "20% off for the New Year",
    },
];
