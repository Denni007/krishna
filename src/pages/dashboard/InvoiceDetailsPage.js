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
import  useSettings  from '../../hooks/useSettings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import InvoiceDetails from '../../sections/@dashboard/invoice/details';
import { invoiceDetail } from '../../actions/invoiceActions';

// ----------------------------------------------------------------------

export default function InvoiceDetailsPage() {
  const { themeStretch } = useSettings();

  const { id } = useParams();

  const invoiceData = useSelector((state) => state.invoiceDetail);
  const { loading, error, invoice  } = invoiceData;
  const dispatch = useDispatch();

  useEffect(() => {
    if(!loading && invoice){
      const currentInvoice = invoice;

    }
    dispatch(invoiceDetail(id));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title> Invoice: View | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Invoice Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Invoices',
              href: PATH_DASHBOARD.invoice.list,
            },
            { name: `${invoice?.invoiceNo}` },
          ]}
        />

       {!loading && <InvoiceDetails invoice={invoice} />}
      </Container>
    </>
  );
}
