import { IRootState } from "@/store";
import { Product } from "@/types/product.types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart as addToCartAction } from "@/slices/cartSlice";


export function useCart() {

    const reduxCart = useSelector((state: IRootState) => state.cart)
    const items = reduxCart.items;

    const dispatch = useDispatch();


    const addProductToCart = async (product: Product) => {
        dispatch(addToCartAction(product));
    }

    return {
        items,
        totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: items.reduce((price, i) => price + i.product.price * i.quantity, 0),
        addProductToCart,
    }

}