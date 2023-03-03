import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
// import { _invoices } from '../../_mock/arrays';
// components
import useSettings from '../../hooks/useSettings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import InvoiceNewEditForm from '../../sections/@dashboard/invoice/form';

import { invoiceDetail } from '../../actions/invoiceActions';

// ----------------------------------------------------------------------

export default function InvoiceEditPage() {
  const { themeStretch } = useSettings();

  const { id } = useParams();

  const invoicedata = useSelector((state) => state.invoiceDetail);
  const { loading, error, invoice  } = invoicedata;
  const dispatch = useDispatch();

  useEffect(() => {
   
    dispatch(invoiceDetail(id));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // const currentInvoice = invoice.find((invoice) => invoice.id === id);

  return (
    <>
      <Helmet>
        <title> Invoice: Edit | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit invoice"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Invoices',
              href: PATH_DASHBOARD.invoice.list,
            },
            { name: `${invoice?.invoiceNo}` },
          ]}
        />
{ !loading && invoice && <InvoiceNewEditForm isEdit currentInvoice={invoice} />} 
        
      </Container>
    </>
  );
}
