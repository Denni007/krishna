import sum from 'lodash/sum';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// form
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
// @mui
import { MobileDatePicker } from '@mui/lab';

import { Box, Stack, Button, Divider, Typography, InputAdornment, MenuItem, TextField } from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/iconify2';
import { RHFSelect, RHFSwitch, RHFTextField } from '../../../../components/hook-form2';
import { listStock } from '../../../../actions/stockAction';

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = [
  { id: 1, name: 'full stack development', price: 90.99 },
  { id: 2, name: 'backend development', price: 80.99 },
  { id: 3, name: 'ui design', price: 70.99 },
  { id: 4, name: 'ui/ux design', price: 60.99 },
  { id: 5, name: 'front end development', price: 40.99 },
];

// ----------------------------------------------------------------------

export default function InvoiceNewEditDetails() {
  const { control, setValue, getValues, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const values = watch();
  const dispatch = useDispatch();
  const [stockData, setStockData] = useState([]);

  const stockList = useSelector((state) => state.stockList);
  const { loading: loadingStock, error: errorStock, stocks } = stockList;

  useEffect(() => {
    if (stocks && values.invoiceTo) {
      setStockData(stocks.filter((stocks) => stocks.clientName === values.invoiceTo.clientName))
    }
    else {
      dispatch(listStock());
    }

  }, [dispatch, values.invoiceTo]);
  const totalOnRow = values.items.map((item) => (item.quantity - item.short - item.plain) * item.price);
  const totalTaxAmount = (sum(totalOnRow) / 100) * (values.discount ? 95 : 100);
  const gst = (totalTaxAmount / 100) * 2.5
  const invoiceAmount = totalTaxAmount + (2 * gst);
  useEffect(() => {
    setValue('TotalAmount', sum(totalOnRow));
    
    setValue('invoiceAmount', Number(invoiceAmount));
  }, [setValue, invoiceAmount]);
 
  const handleAdd = () => {
    append({
      challanNo: '',
      challanDate: new Date(),
      designId: '',
      designName: '',
      short: 0,
      plain: 0,
      quantity: 0,
      price: 0,
      total: 0,
    });


  };

  const handleRemove = (index) => {
    remove(index);
  };

  const handleClearService = useCallback(
    (index) => {
      resetField(`items[${index}].quantity`);
      resetField(`items[${index}].price`);
      resetField(`items[${index}].total`);
    },
    [resetField]
  );

  const handleSelectService = useCallback(
    (index, option) => {
      console.log(stockData)
      setValue(
        `items[${index}].price`,
        Number(stockData.find((service) => service.challanNo === option)?.design.designRate)
      );
      setValue(
        `items[${index}].quantity`,
        Number(stockData.find((service) => service.challanNo === option)?.stockQuantity)
      );
      setValue(
        `items[${index}].challanDate`,
        stockData.find((service) => service.challanNo === option)?.challanDate
      );
      setValue(
        `items[${index}].designId`,
        stockData.find((service) => service.challanNo === option)?.designId
      );
      setValue(
        `items[${index}].short`,
        Number(stockData.find((service) => service.challanNo === option)?.Short)
      );

      setValue(
        `items[${index}].designName`,
        stockData.find((service) => service.challanNo === option)?.designName
      );
      setValue(
        `items[${index}].total`,
        values.items.map((item) => ((item.quantity - item.short - item.plain) * item.price))[index]
      );
    },
    [setValue, values.items, stockData]
  );


  const handleChangeplain = useCallback(
    (event, index) => {
      setValue(`items[${index}].plain`, Number(event.target.value));
      setValue(
        `items[${index}].total`,
        values.items.map((item) => ((item.quantity - item.short - item.plain) * item.price))[index]
      );
    },
    [setValue, values.items]
  );

  const handleChangeQuantity = useCallback(
    (event, index) => {
      setValue(`items[${index}].quantity`, Number(event.target.value));
      setValue(
        `items[${index}].total`,
        values.items.map((item) => ((item.quantity - item.short - item.plain) * item.price))[index]
      );
    },
    [setValue, values.items]
  );

  const handleChangePrice = useCallback(
    (event, index) => {
      setValue(`items[${index}].price`, Number(event.target.value));
      setValue(
        `items[${index}].total`,
        values.items.map((item) => item.quantity * item.price)[index]
      );
    },
    [setValue, values.items]
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Details:
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => (
          <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <RHFSelect
                name={`items[${index}].challanNo`}
                size="small"
                label="challanNo"
                InputLabelProps={{ shrink: true }}
                sx={{ maxWidth: { md: 160 } }}
              >
                <MenuItem
                  value=""
                  onClick={() => handleClearService(index)}
                  sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                >
                  None
                </MenuItem>

                <Divider />

                {!loadingStock? stockData.map((service) => (
                  <MenuItem
                    key={service.challanNo} 
                    value={service.challanNo}
                    onClick={() => handleSelectService(index, service.challanNo)}
                  >
                    {service.challanNo}
                  </MenuItem>
                )) : <MenuItem
                  value=""
                  onClick={() => handleClearService(index)}
                  sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                >
                  None
                </MenuItem>
                }
              </RHFSelect>
              <Controller
                size="small"
                name={`items[${index}].challanDate`}
                control={control}
                render={({ field }) => (
                  <MobileDatePicker
                    {...field}
                    showTodayButton
                    // onAccept={onAccept}
                    // onChange={changeDate}
                    // value={getValues('invoiceDate')}
                    label="invoice date"
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => <TextField
                      size="small"
                      {...params} fullWidth />}
                  />
                )}
              />
              <RHFTextField
                size="small"
                name={`items[${index}].designId`}
                label="Description"
                InputLabelProps={{ shrink: true }}
              />

              <RHFTextField
                size="small"
                name={`items[${index}].designName`}
                label="Description"
                InputLabelProps={{ shrink: true }}
              />

              {/* <RHFSelect
                name={`items[${index}].service`}
                size="small"
                label="Service"
                InputLabelProps={{ shrink: true }}
                sx={{ maxWidth: { md: 160 } }}
              >
                <MenuItem
                  value=""
                  onClick={() => handleClearService(index)}
                  sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                >
                  None
                </MenuItem>

                <Divider />

                {SERVICE_OPTIONS.map((service) => (
                  <MenuItem
                    key={service.id}
                    value={service.name}
                    onClick={() => handleSelectService(index, service.name)}
                  >
                    {service.name}
                  </MenuItem>
                ))}
              </RHFSelect> */}
              <RHFTextField
                size="small"
                type="number"
                name={`items[${index}].short`}
                label="Short"
                placeholder="0"
                disabled
                InputLabelProps={{ shrink: true }}
                sx={{ maxWidth: { md: 96 } }}
              />
              <RHFTextField
                size="small"
                type="number"
                name={`items[${index}].plain`}
                label="Plain"
                placeholder="0"
                onChange={(event) => handleChangeplain(event, index)}
                InputLabelProps={{ shrink: true }}
                sx={{ maxWidth: { md: 96 } }}
              />
              <RHFTextField
                size="small"
                type="number"
                name={`items[${index}].quantity`}
                label="Quantity"
                placeholder="0"
                disabled
                InputLabelProps={{ shrink: true }}
                sx={{ maxWidth: { md: 96 } }}
              />

              <RHFTextField
                size="small"
                type="number"
                name={`items[${index}].price`}
                label="Rate"
                disabled
                placeholder="0"
                // onChange={(event) => handleChangePrice(event, index)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                sx={{ maxWidth: { md: 96 } }}
              />

              <RHFTextField
                disabled
                size="small"
                name={`items[${index}].total`}
                label="Total"
                placeholder="0"
                value={totalOnRow[index]}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                sx={{ maxWidth: { md: 96 } }}
              />
            </Stack>

            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="eva:trash-2-outline" />}
              onClick={() => handleRemove(index)}
            >
              Remove
            </Button>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Stack
        spacing={2}
        direction={{ xs: 'column-reverse', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <Button
          size="small"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
        >
          Add Item
        </Button>

        <Stack
          spacing={2}
          justifyContent="flex-end"
          direction={{ xs: 'column', md: 'row' }}
          sx={{ width: 1 }}
        >
          <RHFSwitch
            size="small"
            label="Discount"
            name="discount"
          // onChange={(event) => console.log(event.target.value)}
          // sx={{ maxWidth: { md: 200 } }}
          />


          <RHFTextField
            size="small"
            label="Total Amount"
            name="TotalAmount"
            disabled
            value={fCurrency(sum(totalOnRow)) || '-'}
            sx={{ maxWidth: { md: 200 } }}
          />
        </Stack>
      </Stack>

      <Stack spacing={2} sx={{ mt: 3 }}>
        <Stack direction="row" justifyContent="flex-end">
          <Typography>Discount :</Typography>
          <Typography
            sx={{ textAlign: 'right', width: 120, ...(values.discount && { color: 'error.main' }) }}
          >
            {values.discount ? fCurrency(totalTaxAmount - sum(totalOnRow)) : '-'}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="flex-end">
          <Typography>Taxable Amount:</Typography>
          <Typography sx={{ textAlign: 'right', width: 120 }}>
            {fCurrency(totalTaxAmount) || '-'}
          </Typography>
        </Stack>



        <Stack direction="row" justifyContent="flex-end">
          <Typography>CGST :</Typography>
          <Typography sx={{ textAlign: 'right', width: 120 }}>
            {fCurrency(gst) || '-'}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="flex-end">
          <Typography>SGST :</Typography>
          <Typography sx={{ textAlign: 'right', width: 120 }}>
            {fCurrency(gst) || '-'}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Typography variant="h6">Total price :</Typography>
          <Typography variant="h6" sx={{ textAlign: 'right', width: 120 }}>
            {fCurrency(invoiceAmount) || '-'}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
