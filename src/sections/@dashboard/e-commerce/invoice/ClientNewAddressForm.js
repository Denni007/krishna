import PropTypes from 'prop-types';
import * as Yup from 'yup';
import * as React from 'react';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Dialog, Button, Divider, DialogTitle, DialogContent, DialogActions, InputAdornment, ListItem, ListItemButton, ListItemText, ListItemAvatar, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// _mock
import { countries } from '../../../../_mock';
import { FormProvider, RHFCheckbox, RHFSelect, RHFTextField, RHFRadioGroup } from '../../../../components/hook-form';
import { listUsers } from '../../../../actions/userActions';
import InputStyle from '../../../../components/InputStyle';
import Iconify from '../../../../components/Iconify';

// -----------------------------------------a-----------------------------

ClientNewAddressForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onNextStep: PropTypes.func,
  onCreateBilling: PropTypes.func,
};

export default function ClientNewAddressForm({ open, onClose, onCreateBilling }) {
  const NewAddressSchema = Yup.object().shape({
    receiver: Yup.string().required('Fullname is required'),
    phone: Yup.string().required('Phone is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
  });
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const userList = useSelector(state => state.userList);

  const { loading, users, error: errornews, success } = userList;
  const { cartItems, error: carterror, } = cart;
  const defaultValues = {
    addressType: 'Home',
    receiver: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: countries[0].label,
    zipcode: '',
    isDefault: true,
  };

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  useEffect(() => {

    dispatch(listUsers());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  const onSubmit = async (data) => {
    try {
      console.log(data);
      // dispatch(clientList(data));
      onClose();
      /* onNextStep();
       // onCreateBilling({
      //   receiver: data.receiver,
      //   phone: data.phone,
      //   fullAddress: `${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.zipcode}`,
      //   addressType: data.addressType,
      //   isDefault: data.isDefault,
      // }); */
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Add new address</DialogTitle>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3}>
            <InputStyle
              //  value={filterName}
              onChange={(event) => console.log(event.target.value)}
              placeholder="Search challan..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
           {!loading && users.map((option) => (
            <Box>

            
           <ListItem alignItems="flex-start">
           <ListItemButton>
             <ListItemText
               primary={option.clientName}
               secondary={
                 
                   <Typography
                     sx={{ display: 'inline' }}
                     component="span"
                     variant="body2"
                     color="text.primary"
                   >
                     {option.address}
                   </Typography>
                   
                
               }
             />
           </ListItemButton>
         </ListItem>
         </Box>
           )
           )}
            

           

            <RHFSelect name="country" label="Country">
              {countries.map((option) => (
                <option key={option.code} value={option.label}>
                  {option.label}
                </option>
              ))}
            </RHFSelect>

            <RHFCheckbox name="isDefault" label="Use this address as default." sx={{ mt: 3 }} />
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Deliver to this Address
          </LoadingButton>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
