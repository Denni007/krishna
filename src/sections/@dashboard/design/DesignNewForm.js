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
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries } from '../../../_mock';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import { createDesign, updateDesign } from '../../../actions/designActions';
import {  listUsers } from '../../../actions/userActions';

import {  DESIGN_UPDATE_RESET } from '../../../constants/designConstants';

// ----------------------------------------------------------------------

DesignNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentDesign: PropTypes.object,
};

export default function DesignNewForm({ isEdit, currentDesign }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const NewDesignSchema = Yup.object().shape({
    designName: Yup.string().required('Name is required'),
    designId: Yup.string().required('DesignId is required'),
    designRate: Yup.string().required('DesignRate is required'),
    client: Yup.string().required('client is required'),
  });

  const defaultValues = useMemo(
    () => ({
      designName: currentDesign?.designName || '',
      designId: currentDesign?.designId || '',
      designRate: currentDesign?.designRate || '',
      client: currentDesign?.client?._id || '',
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
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const [filterName, setFilterName] = useState([]);
  const userList = useSelector((state) => state.userList);
  const { loading:loadingclient, error:errorclient, users:clientData } = userList;
  const designUpdate = useSelector((state) => state.designUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = designUpdate;

  const designCreate = useSelector((state) => state.designCreate);
  const { loading:loadingcreate, error:errorCreate, design } = designCreate;
  
  useEffect(() => {
    if (isEdit && currentDesign) {
      reset(defaultValues);
    }
    if (isEdit && successUpdate) {
      dispatch({ type: DESIGN_UPDATE_RESET });
      navigate(PATH_DASHBOARD.design.list);
    }
    if (!loadingcreate && design) {

      navigate(PATH_DASHBOARD.design.list);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    
    dispatch(listUsers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentDesign,successUpdate]);
  
  
  useEffect(() => {
    if (clientData) {
      setFilterName(clientData)
    }
  }, [clientData]);

  const onSubmit = async (data) => {
    console.log(data)
    try {
      if (isEdit) {
        dispatch(updateDesign(data));
      }
      else{
        
        dispatch(createDesign(data.designName, data.designId, data.client, data.designRate));
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
       
        navigate(PATH_DASHBOARD.design.list);

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
              <RHFTextField name="designName" label="Design Name" />
             <RHFTextField name="designId" label="Design ID"  disabled={isEdit}/>
              <RHFSelect name="client" label="ClientName"  placeholder="ClientName">
                 {filterName.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.clientName}
                  </option>
                ))}
                <option value='' />
              </RHFSelect>

             
              <RHFTextField name="designRate" label="Design Rate" />
              
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
