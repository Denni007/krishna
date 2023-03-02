import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// form
import { useFormContext } from 'react-hook-form';
// @mui
import { Stack, Divider, Typography, Button } from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// _mock
// import { _invoiceAddressFrom, _invoiceAddressTo } from '../../../../../_mock/arrays';
// components
import Iconify from '../../../../components/iconify2';
//
import InvoiceAddressListDialog from './InvoiceAddressListDialog';
import { listUsers } from '../../../../actions/userActions';
import { listStock } from '../../../../actions/stockAction';

// ----------------------------------------------------------------------

export default function InvoiceNewEditAddress() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const upMd = useResponsive('up', 'md');

  const values = watch();
  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(listUsers());

  }, [dispatch]);
  const userList = useSelector((state) => state.userList);
  const { loading: loadingclient, error: errorclient, users } = userList;

  const { invoiceFrom, invoiceTo } = values;

  const [openFrom, setOpenFrom] = useState(false);

  const [openTo, setOpenTo] = useState(false);

  const handleOpenFrom = () => {
    setOpenFrom(true);
  };

  const handleCloseFrom = () => {
    setOpenFrom(false);
  };

  const handleOpenTo = () => {
    setOpenTo(true);
  };

  const handleCloseTo = () => {
    setOpenTo(false);
  };

  return (
    <Stack
      spacing={{ xs: 2, md: 5 }}
      direction={{ xs: 'column', md: 'row' }}
      divider={
        <Divider
          flexItem
          orientation={upMd ? 'vertical' : 'horizontal'}
          sx={{ borderStyle: 'dashed' }}
        />
      }
      sx={{ p: 3 }}
    >
      <Stack sx={{ width: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            From:
          </Typography>

          <Button
            size="small"
            startIcon={<Iconify icon="eva:edit-fill" />}
            onClick={handleOpenFrom}
          >
            Change
          </Button>
          {!loadingclient && users ?
            <InvoiceAddressListDialog
            open={openFrom}
            onClose={handleCloseFrom}
            selected={(selectedId) => invoiceFrom?.id === selectedId}
            onSelect={(address) => setValue('invoiceFrom', address)}
            addressOptions={users}
          /> : <Button
              size="small"
              startIcon={<Iconify icon={invoiceTo ? 'eva:edit-fill' : 'eva:plus-fill'} />}
              onClick={handleOpenTo}
            >
              {invoiceTo ? 'Change' : 'Add'}
            </Button>
          }
          {/* <InvoiceAddressListDialog
            open={openFrom}
            onClose={handleCloseFrom}
            selected={(selectedId) => invoiceFrom?.id === selectedId}
            onSelect={(address) => setValue('invoiceFrom', address)}
            addressOptions={_invoiceAddressFrom}
          /> */}
        </Stack>

        <AddressInfo
          name={'Krishna Fashion'}
          address={'New Address'}
          phone={'9824723865'}
          gst={'GST4545788'}
        />
      </Stack>

      <Stack sx={{ width: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            To:
          </Typography>

          <Button
            size="small"
            startIcon={<Iconify icon={invoiceTo ? 'eva:edit-fill' : 'eva:plus-fill'} />}
            onClick={handleOpenTo}
          >
            {invoiceTo ? 'Change' : 'Add'}
          </Button>
          {!loadingclient && users ?
            <InvoiceAddressListDialog
              open={openTo}
              onClose={handleCloseTo}
              selected={(selectedId) => invoiceTo?._id === selectedId}
              onSelect={(address) => setValue('invoiceTo', address)}
              addressOptions={users}
            /> : <Button
              size="small"
              startIcon={<Iconify icon={invoiceTo ? 'eva:edit-fill' : 'eva:plus-fill'} />}
              onClick={handleOpenTo}
            >
              {invoiceTo ? 'Change' : 'Add'}
            </Button>
          }

        </Stack>

        {invoiceTo ? (
          <AddressInfo name={invoiceTo?.clientName} address={invoiceTo?.address} phone={invoiceTo?.phoneNumber} gst={invoiceTo?.gst} />
        ) : (
          <Typography typography="caption" sx={{ color: 'error.main' }}>
            {errors.invoiceTo?.message}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

AddressInfo.propTypes = {
  name: PropTypes.string,
  phone: PropTypes.string,
  address: PropTypes.string,
};

function AddressInfo({ name, address, phone, gst }) {
  return (
    <>
      <Typography variant="subtitle2">{name}</Typography>
      <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
        {address}
      </Typography>
      <Typography variant="body2">Phone: {phone}</Typography>
      <Typography variant="body2">GST: {gst}</Typography>
    </>
  );
}
