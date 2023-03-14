import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import NavbarLanding from '../partials/landing/navbarLanding';
import {EyeFill,EyeSlashFill, Envelope} from "react-bootstrap-icons";
import { InputGroup } from 'react-bootstrap';
import OtpInput from 'react18-input-otp';
import { useEffect, useState } from "react";
import axios from 'axios';
import 'bootstrap';
import '../../index.css';
import './styledVerify.css';
import { useNavigate, useParams } from 'react-router-dom';
import OTPValidityTimer from './OTPTimer';
import { useDispatch } from 'react-redux';
import { LOGIN } from '../../Contexts/action';

const EmailVerification = () => {
    const currentUser=JSON.parse(localStorage.getItem('user'));
    if(!currentUser){
      navigate('/');
    }
    const token=currentUser.token;
    const navigate=useNavigate();
    const {email}=useParams();
    const [otp,setOTP]=useState("");
    const [isDisabled,setIsDisabled]=useState(true);
    const [isLocked,setisLocked]=useState(false);
    const [error,setError]=useState(true);
    const dispatch=useDispatch();

    useEffect(()=>{
      axios.get('/api/verifyEmail/'+email, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((result)=>{
        console.log(result);
      })
      .catch(err=>setError(err.error));
    },[]);



    const handleSubmit = async(e) =>{
      setisLocked(true);
      const result=await axios.post('/api/verifyOTP',{
        email:email,
        OTP:otp
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch((error)=>{
        console.log(error);
        setError(error.response.data.error);
        setisLocked(false);
      });
      if(result){
        const user=await axios.patch('/api/verifyEmail/'+email,{
          verified:true
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch((err)=>{
          setError(err.response.data.error);
          setisLocked(false);
        });
        if(user){
          const unverified=JSON.parse(localStorage.getItem('user'));
          localStorage.removeItem('user');
          localStorage.setItem('user',JSON.stringify({_id:unverified._id,userType:unverified.userType,token:unverified.token,verified:true}));
          dispatch(LOGIN({_id:user.data.result._id,userType:unverified.userType,token:unverified.token,verified:true}));
          setisLocked(false);
        }
        else{
          setError('An error occured try again later');
        }
      }
    }


    const resend = () =>{
      window.location.reload();
    }

    const handleTimerExpire = async(e) =>{
      setIsDisabled(false);
      axios.delete('/api/deleteOTP/'+email, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((result)=>{
        console.log('successfully deleted');
      })
      .catch((error)=>{
        console.log(error);
      })
    }

    return ( 
        <div>
            <NavbarLanding/>
            <section className='d-flex justify-content-center'>
            <Card className='forgotPasswordCard'>
        <Card.Header className=''><Envelope style={{color:"#3354a9",paddingRight:'5px',fontSize:'30px',marginBottom:'1.25%'}} /><b style={{textAlign: "center", fontSize: "20px"}}>Verify Email Account</b></Card.Header>
        <Card.Body>
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
        </Card.Body>
      </Card>
      </section>
        </div>   
     );
}
 
export default EmailVerification;
