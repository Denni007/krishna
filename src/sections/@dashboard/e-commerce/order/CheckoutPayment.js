import * as Yup from 'yup';
import { useEffect } from 'react';
import {useNavigate, Link as RouterLink } from 'react-router-dom';
import { paramCase } from 'change-case';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Grid, Button, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { onGotoStep, onBackStep, onNextStep, applyShipping } from '../../../../redux/slices/product';
// components
import Iconify from '../../../../components/Iconify';
import { FormProvider } from '../../../../components/hook-form';
//
import CheckoutSummary from './CheckoutSummary';
import CheckoutDelivery from './CheckoutDelivery';
import CheckoutBillingInfo from './CheckoutBillingInfo';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';
import { backStep, gotoStep, nextStep, savePayment } from '../../../../actions/cartActions';
import { CART_CHARGE_SHIPPING } from '../../../../constants/cartConstants';
import { createOrder, payOrder } from '../../../../actions/orderActions';
import CheckoutProductList from './CheckoutProductList';
import Scrollbar from '../../../../components/Scrollbar';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS = [
  {
    value: 0,
    title: 'Standard delivery (Free)',
    description: 'Delivered on Monday, August 12',
  },
  {
    value: 2,
    title: 'Fast delivery ($2,00)',
    description: 'Delivered on Monday, August 5',
  },
];

const PAYMENT_OPTIONS = [
  {
    value: 'paypal',
    title: 'Pay with Paypal',
    description: 'You will be redirected to PayPal website to complete your purchase securely.',
    icons: ['https://minimal-assets-api.vercel.app/assets/icons/ic_paypal.svg'],
  },
  {
    value: 'credit_card',
    title: 'Credit / Debit Card',
    description: 'We support Mastercard, Visa, Discover and Stripe.',
    icons: [
      'https://minimal-assets-api.vercel.app/assets/icons/ic_mastercard.svg',
      'https://minimal-assets-api.vercel.app/assets/icons/ic_visa.svg',
    ],
  },
  {
    value: 'razorpay',
    title: 'Pay with Razorpay',
    description: 'You will be redirected to razorpay website to complete your purchase securely.',
    icons: ['https://avatars.githubusercontent.com/u/7713209?s=200&v=4'],
  },
];

const CARDS_OPTIONS = [
  { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' },
];

export default function CheckoutPayment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderPay = useSelector((state) => state.orderPay);

  const cart = useSelector((state) => state.cart);

  const orderDetails = useSelector(state => state.orderDetails);
  const { loading:loadData, order:orderData, total ,discount, subtotal, shipping , billing ,error:errorData } = orderDetails;
  const { cartItems, activeStep} = cart;
  
  const orderCreate = useSelector((state) => state.orderCreate);

  const { loading, order, success} = orderCreate;
  useEffect(() => {
    if (orderData.isPaid) {

      dispatch(nextStep());
    }
  }, [dispatch,success]);
  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleBackStep = () => {
    navigate(`${PATH_DASHBOARD.eCommerce.root}/order/list`);
  };

  const handleGotoStep = (step) => {
    dispatch(gotoStep(step));
  };

  const handleApplyShipping = (value) => {
    dispatch({ type: CART_CHARGE_SHIPPING, payload: value });
    dispatch(applyShipping(value));
  };

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required('Payment is required!'),
  });

  const defaultValues = {
    cartItem:cartItems,
    delivery: shipping,
    address: billing,
    payment: orderData.payment?orderData.payment.paymentMethod:'',
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      if (activeStep>3) {

        dispatch(createOrder({ ...cart, orderItems: cart.cartItems }));
      }
      if(orderData.payment.paymentMethod === 'razorpay'){
        loadRazorpay(orderData.payment.paymentResult.orderID);
      }
      

      // handleNextStep();
    } catch (error) {
      console.error(error);
    }
  };
  function loadRazorpay(order) {
    console.log(order);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onerror = () => {
      alert('Razorpay SDK failed to load. Are you online?');
    };
    script.onload = async () => {
      try {
        const options = {
          key: 'rzp_test_c5z6eRGaOgyPLd',
          amount: 1500,
          currency: 'INR',
          name: 'example name',
          description: 'example transaction',
          order_id: order,
          handler (response) {
            console.log(response)
            dispatch(payOrder(response,orderData));
            
          },
          prefill: {
            name: 'example name',
            email: 'email@example.com',
            contact: '9824723865',
          },
          notes: {
            address: 'example address',
          },
          theme: {
            color: '#80c0f0',
          },
        };

        
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
       
      } catch (err) {
        alert(err);
        
      }
    };
    document.body.appendChild(script);
  }
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
        <Card>
          <Scrollbar>
              <CheckoutProductList
                products={orderData.orderItems}
              />
            </Scrollbar>
            </Card>
            <CheckoutPaymentMethods cardOptions={CARDS_OPTIONS} paymentOptions={PAYMENT_OPTIONS.filter(name => name.value === orderData.payment.paymentMethod)} />
          <Button
            size="small"
            color="inherit"
            onClick={handleBackStep}
            startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
          >
            Back
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          
       
          <CheckoutSummary
            enableEdit
            product={orderData.orderItems}
            total={orderData?.total}
            subtotal={orderData.subtotal}
            discount={orderData.discount}
            shipping={orderData.shippingPrice}
            onEdit={() => handleGotoStep(0)}
          />
         
           <LoadingButton  fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Pay
          </LoadingButton>
       
        </Grid>
      </Grid>
    </FormProvider>
  );
}
