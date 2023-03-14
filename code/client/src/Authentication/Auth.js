import DOMPurify from "dompurify";
import validator from "validator";

const emailAuth = (email) =>{
  const santizedValue=DOMPurify.sanitize(email);
  if(!validator.isEmail(santizedValue)){
    return {email:santizedValue,error:true};
  }
  else{
    return {email:santizedValue,error:false};
  }
}

const passwordAuth = (password) =>{
  const sanitizedValue = DOMPurify.sanitize(password);
  if(validator.isStrongPassword(sanitizedValue)){
    return {password: sanitizedValue,error:""}
  }
  else{
    return {password: sanitizedValue,error:"Password must be at least 8 characters with numbers, symbols and letters of upper case and lower case"}
  }

}

const confirmPasswordAuth = (password,confirmPassword) =>{
  if(DOMPurify.sanitize(password)===DOMPurify.sanitize(confirmPassword)){
    return {confirmPassword:confirmPassword,error:""};
  }
  else{
    return {confirmPassword:confirmPassword,error:"Passwords do not match"};
  }
}

const userNameAuth = (username) =>{
  return DOMPurify.sanitize(username);
}

export {emailAuth,passwordAuth,confirmPasswordAuth,userNameAuth};

