import axios from "axios";
import { useState } from "react";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LOGIN } from "../Contexts/action";

export const useSignUp = () =>{
  const [error,setError] = useState(null);
  const [isLoading, setisLoading] = useState(null);
  const navigate =useNavigate();
  const dispatch=useDispatch();
  const signup = async (userType,username,email,password) =>{
    setisLoading(true);
    setError(null);
    password=CryptoJS.SHA512(password).toString();
    await axios.post('/api/signup',{userType,username,email,password,verified:false})
    .then((result)=>{
      localStorage.setItem('user',JSON.stringify({_id:result.data._id,email:result.data.email,userType:result.data.userType,token:result.data.token,verified:false}));
      navigate('/emailVerify/'+email);
      setisLoading(false);
      setError(null);
    })
    .catch((err)=>{
      console.log(err.response.data.error);
      setError(err.response.data.error);
      setisLoading(false);
    })
  }

  return {signup,error,isLoading};
}