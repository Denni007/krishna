import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { useState, useMemo, useEffect } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// mock
// import { cle } from '../../../../_mock/arrays/_invoice';
// components
import FormProvider from '../../../../components/hook-form2/FormProvider';
//
import InvoiceNewEditDetails from './InvoiceNewEditDetails';
import InvoiceNewEditAddress from './InvoiceNewEditAddress';
import InvoiceNewEditStatusDate from './InvoiceNewEditStatusDate';
import { createInvoice, listInvoice,updateInvoice } from '../../../../actions/invoiceActions';
import { INVOICE_UPDATE_RESET } from '../../../../constants/invoiceConstants';

// ----------------------------------------------------------------------

InvoiceNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentInvoice: PropTypes.object,
};

export default function InvoiceNewEditForm({ isEdit, currentInvoice }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const NewUserSchema = Yup.object().shape({
    invoiceDate: Yup.string().nullable().required('Create date is required'),
    dueDate: Yup.string().nullable().required('Due date is required'),
    invoiceTo: Yup.mixed().nullable().required('Invoice to is required'),
  });


  const defaultValues = useMemo(
    () => ({
      invoiceNo: currentInvoice?.invoiceNo || '17099',
      invoiceDate: currentInvoice?.invoiceDate || new Date(),
      dueDate: currentInvoice?.dueDate || new Date( new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+90) ,
      TotalAmount: currentInvoice?.TotalAmount || 0,
      status: currentInvoice?.status || 'draft',
      discount: currentInvoice?.discount || false,
      //  invoiceFrom: currentInvoice?.invoiceFrom || '_invoiceAddressFrom[0]',
      invoiceTo: currentInvoice?.invoiceTo || null,
      items: currentInvoice?.items || [
        { challanNo: '', challanDate: '', designId: '', designName: '', short: 1, plain: 0, quantity: 1, price: 0, total: 0 },
      ],
      invoiceAmount: currentInvoice?.invoiceAmount || 0,
      _id: currentInvoice?._id || '',
    }),
    [currentInvoice]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const invoiceCreate = useSelector(state => state.invoiceCreate);
  const { loading, invoice, error } = invoiceCreate;
  const invoiceUpdate = useSelector((state) => state.invoiceUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = invoiceUpdate;
  useEffect(() => {
    if (isEdit && currentInvoice) {
      reset(defaultValues);
    }
    if (!loadingUpdate && error ) {
      console.log(error); 
     
    }
    if (isEdit && successUpdate) {
      dispatch({ type: INVOICE_UPDATE_RESET });
      navigate(PATH_DASHBOARD.invoice.list);
    }
    if (!isEdit && invoice) {
      reset(defaultValues);
    }
    if (!isEdit && loading && invoice) {
      reset(defaultValues);
      navigate(PATH_DASHBOARD.invoice.list);
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentInvoice, invoice, loading, successUpdate]);

  const invoiceList = useSelector((state) => state.invoiceList);
  const { loading:loadingList, error:errorList, invoices } = invoiceList;
  
  useEffect(() => {
    dispatch(listInvoice());
  }, [dispatch ]);

  const handleSaveAsDraft = async (data) => {
    console.log(data);
    setLoadingSave(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      setLoadingSave(false);
     
    } catch (error) {
      console.error(error);
      setLoadingSave(false);
    }
  };

  const handleCreateAndSend = async (data) => {
    try {
      if (isEdit) {
        dispatch(
          updateInvoice(data)
        );
      }
      else{
        
          dispatch(createInvoice(data));
          await new Promise((resolve) => setTimeout(resolve, 500));
          reset();
          setLoadingSend(false);
          navigate(PATH_DASHBOARD.invoice.list);
          console.log('DATA', JSON.stringify(data, null, 2));
        
          
      }
    } catch (error) {
      console.error(error);
          setLoadingSend(false);
        
    }
    setLoadingSend(true);
    
    
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        <InvoiceNewEditAddress />

        <InvoiceNewEditStatusDate />

        <InvoiceNewEditDetails />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          color="inherit"
          size="large"
          variant="contained"
          loading={loadingSave && isSubmitting}
          onClick={handleSubmit(handleSaveAsDraft)}
        >
          Save as Draft
        </LoadingButton>

        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend && isSubmitting}
          onClick={handleSubmit(handleCreateAndSend)}
        >
          {isEdit ? 'Update' : 'Create'} & Send
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
