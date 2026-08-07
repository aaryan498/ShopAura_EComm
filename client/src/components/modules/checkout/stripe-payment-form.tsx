import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Appearance } from "@stripe/stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import { useState } from "react";


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

export function StripePaymentProvider({
    clientSecret,
    children,
    // amount, // Removed amount as it's not directly used by provider
}: {
    clientSecret: string,
    children: React.ReactNode,
    amount: number, // Still needed for options, but not passed to children directly
    onSuccess: (paymentIntentId: string) => void, // Not directly used by provider, but needed for context
    onError: (error: string) => void, // Not directly used by provider, but needed for context
}) {

    const appearance: Appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: "#252525",
            colorBackground: "#c5c5c5ce",
            colorText: "#252525",
            colorDanger: "#dc2626",
            fontFamily: "poppins",
            spacingUnit: "4px",
            borderRadius: "8px", // Increased for a softer look

        }
    }

    const options: StripeElementsOptions = {
        clientSecret,
        appearance,
    }

    return <Elements stripe={stripePromise} options={options}>
        {children}
    </Elements>
}


export function StripePaymentForm({
    amount,
    onSuccess,
    onError,
}: {
    amount: number;
    onSuccess: (paymentIntentId: string) => void;
    onError: (error: string) => void;
}){

    const stripe = useStripe();
    const elements = useElements();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if(!stripe || !elements) return;

        setIsLoading(true);
        setErrorMessage(null);

        try {

            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/checkout/success`,   
                },
                redirect: 'if_required',
            })

            if(error){
                setErrorMessage(error.message || "An error occured while confirming payment");
                onError(error.message || "Payment Failed");
                alert(error.message || "Payment Failed");
            }
            else if(paymentIntent?.status === "succeeded"){
                alert(`Payment Successful. Amount $${amount.toFixed(2)}`)
                onSuccess(paymentIntent.id);
            }
            
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unexpected Error";
            setErrorMessage(message);
            onError(message);
            alert("Payment Error");
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement className="text-foreground" />
            <div className="flex justify-end">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || !stripe || !elements}
                    className="bg-primary text-primary-foreground py-3 px-6 rounded-md font-semibold text-lg transition-colors duration-200 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 text-primary-foreground mr-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </div>
                    ) : (
                        `Pay $${amount.toFixed(2)}`
                    )}
                </motion.button>
            </div>
            {errorMessage && (
                <div className="text-destructive text-sm mt-2 text-center">{errorMessage}</div>
            )}
        </form>
    );

}