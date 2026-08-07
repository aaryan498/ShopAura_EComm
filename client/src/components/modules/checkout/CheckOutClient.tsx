'use client';

import React, { useEffect, useState } from 'react';
import CheckOutHeader from './CheckOutHeader';
import CheckOutSteps from './CheckOutSteps';
import PaymentMethodCard from './PaymentMethodCard';
import { usePayment } from '@/hooks/usePayment';
import { StripePaymentForm, StripePaymentProvider } from './stripe-payment-form';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { OrderItem, Order } from '@/types/order.types';
import { FiCreditCard, FiCheckCircle, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { useOrder } from '@/hooks/useOrder';

type Step = 1 | 2 | 3;

const CheckOutClient = () => {

    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [selectedPayment, setSelectedPayment] = useState<string>("");
    const [stripeError, setStripeError] = useState<string | null>(null);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [orderSummary, setOrderSummary] = useState<Order | null>(null);
    const [orderId, setOrderId] = useState<string>("");

    const { clientSecret, confirmPayment, createPaymentIntent } = usePayment();
    const { items, totalPrice, clearCart } = useCart();
    const { createOrder } = useOrder();

    const router = useRouter();


    const handlePaymentMethodSelect = (method: string) => {
        setSelectedPayment(method);
        setStripeError(null);
    }

    useEffect(()=>{
        if(items.length === 0 && !orderId){ // Only redirect if cart is empty AND no order has been created yet
            router.push("/cart");
        }
    }, [orderId, items, router]);

    const shippingCost = totalPrice > 400 ? 0 : 30;
    const finalTotal = totalPrice + shippingCost;

    useEffect(()=>{
        const createOrderAutomatically = async () => {
            setIsCreatingOrder(true);
            setStripeError(null);

            try {
                const cartItems: OrderItem[] = items.map((item)=>({
                    productId: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price,
                }))

                const order = await createOrder({
                    items: cartItems,
                    shippingAddress: "Sector 6, Vaishali, Ghaziabad, Uttar Pradesh, India - 202020",
                })

                if(!order){
                    throw new Error("Failed to create order");
                }
                setOrderId(order.id); // Crucial: Set the orderId here

                if(selectedPayment === "stripe"){

                    const createdPayment = await createPaymentIntent({
                        orderId: order.id,
                        amount: totalPrice,
                        description: "Order payment for ShopAura Product purchase",
                        currency: "usd",
                    })

                    if(!createdPayment){
                        throw new Error('Failed to create Payment intent');
                    }
                    // clientSecret is now set by usePayment hook, which will trigger StripePaymentProvider render
                }

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Failed to create payment intent";
                setStripeError(errorMessage);
                console.log("Order Creation Error: ", error);
            } finally {
                setIsCreatingOrder(false);
            }
        }
        createOrderAutomatically();
    }, [
        selectedPayment,
        orderId,
        isCreatingOrder,
        clientSecret,
        items,
        createOrder,
        createPaymentIntent,
        totalPrice,
        router, // Added router to dependency array for useEffect cleanup
    ])

    const handlePaymentSuccess = async(paymentIntentId: string) => {
        try{
            setCurrentStep(3);

            const confirmed = await confirmPayment({
                orderId,
                paymentIntentId,
            })

            // TODO: Store the confirmed order details in state if needed for step 3 summary
            if(!confirmed) throw new Error('Failed to confirm Payment');

            await clearCart();
        } catch(error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to confirm Payment";
            setStripeError(errorMessage);
        }
    }

    const handlePaymentError = async (error: string) => {
        setStripeError(error);
    }


  return (
    // <section>
    //     <div>
    //         <CheckOutHeader/>
    //         <CheckOutSteps currentStep={currentStep} />
    //         <div>
    //             {
    //                 currentStep === 1 && (
    //                     <div>
    //                         <h2></h2>
    //                         <div>
    //                             {/* Stripe */}
    //                             <PaymentMethodCard
    //                                 method='stripe'
    //                                 selectedMethod={selectedPayment}
    //                                 onSelect={handlePaymentMethodSelect}
    //                                 icon={<CreditCard/>}
    //                                 title="Credit / Debit Card"
    //                                 description='Pay securely with Stripe'

    //                             >
    //                                 {
    //                                     stripeError && (
    //                                         <div>
    //                                             {stripeError}
    //                                         </div>
    //                                     )
    //                                 }
    //                                 {
    //                                     isCreatingOrder && !clientSecret && (
    //                                         <div>
    //                                             Creating Order Spinner... 
    //                                         </div>
    //                                     )
    //                                 }
    //                                 {
    //                                     clientSecret && (
    //                                         <StripePaymentProvider 
    //                                             clientSecret={clientSecret}
    //                                             amount={totalPrice}
    //                                             onSuccess={handlePaymentSuccess}
    //                                             onError={handlePaymentError}
    //                                         >
    //                                             <StripePaymentForm
    //                                                 amount={totalPrice}
    //                                                 onSuccess={handlePaymentSuccess}
    //                                                 onError={handlePaymentError}
    //                                             />
    //                                         </StripePaymentProvider>
    //                                     )
    //                                 }
    //                             </PaymentMethodCard>
    //                             {/* Other payment method */}
                                
    //                         </div>

    <section className="min-h-[calc(100vh-10rem)] bg-background text-foreground">
      <CheckOutHeader />
      <CheckOutSteps currentStep={currentStep} />

      <div className="container mx-auto px-4 py-8 md:py-12">
        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Methods & Details */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">Payment Information</h2>
              <div className="bg-card rounded-lg shadow-md p-6 border border-border">
                {isCreatingOrder && !clientSecret && (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <svg className="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-lg font-medium">Preparing your order...</p>
                  </div>
                )}

                {stripeError && (
                  <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md mb-4 text-center">
                    <p className="font-semibold">Payment Error:</p>
                    <p>{stripeError}</p>
                  </div>
                )}

                {/* Stripe Payment Method Card */}
                <PaymentMethodCard
                  method="stripe"
                  selectedMethod={selectedPayment}
                  icon={<FiCreditCard />}
                  onSelect={handlePaymentMethodSelect}
                  title="Credit / Debit Card"
                  description="Pay securely with Stripe"
                >
                  {clientSecret && (
                    <StripePaymentProvider
                      clientSecret={clientSecret}
                      amount={totalPrice}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    >
                      <StripePaymentForm
                        amount={totalPrice}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </StripePaymentProvider>
                  )}
                </PaymentMethodCard>

                {/* Other payment methods can be added here */}
                {/* <PaymentMethodCard
                  method="paypal"
                  selectedMethod={selectedPayment}
                  onSelect={handlePaymentMethodSelect}
                  title="PayPal"
                  description="Pay with your PayPal account"
                >
                  {selectedPayment === "paypal" && (
                    <div className="text-muted-foreground">PayPal integration coming soon!</div>
                  )}
                </PaymentMethodCard> */}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg shadow-md p-6 border border-border sticky top-24">
                <h3 className="text-xl font-semibold mb-4 border-b border-border pb-3">Order Summary</h3>
                <div className="space-y-3 text-foreground">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border mt-3">
                    <span>Total:</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/cart')}
                  className="mt-6 w-full flex items-center justify-center bg-secondary text-secondary-foreground py-3 rounded-md hover:bg-secondary/80 transition-colors duration-200 font-semibold"
                >
                  <FiShoppingCart className="mr-2" /> Back to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-card border border-border rounded-xl shadow-md p-8 md:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-16 text-foreground">
            <FiCheckCircle className="text-success text-6xl mb-6" />
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Order Placed Successfully!</h3>
            <p className="text-muted-foreground mb-6">Your order #{orderId} has been confirmed.</p>
            <p className="text-muted-foreground mb-8">Shipping to: Sector 6, Vaishali, Ghaziabad, Uttar Pradesh, India - 202020</p>
            <button
              onClick={() => router.push('/user/orders')}
              className="bg-primary text-primary-foreground py-3 px-6 rounded-md font-semibold text-lg hover:bg-primary/90 transition-colors duration-200 flex items-center"
            >
              View My Orders <FiArrowRight className="ml-2" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

//                             {/* Summary */}
//                             <div>
//                                 <h3>Order Summary</h3>
//                                 <div>
//                                     <span></span>
//                                     <span></span>
//                                 </div>
//                                 <div>
//                                     <span></span>
//                                     <span></span>
//                                 </div>
//                                 <hr />
//                                 <div>
//                                     <span></span>
//                                     <span></span>
//                                 </div>
//                             </div>
//                         </div>
//                     )
//                 }

//                 {
//                     currentStep === 3 && (
//                         <div>
//                             order placed successfully.
//                             Your order #{orderId} has been confirmed.
//                             shipping to address: Sector 6, Vaishali, Ghaziabad, Uttar Pradesh, India - 202020

//                             <button onClick={()=> router.push('/user/orders')}></button>
//                         </div>
//                     )
//                 }
//             </div>
//         </div>
//     </section>
//   );
// };

export default CheckOutClient;