import { configureStore } from '@reduxjs/toolkit';
import Cookie from 'js-cookie';

import { useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import { rootPersistConfig, rootReducer } from './rootReducer';

const userInfo = localStorage.getItem('userSignin')?JSON.parse(localStorage.getItem('userSignin'))
: null
|| null;

// ----------------------------------------------------------------------
const initialState = {
  productDetails: {
  isLoading: false,
  error: null,
  products: [],
  product: null,
  sortBy: null,
  filters: {
    gender: [],
    category: 'All',
    colors: [],
    priceRange: '',
    rating: '',
  },
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: 0,
    billing: null,
  },
},
cart: {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {},
  paymentMethod: 'PayPal',
  subtotal: localStorage.getItem('cartsubtotal')
  ? JSON.parse(localStorage.getItem('cartsubtotal'))
  : 0,
  total: localStorage.getItem('carttotal')
  ? JSON.parse(localStorage.getItem('carttotal'))
  : 0,
  discount: 0,
  shipping: 0,
  billing: null,
  activeStep: 0,
},
userSignin: { userInfo },
};  

const store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
    preloadedState: initialState,
});

const persistor = persistStore(store);

const { dispatch } = store;

const useSelector = useAppSelector;

const useDispatch = () => useAppDispatch();

export { store, persistor, dispatch, useSelector, useDispatch };
