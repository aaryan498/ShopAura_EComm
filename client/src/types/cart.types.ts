import { Product } from "./product.types";




export interface CartItem {
    id: string,
    cartId: string,
    productId: string,
    quantity: number,
    price: number,
    product: Product,
    createdAt: string,
    updatedAt: string,
}

export interface CartState {
    items: CartItem[],
    totalItems: number,
    totalPrice: number,

}