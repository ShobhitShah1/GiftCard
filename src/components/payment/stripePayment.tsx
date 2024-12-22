import { useStripe } from '@stripe/stripe-react-native';
import { useEffect, useState } from 'react';

const StripePayment = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();
    const { error } = initPaymentSheet({
      merchantDisplayName: 'Example, Inc.',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
    });

    if (!error) {
      setLoading(true);
    }
  };

  const fetchPaymentSheetParams = async amount => {
    // console.log(amount)
    try {
      const formdata = new FormData();
      formdata.append('amount', amount?.totalInteger?.toString()); // Convert amount to string before appending

      const myHeaders = new Headers();
      myHeaders.append(
        'X-Secret-Key',
        '7q3koDuZzmOiILgPyPpAs07ZdB61n8QuNyTFpFOqLQ',
      );

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      const response = await fetch(
        'http://10.0.0.68/fetangift/public/api/order/payment-sheet',
        requestOptions,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const paymentIntent = result?.data?.paymentIntent;
      const ephemeralKey = result?.data?.ephemeralKey;
      const customer = result?.data?.customer;

      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    } catch (error) {
      console.error('Error fetching payment sheet params:', error);
      throw error;
    }
  };

  return {
    initializePaymentSheet,
    fetchPaymentSheetParams,
  };
};

export default StripePayment;
