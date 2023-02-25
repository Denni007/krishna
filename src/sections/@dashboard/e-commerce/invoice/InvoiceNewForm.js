import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  Table,
  Stack,
  Divider,
  TableRow,
  Container,
  TableBody,
  Button,
  TableHead,
  TableCell,
  Typography,
  FormControlLabel,
  Switch,
  TableContainer,
  TextField,
  Chip,
  Autocomplete,
  createFilterOptions,
  InputAdornment,
} from '@mui/material';
// form
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton, MobileDatePicker } from '@mui/lab';
// utils
import { fData } from '../../../../utils/formatNumber';
import { _invoice } from '../../../../_mock';

// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// _mock
// components
import InvoiceToolbar from './InvoiceToolbar';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';
import { createClient, listUsers, updateClient } from '../../../../actions/userActions';
import { USER_UPDATE_PROFILE_RESET, USER_UPDATE_RESET } from '../../../../constants/userConstants';
import Label from '../../../../components/Label';
import Page from '../../../../components/Page';
import Iconify from '../../../../components/Iconify';
import useSettings from '../../../../hooks/useSettings';
import ClientNewAddressForm from './ClientNewAddressForm';
import AddCard from './add/AddCard';
import AddActions from './add/AddActions';
import AddNewCustomer from './add/AddNewCustomer';
import { listStock } from '../../../../actions/stockAction';
import { createInvoice } from '../../../../actions/invoiceActions';



// ----------------------------------------------------------------------

InvoiceNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function InvoiceNewForm({ isEdit, currentUser }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { themeStretch } = useSettings();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const userList = useSelector((state) => state.userList);
  const { loading: loadingclient, error: errorclient, users } = userList;
  const stockList = useSelector((state) => state.stockList);
  const { loading: loadingStock, error: errorStock, stocks } = stockList;

  const NewUserSchema = Yup.object().shape({
    clientName: Yup.object().required('client Name is required'),
    invoiceNo: Yup.string().required('clientId is required'),
    invoiceDate: Yup.date().required('clientId is required'),
    invoiceStatus: Yup.string().required('invoiceStatus number is required'),
    invoiceAmount: Yup.number().required('invoiceStatus number is required'),
    invoiceDiscount: Yup.number().required('invoiceStatus number is required'),
    Items: Yup.array().of(
      Yup.object().shape({
        challanNo: Yup.string().required('Name is required'),
        challanDate: Yup.string().required('Email is required'),
        designId: Yup.string().required('Email is required'),
        plain: Yup.number().required('Email is required'),
        short: Yup.number().required('Email is required'),
        quantity: Yup.number().required('Email is required'),
        rate: Yup.number().required('Email is required'),
        amount: Yup.number().required('Email is required')
      })
    )

  });

  const [addCustomerOpen, setAddCustomerOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)

  const INVOICE_STATUS = ['Unpaid', 'Paid'];

  const dataitem = [{
    challanNo: 'jsona',
    challanDate: new Date(),
    designId: '',
    plain: 0,
    quantity: 0,
    rate: 0,
    short: 0,
    amount: 0
  }]

  const defaultValues = useMemo(
    () => ({
      clientName: currentUser?.clientName || '',
      invoiceNo: currentUser?.invoiceNo || '',
      invoiceDate: currentUser?.invoiceDate || new Date(new Date().getTime() + (90 * 24 * 60 * 60 * 1000)),
      invoiceStatus: currentUser?.invoiceStatus || 'Unpaid',
      Items: currentUser?.Items || dataitem,
      invoiceAmount: currentUser?.invoiceAmount || 0,
      invoiceDiscount: currentUser?.invoiceDiscount || 5,
      taxamount: currentUser?.taxamount || 0,
      gst:currentUser?.gst || 0
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
   
    formState: { isSubmitting },
  } = methods;


  const {
    fields: foodFields,
    append: foodAppend,
    remove: foodRemove
  } = useFieldArray({ control, name: "Items" });

  const items = useWatch({ control, name: "Items" });

  const values = watch();
  

  const [clients, setClients] = useState(users);
  const [filterName, setFilterName] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [taxamount, setTaxamount] = useState('');
  const [gst, setGst] = useState('');
  useEffect(() => {
    if (items[0].rate>0) {
      const field1Sum = items.reduce((total, item) => {
        return total + Number(item.amount);
      }, 0);
      //  setTaxamount(field1Sum % 5)
      setValue('TotalAmount', field1Sum);
      const txtamout =  field1Sum  - (field1Sum/100)*5;
      const gst = (txtamout/100)*2.5
      setTaxamount(Number(txtamout).toFixed(2));
      setValue('taxamount',Number(txtamout).toFixed(2));
      setValue('gst',Number(gst).toFixed(2));
      setGst(Number(gst).toFixed(2));
      setValue('invoiceAmount', Number(txtamout - Number((2*gst)).toFixed(2)));
    }
    
  }, [items, setValue]);
  // useEffect(() => {
  //   if(values.invoiceDiscount>0){
     
     
  //   } 
  // }, [values]);

  const handleDiscount = useCallback(
    (e) => {
      setValue('invoiceDiscount',Number(e.target.value))

      const field1Sum = items.reduce((total, item) => {
        return total + Number(item.amount);
      }, 0);
      //  setValue('Discount', (field1Sum/100)* Number(e.target.value))
      setTaxamount(Number(field1Sum/100)* Number(e.target.value))
      setValue('invoiceAmount', Number(field1Sum-Number(taxamount)));
    },
    [ setValue]
  );

  const clientUpdate = useSelector((state) => state.clientUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = clientUpdate;




  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (isEdit && successUpdate) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      navigate(PATH_DASHBOARD.user.list);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    if (!loadingclient && users) {
      setFilterName(users)
      setClients(users);
    }
    if (getValues('clientName').length > 0 && !loadingStock) {
      console.log(getValues('clientName'))
      const datas = stocks.filter((stocks) => stocks.clientName === getValues('clientName').clientName)
      setStockData(datas)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser, successUpdate, users, stocks]);

  

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        // dispatch(
        //  // updateClient(data)
        // );
      }
      else {

        dispatch(createInvoice(data));
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();

        navigate(PATH_DASHBOARD.invoice.list);

      }
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
    } catch (error) {
      console.error(error);
    }
  };

  const handlePlain = useCallback(
    (e, n) => {
      setValue(`Items[${n}].plain`, Number(e.target.value));
      setValue(`Items[${n}].amount`, items.map((e) => {
        return (e.quantity - e.short - e.plain) * e.rate;
      })[n]
      );
    },
    [setValue, items]
  );
  const handleDesign = useCallback(
    (e, index) => {
      setValue(`Items[${index}].challanNo`, stocks?.filter((stocks) => stocks.challanNo === e.target.value)[0].challanNo)
      setValue(`Items[${index}].challanDate`, stocks?.filter((stocks) => stocks.challanNo === e.target.value)[0].challanDate)
      setValue(`Items[${index}].designId`, stocks?.filter((stocks) => stocks.challanNo === e.target.value)[0].designId, { shouldTouch: true })
      setValue(`Items[${index}].rate`, stocks?.filter((stocks) => stocks.challanNo === e.target.value)[0].design.designRate, { shouldTouch: true })
      setValue(`Items[${index}].quantity`, stocks?.filter((stocks) => stocks.challanNo === e.target.value)[0].stockQuantity, { shouldTouch: true })
      setValue(`Items[${index}].short`, stocks?.filter((stocks) => stocks.challanNo === e.target.value)[0].Short, { shouldTouch: true })
      setValue(`Items[${index}].amount`, items.map((e) => {
        return (e.quantity - e.short - e.plain) * e.rate;
      })[index]
      );
    },
    [setValue, items]
  );





  useEffect(() => {

    dispatch(listUsers());
    dispatch(listStock());

  }, [dispatch]);


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <InvoiceToolbar invoice={_invoice} />
      <Grid container xs={12}>
        <Card sx={{ p: 3 }}>



          <Stack direction="row" divider={<Divider orientation="vertical" flexItem sx={{ ml: 5, mr: 2 }} />} alignContent="center" >



            <Grid item xl={5} direction="column" justifyContent="flex-end">
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Invoice from
              </Typography>
              <Typography variant="body2">{_invoice.invoiceFrom.name}</Typography>
              <Typography variant="body2">{_invoice.invoiceFrom.address}</Typography>
              <Typography variant="body2">Phone: {_invoice.invoiceFrom.phone}</Typography>
            </Grid>
            {/* <Box component="span"> */}
            {/* <Divider   orientation='vertical' sx={{ ml: 5, mr: 2 }} /> */}
            {/* </Box> */}
            <Grid item xl={5} direction="column">
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Invoice To
              </Typography>
              {selectedClient !== null && selectedClient !== undefined ? (<Box>
                <Typography variant="body2">{selectedClient.clientName}</Typography>
                <Typography variant="body2">{selectedClient.address}</Typography>
                <Typography variant="body2">Phone: {selectedClient.phoneNumber}</Typography>
                <Typography variant="body2">GST: {selectedClient.gst}</Typography>
              </Box>
              ) : null}
            </Grid>

          </Stack>

          <Divider sx={{ mt: 2, mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Controller
                name="clientName"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    onChange={(event, value) => {

                      setValue('clientName', value);
                      setSelectedClient(filterName.filter((user) => user._id === value._id)[0]);
                      setStockData(stocks?.filter((stocks) => stocks.clientName === getValues('clientName').clientName))
                    }}
                    onSelect={(e, v) => { }}
                    options={filterName.map((option) => option)}
                    filterOptions={
                      createFilterOptions({
                        stringify: (option) => option.clientName + option._id,
                      })
                    }
                    getOptionLabel={(option) => option.clientName || ''}
                    value={getValues('clientName')}
                    renderInput={(params) => <TextField label="Client" {...params} />}
                  />
                )}
              />

            </Grid>
            <Grid item xs={6} md={3}>
              <RHFTextField
                name="invoiceNo"
                label="Invoice No"
                placeholder="Invoice No"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <Controller
                name="invoiceStatus"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}

                    onChange={(event, newValue) => field.onChange(newValue)}
                    onSelect={(e, v) => console.log(v)}
                    options={INVOICE_STATUS.map((option) => option)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                      ))
                    }
                    renderInput={(params) => <TextField label="invoiceStatus" {...params} />}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <Controller
                name="invoiceDate"
                control={control}
                render={({ field }) => (
                  <MobileDatePicker
                    {...field}
                    showTodayButton
                    // onAccept={onAccept}
                    // onChange={changeDate}
                    value={getValues('invoiceDate')}
                    label="invoice date"
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => <TextField
                      {...params} fullWidth />}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Divider sx={{ mt: 2, mb: 2 }} />

          <Box >
            <Typography paragraph variant="subtitle" sx={{ color: 'text.disabled' }}>
              Details:
            </Typography>
            <Stack>
              {foodFields.map((item, index) => {
                return (<Grid container direction="column" justifyContent="flex-end">
                  <Grid container spacing={2} direction="row" >
                    <Grid item md={2} xs={6} >
                      <RHFSelect size="small"
                        name={`Items[${index}].challanNo`}
                        label="Challan No"
                        onChange={
                          (e) => { handleDesign(e, index) }}
                        placeholder="Challan No">
                        <option value="" />
                        {!loadingStock ? stockData.map((option) => (
                          <option key={option.challanNo} value={option.challanNo}>
                            {option.challanNo}
                          </option>
                        )) : null}
                      </RHFSelect>
                    </Grid>
                    <Grid item md={2} xs={6}>
                      <Controller
                        name={`Items[${index}].challanDate`}
                        control={control}
                        render={({ field }) => (
                          <MobileDatePicker
                            {...field}
                            showTodayButton

                            // onAccept={onAccept}
                            // onChange={changeDate}
                            value={getValues(`Items[${index}].challanDate`)}
                            label="Challan date"
                            inputFormat="dd/MM/yyyy"
                            renderInput={(params) => <TextField
                              {...params} size="small" fullWidth />}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item md={2} xs={4} key={item.id}>
                      <RHFTextField
                        name={`Items[${index}].designId`}
                        size="small"
                        label="Design Id"
                        focused
                      />
                    </Grid>
                   

                    <Grid item md={1} xs={4} key={`Items[${index}].short`}>
                      <RHFTextField
                        name={`Items[${index}].short`}
                        size="small"
                        type="number"
                        label="Short"
                        disabled
                        autoFocus
                      />
                    </Grid>
                    <Grid item md={1} xs={4} key={`Items[${index}].plain`}>
                      <RHFTextField
                        name={`Items[${index}].plain`}
                        size="small"
                        value={getValues(`Items[${index}].plain`) === 0 ? 0 : getValues(`Items[${index}].plain`)}
                        onChange={(e) => { handlePlain(e, index) }}
                        label="plain"
                      />
                    </Grid>
                    <Grid item md={1} xs={4} key={`Items[${index}].rate`}>
                      <RHFTextField
                        name={`Items[${index}].rate`}
                        size="small"
                        label="Rate"
                        autoFocus
                      />
                    </Grid>
                    <Grid item md={1} xs={4} key={`Items[${index}].quantity`}>
                      <RHFTextField
                        name={`Items[${index}].quantity`}
                        size="small"
                        type="number"
                        disabled
                        label="quantity"
                      />
                    </Grid>
                    <Grid item md={2} xs={4} key={`Items[${index}].designId`}>
                      <RHFTextField
                        name={`Items[${index}].amount`}
                        size="small"
                        label="amount"
                        disabled
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                          type: 'number',
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid item spacing={2} alignContent="flex-end" >
                    <Button
                      color="error"
                      size="small"
                      variant="text"
                      startIcon={<Iconify icon={'eva:trash-2-fill'} />}
                      onClick={() => foodRemove(index)}>Delete</Button>
                  </Grid>
                  <Divider sx={{ mt: 2, mb: 2, borderStyle: "dashed" }} />
                </Grid>)
              })}

            </Stack>
          
            </Box>
         
          <Stack spacing={2} direction={{xs:'column-reverse' ,md:"row" }} justifyContent="space-between" alignItems= {{xs: "flex-start", md: "center" }} >
            <Button
              color="info"
              size="small"
              variant="contained"
              disabled={stockData.length <= foodFields.length}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
              onClick={() => {
                if (stockData.length > foodFields.length) {
                  foodAppend({
                    challanNo: 'jsona',
                    challanDate: new Date(),
                    designId: '',
                    plain: 0,
                    quantity: 0,
                    rate: 0,
                    short: 0,
                    amount: 0,
                  });
                }
                else {
                  console.log('sorry');
                }
              }}>add to</Button>
           <Stack spacing={2} direction="row" justifyContent="flex-end" >
                      <RHFTextField
                        name="invoiceDiscount"
                        size="small"
                        label="invoiceDiscount"
                        onChange={(e) => { handleDiscount(e) }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">%</InputAdornment>,
                          type: 'number',
                        }}
                      />
                <RHFTextField
                        name="TotalAmount"
                        size="small"
                        label="Total Amount"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                          type: 'number',
                        }}
                      />
            </Stack>
          </Stack>
         
          <Divider sx={{ mt: 2, mb: 2, borderStyle: "dashed" }} />







         
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem sx={{ ml: 5, mr: 2 }} />} alignContent="center" >



            <Grid item xl={5} direction="column" justifyContent="flex-end">
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Bank Info
              </Typography>
              <Typography variant="body2">Bank Name :  KOTAK MAHINDRA BANK</Typography>
              <Typography variant="body2">BRANCH    :  PUNAGAM</Typography>
              <Typography variant="body2">ACC. No.  :  25111253487</Typography>
              <Typography variant="body2">IFSC CODE :  KKBK0000883</Typography>

            </Grid>
            {/* <Box component="span"> */}
            {/* <Divider   orientation='vertical' sx={{ ml: 5, mr: 2 }} /> */}
            {/* </Box> */}
            <Grid item xl={7} direction="column" spacing={3}>
            <Typography  paragraph variant="overline" sx={{ textAlign: "right",color: 'text.disabled' }}>
                Amount Summary
              </Typography>
            <Grid item xs container justifyContent="flex-end" >
              <Grid item xs={4} alignItems="flex-end">
                <Typography variant="subtitle2" sx={{textAlign: "right"}}>Taxable Amount :</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle2" textAlign='right'>{taxamount}</Typography>
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end" spacing={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle2"   sx={{textAlign: "right"}}>CGST (2.50)% :</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle2" sx={{textAlign: "right"}}>{gst}</Typography>
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end" spacing={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle2"   sx={{textAlign: "right"}}>SGST (2.50)% :</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle2" sx={{textAlign: "right"}}>{gst}</Typography>
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end" spacing={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle2"   sx={{textAlign: "right"}}>Total GST :</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle2" sx={{textAlign: "right"}}>{gst*2}</Typography>
              </Grid>
            </Grid>
            </Grid>

          
            
            
          </Stack>
          <Divider sx={{ mt: 2, mb: 2, borderStyle: "dashed" }} />
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
              <Grid item xs={2}>
                <Typography variant="h6" sx={{textAlign: "right"}}>Total price :</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography variant="h6" textAlign='right'>{getValues('invoiceAmount') > 0 ? getValues('invoiceAmount') : 0}</Typography>
              </Grid>
            </Grid>
         

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!isEdit ? 'Create User' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </FormProvider >


  );
}
