import sum from 'lodash/sum';

import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_SHIPPING,CART_ADD_ITEM_FAIL, CART_SAVE_PAYMENT, CART_DATA_ALL, CART_INCREASE_DATA, CART_DECREASE_DATA, CART_NEXT_STEP, CART_DISCOUNT, CART_BACK_STEP, ADDRESS_ADD_REQUEST, ADDRESS_ADD_SUCCESS, ADDRESS_ADD_FAIL, ADDRESS_LIST_FAIL, ADDRESS_LIST_SUCCESS, ADDRESS_LIST_REQUEST, CART_CHARGE_SHIPPING, ADDRESS_DELETE_REQUEST, ADDRESS_DELETE_SUCCESS, ADDRESS_DELETE_FAIL, ADDRESS_DELETE_RESET, ADDRESS_ADD_RESET, CART_GOTO_STEP, CART_RESET_DATA } from "../constants/cartConstants";

const InitialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {},
  paymentMethod: 'PayPal',
  subtotal: 0,
  total: localStorage.getItem('carttotal')
  ? JSON.parse(localStorage.getItem('carttotal'))
  :0,
  discount: 0,
  shipping: 0,
  billing: null,
  activeStep: 0,
}
function cartReducer(state = InitialState, action) {
  
  const isEmptyCart = state.cartItems === 0;
  switch (action.type) {
    case CART_ADD_ITEM:{ 
      const item = action.payload;
      console.log(item)
      const existItem = state.cartItems.find(x => x._id === item._id);
      console.log(existItem)
      if (existItem) {
        
        return {
          ...state,
          error: '',
          cartItems: state.cartItems.map((_product) => {
            const isExisted = _product._id === item._id;
            if (isExisted) {
              return {
                ..._product,
                quantity: _product.quantity + item.quantity,
                subtotal:_product.price*(_product.quantity + item.quantity),
                
              };
            }
            return _product ;
          }),
          total: sum(state.cartItems.map((cartItem) => cartItem.price * cartItem.quantity)),  
          subtotal: sum(state.cartItems.map((cartItem) => cartItem.price * cartItem.quantity))  ,
        };
      } 
      
        return { ...state, error: '', cartItems: [...state.cartItems, item] ,total: item.price * item.quantity ,subtotal: item.price * item.quantity  };
      
    }
    case CART_DISCOUNT: {
    const discountd = action.payload;
      return { ...state, 
        discount: discountd, 
        subtotal:sum(state.cartItems.map((cartItem) => cartItem.price * cartItem.quantity)), 
        total: sum(state.cartItems.map((cartItem) => cartItem.price * cartItem.quantity)) - discountd , 
      };
    }
    case CART_REMOVE_ITEM: 
      return { ...state, cartItems: state.cartItems.filter(x => x._id !== action.payload) };
    case CART_SAVE_SHIPPING:
      return { ...state, shippingAddress: action.payload , billing: action.payload};
    case CART_CHARGE_SHIPPING:
      return { ...state, shipping: action.payload,
        total :sum(state.cartItems.map((cartItem) => cartItem.price * cartItem.quantity)) +  action.payload - state.discount};
    case CART_ADD_ITEM_FAIL:
      return { ...state, error: action.payload };
    case CART_SAVE_PAYMENT:
      return { ...state, paymentMethod: action.payload };
    case CART_DATA_ALL:
      return { ...state, cartItems: action.payload ,  
        subtotal:sum(state.cartItems.map((cartItem) => cartItem.price * cartItem.quantity)), 
        total: sum(state.cartItems.map((cartItem) => cartItem.price * cartItem.quantity))};
    case CART_NEXT_STEP:
      return { ...state, activeStep:state.activeStep+ 1};
      
    case CART_BACK_STEP:{
      const productId = action.payload;
        return { ...state, activeStep:state.activeStep ===2?state.activeStep -2 :state.activeStep -1 }; 
    }
    case CART_GOTO_STEP:{
      const step = action.payload;
        return { ...state, activeStep:step }; 
    }
    case CART_INCREASE_DATA:{
      const productId = action.payload;
      return { 
        ...state,
        cartItems: state.cartItems.map((product) => {
        if (product._id === productId) {
          return {
            ...product,
            quantity: product.quantity +1,  
          };
        }
        return product;}),
        subtotal:sum(state.cartItems.map((cartItem) => cartItem.price * cartItem.quantity)), 
        total: sum(state.cartItems.map((cartItem) => cartItem.price * cartItem.quantity))
      }
    }
    case CART_DECREASE_DATA:{
      const productId = action.payload;
      return { 
        ...state,
        cartItems: state.cartItems.map((product) => {
        if (product._id === productId) {
          return {
            ...product,
            quantity: product.quantity -1,  
          };
        }
        return product;}), 
        subtotal:sum(state.cartItems.map((cartItem) => cartItem.price * cartItem.quantity)), 
        total: sum(state.cartItems.map((cartItem) => cartItem.price * cartItem.quantity))
      }
    }
    case CART_RESET_DATA:
      return {cartItems: [],
    shippingAddress:  {},
    paymentMethod: 'PayPal',
    subtotal: 0,
    total: localStorage.removeItem('carttotal')
    ? JSON.parse(localStorage.removeItem('carttotal'))
    :0,
    discount: 0,
    shipping: 0,
    billing: null,
    activeStep: state.activeStep,
  };
     default:
      return state
    
  }
} 

function addressCreateReducer(state = {}, action) {
  switch (action.type) {
    case ADDRESS_ADD_REQUEST:
      return {...state, loading: true };
    case ADDRESS_ADD_SUCCESS:
      return {...state, loading: false, address: action.payload, success: true };
    case ADDRESS_ADD_FAIL:
      return {...state, loading: false, error: action.payload };
    case ADDRESS_ADD_RESET:
      return {};
    default:
      return state
  }
}

function addressReducer(state = {}, action) {
  switch (action.type) {
    case ADDRESS_LIST_REQUEST:
      return {...state, loading: true };
    case ADDRESS_LIST_SUCCESS:
      return {...state, loading: false, address: action.payload.data, success: true };
    case ADDRESS_LIST_FAIL:
      return {...state, loading: false, error: action.payload };
   
    default:
      return state
  }
}

function deleteAddressReducer(state = {}, action) {
  switch (action.type) {
    case ADDRESS_DELETE_REQUEST:
      return {...state, loading: true };
    case ADDRESS_DELETE_SUCCESS:
      return {...state, loading: false, deleteaddress: action.payload, success: true };
    case ADDRESS_DELETE_FAIL:
      return {...state, loading: false, error: action.payload };
    case ADDRESS_DELETE_RESET:
        return {};
    default:
      return state
  }
}

export { cartReducer, addressCreateReducer, addressReducer ,deleteAddressReducer}