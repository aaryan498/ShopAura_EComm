import { CartResponse } from "@/types/cart.types";
import { apiClient } from "./axios.config";

export class CartService {

    private static readonly ENDPOINT = '/carts';

    static async getCurrentCart(): Promise<CartResponse> {
        const response = await apiClient.get<CartResponse>(
            this.ENDPOINT
        );

        return response.data;
    }

    static async addProduct(productId: string): Promise<CartResponse> {
        const response = await apiClient.post<CartResponse>(
            `${this.ENDPOINT}/${productId}`
        );

        return response.data;
    }

    static async updateProductQuantity(
        productId: string,
        quantity: number
    ): Promise<CartResponse> {
        const response = await apiClient.patch<CartResponse>(
            `${this.ENDPOINT}/${productId}`,
            { quantity }
        );

        return response.data;
    }

    static async removeProduct(productId: string): Promise<CartResponse> {
        const response = await apiClient.delete<CartResponse>(
            `${this.ENDPOINT}/${productId}`
        );

        return response.data;
    }

    static async clearCart(): Promise<CartResponse> {
        const response = await apiClient.delete<CartResponse>(
            this.ENDPOINT
        );

        return response.data;
    }
}
