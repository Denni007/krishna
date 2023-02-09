import { STOCK_SIGNIN_REQUEST,
  STOCK_UPDATE_PROFILE_FAIL,
  STOCK_UPDATE_PROFILE_REQUEST,
  STOCK_UPDATE_PROFILE_RESET,
  STOCK_DETAILS_FAIL,
  STOCK_DETAILS_REQUEST,
  STOCK_DETAILS_RESET,
  STOCK_LIST_REQUEST,
  STOCK_LIST_SUCCESS,
  STOCK_LIST_FAIL,
  STOCK_DETAILS_SUCCESS,
  STOCK_UPDATE_PROFILE_SUCCESS, STOCK_SIGNIN_SUCCESS, STOCK_SIGNIN_FAIL, STOCK_CREATE_REQUEST, STOCK_CREATE_SUCCESS, STOCK_CREATE_FAIL, 
  STOCK_LOGOUT, STOCK_UPDATE_REQUEST, STOCK_UPDATE_SUCCESS, STOCK_UPDATE_FAIL,
  STOCK_DELETE_REQUEST, STOCK_DELETE_SUCCESS, STOCK_DELETE_FAIL, STOCK_DELETE_RESET,
  STOCK_UPDATE_RESET, STOCK_TOPSELLERS_LIST_REQUEST, STOCK_TOPSELLERS_LIST_SUCCESS, STOCK_TOPSELLERS_LIST_FAIL } from "../constants/stockConstants";
  
 



const stockUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case STOCK_UPDATE_REQUEST:
      return { loading: true };
    case STOCK_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case STOCK_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case STOCK_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};


function stockCreateReducer(state = {}, action) {
  switch (action.type) {
    case STOCK_CREATE_REQUEST:
      return { loading: true };
    case STOCK_CREATE_SUCCESS:
      return { loading: false, stock: action.payload };
    case STOCK_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default: return state;
  }
}

const stockDetailReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case STOCK_DETAILS_REQUEST:
      return { loading: true };
    case STOCK_DETAILS_SUCCESS:
      return { loading: false, stock: action.payload };
    case STOCK_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case STOCK_DETAILS_RESET:
      return { loading: true };
    default:
      return state;
  }
};
const stockListReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case STOCK_LIST_REQUEST:
      return { loading: true };
    case STOCK_LIST_SUCCESS:
      return { loading: false, stocks: action.payload };
    case STOCK_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

const stockDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case STOCK_DELETE_REQUEST:
      return { loading: true };
    case STOCK_DELETE_SUCCESS:
      return { loading: false, success: true };
    case STOCK_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case STOCK_DELETE_RESET:
      return {};
    default:
      return state;
  }
};

const userTopSellerListReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case STOCK_TOPSELLERS_LIST_REQUEST:
      return { loading: true };
    case STOCK_TOPSELLERS_LIST_SUCCESS:
      return { loading: false, users: action.payload };
    case STOCK_TOPSELLERS_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export {stockCreateReducer, stockUpdateReducer, stockDetailReducer, stockDeleteReducer, stockListReducer, userTopSellerListReducer
}