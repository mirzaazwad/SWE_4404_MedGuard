import Button from 'react-bootstrap/Button';
import OtpInput from 'react18-input-otp';
import { useEffect, useState } from "react";
import axios from 'axios';
import 'bootstrap';
import '../../index.css';
import './styledVerify.css';
import OTPValidityTimer from './OTPTimer';
import PasswordReset from './forgotPasswordReset';

const ForgotPasswordEmailVerify = (props) => {
    const [otp,setOTP]=useState("");
    const [isDisabled,setIsDisabled]=useState(true);
    const [isLocked,setisLocked]=useState(false);
    const [error,setError]=useState(false);
    const [enterotp,setEnterotp]=useState(true);
    const email=props.email;
    const handleTimerExpire = () =>{

    }

    const resend = () =>{
      this.forceUpdate();
    }

    const handleSubmit = async(e) =>{
      await axios.post('/api/forgot/verifyOTP',{
        email:email,
        OTP:otp
      }).then((result)=>{
        console.log(result);
        setEnterotp(false);
      }).catch((error)=>{
        console.log(error);
        setError(error.response.data.error);
        setisLocked(false);
      });
    }
    
  if(enterotp){
    return (
      <div className="verifyDiv">
    <p className="p2">
      An OTP has been sent to your entered email {email}
    </p>
    <p className="p2" style={{color:'red'}}>{error}</p>
    <div className="otpElements">
      <p className="p3">Enter your Code here</p>
      <div className="otp">
        <OtpInput
          onChange={setOTP}
          value={otp}
          inputStyle="inputStyle"
          numInputs={6}
          separator={<span></span>}
        />
      </div>
      <p>OTP is valid for: <OTPValidityTimer validityPeriodInSeconds={180} onTimerExpired={handleTimerExpire}/></p>
      
    </div>
    <div style={{marginBottom:'2%'}}><p className="p3">Didn't receive the code?</p></div>
    <Button  variant="primary" disabled={isDisabled}  style={{float:'left'}} onClick={resend}>Resend</Button>
    <Button variant="primary" disabled={isLocked} style={{float:'right'}} onClick={handleSubmit}>
        Verify
      </Button>

  </div>
 );
  }
  else{
    return (
      <PasswordReset email={email}></PasswordReset>
    )
  }
}
 
export default ForgotPasswordEmailVerify;