import axios from "axios";
import { useState } from "react";

export const useEmail = () =>{
  const [error,setError] = useState(null);
  const [isLoading, setisLoading] = useState(null);

  const isUserEmail = async (email) =>{
    setisLoading(true);
    setError(null);
    await axios.get('/api/forgot/'+email).then((result)=>{
      setError(null);
      setisLoading(false);
    }).catch((err)=>{
      setError("Email does not exist as an account");
      setisLoading(false);
    })
  }

  return {isUserEmail,error,isLoading};

}