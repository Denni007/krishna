import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Table,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { DesignListHead, DesignListToolbar, DesignMoreMenu } from '../../sections/@dashboard/design/list';

import { deleteDesign, listDesign } from '../../actions/designActions';
import { DESIGN_DELETE_RESET } from '../../constants/designConstants';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'designName', label: 'Design Name', alignRight: false },
  { id: 'designId', label: 'Design ID', alignRight: false },
  { id: 'client', label: 'Client Name', alignRight: false },
  { id: 'clientId', label: 'Client Id', alignRight: false },

  { id: 'designRate', label: 'Design Rate', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function UserList() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [userLists, setUserLists] = useState([]);
  const designList = useSelector((state) => state.designList);
  const { loading, error, designs } = designList;
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const clientDelete = useSelector((state) => state.clientDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = clientDelete;
  useEffect(() => {
    if (successDelete) {
      enqueueSnackbar('Deletee success!'); 
      dispatch({ type: DESIGN_DELETE_RESET });
    }
    dispatch(listDesign());
    
  }, [dispatch ,successDelete]);

  useEffect(() => {
    if (designs?.length) {
      setUserLists(designs);
    }
    
  }, [designs ]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const newSelecteds = userLists.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteUser = (userId) => {
   // const deleteUser = userLists.filter((user) => user.id !== userId);
    dispatch(deleteDesign(userId));
    setSelected([]);
    // setUserList(deleteUser);
  };

  const handleDeleteMultiUser = (selected) => {
    const deleteUsers = userLists.filter((user) => !selected.includes(user.name));
    setSelected([]);
    // setUserList(deleteUsers);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userLists.length) : 0;

  const filteredUsers = applySortFilter(userLists, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && Boolean(filterName);

  return (
    <Page title="Design: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Design List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Design', href: PATH_DASHBOARD.design.root },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.design.newDesign}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Design
            </Button>
          }
        />

        <Card>
          <DesignListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteUsers={() => handleDeleteMultiUser(selected)}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <DesignListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={userLists.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {!loading && filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, designName, designId, client, designRate } = row;
                    const isItemSelected = selected.indexOf(designName) !== -1;

                    return (
                      <TableRow
                        hover
                        key={_id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(designName)} />
                        </TableCell>
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                          {/* // <Avatar alt={clientName} src={avatarUrl} sx={{ mr: 2 }} /> */}
                          <Typography variant="subtitle2" noWrap>
                            {designName}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{designId}</TableCell>
                        <TableCell align="left">{client?client.clientName:'jelpp'}</TableCell>
                        <TableCell align="left">{client?client.clientId:'jelpp'}</TableCell>
                        <TableCell align="left">{designRate}</TableCell>
                        

                        <TableCell align="right">
                          <DesignMoreMenu onDelete={() => handleDeleteUser(_id)} userName={_id} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {loading && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={userLists.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array.filter((_user) => _user.designName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||  _user.designId.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
