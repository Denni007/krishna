import { sentenceCase,paramCase } from 'change-case';
import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
import {useSettingsContext} from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { UserListHead, UserListToolbar, UserMoreMenu ,UserTableRow} from '../../sections/@dashboard/user/list';

// import { deleteClient, listUsers } from '../../actions/userActions';
import { USER_DELETE_RESET } from '../../constants/userConstants';
import { getClients ,deleteClient} from '../../redux/slices/client';
import ConfirmDialog from '../../components/confirm-dialog/ConfirmDialog';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'clientName', label: 'Client Name', alignRight: false },
  { id: 'ClientId', label: 'client ID', alignRight: false },
  { id: 'phonenumber', label: 'GST', alignRight: false },
  { id: 'gst', label: 'Phone Number', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function UserList() {
  const theme = useTheme();
  const navigate = useNavigate();
  

  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [filterRoleuserLists, setUserLists] = useState([]);
  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;
  const [openConfirm, setOpenConfirm] = useState(false);
 
  const [tableData, setTableData] = useState([]);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('clientName');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { clients, isLoading } = useSelector((state) => state.client);
  const clientDelete = useSelector((state) => state.clientDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = clientDelete;

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };
  useEffect(() => {
    if (successDelete) {
      enqueueSnackbar('Deletee success!'); 
      dispatch({ type: USER_DELETE_RESET });
    }
    //  dispatch(listUsers());
    dispatch(getClients());
  }, [dispatch , successDelete,  ]);

  useEffect(() => {
    if (clients.length) {
      setTableData(clients);
    }
  }, [clients]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = true ? 60 : 80;

  const isFiltered = filterName !== '' ;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);


  useEffect(() => {
    if (users?.length) {
      setUserLists(users);
      
    }
    
  }, [users ]);
 
  const handleRequestSort = (property) => {
    console.log(property);
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const newSelecteds = clients.map((n) => n.name);
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
    console.log(userId);
    const deleteUser = clients.filter((user) => user.id !== userId);
    dispatch(deleteClient(userId));
    
    setSelected([]);
   setUserLists(deleteUser);
  };

  const handleDeleteRow = (id) => {
    console.log(id);
    // const deleteUser = clients.filter((user) => user._id !== id);
     dispatch(deleteClient(id));
     enqueueSnackbar('Deletee success!'); 
     setTableData(clients);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleEditRow = (id) => {
    console.log(id);

    navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
  };

  const handleDeleteMultiUser = (selected) => {
    const deleteUsers = clients.filter((user) => !selected.includes(user.name));
    setSelected([]);
    setUserLists(deleteUsers);
  };

  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - clients.length) : 0;
  const filteredUsers = applySortFilter(clients, getComparator(order, orderBy), filterName);
  // const isNotFound = !filteredUsers.length && Boolean(filterName);


  return (
    <Page title="User: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="User List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.user.newUser}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New User
            </Button>
          }
        />

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteUsers={() => handleDeleteMultiUser(selected)}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={clients.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                {/* <TableBody>
                  {!isLoading && clients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, clientName, clientId, phoneNumber, gst, address } = row;
                    const isItemSelected = selected.indexOf(clientName) !== -1;

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
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(clientName)} />
                        </TableCell>
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle2" noWrap>
                            {clientName}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{c}</TableCell>
                        <TableCell align="left">{phoneNumber}</TableCell>
                        <TableCell align="left">{gst}</TableCell>
                        <TableCell align="left">{address}</TableCell>
                       

                        <TableCell align="right">
                          <UserMoreMenu onDelete={() => handleDeleteUser(_id)} userName={clientId} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody> */}
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <UserTableRow
                        key={row._id}
                        row={row}
                        // selected={selected.includes(row._id)}
                       // onSelectRow={() => onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                {isLoading && (
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
            count={clients.length}
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

// function getComparator(order, orderBy) {

//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {

    console.log(array.filter((_user) => _user.clientName.toLowerCase().indexOf(query.toLowerCase()) !== -1))
    return array.filter((_user) => _user.clientName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (product) => product.clientName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 || product.clientId.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  // if (filterStatus.length) {
  //   inputData = inputData.filter((product) => filterStatus.includes(product.inventoryType));
  // }

  return inputData;
}