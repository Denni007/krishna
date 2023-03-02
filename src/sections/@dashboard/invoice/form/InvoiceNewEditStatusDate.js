// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
// import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton, MobileDatePicker } from '@mui/lab';

import { Stack, TextField, MenuItem } from '@mui/material';
// components
import { RHFSelect, RHFTextField } from '../../../../components/hook-form2';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['paid', 'unpaid', 'overdue', 'draft'];

// ----------------------------------------------------------------------

export default function InvoiceNewEditStatusDate() {
  const { control,setValue,  watch } = useFormContext();

  const values = watch();

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >
      <RHFTextField
        disabled
        name="invoiceNo"
        label="Invoice number"
        value={`INV-${Number(values.invoiceNo)}` }
      />

      <RHFSelect fullWidth name="status" label="Status" InputLabelProps={{ shrink: true }}>
        {STATUS_OPTIONS.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
         
      </RHFSelect>

      {/* <Controller
        name="createDate"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <MobileDatePicker
            label="Date create"
            value={field.value}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
            )}
          />
        )}
      /> */}
      <Controller
                name="invoiceDate"
                control={control}
                render={({ field }) => (
                  <MobileDatePicker
                    {...field}
                    showTodayButton
                    // onAccept={onAccept}
                    // onChange={changeDate}
                    onChange={(newValue) => {
                      console.log(newValue)
                      field.onChange(newValue);
                      setValue('dueDate', new Date( new Date(newValue).getFullYear(), new Date(newValue).getMonth(), new Date(newValue).getDate()+90))
                    }}
                    label="invoice date"
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => <TextField
                      {...params} fullWidth />}
                  />
                )}
              />

      <Controller
        name="dueDate"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <MobileDatePicker
            label="Due date"
            value={field.value}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
            )}
          />
        )}
      />
    </Stack>
  );
}
