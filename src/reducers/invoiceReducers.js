import { INVOICE_SIGNIN_REQUEST,
  INVOICE_UPDATE_PROFILE_FAIL,
  INVOICE_UPDATE_PROFILE_REQUEST,
  INVOICE_UPDATE_PROFILE_RESET,
  INVOICE_DETAILS_FAIL,
  INVOICE_DETAILS_REQUEST,
  INVOICE_DETAILS_RESET,
  INVOICE_LIST_REQUEST,
  INVOICE_LIST_SUCCESS,
  INVOICE_LIST_FAIL,
  INVOICE_DETAILS_SUCCESS,
  INVOICE_UPDATE_PROFILE_SUCCESS, INVOICE_SIGNIN_SUCCESS, INVOICE_SIGNIN_FAIL, INVOICE_CREATE_REQUEST, INVOICE_CREATE_SUCCESS, INVOICE_CREATE_FAIL, 
  INVOICE_LOGOUT, INVOICE_UPDATE_REQUEST, INVOICE_UPDATE_SUCCESS, INVOICE_UPDATE_FAIL,
  INVOICE_DELETE_REQUEST, INVOICE_DELETE_SUCCESS, INVOICE_DELETE_FAIL, INVOICE_DELETE_RESET,
  INVOICE_UPDATE_RESET, INVOICE_TOPSELLERS_LIST_REQUEST, INVOICE_TOPSELLERS_LIST_SUCCESS, INVOICE_TOPSELLERS_LIST_FAIL } from "../constants/invoiceConstants";
  
 



const invoiceUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case INVOICE_UPDATE_REQUEST:
      return { loading: true };
    case INVOICE_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case INVOICE_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case INVOICE_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};


function invoiceCreateReducer(state = {}, action) {
  switch (action.type) {
    case INVOICE_CREATE_REQUEST:
      return { loading: true };
    case INVOICE_CREATE_SUCCESS:
      return { loading: false, invoice: action.payload };
    case INVOICE_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default: return state;
  }
}

const invoiceDetailReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case INVOICE_DETAILS_REQUEST:
      return { loading: true };
    case INVOICE_DETAILS_SUCCESS:
      return { loading: false, invoice: action.payload };
    case INVOICE_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case INVOICE_DETAILS_RESET:
      return { loading: true };
    default:
      return state;
  }
};
const invoiceListReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case INVOICE_LIST_REQUEST:
      return { loading: true };
    case INVOICE_LIST_SUCCESS:
      return { loading: false, invoices: action.payload };
    case INVOICE_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

const invoiceDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case INVOICE_DELETE_REQUEST:
      return { loading: true };
    case INVOICE_DELETE_SUCCESS:
      return { loading: false, success: true };
    case INVOICE_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case INVOICE_DELETE_RESET:
      return {};
    default:
      return state;
  }
};

const userTopSellerListReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case INVOICE_TOPSELLERS_LIST_REQUEST:
      return { loading: true };
    case INVOICE_TOPSELLERS_LIST_SUCCESS:
      return { loading: false, users: action.payload };
    case INVOICE_TOPSELLERS_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export {invoiceCreateReducer, invoiceUpdateReducer, invoiceDetailReducer, invoiceDeleteReducer, invoiceListReducer, userTopSellerListReducer
}