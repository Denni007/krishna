import { createSlice } from '@reduxjs/toolkit';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  isSuccess: false,
  error: null,
  designs: [],
  design: null,
  sortBy: null
};

const slice = createSlice({
  name: 'design',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.isSuccess = false;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getDesignsSuccess(state, action) {
      state.isLoading = false;
      state.designs = action.payload;
      state.isSuccess = false;
      state.error = null;

    },

    //  Create client
    createDesignSuccess(state, action) {
      state.isLoading = false;
      state.designs = state.designs.push(action.payload);
      state.isSuccess = true;
      state.error = null;

    },
    updateDesignSuccess(state, action) {
      state.isLoading = false;
      state.designs = state.designs.push(action.payload);
      state.isSuccess = true;
      state.error = null;

    },
    // GET PRODUCT
    getDesignSuccess(state, action) {
      state.isLoading = false;
      state.design = action.payload;
    },

    deleteDesignSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      const  user = action.payload;
      const deleteDesign = state.designs.filter((event) => event._id !== user._id);
      state.designs = deleteDesign;
    },

    filterProducts(state, action) {
      state.filters.gender = action.payload.gender;
      state.filters.category = action.payload.category;
      state.filters.colors = action.payload.colors;
      state.filters.priceRange = action.payload.priceRange;
      state.filters.rating = action.payload.rating;
    },
    emptyDesign(state) {
     
      state.isLoading = false;
      state.designs = [];
      state.isSuccess = false;
      state.design = null;
      state.error = null;
    },

    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;

      const subtotal = sum(cart.map((cartItem) => cartItem.price * cartItem.quantity));
      const discount = cart.length === 0 ? 0 : state.checkout.discount;
      const shipping = cart.length === 0 ? 0 : state.checkout.shipping;
      const billing = cart.length === 0 ? null : state.checkout.billing;

      state.checkout.cart = cart;
      state.checkout.discount = discount;
      state.checkout.shipping = shipping;
      state.checkout.billing = billing;
      state.checkout.subtotal = subtotal;
      state.checkout.total = subtotal - discount;
    },

    addCart(state, action) {
      const product = action.payload;
      
      const isEmptyCart = state.checkout.cart.length === 0;

      if (isEmptyCart) {
        state.checkout.cart = [...state.checkout.cart, product];
      } else {
        state.checkout.cart = state.checkout.cart.map((_product) => {
          const isExisted = _product._id === product._id;
          console.log(_product.price*_product.quantity)
          if (isExisted) {
            return {
              ..._product,
              quantity: _product.quantity + 1,
              subtotal:_product.price*_product.quantity
            };
          }
          return _product;
        });
      }
      state.checkout.cart = uniqBy([...state.checkout.cart, product], 'id');
    },

    deleteCart(state, action) {
      const updateCart = state.checkout.cart.filter((item) => item.id !== action.payload);
      state.checkout.cart = updateCart;
    },

  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  addCart,
  resetCart,
  onGotoStep,
  onBackStep,
  onNextStep,
  deleteCart,
  createBilling,
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
  sortByProducts,
  filterProducts,
} = slice.actions;

// ----------------------------------------------------------------------

export function getDesigns() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/design');
      dispatch(slice.actions.getDesignsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getDesign(name) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/design/${name}`);
      dispatch(slice.actions.getDesignSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function createDesign(designName,designId, client, designRate) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/design/createDesign`, { designName,designId, client, designRate});
      dispatch(slice.actions.createDesignSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateDesign(data) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/design/updateDesign`, data);
      dispatch(slice.actions.updateDesignSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function deleteDesign(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/design/${id}`);
      dispatch(slice.actions.deleteDesignSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
    
  };
}

export function resetDesign() {
  return async () => {
    await dispatch(slice.actions.emptyDesign());
  };
}