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
  
  const userInfo = localStorage.getItem('userSignin')? JSON.parse(localStorage.getItem('userSignin'))
  : null;

  const InitialState = {
    userSignin: { userInfo }
  
  }
function userSigninReducer(state = InitialState, action) {
  switch (action.type) {
    case DESIGN_SIGNIN_REQUEST:
      return { loading: true };
    case DESIGN_SIGNIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case DESIGN_SIGNIN_FAIL:
      return { loading: false, error: action.payload };
    case DESIGN_LOGOUT:
      return {};
    default: return state;
  }
}


const designUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case DESIGN_UPDATE_REQUEST:
      return { loading: true };
    case DESIGN_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case DESIGN_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case DESIGN_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

function userRegisterReducer(state = {}, action) {
  switch (action.type) {
    case DESIGN_CREATE_REQUEST:
      return { loading: true };
    case DESIGN_CREATE_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case DESIGN_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default: return state;
  }
}
function designCreateReducer(state = {}, action) {
  switch (action.type) {
    case DESIGN_CREATE_REQUEST:
      return { loading: true };
    case DESIGN_CREATE_SUCCESS:
      return { loading: false, design: action.payload };
    case DESIGN_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default: return state;
  }
}

const designDetailReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case DESIGN_DETAILS_REQUEST:
      return { loading: true };
    case DESIGN_DETAILS_SUCCESS:
      return { loading: false, design: action.payload };
    case DESIGN_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case DESIGN_DETAILS_RESET:
      return { loading: true };
    default:
      return state;
  }
};
const designListReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case DESIGN_LIST_REQUEST:
      return { loading: true };
    case DESIGN_LIST_SUCCESS:
      return { loading: false, designs: action.payload };
    case DESIGN_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

const designDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case DESIGN_DELETE_REQUEST:
      return { loading: true };
    case DESIGN_DELETE_SUCCESS:
      return { loading: false, success: true };
    case DESIGN_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case DESIGN_DELETE_RESET:
      return {};
    default:
      return state;
  }
};

const userTopSellerListReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case DESIGN_TOPSELLERS_LIST_REQUEST:
      return { loading: true };
    case DESIGN_TOPSELLERS_LIST_SUCCESS:
      return { loading: false, users: action.payload };
    case DESIGN_TOPSELLERS_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export {
  userSigninReducer, userRegisterReducer,designCreateReducer, designUpdateReducer, designDetailReducer, designDeleteReducer, designListReducer, userTopSellerListReducer
}