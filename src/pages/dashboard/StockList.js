import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

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
import { StockListHead, StockListToolbar, StockMoreMenu } from '../../sections/@dashboard/stock/list';

import { deleteStock, listStock } from '../../actions/stockAction';
import { USER_DELETE_RESET } from '../../constants/userConstants';
import { fCurrency } from '../../utils/formatNumber';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'challanNo', label: 'challanNo', alignRight: false },
  { id: 'challanDate', label: 'challan Date', alignRight: false },
  { id: 'designName', label: 'Design Name', alignRight: false },
  { id: 'clientName', label: 'Client Name', alignRight: false },
  { id: 'Design Rate', label: 'design Rate', alignRight: false },
  { id: 'Short', label: 'Short', alignRight: false },
  { id: 'Quantity', label: 'Quantity', alignRight: false },
  { id: 'Challanprice', label: 'Challan Price', alignRight: false },

  { id: 'Action' ,label:'Action' },
];

// ----------------------------------------------------------------------

export default function UserList() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [userLists, setUserLists] = useState([]);
  const stockList = useSelector((state) => state.stockList);
  const { loading, error, stocks } = stockList;
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('clientName');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const stockDelete = useSelector((state) => state.stockDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = stockDelete;
  useEffect(() => {
    if (successDelete) {
      enqueueSnackbar('Deletee success!'); 
      dispatch({ type: USER_DELETE_RESET });
    }
    dispatch(listStock());
    
  }, [dispatch , successDelete,  ]);

  useEffect(() => {
    console.log(stocks)
    if (stocks?.length) {
      setUserLists(stocks);
      console.log(userLists);
    }
  }, [stocks]);
 
  const handleRequestSort = (property) => {
    console.log(property);
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
    console.log(userId);
    const deleteUser = userLists.filter((user) => user.id !== userId);
    dispatch(deleteStock(userId));
    setSelected([]);
   setUserLists(deleteUser);
  };

  const handleDeleteMultiUser = (selected) => {
    const deleteUsers = userLists.filter((user) => !selected.includes(user.name));
    setSelected([]);
    setUserLists(deleteUsers);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userLists.length) : 0;
  const filteredUsers = applySortFilter(userLists, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUsers.length && Boolean(filterName);


  return (
    <Page title="Stock: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Stock List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Stock', href: PATH_DASHBOARD.stock.root },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.stock.newStock}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Stock
            </Button>
          }
        />

        <Card>
          <StockListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteUsers={() => handleDeleteMultiUser(selected)}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <StockListHead
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
                    const { _id, challanNo, challanDate, designId, designName, design,stockQuantity,Short,clientId } = row;
                    const isItemSelected = selected.indexOf(challanNo) !== -1;

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
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(challanNo)} />
                        </TableCell>
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                          {/* // <Avatar alt={clientName} src={avatarUrl} sx={{ mr: 2 }} /> */}
                          <Typography variant="subtitle2" noWrap>
                            {challanNo}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                        <Typography variant="subtitle2">{format(new Date(challanDate), 'dd MMM yyyy')}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {format(new Date(challanDate), 'p')}
                      </Typography>
                        </TableCell>
                        <TableCell align="left">
                        <Typography variant="subtitle2">{designName}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                       {designId}
                      </Typography>
                          </TableCell>
                        <TableCell align="left">
                        <Typography variant="subtitle2">{row.client.clientName}</Typography>
                       <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                       {clientId}
                      </Typography>
                        </TableCell>
                        <TableCell>{fCurrency(design.designRate)}</TableCell>
                        <TableCell>{Short}</TableCell>
                        <TableCell>{stockQuantity}</TableCell>
                        <TableCell>₹{fCurrency((design.designRate -Short) * stockQuantity)}</TableCell>
                        {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}
                         {/* <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={(status === 'banned' && 'error') || 'success'}
                          >
                            {sentenceCase(status)}
                          </Label>
                        </TableCell> */}

                        <TableCell align="right">
                          <StockMoreMenu onDelete={() => handleDeleteUser(_id)} userName={_id} />
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

    return array.filter((_user) => _user.clientName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
