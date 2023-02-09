import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { useEffect, useState } from 'react';

// @mui
import { Box, Card, Button, Typography, Stack, Paper } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import { CheckoutNewAddressForm } from '../../e-commerce/order';
import { deleteAddress, getAddress, saveShipping } from '../../../../actions/cartActions';
import { ADDRESS_ADD_RESET, ADDRESS_DELETE_RESET } from '../../../../constants/cartConstants';

// ----------------------------------------------------------------------

AccountBillingAddressBook.propTypes = {
  addressBook: PropTypes.array,
};

export default function AccountBillingAddressBook({ addressBook }) {
  const [open, setOpen] = useState(false);
  
  const deleteAddressdata = useSelector(state => state.deleteAddress);
  const { loading:loadingdelete, address:deleteaddre, error:errordelete,success:deletesuccess } = deleteAddressdata;
  const dispatch = useDispatch();
  const handleClickOpen = () => {  
    setOpen(true);
  };
  
  const addressList = useSelector(state => state.addressList);
  const { loading, address:addressnews, error:errornews,success } = addressList;
  const addressCreate = useSelector(state => state.addressCreate);
  const { loading:loadingcreate, address:addresscreate, error:errorcreate,success:createsuccess } = addressCreate;
  const handleClose = () => {
    setOpen(false);
  };
  const handleNextStep = () => {
    console.log('hellp')
  };
  const handleCreateBilling = (value) => {
    console.log(value);
  /*  dispatch(saveShipping(value));   dispatch(createBilling(value));  */
  };

  const handleDelete = (addressid) => {
       dispatch(deleteAddress(addressid))
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
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={3} alignItems="flex-start">
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Billing Info
        </Typography>

        {addressnews?.map((address) => (
          <Paper
            key={address.id}
            sx={{
              p: 3,
              width: 1,
              bgcolor: 'background.neutral',
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              {address.receiver}
            </Typography>

            <Typography variant="body2" gutterBottom>
              <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                Address: &nbsp;
              </Typography>
              {`${address.address}, ${address.city}, ${address.state}, ${address.country} ${address.zipcode}`}
            </Typography>

            <Typography variant="body2" gutterBottom>
              <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                Phone: &nbsp;
              </Typography>
              {address.phone}
            </Typography>

            <Box sx={{ mt: 1 }}>
              <Button
                color="error"
                size="small"
                startIcon={<Iconify icon={'eva:trash-2-outline'} />}
                onClick={(e) => {handleDelete(address._id)}}
                sx={{ mr: 1 }}
              >
                Delete
              </Button>
              <Button size="small"  onClick={handleClickOpen} startIcon={<Iconify icon={'eva:edit-fill'} />} >
                Edit
              </Button>
            </Box>
          </Paper>
        ))}

        <Button size="small" onClick={handleClickOpen}  startIcon={<Iconify icon={'eva:plus-fill'} />}>
          Add new address
        </Button>
      </Stack>
      <CheckoutNewAddressForm
    open={open}
    onClose={handleClose}
    onNextStep={handleNextStep}
    onCreateBilling={handleCreateBilling}
  />
    </Card>
    
  );
}
