import { IRootState } from "@/store";
import { Product } from "@/types/product.types";
import { useDispatch, useSelector } from "react-redux";
import { CartService } from "@/services/api/cart.service";
import { setCart as setCartAction } from "@/slices/cartSlice";
import { addToCart as addToCartAction } from "@/slices/cartSlice";
import { incrementProductQuantity as incrementProductQuantityAction } from "@/slices/cartSlice";
import { decrementProductQuantity as decrementProductQuantityAction } from "@/slices/cartSlice";
import { removeProductFromCart as removeProductFromCartAction } from "@/slices/cartSlice";
import { clearCart as clearCartAction } from "@/slices/cartSlice";

export function useCart() {

    const reduxCart = useSelector((state: IRootState) => state.cart)
    const items = reduxCart.items;

    const dispatch = useDispatch();

    const addProductToCart = async (product: Product) => {
    const response = await CartService.addProduct(product.id);

    if (response.success) {
        dispatch(setCartAction(response.data.items));
    }
    }

    const incrementProductQuantity = async (productId: string) => {
        dispatch(incrementProductQuantityAction(productId));
    }

    const decrementProductQuantity = async (productId: string) => {
        dispatch(decrementProductQuantityAction(productId));
    }

    const removeProductFromCart = async (productId: string) => {
        dispatch(removeProductFromCartAction(productId));
    }
    const clearCart = async () => {
        dispatch(clearCartAction());
    }

    return {
        items,
        totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: items.reduce((price, i) => price + i.product.price * i.quantity, 0),
        addProductToCart,
        incrementProductQuantity,
        decrementProductQuantity,
        removeProductFromCart,
        clearCart,
    }

}
