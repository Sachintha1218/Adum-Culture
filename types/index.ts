export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    images: string[];
    sizes: string[];
    colors: string[];
    newArrival?: boolean;
    bestSeller?: boolean;
    slug: string;
    itemCode?: string;
    stock?: number;
    modelDetails?: string;
    material?: string;
    careInstructions?: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image: string;
    description?: string;
}

export interface CartItem extends Product {
    quantity: number;
    selectedSize: string;
}
