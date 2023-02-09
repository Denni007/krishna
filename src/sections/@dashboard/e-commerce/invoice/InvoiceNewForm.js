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
import { useForm, Controller, useFieldArray } from 'react-hook-form';
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
      invoiceDate: currentUser?.invoiceDate || new Date(),
      invoiceStatus: currentUser?.invoiceStatus || 'unpaid',
      Items: currentUser?.Items || dataitem
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

  const [clients, setClients] = useState(users);
  const [filterName, setFilterName] = useState([]);
  const [stockData, setStockData] = useState([]);

  const values = watch();
  useEffect(() => {
    if(values.Items[0].quantity>0){
      console.log(values);
    }
    
  }, [values]);

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

  const onchallanchange = (data) => {

  }

  const onSubmit = async (data) => {
    console.log(data);
    try {
      if (isEdit) {
        // dispatch(
        //  // updateClient(data)
        // );
      }
      else {

        // dispatch(createClient(data));
        // await new Promise((resolve) => setTimeout(resolve, 500));
        // reset();

        // navigate(PATH_DASHBOARD.user.list);

      }
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

    dispatch(listUsers());
    dispatch(listStock());

  }, [dispatch]);


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <InvoiceToolbar invoice={_invoice} />
      <Grid item xs={12}>
        <Card sx={{ p: 3 }}>
       


          <Stack direction="row" divider={<Divider orientation="vertical" flexItem sx={{ ml: 5, mr: 2 }} />} alignContent="center" >



            <Grid item xl={5} direction="column"
              justifyContent="flex-end">



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
                    onSelect={(e, v) => console.log(v)}
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
                label="Design Id"
                placeholder="Client ID"
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
                    renderInput={(params) => <TextField label="Tags" {...params} />}
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

          <Box>
            <Typography paragraph variant="subtitle" sx={{ color: 'text.disabled' }}>
              Details:
            </Typography>
            <Stack>
              {foodFields.map((item, index) => {
                return (<Grid direction="column" justifyContent="flex-end">
                  <Stack direction="row" spacing={2}>
                    <Grid md={2}>
                      <RHFSelect size="small"
                        name={`Items[${index}].challanNo`}
                        label="Challan No"
                        onChange={
                          (e) => {
                            setValue(`Items[${index}].challanNo`, stocks?.filter((stocks) => stocks.challanNo === e.target.value)[0].challanNo)
                            setValue(`Items[${index}].challanDate`, stocks?.filter((stocks) => stocks.challanNo === e.target.value)[0].challanDate)
                            setValue(`Items[${index}].designId`, stocks?.filter((stocks) => stocks.challanNo === e.target.value)[0].designId, { shouldTouch: true })
                            setValue(`Items[${index}].rate`, stocks?.filter((stocks) => stocks.challanNo === e.target.value)[0].design.designRate, { shouldTouch: true })
                            setValue(`Items[${index}].quantity`, stocks?.filter((stocks) => stocks.challanNo === e.target.value)[0].stockQuantity, { shouldTouch: true })
                            setValue(`Items[${index}].short`, stocks?.filter((stocks) => stocks.challanNo === e.target.value)[0].Short, { shouldTouch: true })
                            setValue(`Items[${index}].amount`,(getValues(`Items[${index}].quantity`)-getValues(`Items[${index}].short`))*getValues(`Items[${index}].rate`), { shouldTouch: true })
                          }}
                        placeholder="Challan No">
                        <option value="" />
                        {!loadingStock ? stockData.map((option) => (
                          <option key={option.challanNo} value={option.challanNo}>
                            {option.challanNo}
                          </option>
                        )) : null}
                      </RHFSelect>
                    </Grid>
                    <Grid md={2}>
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
                    <Grid item md={2} key={item.id}>
                      <RHFTextField
                        name={`Items[${index}].designId`}
                        size="small"
                        label="Design Id"
                        focused
                      />
                    </Grid>
                    <Grid item md={1} key={`Items[${index}].rate`}>
                      <RHFTextField
                        name={`Items[${index}].rate`}
                        size="small"
                        label="Rate"
                        autoFocus
                      />
                    </Grid>
                    <Grid item md={1} key={`Items[${index}].quantity`}>
                      <RHFTextField
                        name={`Items[${index}].quantity`}
                        size="small"
                        type="number"
                        label="quantity"
                        disabled 
                      />
                    </Grid>

                    <Grid item md={1} key={`Items[${index}].short`}>
                      <RHFTextField
                        name={`Items[${index}].short`}
                        size="small"
                        type="number"
                        label="Short"
                        autoFocus
                      />
                    </Grid>
                    <Grid item md={1} key={`Items[${index}].plain`}>
                      <RHFTextField
                        name={`Items[${index}].plain`}
                        size="small"
                        value={getValues(`Items[${index}].plain`) === 0 ?0:getValues(`Items[${index}].plain`)}
                        onChange={(event) => {
                          setValue(`Items[${index}].plain`, Number(event.target.value))
                          setValue(`Items[${index}].amount`, (getValues(`Items[${index}].quantity`)-getValues(`Items[${index}].short`) - event.target.value )*getValues(`Items[${index}].rate`))
                        }}

                        label="plain"
                      />
                    </Grid>
                    <Grid item md={1} key={`Items[${index}].designId`}>
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
                  </Stack>
                  <Grid><Button onClick={() => foodRemove(index)}>Delete</Button></Grid>
                </Grid>)
              })}

              <Divider sx={{ mt: 2, mb: 2 }} />

              <Grid>
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
                   <Typography variant="h6">Total </Typography>
                  
              </Grid>

            </Stack>
          </Box>
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
