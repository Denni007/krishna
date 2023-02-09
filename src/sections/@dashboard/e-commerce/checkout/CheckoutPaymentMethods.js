import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

// form
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Radio,
  Stack,
  Button,
  Collapse,
  TextField,
  Typography,
  RadioGroup,
  CardHeader,
  CardContent,
  FormHelperText,
  FormControlLabel,
} from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
import { savePayment } from '../../../../actions/cartActions';

// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import LoadingButton from '../../../../theme/overrides/LoadingButton';

// ----------------------------------------------------------------------

const OptionStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2.5),
  justifyContent: 'space-between',
  transition: theme.transitions.create('all'),
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
}));

// ----------------------------------------------------------------------

CheckoutPaymentMethods.propTypes = {
  paymentOptions: PropTypes.array,
  cardOptions: PropTypes.array,
};

export default function CheckoutPaymentMethods({ paymentOptions, cardOptions }) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const isDesktop = useResponsive('up', 'sm');

  return (
    <Card sx={{ my: 3 }}>
      <CardHeader title="Payment options" />
      <CardContent>
        <Controller
          name="payment"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <RadioGroup row {...field}>
                <Stack spacing={2}>
                  {paymentOptions.map((method) => {
                    const { value, title, icons, description } = method;
                    
                    const hasChildren = value === 'credit_card';

                    const selected = field.value === value;

                    return (
                      <OptionStyle
                        key={title}
                        onChange={(e) => dispatch(savePayment(e.target.value))}
                        sx={{
                          ...(selected && {
                            boxShadow: (theme) => theme.customShadows.z20,
                          }),
                          ...(hasChildren && { flexWrap: 'wrap' }),
                        }}
                      >
                        <FormControlLabel
                          value={value}
                          control={<Radio checkedIcon={<Iconify icon={'eva:checkmark-circle-2-fill'} />} />}
                          label={
                            <Box sx={{ ml: 1 }}>
                              <Typography variant="subtitle2">{title}</Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {description}
                              </Typography>
                            </Box>
                          }
                          sx={{ flexGrow: 1, py: 3 }}
                        />

                        {isDesktop && (
                          <Stack direction="row" spacing={1} flexShrink={0}>
                            {icons.map((icon) => (
                              <Image key={icon} alt="logo card" src={icon} />
                            ))}
                          </Stack>
                        )}

                        {hasChildren && (
                          <Collapse in={field.value === 'credit_card'} sx={{ width: 1 }}>
                            <TextField select fullWidth label="Cards" SelectProps={{ native: true }}>
                              {cardOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </TextField>

                            <Button
                              size="small"
                              onClick={() => setOpen(!open)}
                              startIcon={<Iconify icon={'eva:plus-fill'} width={20} height={20} />}
                              sx={{ my: 3 }}
                            >
                              Add new card
                            </Button>

                            <CardAdd
                              
                              isOpen={open}
                              onOpen={() => setOpen(!open)}
                              onCancel={() => setOpen(false)}
                            />
                          </Collapse>
                        )}
                      </OptionStyle>
                    );
                  })}
                </Stack>
              </RadioGroup>

              {!!error && (
                <FormHelperText error sx={{ pt: 1, px: 2 }}>
                  {error.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </CardContent>
    </Card>
  );
}


function CardAdd({ isOpen, onOpen, onCancel }) {
  return (
   
  
      <Collapse in={isOpen}>
           
<Card sx={{ p: 3 }}>
        <Box
          sx={{
            padding: 3,
            marginTop: 3,
            borderRadius: 1,
            bgcolor: 'background.neutral',
          }}
        >
          <Stack spacing={3}>
            <Typography variant="subtitle1">Add new card</Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField fullWidth label="Name on card" />

              <TextField fullWidth label="Card number" />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField fullWidth label="Expiration date" placeholder="MM/YY" />

              <TextField fullWidth label="Cvv" />
            </Stack>

            <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
              <Button color="inherit" variant="outlined" onClick={onCancel}>
                Cancel
              </Button>
              {/* <LoadingButton type="submit" variant="contained" onClick={onCancel}>
                Save Change
              </LoadingButton> */}
            </Stack>
          </Stack>
        </Box>
        </Card>
      </Collapse>
    
  );
}
