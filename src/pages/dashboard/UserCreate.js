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
import UserNewForm from '../../sections/@dashboard/user/UserNewForm';
import { clientDetails } from '../../actions/userActions';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { name = '' } = useParams();
  const clientDetail = useSelector((state) => state.clientDetail);
  const { loading, error, client  } = clientDetail;
  const isEdit = pathname.includes('edit');
  const dispatch = useDispatch();
  useEffect(() => {
   
    dispatch(clientDetails(name));
    console.log("hhello");
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
            { name: 'User', href: PATH_DASHBOARD.user.list },
            { name: !isEdit ? 'New user' : capitalCase(name) },
          ]}
        />
 { !loading && <UserNewForm isEdit={isEdit} currentUser={client} />} 

        
      </Container>
    </Page>
  );
}
