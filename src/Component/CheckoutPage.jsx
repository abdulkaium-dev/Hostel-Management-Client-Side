import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { AuthContext } from "../Auth/AuthContext";
import axiosInstance from "../Api/axios";
import toast from "react-hot-toast";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const PACKAGE_DETAILS = {
  silver: { name: "Silver", price: 19.99 },
  gold: { name: "Gold", price: 29.99 },
  platinum: { name: "Platinum", price: 49.99 },
};

const CheckoutForm = ({ packageKey, packageName, packagePrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    try {
      const { data } = await axiosInstance.post("/create-payment-intent", {
        amount: Math.round(packagePrice * 100),
        packageName: packageKey,
        userEmail: user?.email,
      });

      const clientSecret = data.clientSecret;
      const cardNumberElement = elements.getElement(CardNumberElement);

      if (!cardNumberElement) {
        toast.error("Card number is incomplete.");
        setProcessing(false);
        return;
      }

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            email: user?.email,
            name: user?.displayName || "User",
          },
        },
      });

      if (paymentResult.error) {
        toast.error(paymentResult.error.message || "Payment failed.");
        setProcessing(false);
        return;
      }

      if (paymentResult.paymentIntent.status === "succeeded") {
        await axiosInstance.post("/payments/save", {
          userEmail: user?.email,
          packageName: packageKey,
          paymentIntentId: paymentResult.paymentIntent.id,
          amount: packagePrice,
          status: "succeeded",
          purchasedAt: new Date().toISOString(),
        });

        if (typeof setUser === "function") {
          setUser((prev) => ({
            ...prev,
            badge: packageName,
          }));
        }

        setShowModal(true);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const inputStyle = {
    base: {
      fontSize: "16px",
      color: "#1f2937", // Tailwind gray-800
      letterSpacing: "0.025em",
      fontFamily: "'Inter', sans-serif",
      "::placeholder": {
        color: "#9ca3af", // Tailwind gray-400
      },
    },
    invalid: {
      color: "#dc2626", // Tailwind red-600
    },
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mx-auto transition-colors duration-300"
      >
        <h3 className="text-2xl font-extrabold mb-8 text-indigo-700 dark:text-indigo-400 text-center">
          {packageName} Package - ${packagePrice.toFixed(2)}
        </h3>

        <div className="mb-6">
          <label className="block mb-2 text-gray-700 dark:text-gray-200 font-semibold text-sm">
            Card Number
          </label>
          <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
            <CardNumberElement options={{ style: inputStyle }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-200 font-semibold text-sm">
              Expiry Date
            </label>
            <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
              <CardExpiryElement options={{ style: inputStyle }} />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-200 font-semibold text-sm">
              CVC
            </label>
            <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
              <CardCvcElement options={{ style: inputStyle }} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || processing}
          className={`w-full py-3 rounded-md text-white font-bold transition-colors duration-200 ${
            processing ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {processing ? "Processing..." : `Pay $${packagePrice.toFixed(2)}`}
        </button>
      </form>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-sm w-full text-center transition-colors duration-300">
            <h2 className="text-2xl font-extrabold mb-4 text-green-600">
              Payment Successful!
            </h2>
            <p className="mb-8 text-gray-700 dark:text-gray-200">
              Your package has been upgraded to <strong>{packageName}</strong>.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md font-semibold hover:bg-indigo-700 transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const CheckoutPage = () => {
  const { packageName } = useParams();
  const navigate = useNavigate();
  const packageKey = packageName?.toLowerCase();
  const packageInfo = PACKAGE_DETAILS[packageKey];

  useEffect(() => {
    if (!stripeKey) {
      toast.error("Stripe is not configured.");
      console.error("❌ VITE_STRIPE_PUBLISHABLE_KEY is missing.");
      return;
    }
    if (!packageInfo) {
      toast.error("Invalid package selected.");
      navigate("/membership");
    }
  }, [packageInfo, navigate]);

  if (!packageInfo || !stripePromise) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <p className="text-red-600 dark:text-red-400 text-lg font-semibold text-center">
          Cannot proceed to checkout. Stripe is not configured or package is invalid.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 transition-colors duration-300">
      <h1 className="text-5xl font-extrabold mb-10 text-indigo-700 dark:text-indigo-400 text-center">
        Checkout
      </h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm
          packageKey={packageKey}
          packageName={packageInfo.name}
          packagePrice={packageInfo.price}
        />
      </Elements>
    </div>
  );
};

export default CheckoutPage;
