import Axios from "axios";
import Cookie from "js-cookie";
import { BACKEND_API } from "../config";
import { CART_ADD_ITEM,CART_DATA_ALL ,CART_REMOVE_ITEM, CART_SAVE_SHIPPING,CART_SAVE_PAYMENT ,CART_ADD_ITEM_FAIL, CART_INCREASE_DATA, CART_DECREASE_DATA, CART_NEXT_STEP, CART_DISCOUNT, CART_BACK_STEP, ADDRESS_ADD_REQUEST, ADDRESS_ADD_SUCCESS, ADDRESS_ADD_FAIL, ADDRESS_LIST_REQUEST, ADDRESS_LIST_SUCCESS, ADDRESS_LIST_FAIL, ADDRESS_DELETE_REQUEST, ADDRESS_DELETE_SUCCESS, ADDRESS_DELETE_FAIL, CART_GOTO_STEP, CART_RESET_DATA} from "../constants/cartConstants";

const addToCart = (productId, qty) => async (dispatch, getState) => {
  try {
   // const { data } = await Axios.get(`http://localhost:5000/api/products/${productId._id}` );
    const {cart: { cartItems },} = getState();
      dispatch({
        type: CART_ADD_ITEM,
        payload: {
          _id: productId._id,
          name: productId.name,
          cover:productId.cover,
          available:productId.available,
          price: productId.price,
          color:productId.color,
          quantity: productId.quantity,
          size: productId.size,
          subtotal:Math.round(productId.price*productId.quantity)
        },
      });
      localStorage.setItem(
        'cartItems',
        JSON.stringify(getState().cart.cartItems)
      );
      localStorage.setItem(
        'carttotal',
        JSON.stringify(getState().cart.total)
      );
      localStorage.setItem(
        'cartsubtotal',
        JSON.stringify(getState().cart.total)
      );
  } catch (error) {
console.log(error);
  }
}
const removeFromCart = (productId) => (dispatch, getState) => {
  const { cart: { cartItems } } = getState();
  
  const product = cartItems.filter(x => x._id === productId);
 
 
  dispatch({ type: CART_REMOVE_ITEM, payload: productId });
 
  localStorage.setItem(
    'cartItems',
    JSON.stringify(getState().cart.cartItems)
  );
}
const saveShipping = (data) => (dispatch) => {
  dispatch({ type: CART_SAVE_SHIPPING, payload: data });
  localStorage.setItem('shippingAddress', JSON.stringify(data));
}
const savePayment = (data) => (dispatch) => {
  dispatch({ type: CART_SAVE_PAYMENT, payload: data });
}
const getCartdata = () => (dispatch,  getState) => {
  const { cart: { cartItems } } = getState();
  dispatch({ type: CART_DATA_ALL, payload: cartItems });
}
const cartIncrease = (product) => (dispatch,  getState) => {
  const { cart: { cartItems } } = getState();

  dispatch({ type: CART_INCREASE_DATA, payload: product });
}
const cartDecrease = (product) => (dispatch,  getState) => {
  const { cart: { cartItems } } = getState();

  dispatch({ type: CART_DECREASE_DATA, payload: product });
}
const nextStep = () => (dispatch,  getState) => {
  const { cart: { cartItems } } = getState();
  dispatch({ type: CART_NEXT_STEP, payload: cartItems });
}
const backStep = () => (dispatch,  getState) => {
  const { cart: { cartItems } } = getState();
  dispatch({ type: CART_BACK_STEP, payload: cartItems });
}
const gotoStep = (data) => (dispatch,  getState) => {
  const { cart: { cartItems } } = getState();
  dispatch({ type: CART_GOTO_STEP, payload: data });
}
const cartDiscount = (value) => (dispatch,  getState) => {
  const { cart: { cartItems } } = getState();
  dispatch({ type: CART_DISCOUNT, payload: value});
}
const createAddress = (datapay) => async (dispatch,  getState) => {
  const {
        userSignin: { userInfo },
      } = getState();
  dispatch({ type: ADDRESS_ADD_REQUEST, payload: datapay});
  try {
    const { data } = await Axios.post(`http://localhost:5000/api/orders/shipping`, datapay ,  {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            });
    
    dispatch({ type: ADDRESS_ADD_SUCCESS, payload: data });
    
    
  } catch (error) {
    dispatch({ type: ADDRESS_ADD_FAIL, payload:  error.response && error.response.data.message
      ? error.response.data.message
      : error.message,});
  }
}
const getAddress = () => async (dispatch,  getState) => {
  const {
        userSignin: { userInfo },
      } = getState();
  dispatch({ type: ADDRESS_LIST_REQUEST, payload: userInfo});
  try {
    const { data } = await Axios.get(`http://localhost:5000/api/orders/address`,   {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            });
    
    dispatch({ type: ADDRESS_LIST_SUCCESS, payload: data });
    localStorage.setItem('address', JSON.stringify(data));
  } catch (error) {
    dispatch({ type: ADDRESS_LIST_FAIL, payload:  error.response && error.response.data.message
      ? error.response.data.message
      : error.message,});
  }
}

const deleteAddress = (address) => async (dispatch,  getState) => {
  const {
        userSignin: { userInfo },
      } = getState();
  dispatch({ type: ADDRESS_DELETE_REQUEST, payload: userInfo});
  try {
    const { data } = await Axios.delete(`${BACKEND_API}/api/orders/address/${address}`,  {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            });
    
    dispatch({ type: ADDRESS_DELETE_SUCCESS, payload: data });
    
  } catch (error) {
    dispatch({ type: ADDRESS_DELETE_FAIL, payload:  error.response && error.response.data.message
      ? error.response.data.message
      : error.message,});
  }
}

const resetCart = () => async (dispatch,  getState) => {
  localStorage.removeItem("cartItems");
  
  dispatch({ type: CART_RESET_DATA });

}

export { addToCart,resetCart, removeFromCart, getAddress ,saveShipping, savePayment,  getCartdata, cartIncrease,cartDecrease ,gotoStep,nextStep,backStep,deleteAddress, cartDiscount,createAddress}