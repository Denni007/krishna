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
import { stockDetails } from '../../actions/stockAction';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { name = '' } = useParams();
  // const stockDetail = useSelector((state) => state.stockDetail);
  // const { loading, error, stock  } = stockDetail;
  const isEdit = pathname.includes('edit');
  const dispatch = useDispatch();
  useEffect(() => {
   
    dispatch(stockDetails(name));
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // const currentUser = _userList.find((user) => paramCase(user.name) === name);

  return (
    <Page title="User: Create a new user">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new user' : 'Edit user'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Stock', href: PATH_DASHBOARD.stock.list },
            { name: !isEdit ? 'New Stock' : capitalCase(name) },
          ]}
        />
    <InvoiceNewForm isEdit={isEdit} currentDesign={'stock'} /> 

        
      </Container>
    </Page>
  );
}
