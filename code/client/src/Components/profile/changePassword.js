import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import NavbarLanding from '../partials/landing/navbarLanding';
import { InputGroup } from 'react-bootstrap';
import {EyeFill,EyeSlashFill} from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { passwordAuth, confirmPasswordAuth } from '../../Authentication/Auth'; 

const ChangePassword = () => {
    const user=JSON.parse(localStorage.getItem('user'));
    const navigate=useNavigate();
    const [currentPasswordVisibility, setCurrentPasswordVisibility] = useState(false);
    const [NewPasswordVisibility, setNewPasswordVisibility] = useState(false);
    const [confirmNewPasswordVisibility, setConfirmNewPasswordVisibility] = useState(false);
    const [currentPassword,setCurrentPassword]=useState("");
    const [newPassword,setNewPassword]=useState("");
    const [confirmPassword, setConfirmPassword]=useState("");
    const [errorNewPassword,setErrorNewPassword]=useState("");
    const [errorCurrentPassword, setErrorCurrentPassword]=useState("");
    const [errorConfirmPassword, setErrorConfirmPassword]=useState("");
    const [disableButton, setDisableButton] = useState(true);


    const handleSubmit = async(e) =>{
      e.preventDefault();
      setDisableButton(true);
      await axios.patch('/api/profile/user/changePassword/'+user._id,{
        currentPassword:CryptoJS.SHA512(currentPassword).toString(),
        password:CryptoJS.SHA512(newPassword).toString()
      },{
        headers: {
          'Authorization': `Bearer ${user.token}`
        }})
        .then(()=>{
          navigate('./../');
        })
        .catch(()=>{
          setDisableButton(false);
          setErrorCurrentPassword('Current password does not match the existing password');
        })
      setDisableButton(false);
    }

    useEffect(()=>{
      if(errorCurrentPassword==="" && errorConfirmPassword==="" && errorNewPassword==="" && currentPassword!=="" && newPassword!=="" && confirmPassword!==""){
        setDisableButton(false);
      }
      else{
        setDisableButton(true);
      }
    },[errorCurrentPassword,errorNewPassword,errorConfirmPassword,confirmPassword,newPassword,currentPassword])


    const changeCurrentPassword = (e) =>{
      setErrorCurrentPassword("");
      setCurrentPassword(e.target.value);
    }

    const passwordChange = (e) =>{
      setNewPassword(e.target.value);
      if(e.target.value===""){
        return setErrorNewPassword(null);
      }
      const result=passwordAuth(e.target.value);
      setErrorNewPassword(result.error);
      const confirm=confirmPasswordAuth(e.target.value,confirmPassword);
      setErrorConfirmPassword(confirm.error);
      
    }

    const confirmPasswordChange = (e) =>{
      setConfirmPassword(e.target.value);
      if(e.target.value===""){
        return setErrorConfirmPassword(null);
      }
      const result=confirmPasswordAuth(e.target.value,newPassword);
      setErrorConfirmPassword(result.error);
    }

    return ( 
        <div>
            <NavbarLanding/>
            <section className='d-flex justify-content-center'>
            <Card className='changePasswordCard'>
        <Card.Header className='' style={{textAlign: "center", fontSize: "20px"}}><b>Change Password</b></Card.Header>
        <Card.Body>
        <Form onSubmit={handleSubmit}>     
            <Form.Group className="mb-3" controlId="formCurrentPassword">
            {errorCurrentPassword!=="" && (<div style={{color:'red'}}>{errorCurrentPassword}</div>)}
            <Form.Label>Current Password</Form.Label>
            <InputGroup>
            <Form.Control  type={currentPasswordVisibility?"text":"password"} placeholder="Password" value={currentPassword} onChange={changeCurrentPassword}  />                 
            <InputGroup.Text>
                    {(currentPasswordVisibility && (
                      <EyeFill color="#3354a9" onClick={()=>setCurrentPasswordVisibility(false)} />
                    )) ||
                      (!currentPasswordVisibility && (
                        <EyeSlashFill color="#3354a9" onClick={()=>setCurrentPasswordVisibility(true)} />
                      ))}
                  </InputGroup.Text>
                  </InputGroup>
          </Form.Group>
          {errorNewPassword!=="" && (<div style={{color:'red'}}>{errorNewPassword}</div>)}
        <Form.Group className="mb-3" controlId="formNewPassword">
            
          <Form.Label>New Password</Form.Label>
          <InputGroup>
          <Form.Control  type={NewPasswordVisibility?"text":"password"} placeholder="Password" onChange={passwordChange} value={newPassword} />                 
          <InputGroup.Text>
                  {(NewPasswordVisibility && (
                    <EyeFill color="#3354a9" onClick={()=>setNewPasswordVisibility(false)} />
                  )) ||
                    (!NewPasswordVisibility && (
                      <EyeSlashFill color="#3354a9" onClick={()=>setNewPasswordVisibility(true)} />
                    ))}
                </InputGroup.Text>
                </InputGroup>
        </Form.Group>
        {errorConfirmPassword!=="" && (<div style={{color:'red'}}>{errorConfirmPassword}</div>)}
        <Form.Group className="mb-3" controlId="formConfirmNewPassword">
            
          <Form.Label>Confirm New Password</Form.Label>
          <InputGroup>
          <Form.Control  type={confirmNewPasswordVisibility?"text":"password"} placeholder="Password" onChange={confirmPasswordChange} value={confirmPassword}/>                 
          <InputGroup.Text>
                  {(confirmNewPasswordVisibility && (
                    <EyeFill color="#3354a9" onClick={()=>setConfirmNewPasswordVisibility(false)} />
                  )) ||
                    (!confirmNewPasswordVisibility && (
                      <EyeSlashFill color="#3354a9" onClick={()=>setConfirmNewPasswordVisibility(true)} />
                    ))}
                </InputGroup.Text>
                </InputGroup>
        </Form.Group>
        <div className='d-flex justify-content-between'>
        <Button variant="primary" type="submit" disabled = {disableButton}  >
          Confirm
        </Button>
            <Button onClick={()=>navigate('./../')}>Back To Profile</Button>
            </div>
      </Form>
        </Card.Body>
      </Card>
      </section>
        </div>   
     );
}
 
export default ChangePassword;