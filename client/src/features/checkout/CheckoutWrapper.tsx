import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./CheckoutPage";

const stripePromise = loadStripe('pk_test_51NtvDHJOQdR9i9fC85kKE2ypCDCWNtRyE2AsSZtlkwLZRi5zCfvRorYYw5xT2hzGStaXxInleFp2eBzuQnUDg7sm009J4SU2OZ', { locale: 'en' });



export default function CheckoutWrapper() {

  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  )
}