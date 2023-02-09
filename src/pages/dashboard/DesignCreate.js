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
import DesignNewForm from '../../sections/@dashboard/design/DesignNewForm';
import { designDetails } from '../../actions/designActions';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { name = '' } = useParams();
  const designDetail = useSelector((state) => state.designDetail);
  const { loading, error, design  } = designDetail;
  const isEdit = pathname.includes('edit');
  const dispatch = useDispatch();
  useEffect(() => {
   
    dispatch(designDetails(name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);


  return (
    <Page title="Design: Create a new design">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new design' : 'Edit design'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Design', href: PATH_DASHBOARD.design.list },
            { name: !isEdit ? 'New Design' : capitalCase(name) },
          ]}
        />
 { !loading && <DesignNewForm isEdit={isEdit} currentDesign={design} />} 

        
      </Container>
    </Page>
  );
}
