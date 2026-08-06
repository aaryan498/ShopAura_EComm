import { CartItem, CartState } from "@/types/cart.types";
import { Product } from "@/types/product.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



const initialState : CartState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
}

interface CartTotals {
    totalItems: number,
    totalPrice: number,
}


const calculateTotals = (items: CartItem[]): CartTotals => {

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return {
        totalItems,
        totalPrice
    }
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {


        addToCart: (state, action: PayloadAction<Product>) => {
            const existingItem = state.items.find(
                (item) => item.product.id === action.payload.id
            )

            if(existingItem){
                existingItem.quantity++;
            }
            else{
                state.items.push({
                    product: action.payload,
                    quantity: 1,
                    price: action.payload.price,
                    id: crypto.randomUUID(),
                    cartId: "",
                    productId: action.payload.id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                })
            }

            const totals = calculateTotals(state.items);
            state.totalItems = totals.totalItems;
            state.totalPrice = totals.totalPrice;
        }
    },
})

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
