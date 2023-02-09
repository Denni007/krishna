import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton, MobileDatePicker, MobileDateTimePicker } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, TextField, InputAdornment, Autocomplete, Chip, createFilterOptions } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries } from '../../../_mock';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import {  listDesign } from '../../../actions/designActions';
import { createStock, updateStock, } from '../../../actions/stockAction';

import { listUsers } from '../../../actions/userActions';

import { STOCK_UPDATE_RESET } from '../../../constants/stockConstants';

// ----------------------------------------------------------------------

DesignNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentDesign: PropTypes.object,
};

export default function DesignNewForm({ isEdit, currentDesign }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
console.log(currentDesign._id);
  const NewDesignSchema = Yup.object().shape({
    designName: Yup.object().required('DesignName is required'),
    designId: Yup.string().required('DesignId is required'),
    designRate: Yup.string().required('designRate is required'),
    clientId: Yup.string().required('client Id is required'),
    clientName: Yup.object().required('client Name is required'),
    challanNo: Yup.string().required('challanNo is required'),
    challanDate: Yup.date().required('challanDate is required'),
    Remark: Yup.string().required('Remark is required'),
    stockQuantity: Yup.string().required('Remark is required'),
    Short: Yup.string().required('Short is required'),
  });

  const defaultValues = useMemo(
    () => ({
      designName: currentDesign?.design || '',
      designId: currentDesign?.designId || '',
      designRate: currentDesign?.design?.designRate || '',
      clientId: currentDesign?.clientId || '',
      clientName: currentDesign?.client || '',
      challanNo: currentDesign?.challanNo || '',
      challanDate: currentDesign?.challanDate || new Date(),
      stockQuantity: currentDesign?.stockQuantity || '',
      Short: currentDesign?.Short || '',
      Remark: currentDesign?.Remark || 'NA',
      _id: currentDesign?._id || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDesign]
  );
  const methods = useForm({
    resolver: yupResolver(NewDesignSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    getValues,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const [clientdataid, setClientdataid] = useState('');
  const designList = useSelector((state) => state.designList);
  const [date, setDate] = useState(new Date());
  const [selectedValue, setSelectedValue] = useState(date);

  const { loading: loadingDesign, error, designs } = designList;
  const [filterName, setFilterName] = useState([]);
  const [designName, setDesignName] = useState([]);
  const userList = useSelector((state) => state.userList);
  const { loading: loadingclient, error: errorclient, users: clientData } = userList;
  const stockUpdate = useSelector((state) => state.stockUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = stockUpdate;

  const stockCreate = useSelector((state) => state.stockCreate);
  const { loading: loadingcreate, error: errorCreate, stock } = stockCreate;

  useEffect(() => {
    if (isEdit && currentDesign) {
      reset(defaultValues);
    }
    if (isEdit && successUpdate) {
      dispatch({ type:STOCK_UPDATE_RESET });
      navigate(PATH_DASHBOARD.stock.list);
    }
    if (!loadingcreate && stock) {

      navigate(PATH_DASHBOARD.stock.list);
    }
    if (!isEdit) {
      reset(defaultValues);
    }

    dispatch(listUsers());
    dispatch(listDesign());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentDesign, successUpdate]);


  useEffect(() => {
    if (clientData) {
      setFilterName(clientData)
    }
    if (designs) {
      const datas = designs.filter((user) => user.client._id === getValues('clientName')._id)
      setDesignName(datas)
    }
  }, [clientData, designs,getValues('clientName')]);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      if (isEdit) {
        console.log(data)
         dispatch(updateStock(data));
      }
      else {
          dispatch(createStock(data));
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();

        navigate(PATH_DASHBOARD.stock.list);

      }
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'avatarUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  

    const onAccept = (value) => {
      setValue('challanDate',selectedValue);
    };
    const changeDate = (value) => {
      setSelectedValue(value);
    };
  

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

      <Grid container spacing={3}>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Controller
                  name="clientName"
                  control={control}
                              
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                       onChange={(event,value) => {
                        console.log(value);
                        setValue('clientName',value);
                        setValue('clientId',value.clientId)
                        setValue('designName','')
                       }}
                       onSelect={(e, v) =>console.log(v)}
                      options={filterName.map((option) => option)}
                      filterOptions={
                        createFilterOptions({
                          stringify: (option) => option.clientName + option._id,
                        })
                        }
                      getOptionLabel={(option) => option.clientName || ''}
                      value={getValues('clientName')}
                      // isOptionEqualToValue={option => option._id}
                     
                      // renderTags={(value, getTagProps) =>
                      //   value.map((option, index) => (
                      //     <Chip {...getTagProps({ index })} key={option._id} value={option} size="small" label={option.clientName} />
                      //   ))
                      // }
                      renderInput={(params) => <TextField label="Client" {...params} />}
                    />
                  )}
                />
              <RHFTextField
                name="clientId"
                label="client Id"
                placeholder="Client ID"

              //  onChange={(event) => setValue('clientId', event.target.value)}


              />
              {/* <RHFSelect name="designName" label="Design Name" placeholder="designName" onChange={handleChange} >
                <option value='' />
                {designName.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.designName}
                  </option>
                ))}
              </RHFSelect> */}
              <Controller
              name="designName"
                  control={control}  
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      onChange={(event,value) => {
                        console.log(`${value} hello`);
                        setValue('designName',value);
                        setValue('designId',value.designId)
                        setValue('designRate',value.designRate)
                       }}
                       onSelect={(e, v) =>console.log(v)}
                      options={designName.map((option) => option)}
                      filterOptions={
                        createFilterOptions({
                          stringify: (option) => option.designName + option._id,
                        })
                        }
                      getOptionLabel={(option) => option.designName || ''}
                      value={getValues('designName')}
                      renderInput={(params) => <TextField label="Design Name" {...params} />}
                    />
                  )}
                />
              <RHFTextField
                name="designId"
                label="Design Id"
                placeholder="Client ID"
              />
              <RHFTextField
                name="designRate"
                label="Design Rate"
                placeholder="Rate"
              />
              <RHFTextField name="challanNo" label="Challan Number" />
              <Controller
                name="challanDate"
                control={control}
                render={({ field }) => (
                  <MobileDatePicker
                    {...field}
                    showTodayButton
                    onAccept={onAccept}
                    onChange={changeDate}
                    value={getValues('challanDate')}
                    label="Challan date"
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => <TextField 
                      {...params} fullWidth />}
                  />
                )}
              />
                 <RHFTextField
                  name="stockQuantity"
                  label="Stock Quantity"
                  placeholder="0"
                  InputProps={{
                    type: 'number',
                  }}
                />
                <RHFTextField
                  name="Short"
                  label="Short Product"
                  placeholder="0"
                  InputProps={{
                    type: 'number',
                  }}
                />
              <RHFTextField name="Remark" label="Remark" />
              
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Design' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
