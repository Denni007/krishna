import { paramCase, capitalCase } from 'change-case';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import InvoiceNewForm from '../../sections/@dashboard/e-commerce/invoice/InvoiceNewForm';
import { invoiceDetails } from '../../actions/invoiceActions';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { name = '' } = useParams();
  const invoiceDetail = useSelector((state) => state.invoiceDetail);
  const { loading, error, invoice  } = invoiceDetail;
  const isEdit = pathname.includes('edit');
  const dispatch = useDispatch();
  useEffect(() => {
   console.log(name);
    dispatch(invoiceDetails(name));
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // const currentUser = _userList.find((user) => paramCase(user.name) === name);

  return (
    <Page title="Invoice: Create a new Invoice">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new Invoice' : 'Edit Invoice'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Invoice', href: PATH_DASHBOARD.invoice.list },
            { name: !isEdit ? 'New Stock' : capitalCase(name) },
          ]}
        />
    <InvoiceNewForm isEdit={isEdit} currentUser={invoice} /> 

        
      </Container>
    </Page>
  );
}
