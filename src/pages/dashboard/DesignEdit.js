import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { paramCase } from 'change-case';

// @mui
import { Container } from '@mui/material';
// redux
import { getDesign } from '../../redux/slices/design';
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
import DesignNewForm from '../../sections/@dashboard/design/DesignNewForm';

// ----------------------------------------------------------------------

export default function DesignEdit() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
   const { pathname } = useLocation();
     const { id } = useParams();

  // const productDetails = useSelector((state) => state.productDetails);
  const { isLoading, error, design  } = useSelector((state) => state.design);
  //   const { products } = useSelector((state) => state.product);
  const isEdit = pathname.includes('edit');
  // const currentProduct = products.find((product) => paramCase(product.name) === name);
  const currentDesign = design;

  
  useEffect(() => {
    dispatch(getDesign(id));
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title> Design: Edit Design | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Design"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Design',
              href: PATH_DASHBOARD.design.list,
            },
            { name: currentDesign?.designName },
          ]}
        />

       {!isLoading && <DesignNewForm isEdit currentDesign={currentDesign} />}
      </Container>
      </>

  );
}
