// ** React Imports
import { useState, forwardRef } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import TableRow from '@mui/material/TableRow'
import Collapse from '@mui/material/Collapse'
import TableBody from '@mui/material/TableBody'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import TableContainer from '@mui/material/TableContainer'
import { styled, alpha, useTheme } from '@mui/material/styles'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TableCell from '@mui/material/TableCell'
import CardContent from '@mui/material/CardContent'
import { MobileDatePicker } from '@mui/lab'
import Repeater from '../../../../../components/Repeter/index'

// ** Icon Imports

// ** Third Party Imports
// import DatePicker from 'react-datepicker'

// ** Configs
// import themeConfig from 'src/configs/themeConfig'

// ** Custom Component Imports
// import Repeater from 'src/@core/components/repeater'

const CustomInput = forwardRef(({ ...props }, ref) => {
  return (
    <TextField
      size='small'
      inputRef={ref}
      sx={{ width: { sm: '250px', xs: '170px' }, '& .MuiInputBase-input': { color: 'text.secondary' } }}
      {...props}
    />
  )
})

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  padding: `${theme.spacing(1, 0)} !important`
}))

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const RepeatingContent = styled(Grid)(({ theme }) => ({
  paddingRight: 0,
  display: 'flex',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '& .col-title': {
    top: '-1.5rem',
    position: 'absolute'
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.secondary
  },
  [theme.breakpoints.down('lg')]: {
    '& .col-title': {
      top: '0',
      position: 'relative'
    }
  }
}))

const RepeaterWrapper = styled(CardContent)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  '& .repeater-wrapper + .repeater-wrapper': {
    marginTop: theme.spacing(1)
  }
}))

const InvoiceAction = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 1),
  borderLeft: `1px solid ${theme.palette.divider}`
}))

const CustomSelectItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.success.main,
  backgroundColor: 'transparent !important',
  '&:hover': { backgroundColor: `${alpha(theme.palette.success.main, 0.1)} !important` }
}))
const now = new Date()
const tomorrowDate = now.setDate(now.getDate() + 7)

