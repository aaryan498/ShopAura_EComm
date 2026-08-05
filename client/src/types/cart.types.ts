import { Product } from "./product.types";




export interface CartItem {
    id: string,
    cartId: string,
    productId: string,
    quantity: number,
    product: Product,
}

export interface CartState {
    items: CartItem[],
    totalItems: number,
    totalPrice: number,

}