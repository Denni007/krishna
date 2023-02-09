import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { Box, Grid, Card, Button, Typography } from '@mui/material';
// redux
import {  useDispatch, useSelector } from '../../../../redux/store';
import { onBackStep, onNextStep, createBilling } from '../../../../redux/slices/product';
// _mock_
import { _addressBooks } from '../../../../_mock';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
//
import CheckoutSummary from './CheckoutSummary';
import CheckoutNewAddressForm from './CheckoutNewAddressForm';
import { addToCart, getCartdata, nextStep , backStep, getAddress, saveShipping, deleteAddress} from '../../../../actions/cartActions';
import { ADDRESS_ADD_RESET, ADDRESS_DELETE_RESET } from '../../../../constants/cartConstants';

// ----------------------------------------------------------------------

export default function CheckoutBillingAddress() {
  //
  const dispatch = useDispatch();
  const { checkout } = useSelector((state) => state.product);
 // const { total, discount, subtotal } = checkout;
  //
  const cart = useSelector(state => state.cart);

  const { cartItems, error:carterror,total, discount, subtotal } = cart;
  const { cart2} = checkout;
  const [open, setOpen] = useState(false);
  const addressList = useSelector(state => state.addressList);
  const { loading, address:addressnews, error:errornews,success } = addressList;

  const addressCreate = useSelector(state => state.addressCreate);
  const { loading:loadingcreate, address:addresscreate, error:errorcreate,success:createsuccess } = addressCreate;

  const deleteAddress = useSelector(state => state.deleteAddress);
  const { loading:loadingdelete, address:deleteaddress, error:errordelete,success:deletesuccess } = deleteAddress;
  
  const handleClickOpen = () => {  
    setOpen(true);
  };
  useEffect(() => {
    if (deletesuccess) {
      dispatch({ type: ADDRESS_DELETE_RESET });
    }
    if (createsuccess) {
      dispatch({ type: ADDRESS_ADD_RESET });
    }
      dispatch(getAddress());
  },[dispatch, deletesuccess ,createsuccess ]);
  
  const handleClose = () => {
    setOpen(false);
  };

  const handleNextStep = () => {
    dispatch(nextStep());
    dispatch(onNextStep());
  };

  const handleBackStep = () => {
    dispatch(backStep());
    dispatch(onBackStep());
  };

  const handleCreateBilling = (value) => {
    dispatch(saveShipping(value)); /*  dispatch(createBilling(value));  */
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {addressnews?.map((address, index) => (
            <AddressItem
              key={index}
              address={address}
              onNextStep={handleNextStep}
              onCreateBilling={handleCreateBilling}
            />
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              size="small"
              color="inherit"
              onClick={handleBackStep}
              startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
            >
              Back
            </Button>
            <Button size="small" onClick={handleClickOpen} startIcon={<Iconify icon={'eva:plus-fill'} />}>
              Add new address
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <CheckoutSummary subtotal={subtotal} total={total} discount={discount} />
        </Grid>
      </Grid>

      <CheckoutNewAddressForm
        open={open}
        onClose={handleClose}
        onNextStep={handleNextStep}
        onCreateBilling={handleCreateBilling}
      />
    </>
  );
}

// ----------------------------------------------------------------------

AddressItem.propTypes = {
  address: PropTypes.object,
  onNextStep: PropTypes.func,
  onCreateBilling: PropTypes.func,
};

function AddressItem({ address, onNextStep, onCreateBilling }) {
  const { receiver, fullAddress, addressType, phone, isDefault } = address;

  const dispatch = useDispatch();
  
  const handleDelete = () => {
    dispatch(deleteAddress(address._id))
  };
  const handleCreateBilling = () => {
    onCreateBilling(address);
    onNextStep();
  };

  return (
    <Card sx={{ p: 3, mb: 3, position: 'relative' }}>
      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1">{receiver}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp;({addressType})
        </Typography>
        {isDefault && (
          <Label color="info" sx={{ ml: 1 }}>
            Default
          </Label>
        )}
      </Box>
      <Typography variant="body2" gutterBottom>
        {fullAddress}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {phone}
      </Typography>

      <Box
        sx={{
          mt: 3,
          display: 'flex',
          position: { sm: 'absolute' },
          right: { sm: 24 },
          bottom: { sm: 24 },
        }}
      >
       
          <Button variant="outlined" size="small" color="inherit" onClick={handleDelete}>
            Delete
          </Button>
       
        <Box sx={{ mx: 0.5 }} />
        <Button variant="outlined" size="small" onClick={handleCreateBilling}>
          Deliver to this Address
        </Button>
      </Box>
    </Card>
  );
}
