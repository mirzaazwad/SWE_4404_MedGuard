import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import { LOGIN } from "../Contexts/action";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useGoogleSignUp = (userType) =>{
  const [error,setError] = useState(null);
  const [isLoading, setisLoading] = useState(null);
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const googleSignUp=useGoogleLogin({
    onSuccess: async ({ code }) => {
      await axios.post('/api/auth/google', {
        code,
        userType:userType,
        operation:'signup'
      }).then((result)=>{
        const user={_id:result.data.result._id,email:result.data.userInfo.email,userType:result.data.result.userType,token:result.data.tokens.id_token,verified:result.data.userInfo.email_verified,googleId:result.data.userInfo.sub};
        console.log(user);
        dispatch(LOGIN({_id:user._id,userType:user.userType,token:user.token,verified:user.verified,googleId:user.googleId}));
        localStorage.setItem('user',JSON.stringify({_id:user._id,userType:user.userType,token:user.token,verified:user.verified,googleId:user.googleId}));
        if(user.userType==="seller"){
          navigate('/profileSeller');
        }
        else if(user.userType==="buyer"){
          navigate('/profileBuyer');
        }
        else if(user.userType==="delivery"){
          navigate('/profileDelivery');
        }
        else{
          navigate('/');
        }
        setisLoading(false);
      }).catch(()=>{
        setError("Google Sign Up Failed");
      })
    },
    flow: 'auth-code',
  }
  );

  return {googleSignUp,error,isLoading};
}