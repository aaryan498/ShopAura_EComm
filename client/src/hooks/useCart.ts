import { IRootState } from "@/store";
import { useSelector } from "react-redux";


export function useCart() {

    const reduxCart = useSelector((state: IRootState) => state.cart)
    const items = reduxCart.items;

    return {
        items,
        totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: items.reduce((price, i) => price + i.product.price * i.quantity, 0),
    }

}