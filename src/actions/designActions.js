import Axios from "axios";
import Cookie from 'js-cookie';

import { DESIGN_SIGNIN_REQUEST,
    DESIGN_UPDATE_PROFILE_FAIL,
    DESIGN_UPDATE_PROFILE_REQUEST,
    DESIGN_UPDATE_PROFILE_RESET,
    DESIGN_DETAILS_FAIL,
    DESIGN_DETAILS_REQUEST,
    DESIGN_DETAILS_RESET,
    DESIGN_LIST_REQUEST,
    DESIGN_LIST_SUCCESS,
    DESIGN_LIST_FAIL,
    DESIGN_DETAILS_SUCCESS,
    DESIGN_UPDATE_PROFILE_SUCCESS, DESIGN_SIGNIN_SUCCESS, DESIGN_SIGNIN_FAIL, DESIGN_CREATE_REQUEST, DESIGN_CREATE_SUCCESS, DESIGN_CREATE_FAIL, 
    DESIGN_LOGOUT, DESIGN_UPDATE_REQUEST, DESIGN_UPDATE_SUCCESS, DESIGN_UPDATE_FAIL,
    DESIGN_DELETE_REQUEST, DESIGN_DELETE_SUCCESS, DESIGN_DELETE_FAIL, DESIGN_DELETE_RESET,
    DESIGN_UPDATE_RESET, DESIGN_TOPSELLERS_LIST_REQUEST, DESIGN_TOPSELLERS_LIST_SUCCESS, DESIGN_TOPSELLERS_LIST_FAIL } from "../constants/designConstants";

const signin = (email, password) => async (dispatch) => {
    dispatch({ type: DESIGN_SIGNIN_REQUEST, payload: { email, password } });
    try {
      const { data } = await Axios.post(`http://localhost:5000/api/users/signin`, { email, password });
      dispatch({ type: DESIGN_SIGNIN_SUCCESS, payload: data });
      localStorage.setItem('userSignin', JSON.stringify(data));
      Cookie.set('userSignin', JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: DESIGN_SIGNIN_FAIL, payload: error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      });
    }
  }

  const createDesign = (designName,designId, client, designRate) => async (dispatch) => {
    dispatch({ type: DESIGN_CREATE_REQUEST, payload: { designName,designId, client, designRate } });
    try {
      const { data } = await Axios.post(`http://localhost:5000/api/design/createDesign`, { designName,designId, client, designRate});
      
      dispatch({ type: DESIGN_CREATE_SUCCESS, payload: data });
     
      
    } catch (error) {
      dispatch({ type: DESIGN_CREATE_FAIL, payload:  error.response && error.response.data.message
        ? error.response.data.message
        : error.message,});
    }
  }
  
  
  
  const designDetails = (userId) => async (dispatch, getState) => {
  
    try {
      console.log(userId.toUpperCase());

      const { data } = await Axios.get(`http://localhost:5000/api/design/${userId}`);
      dispatch({ type: DESIGN_DETAILS_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: DESIGN_DETAILS_FAIL, payload: message });
    }
  };


  const updateDesign = (user) => async (dispatch, getState) => {
    dispatch({ type: DESIGN_UPDATE_REQUEST, payload: user });
   
    try {
      const { data } = await Axios.put(`http://localhost:5000/api/design/updateDesign`, user);
      dispatch({ type: DESIGN_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: DESIGN_UPDATE_FAIL, payload: message });
    }
  }
 
const listDesign = () => async (dispatch, getState) => {
  dispatch({ type: DESIGN_LIST_REQUEST });
  
  try {
    
    const { data } = await Axios.get('http://localhost:5000/api/design/');
    dispatch({ type: DESIGN_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: DESIGN_LIST_FAIL, payload: message });
  }
};


const deleteDesign = (userId) => async (dispatch, getState) => {
  dispatch({ type: DESIGN_DELETE_REQUEST, payload: userId });
  
  try {
    const { data } = await Axios.delete(`http://localhost:5000/api/design/${userId}`);
    dispatch({ type: DESIGN_DELETE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: DESIGN_DELETE_FAIL, payload: message });
  }
};

  
const signout = () => (dispatch) => {
    localStorage.removeItem("userInfo");
    Cookie.remove("userSignin");
    dispatch({ type: DESIGN_LOGOUT });
    document.location.href = '/signin';
  }

  

  
  export { signin  ,createDesign,designDetails ,updateDesign,deleteDesign,listDesign, signout};