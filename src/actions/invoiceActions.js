import Axios from "axios";
import Cookie from 'js-cookie';
import { BACKEND_API } from "../config";

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


  const createInvoice = (user) => async (dispatch) => {
    dispatch({ type: INVOICE_CREATE_REQUEST, payload:  user  });
    try {
      const { data } = await Axios.post(`${BACKEND_API}/api/invoice/createInvoice`, user);     
      dispatch({ type: INVOICE_CREATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: INVOICE_CREATE_FAIL, payload:  error.response && error.response.data.message
        ? error.response.data.message
        : error.message,});
    }
  }
  
  
  
  const invoiceDetail = (userId) => async (dispatch, getState) => {
  
    try {
      dispatch({ type: INVOICE_DETAILS_REQUEST, payload: userId });

      const { data } = await Axios.get(`${BACKEND_API}/api/invoice/${userId}`);
      dispatch({ type: INVOICE_DETAILS_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: INVOICE_DETAILS_FAIL, payload: message });
    }
  };


  const updateInvoice = (user) => async (dispatch, getState) => {
    dispatch({ type: INVOICE_UPDATE_REQUEST, payload: user });
   
    try {
      const { data } = await Axios.put(`${BACKEND_API}/api/invoice/updateInvoice`, user);
      dispatch({ type: INVOICE_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: INVOICE_UPDATE_FAIL, payload: message });
    }
  }
 
const listInvoice = () => async (dispatch, getState) => {
  dispatch({ type: INVOICE_LIST_REQUEST });
  try {
    const { data } = await Axios.get(`${BACKEND_API}/api/invoice/`);
    dispatch({ type: INVOICE_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: INVOICE_LIST_FAIL, payload: message });
  }
};


const deleteInvoice = (userId) => async (dispatch, getState) => {
  dispatch({ type: INVOICE_DELETE_REQUEST, payload: userId });
  
  try {
    const { data } = await Axios.delete(`${BACKEND_API}/api/invoice/${userId}`);
    dispatch({ type: INVOICE_DELETE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: INVOICE_DELETE_FAIL, payload: message });
  }
};

  

  

  
  export { createInvoice,invoiceDetail ,updateInvoice,deleteInvoice,listInvoice};