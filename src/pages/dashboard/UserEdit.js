import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { paramCase } from 'change-case';

// @mui
import { Container } from '@mui/material';
// redux
import { getClient } from '../../redux/slices/client';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';

import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ProductNewForm from '../../sections/@dashboard/e-commerce/ProductNewForm';
// import { getClient } from '../../redux/slices/client';
import UserNewForm from '../../sections/@dashboard/user/UserNewForm';

// ----------------------------------------------------------------------

export default function EcommerceProductEdit() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
   const { pathname } = useLocation();
     const { id } = useParams();

  // const productDetails = useSelector((state) => state.productDetails);
  const { isLoading, error, client  } = useSelector((state) => state.client);
  //   const { products } = useSelector((state) => state.product);
  const isEdit = pathname.includes('edit');
  // const currentProduct = products.find((product) => paramCase(product.name) === name);
  const currentClient = client;

  
  useEffect(() => {
    dispatch(getClient(id));
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title> User: Edit user | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit user"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'User',
              href: PATH_DASHBOARD.user.list,
            },
            { name: currentClient?.clientName },
          ]}
        />

       {!isLoading && <UserNewForm isEdit currentUser={currentClient} />}
      </Container>
      </>

  );
}
