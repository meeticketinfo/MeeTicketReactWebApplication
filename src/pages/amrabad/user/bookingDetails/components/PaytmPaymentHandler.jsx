import { toast } from "react-toastify";

export const usePaytmPaymentHandler = (host = "https://secure.paytmpayments.com") => {
    const loadPaytmScript = (paymentData, onScriptLoaded) => {
        console.log("paymentData => ", paymentData);
        console.log("HOST => ", host);

        // First, check if Paytm SDK is already loaded
        if (window.Paytm && window.Paytm.CheckoutJS) {
            onScriptLoaded(paymentData);
            return;
        }

        // Load Paytm SDK from official CDN
        const script = document.createElement("script");
        script.src = host + "/merchantpgpui/checkoutjs/merchants/" + paymentData.mid + ".js";
        script.async = true;

        script.onload = () => {
            console.log("Paytm SDK loaded successfully");
            // Wait a bit for the SDK to initialize
            setTimeout(() => {
                if (window.Paytm && window.Paytm.CheckoutJS) {
                    onScriptLoaded(paymentData);
                } else {
                    console.error("Paytm SDK failed to initialize");
                    toast.error("Payment gateway failed to load. Please try again.");
                }
            }, 1000);
        };

        script.onerror = () => {
            console.error("Failed to load Paytm SDK");
            toast.error("Payment gateway failed to load. Please try again.");
        };

        document.body.appendChild(script);
    };

    const makePayment = (paymentData, grandTotal, onPaymentSuccess) => {
        console.log("paymentData?.txnToken => ", paymentData?.txnToken);
        console.log("grandTotal => ", grandTotal);

        // Check if Paytm SDK is available
        if (!window.Paytm || !window.Paytm.CheckoutJS) {
            console.error("Paytm SDK not available");
            toast.error("Payment gateway not available. Please refresh and try again.");
            return;
        }

        const config = getPaymentConfig(paymentData, grandTotal, onPaymentSuccess);

        console.log("window.Paytm && window.Paytm.CheckoutJS => ", window.Paytm && window.Paytm.CheckoutJS);

        try {
            console.log("payment Trying to load", window.Paytm.CheckoutJS);
            // Use onLoad if available, otherwise proceed directly
            if (typeof window.Paytm.CheckoutJS.onLoad === 'function') {
                console.log("payment Trying to invoke");
                window.Paytm.CheckoutJS.init(config)
                    .then(() => {
                        console.log("window.Paytm.CheckoutJS.invoke() => ");
                        window.Paytm.CheckoutJS.invoke(); // open payment popup
                    })
                    .catch((error) => {
                        console.error("Paytm init error => ", error);
                        toast.error("Payment initialization failed. Please try again.");
                    });
            } else {
                // Direct initialization if onLoad is not available
                console.log("payment Trying to invoke else");
                window.Paytm.CheckoutJS.init(config)
                    .then(() => {
                        console.log("window.Paytm.CheckoutJS.invoke() => ");
                        window.Paytm.CheckoutJS.invoke(); // open payment popup
                    })
                    .catch((error) => {
                        console.error("Paytm init error => ", error);
                        toast.error("Payment initialization failed. Please try again.");
                    });
            }
        } catch (error) {
            console.error("Error in makePayment:", error);
            toast.error("Payment processing error. Please try again.");
        }
    };

    const getPaymentConfig = (paymentData, grandTotal, onPaymentSuccess) => ({
        root: "",
        flow: "DEFAULT",
        data: {
            orderId: paymentData?.orderId,
            token: paymentData?.txnToken,
            tokenType: "TXN_TOKEN",
            amount: grandTotal.toString(), 
        },
        merchant: {
            mid: paymentData?.mid,
            redirect: false, // if true → Paytm will redirect after payment
        },
        payMode: {
            labels: {},
            filter: {
                exclude: []
            },
            order: [
                "UPI",
                "CC",
                "DC",
                "NB",
                "PPBL",
                "PPI",
                "BALANCE"
            ]
        },
        handler: {
            transactionStatus: function (paymentStatus) {
                console.log("paymentStatus => ", paymentStatus);

                // 🔹 Success/Failure handling
                if (paymentStatus.STATUS === "TXN_SUCCESS") {
                    toast.success("Payment successful!");
                    window.Paytm.CheckoutJS.close();
                    
                    // Call the success callback with payment status and order ID
                    if (onPaymentSuccess) {
                        onPaymentSuccess(paymentStatus, paymentData?.orderId);
                    }
                } else {
                    toast.error("Payment failed!");
                    window.Paytm.CheckoutJS.close();
                }
            },
            notifyMerchant: function (eventName, data) {
                console.log("notifyMerchant:", eventName, data);
            },
        },
    });

    return {
        loadPaytmScript,
        makePayment
    };
};
