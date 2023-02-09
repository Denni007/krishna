
import Axios from 'axios';
import axiosInstance from '../utils/axios';

import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_SAVE_REQUEST,
  PRODUCT_SAVE_SUCCESS,
  PRODUCT_SAVE_FAIL,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_REVIEW_SAVE_REQUEST,
  PRODUCT_REVIEW_SAVE_FAIL,
  PRODUCT_REVIEW_SAVE_SUCCESS,
  PRODUCT_REVIEW_CREATE_REQUEST,
  PRODUCT_REVIEW_CREATE_SUCCESS,
  PRODUCT_REVIEW_CREATE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_CATEGORY_LIST_SUCCESS,
  PRODUCT_CATEGORY_LIST_REQUEST,
  PRODUCT_CATEGORY_LIST_FAIL,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_REQUEST
} from '../constants/productConstants';

const listProducts = ({
  pageNumber = '',
  searchKeyword = '',
  sortOrder = '',
  seller = '',
  category = '',
  order = '',
  min = 0,
  max = 0,
  rating = 0,
}) => async (dispatch) => {
 
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    console.log(seller)
    const { data } = await Axios.get(`http://localhost:5000/api/products?pageNumber=${pageNumber}&searchKeyword=${searchKeyword}&sortOrder=${sortOrder}&seller=${seller}&category=${category}&min=${min}&max=${max}&rating=${rating}&order=${order}`);
    
    if(searchKeyword.length>1){
      dispatch({ type: PRODUCT_LIST_SUCCESS, payload:  data, List:'SearchPage List'});
      localStorage.setItem(
        'products',
        JSON.stringify(data)
      );
    }
    else{
      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data, List:"HomePage List"});
    }

  } catch (error) {
    dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message });
  }
};

// const saveProduct = (product) => async (dispatch, getState) => {
//   try {
//     dispatch({ type: PRODUCT_SAVE_REQUEST, payload: product });
//     const { userSignin: { userInfo } } = getState();
//     if (!product._id) {
//       const { data } = await Axios.post('/api/products', product, {
//         headers: {
//           Authorization: 'Bearer ' + userInfo.token,
//         },
//       });
//       dispatch({ type: PRODUCT_SAVE_SUCCESS, payload: data });
//     } else {
//       const { data } = await Axios.put('/api/products/' + product._id, product,
//         {
//           headers: {
//             Authorization: 'Bearer ' + userInfo.token,
//           },
//         }
//       );
//       dispatch({ type: PRODUCT_SAVE_SUCCESS, payload: data });
//     }
//   } catch (error) {
//     dispatch({ type: PRODUCT_SAVE_FAIL, payload: error.message });
//   }
// };

const detailsProduct = (productId) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST, payload: productId });
    const { data } = await Axios.get(`http://localhost:5000/api/products/det/${productId}`);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCT_DETAILS_FAIL, payload: error.message });
  }
};

const deleteProduct = (productId) => async (dispatch, getState) => {
  try {
    const { userSignin: { userInfo } } = getState();
    dispatch({ type: PRODUCT_DELETE_REQUEST, payload: productId });
    const { data } = await axiosInstance.delete(`/api/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({ type: PRODUCT_DELETE_SUCCESS, payload: data, success: true });
  } catch (error) {
    dispatch({ type: PRODUCT_DELETE_FAIL, payload: error.message });
  }
};

// const saveProductReview = (productId, review) => async (dispatch, getState) => {
//   try {
//     const {
//       userSignin: {
//         userInfo: { token },
//       },
//     } = getState();
//     dispatch({ type: PRODUCT_REVIEW_SAVE_REQUEST, payload: review });
//     const { data } = await Axios.post(
//       `/api/products/${productId}/reviews`,
//       review,
//       {
//         headers: {
//           Authorization: 'Bearer ' + token,
//         },
//       }
//     );
//     dispatch({ type: PRODUCT_REVIEW_SAVE_SUCCESS, payload: data });
//   } catch (error) {
//     // report error
//     dispatch({ type: PRODUCT_REVIEW_SAVE_FAIL, payload: error.message });
//   }
// };


const createProduct = () => async (dispatch, getState) => {
  
  dispatch({ type: PRODUCT_CREATE_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    console.log("data");
    const { data } = await axiosInstance.post('/api/products', {}, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
   
    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    console.log(error);     
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: PRODUCT_CREATE_FAIL, payload: message });
  }
};

const updateProduct = (product) => async (dispatch, getState) => {
 
  dispatch({ type: PRODUCT_UPDATE_REQUEST, payload: product });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await  axiosInstance.put(`/api/products/${product._id}`, product, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: PRODUCT_UPDATE_FAIL, error: message });
  }
};
const listProductCategories = () => async (dispatch) => {
  dispatch({
    type: PRODUCT_CATEGORY_LIST_REQUEST,
  });
  try {
    const { data } = await Axios.get(`/api/products/categories`);
    dispatch({ type: PRODUCT_CATEGORY_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCT_CATEGORY_LIST_FAIL, payload: error.message });
  }
};

// const createReview = (productId, review) => async (
//   dispatch,
//   getState
// ) => {
//   dispatch({ type: PRODUCT_REVIEW_CREATE_REQUEST });
//   const {
//     userSignin: { userInfo },
//   } = getState();
//   try {
//     const { data } = await Axios.post(`/api/products/${productId}/reviews`,review,
//       {
//         headers: { Authorization: `Bearer ${userInfo.token}` },
//       }
//     );
//     dispatch({type: PRODUCT_REVIEW_CREATE_SUCCESS, payload: data.review,});
//   } catch (error) {
//     const message =
//       error.response && error.response.data.message
//         ? error.response.data.message
//         : error.message;
//     dispatch({ type: PRODUCT_REVIEW_CREATE_FAIL, payload: message });
//   }
// };

// export {
//   //createProduct
//    listProducts,
//   // detailsProduct,
//   // saveProduct,
//   // saveProductReview,
//   // deleteProduct,
//   // createReview,
//   // listProductCategories,
//   // updateProduct
// };
export {
  
   listProducts,
   detailsProduct,
   updateProduct,
   deleteProduct,
   createProduct
};