// types
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import UserService from './../../services/UserService';

const userData = JSON.parse(window.localStorage.getItem('userDetails'));
// initial state
const initialState = {
  userDetails: userData,
  showLocation: false,
  search: '',
  selectedLocation: '',
  wishList: [],
  userList: [],
  messages: [],
  showContact: false,
  showMessageBox: false,
  alertBox: null,
  showContactBox: false,
  PropertyUserId: null,
    showLoginModal: false,
    userProperty: {}
};

export const fetchWishList = createAsyncThunk('wishListData/fetchWishList', async (userId, { getState }) => {
  const state = getState();
  const response = await UserService.getWishList(state?.users?.userDetails?.userId);
  return response;
});

export const fetchUserList = createAsyncThunk('wishListData/fetchUserList', async (userId, { getState }) => {
  const state = getState();
  const response = await UserService.getUserProperties(state?.users?.userDetails?.userId);
  return response;
});

export const fetchMessages = createAsyncThunk('messagesData/fetchMessages', async (userId, { getState }) => {
  const state = getState();
  const response = await UserService.GetMessages(state?.users?.userDetails?.userId);
  return response;
});

// ==============================|| SLICE - Accounts ||============================== //

const users = createSlice({
  name: 'users',
  initialState,
  reducers: {
      setUserDetails(state, action) {
     
      if (action.payload.userDetails) state.userDetails = action.payload.userDetails;
      else state.userDetails = null;
    },
    setShowContact(state, action) {
      if (state.userDetails == null) {
        state.showLoginModal = true;
      } else {
        state.showContact = action.payload.showContact;
      }
    },
    setShowMessageBox(state, action) {
      if (state.userDetails == null) {
        state.showLoginModal = true;
      } else {
        state.PropertyUserId = action.payload.PropertyUserId;
        state.showMessageBox = action.payload.showMessageBox;
      }
    },
    setShowAlertBox(state, action) {
      //state.showMessageBox = action.payload.showMessageBox;
      return { ...state, alertBox: action.payload, showMessageBox: action.payload.showMessageBox };
    },
    setShowContactBox(state, action) {
      if (state.userDetails == null) {
        state.showLoginModal = true;
      } else {
        state.PropertyUserId = action.payload.PropertyUserId;
        state.showContactBox = action.payload.showContactBox;
      }
    },
    setShowLoginModal(state, action) {
      state.showLoginModal = action.payload.showLoginModal;
      }
      
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed

    builder.addCase(fetchWishList.fulfilled, (state, action) => {
      state.wishList = action.payload;
    });

    builder.addCase(fetchUserList.fulfilled, (state, action) => {
      state.userList = action.payload;
    });

    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.messages = action.payload;
    });
  }
});

export default users.reducer;

export const { setUserDetails, setShowContact, setShowMessageBox, setShowAlertBox, setShowContactBox, setShowLoginModal } = users.actions;
