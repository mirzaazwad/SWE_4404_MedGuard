import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user: null,
  loginSignUp: 0,
  buyerState: {},
  sellerState: {},
  sellerDetails: {}
}

export const userSlice=createSlice({
  name:"userState",
  initialState,
  reducers:{
    LOGIN:(state,action)=>{
      state.user=action.payload;
    },
    LOGOUT:(state)=>{
      state.user=null;
      state.loginSignUp=0;
    },
    setLogin:(state)=>{
      state.loginSignUp=0;
    },
    setSignUp:(state)=>{
      state.loginSignUp=1;
    },
    setBuyerUser:(state,action)=>{
      state.buyerState=action.payload;
    },
    setSellerUser:(state,action)=>{
      state.sellerState=action.payload;
    },
    setSellerDetails:(state,action)=>{
      state.sellerDetails=action.payload;
    }
  }
});

export const {LOGIN,LOGOUT,setLogin,setSignUp,setBuyerUser,setSellerUser,setSellerDetails} =userSlice.actions;
export default userSlice.reducer;