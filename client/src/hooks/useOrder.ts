import { CartService } from "@/services/api/cart.service";
import { OrderService } from "@/services/api/order.service";
import { IRootState } from "@/store";
import { CreateOrderRequest, Order } from "@/types/order.types";
import { useCallback, useState } from "react"
import { useSelector } from "react-redux";




export function useOrder() {

    const guestCart = useSelector((state: IRootState) => state.cart.items);

    const [isLoading  , setIsLoading  ] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [order, setOrder] = useState<Order | null>(null);

    const createOrder = useCallback(
        async(data: CreateOrderRequest): Promise<Order | null> => {

            setIsLoading(true);
            setError(null);

            try{

                // if(guestCart.length > 0){
                //     await CartService.mergeCart(
                //         guestCart.map((item) => ({
                //             productId: item.productId,
                //             price: item.product.price,
                //             quantity: item.quantity,
                //         }))
                //     );
                // }

                console.log(data);

                const response = await OrderService.createOrder(data);

                if(response.success){
                    setOrder(response.data);
                    return response.data;
                }

                throw new Error(response.message ?? "Failed to create Order");


            } catch(error) {
                const message = error instanceof Error ? error.message : "Failed to create order";
                setError(message);
                return null;

            } finally {
                setIsLoading(false);
            }
        }, []
    )



    return {
        isLoading,
        error,
        order,
        createOrder,
    }
}