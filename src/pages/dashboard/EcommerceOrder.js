import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useParams ,  useNavigate } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import { Box, Grid, Step, Stepper, Container, StepLabel, StepConnector } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getCart, createBilling } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import { LoginForm } from '../../sections/auth/login';

import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  CheckoutCart,
  CheckoutPayment,
  CheckoutOrderComplete,
  CheckoutBillingAddress,
} from '../../sections/@dashboard/e-commerce/order';
import { addToCart, getCartdata, nextStep } from '../../actions/cartActions';
import { detailsOrder } from '../../actions/orderActions';

// ----------------------------------------------------------------------

const STEPS = ['Cart', 'Signin', 'Billing & address', 'Payment'];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  top: 10,
  left: 'calc(-50% + 20px)',
  right: 'calc(50% + 20px)',
  '& .MuiStepConnector-line': {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  '&.Mui-active, &.Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
};

function QontoStepIcon({ active, completed }) {
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? 'primary.main' : 'text.disabled',
      }}
    >
      {completed ? (
        <Iconify icon={'eva:checkmark-fill'} sx={{ zIndex: 1, width: 20, height: 20, color: 'primary.main' }} />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
          }}
        />
      )}
    </Box>
  );
}

export default function EcommerceCheckout(props) {
  const { name = '',code= ''  } = useParams();
  const orderId = code;

  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const navigate = useNavigate();
  const orderDetails = useSelector(state => state.orderDetails);
  const { loading:loadData, order, error:errorData } = orderDetails;
  const  cart  = useSelector((state) => state.cart);
  const { cartItems, activeStep, billing} = cart;
  const userSignin = useSelector(state => state.userSignin);
  const { loading, userInfo, error } = userSignin;
  const { checkout } = useSelector((state) => state.product);
   const {  subtotal } = checkout;
  const isComplete = activeStep === STEPS.length+1;

  useEffect(() => {
    if (isMountedRef.current) {
      dispatch(detailsOrder(orderId));
    }
  }, [dispatch, isMountedRef]);

  
  useEffect(() => {
    if (activeStep === 1 && !userInfo  ) {
      navigate("/auth/login");
    }
    if (activeStep === 1 && userInfo  ) {
      dispatch(nextStep());
    }
    if (activeStep === 2 && !userInfo  ) {
      console.log(userInfo)
      dispatch(createBilling(null));
    }
    if (activeStep === 3) {
      dispatch(createBilling(null));
    }
    if (activeStep === 4) {
      dispatch(createBilling(null));
    }
  }, [dispatch, activeStep]);

  return (
    <Page title="Ecommerce: Checkout">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Checkout"  
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'Checkout' },
          ]}
        />

        

        {!order?.isPaid ? (
          <>
            {order && <CheckoutPayment />}
            </>
        ) : (
          <CheckoutOrderComplete open={isComplete} data={order}/>
        )}
      </Container>
    </Page>
  );
}
