"use client"
import { useState } from "react";
import { IRootState } from "@/store";
import { Product } from "@/types/product.types";
import { useDispatch, useSelector } from "react-redux";
import { CartService } from "@/services/api/cart.service";
import { setCart as setCartAction } from "@/slices/cartSlice";

export function useCart() {

    const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

    const reduxCart = useSelector((state: IRootState) => state.cart)
    const items = reduxCart.items;

    const dispatch = useDispatch();

    const loadCart = async () => {
    setIsLoading(true);
    setError(null);

    try {
        const response = await CartService.getCurrentCart();

        if (response.success) {
            dispatch(setCartAction(response.data.items));
            return;
        }

        throw new Error(
            response.message || "Failed to load cart"
        );

    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to load cart";

        setError(message);
    } finally {
        setIsLoading(false);
    }
};

    const addProductToCart = async (product: Product) => {
    setIsLoading(true);
    setError(null);

    try {
        const response = await CartService.addProduct(product.id);

        if (response.success) {
            dispatch(setCartAction(response.data.items));
            return;
        }

        throw new Error(
            response.message || "Failed to add product to cart"
        );

    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to add product to cart";

        setError(message);
    } finally {
        setIsLoading(false);
    }
};

    const updateProductQuantity = async (
    productId: string,
    quantityChange: number
) => {
    setIsLoading(true);
    setError(null);

    try {
        const item = items.find(
            (item) => item.productId === productId
        );

        if (!item) {
            throw new Error("Product not found in cart");
        }

        const newQuantity = item.quantity + quantityChange;

        if (newQuantity <= 0) {
            const response = await CartService.removeProduct(productId);

            if (response.success) {
                dispatch(setCartAction(response.data.items));
                return;
            }

            throw new Error(
                response.message || "Failed to remove product from cart"
            );
        }

        const response = await CartService.updateProductQuantity(
            productId,
            newQuantity
        );

        if (response.success) {
            dispatch(setCartAction(response.data.items));
            return;
        }

        throw new Error(
            response.message || "Failed to update product quantity"
        );

    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to update cart";

        setError(message);
    } finally {
        setIsLoading(false);
    }
};

    const removeProductFromCart = async (productId: string) => {
    setIsLoading(true);
    setError(null);

    try {
        const response = await CartService.removeProduct(productId);

        if (response.success) {
            dispatch(setCartAction(response.data.items));
            return;
        }

        throw new Error(
            response.message || "Failed to remove product from cart"
        );

    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to remove product from cart";

        setError(message);
    } finally {
        setIsLoading(false);
    }
};


    const clearCart = async () => {
    setIsLoading(true);
    setError(null);

    try {
        const response = await CartService.clearCart();

        if (response.success) {
            dispatch(setCartAction(response.data.items));
            return;
        }

        throw new Error(
            response.message || "Failed to clear cart"
        );

    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to clear cart";

        setError(message);
    } finally {
        setIsLoading(false);
    }
};
    return {
        items,
        totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: items.reduce((price, i) => price + i.product.price * i.quantity, 0),
        addProductToCart,
        updateProductQuantity,
        removeProductFromCart,
        clearCart,
        loadCart,
        isLoading,
        error
    }

}
