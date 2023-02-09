import Axios from "axios";
import Cookie from 'js-cookie';

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


  const createStock = (user) => async (dispatch) => {
    dispatch({ type: STOCK_CREATE_REQUEST, payload:  user  });
    try {
      const { data } = await Axios.post(`http://localhost:5000/api/stock/createStock`, user);     
      dispatch({ type: STOCK_CREATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: STOCK_CREATE_FAIL, payload:  error.response && error.response.data.message
        ? error.response.data.message
        : error.message,});
    }
  }
  
  
  
  const stockDetails = (userId) => async (dispatch, getState) => {
  
    try {
      console.log(userId.toUpperCase());

      const { data } = await Axios.get(`http://localhost:5000/api/stock/${userId}`);
      dispatch({ type: STOCK_DETAILS_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: STOCK_DETAILS_FAIL, payload: message });
    }
  };


  const updateStock = (user) => async (dispatch, getState) => {
    dispatch({ type: STOCK_UPDATE_REQUEST, payload: user });
   
    try {
      const { data } = await Axios.put(`http://localhost:5000/api/stock/updateStock`, user);
      dispatch({ type: STOCK_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: STOCK_UPDATE_FAIL, payload: message });
    }
  }
 
const listStock = () => async (dispatch, getState) => {
  dispatch({ type: STOCK_LIST_REQUEST });
  try {
    const { data } = await Axios.get('http://localhost:5000/api/stock/');
    dispatch({ type: STOCK_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: STOCK_LIST_FAIL, payload: message });
  }
};


const deleteStock = (userId) => async (dispatch, getState) => {
  dispatch({ type: STOCK_DELETE_REQUEST, payload: userId });
  
  try {
    const { data } = await Axios.delete(`http://localhost:5000/api/stock/${userId}`);
    dispatch({ type: STOCK_DELETE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: STOCK_DELETE_FAIL, payload: message });
  }
};

  

  

  
  export { createStock,stockDetails ,updateStock,deleteStock,listStock};