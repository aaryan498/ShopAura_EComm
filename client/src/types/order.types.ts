

export interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
}


export interface CreateOrderRequest {
    items: OrderItem[],
    shippingAddress: string,
}

export interface Order {
    id: string;
    userId: string;
    cartItems: OrderItem[];
    shippindAddress: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrderResponse {
    success: boolean;
    data: Order;
    message?: string;
}