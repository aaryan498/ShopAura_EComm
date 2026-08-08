import { Product } from "./product.types";




export interface CartItem {
    id: string,
    cartId: string,
    productId: string,
    quantity: number,
    price: number,
    
    // Backend response fields
    productName: string;
    productImageUrl: string | null;
    subtotal: number;
    
    product: Product,
    createdAt: string,
    updatedAt: string,
}

export interface CartState {
    items: CartItem[],
    totalItems: number,
    totalPrice: number,

}

export interface Cart {
    id: string;
    userId: string;
    checkoutCompleted: boolean;
    items: CartItem[];
    totalItems: number;
    totalQuantity: number;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
}


export interface CartResponse {
    success: boolean;
    message: string;
    data: Cart;
}