const AddCard = props => {
  // ** Props
  const { clients, invoiceNumber, selectedClient, setSelectedClient, toggleAddCustomerDrawer } = props
  console.log(clients)
  // ** States
  const [count, setCount] = useState([''])
  const [selected, setSelected] = useState('Invoice To')
  const [issueDate, setIssueDate] = useState(new Date())
  const [dueDate, setDueDate] = useState(new Date(tomorrowDate))

  // ** Hook
  const theme = useTheme()

  // ** Deletes form
  const deleteForm = e => {
    e.preventDefault()

    // @ts-ignore
    e.target.closest('.repeater-wrapper').remove()
  }

  // ** Handle Invoice To Change
  const handleInvoiceChange = event => {
    setSelected(event.target.value)
    if (clients !== undefined) {
      setSelectedClient(clients.filter(i => i.clientName === event.target.value)[0])
    }
  }

  const handleAddNewCustomer = () => {
    toggleAddCustomerDrawer()
  }


  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid item xl={6} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h3">Krishna Fashion</Typography>
              </Box>
              <div>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  Office 149, 450 South Brand Brooklyn
                </Typography>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  San Diego County, CA 91905, USA
                </Typography>
                <Typography variant='body2'>+1 (123) 456 7891, +44 (876) 543 2198</Typography>
              </div>
            </Box>
          </Grid>
          <Grid item xl={6} xs={12} >

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xl: 'flex-end', xs: 'flex-start' } }}>
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <Typography variant='h6' sx={{ mr: 1, width: '105px' }}>
                  Invoice
                </Typography>
                <TextField
                  size='small'
                  value={invoiceNumber}
                  sx={{ width: { sm: '250px', xs: '170px' } }}
                  InputProps={{
                    disabled: true,
                    startAdornment: <InputAdornment position='start'>#</InputAdornment>
                  }}
                />
              </Box>
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <Typography variant='body2' sx={{ mr: 2, width: '100px' }}>
                  Date Issued:
                </Typography>
                <MobileDatePicker
                  id='issue-date'
                  showTodayButton
                  value={issueDate}
                  onChange={date => setIssueDate(date)}
                  label="Invoice date"
                  inputFormat="dd/MM/yyyy"
                  renderInput={(params) => <TextField
                    {...params} fullWidth />}
                />
              </Box>
            </Box>

          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ my: theme => `${theme.spacing(1)} !important` }} />
      <CardContent sx={{ pb: 2 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
            <Typography variant='subtitle1' sx={{ mr: 2, color: 'text.primary' }}>
              Invoice To:
            </Typography>

            {selectedClient !== null && selectedClient !== undefined ? (
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>

                  <Typography variant="h5" sx={{ mb: 1, color: 'text.primary' }}>
                    {selectedClient.clientName}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>

                  <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {selectedClient.address}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant='body2' sx={{ mr: 2, width: '100px' }}>
                    PhoneNumber:
                  </Typography>
                  <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {selectedClient.phoneNumber}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant='body2' sx={{ mr: 2, width: '100px' }}>
                    GST:
                  </Typography>
                  <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {selectedClient.gst}
                  </Typography>
                </Box>
              </Grid>
            ) : null}

          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start', 'flex-end'] }}>
            <div>
              <Select size='small' value={selected} onChange={handleInvoiceChange} sx={{ mb: 4, width: '200px' }}>
                {clients !== undefined &&
                  clients.map(client => (
                    <MenuItem key={client.clientName} value={client.clientName}>
                      {client.clientName}
                    </MenuItem>
                  ))}
              </Select>
            </div>

          </Grid>

          {/* <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start', 'flex-end'] }}>
            <div>
              <Typography variant='subtitle2' sx={{ mb: 2.5, color: 'text.primary' }}>
                Bill To:
              </Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='body2'>Total Due:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='body2'>$12,110.55</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='body2'>Bank name:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='body2'>American Bank</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='body2'>Country:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='body2'>United States</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='body2'>IBAN:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='body2'>ETD95476213874685</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='body2'>SWIFT code:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='body2'>BR91905</Typography>
                      </MUITableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Grid> */}
        </Grid>
      </CardContent>

      <Divider sx={{ mb: theme => `${theme.spacing(1.25)} !important` }} />
      <RepeaterWrapper>
      <Box>      
        {count.map((count)=> {
          return <Box key={count}  {...(count !== 0 ? { in: true } : {})}>
                          <Grid container>
                          <RepeatingContent item xs={12}>
        
                            <Grid container sx={{ py: 4, width: '100%', pr: { lg: 0, xs: 4 } }}>
                              <Grid item lg={6} md={5} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                                <Typography
                                  variant='subtitle2'
                                  className='col-title'
                                  sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                                >
                                  Item
                                </Typography>
                                <Select fullWidth size='small' defaultValue='App Design'>
                                  <MenuItem value='App Design'>App Design</MenuItem>
                                  <MenuItem value='App Customization'>App Customization</MenuItem>
                                  <MenuItem value='ABC Template'>ABC Template</MenuItem>
                                  <MenuItem value='App Development'>App Development</MenuItem>
                                </Select>
                                <TextField
                                  rows={2}
                                  fullWidth
                                  multiline
                                  size='small'
                                  sx={{ mt: 3.5 }}
                                  defaultValue='Customization & Bug Fixes'
                                />
                              </Grid>
                              <Grid item lg={2} md={3} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                                <Typography
                                  variant='subtitle2'
                                  className='col-title'
                                  sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                                >
                                  Cost
                                </Typography>
                                <TextField
                                  size='small'
                                  type='number'
                                  placeholder='24'
                                  defaultValue='24'
                                  InputProps={{ inputProps: { min: 0 } }}
                                />
                                <Box sx={{ mt: 3.5 }}>
                                  <Typography component='span' variant='body2' sx={{ lineHeight: 2 }}>
                                    Discount:
                                  </Typography>{' '}
                                  <Typography component='span' variant='body2'>
                                    0%
                                  </Typography>
                                  <Tooltip title='Tax 1' placement='top'>
                                    <Typography component='span' variant='body2' sx={{ mx: 2 }}>
                                      0%
                                    </Typography>
                                  </Tooltip>
                                  <Tooltip title='Tax 2' placement='top'>
                                    <Typography component='span' variant='body2'>
                                      0%
                                    </Typography>
                                  </Tooltip>
                                </Box>
                              </Grid>
                              <Grid item lg={2} md={2} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                                <Typography
                                  variant='subtitle2'
                                  className='col-title'
                                  sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                                >
                                  Hours
                                </Typography>
                                <TextField
                                  size='small'
                                  type='number'
                                  placeholder='1'
                                  defaultValue='1'
                                  InputProps={{ inputProps: { min: 0 } }}
                                />
                              </Grid>
                              <Grid item lg={2} md={1} xs={12} sx={{ px: 4, my: { lg: 0 }, mt: 2 }}>
                                <Typography
                                  variant='subtitle2'
                                  className='col-title'
                                  sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                                >
                                  Price
                                </Typography>
                                <Typography variant='body2'>$24.00</Typography>
                              </Grid>
                            </Grid>
                            <InvoiceAction>
                              <IconButton size='small' onClick={deleteForm}>
                                {/* <Icon icon='mdi:close' fontSize={20} /> */}
                              </IconButton>
                            </InvoiceAction>        
                          </RepeatingContent>
                        </Grid>
                        </Box>
        })}
        
            

             
          </Box>
      </RepeaterWrapper>
      <Grid container sx={{ mt: 4.75 }}>
        <Grid item xs={12} sx={{ px: 0 }}>
          <Button
            size='small'
            variant='contained'
            // startIcon={<Icon icon='mdi:plus' fontSize={20} />}
            onClick={() => setCount('add')}
          >
            Add Item
          </Button>
        </Grid>
      </Grid>
      <Divider />

      <CardContent>
        <Grid container>
          <Grid item xs={12} sm={9} sx={{ order: { sm: 1, xs: 2 } }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Typography
                variant='body2'
                sx={{ mr: 2, color: 'text.primary', fontWeight: 600, letterSpacing: '.25px' }}
              >
                Salesperson:
              </Typography>
              <TextField
                size='small'
                defaultValue='Tommy Shelby'
                sx={{ maxWidth: '150px', '& .MuiInputBase-input': { color: 'text.secondary' } }}
              />
            </Box>
            <TextField
              size='small'
              placeholder='Thanks for your business'
              sx={{ maxWidth: '300px', '& .MuiInputBase-input': { color: 'text.secondary' } }}
            />
          </Grid>
          <Grid item xs={12} sm={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
            <CalcWrapper>
              <Typography variant='body2'>Subtotal:</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                $1800
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant='body2'>Discount:</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                $28
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant='body2'>Tax:</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                21%
              </Typography>
            </CalcWrapper>
            <Divider
              sx={{ mt: theme => `${theme.spacing(6)} !important`, mb: theme => `${theme.spacing(1.5)} !important` }}
            />
            <CalcWrapper>
              <Typography variant='body2'>Total:</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                $1690
              </Typography>
            </CalcWrapper>
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ my: theme => `${theme.spacing(1)} !important` }} />

      <CardContent sx={{ pt: 4 }}>
        <InputLabel htmlFor='invoice-note'>Note:</InputLabel>
        <TextField
          rows={2}
          fullWidth
          multiline
          id='invoice-note'
          sx={{ '& .MuiInputBase-input': { color: 'text.secondary' } }}
          defaultValue='It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!'
        />
      </CardContent>
    </Card>
  )
}

export default AddCard
