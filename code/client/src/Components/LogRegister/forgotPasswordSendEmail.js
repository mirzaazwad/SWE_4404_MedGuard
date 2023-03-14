import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import NavbarLanding from '../partials/landing/navbarLanding';
import { InputGroup } from 'react-bootstrap';
import {Envelope} from "react-bootstrap-icons";
import { useState } from "react";
import axios from 'axios';
import { emailAuth } from '../../Authentication/Auth';
import { useEmail } from '../../Hooks/useEmail';
import ForgotPasswordEmailVerify from './forgotPasswordEmailVerify';

const ForgotPasswordSendEmail = () => {
  const [emailSent,isEmailSent]=useState(false);
  const [email,setEmail]=useState("");
    const [errorMessage,setErrorMessage]=useState("");
    const [isDisabled,setIsDisabled]=useState(false);
    const changeEmail = (e) =>{
      const result=emailAuth(e.target.value);
      setEmail(result.email);
      if(result.error){
        setErrorMessage("Email is not valid");
        setIsDisabled(true);
      }
      else{
        setErrorMessage("");
        setIsDisabled(false);
      }
    }
    const {isUserEmail,error,isLoading}=useEmail();
    const handleSubmit = async (e) =>{
      e.preventDefault();
      setIsDisabled(true);
      isEmailSent(true);
      await isUserEmail(email);
      if(error===""){
        await axios.get('/api/forgot/'+email).then((result)=>{
          console.log(result);
          isEmailSent(true);
        })
        .catch((error)=>{
          setErrorMessage(error.data.response.error);
        })
      }
      setIsDisabled(isLoading);
    }
    if(!emailSent){
      return ( 
        <Form onSubmit={handleSubmit}> 
            <Form.Group>
                      <div className="errorMessage" style={{color:"red"}}>
                        {error===""?errorMessage:error}
                      </div>
                    </Form.Group>
    
                      <Form.Group controlId="Email" className="w-100">
                      <InputGroup className="mt-3 mb-3">
                      <InputGroup.Text><Envelope color="#3354a9" /></InputGroup.Text>
                        <Form.Control
                          type="email"
                          required
                          placeholder="Email"
                          className="float-start"
                          value={email}
                          onChange={changeEmail}
                        />
                       </InputGroup>
                      </Form.Group>
    
                      <div className='d-flex justify-content-center'>
            <Button variant="primary" type="submit" disabled={isDisabled}>
              Send Recovery Email
            </Button>
            </div>
          </Form>
       );
    }
    else{
      return <ForgotPasswordEmailVerify email={email}/>
    }
}
 
export default ForgotPasswordSendEmail;