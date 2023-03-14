import {
  Card,
  Form,
  Button,
  InputGroup,
  ToggleButton,
  ButtonGroup,
} from "react-bootstrap";
import { useState } from "react";
import { setLogin } from "../../Contexts/action";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import {
  passwordAuth,
  confirmPasswordAuth,
} from "../../Authentication/Auth";
import {
  Envelope,
  Lock,
  EyeFill,
  EyeSlashFill,
  Person,
} from "react-bootstrap-icons";
import '../../boxicons-2.1.4/css/boxicons.min.css';
import { useSignUp } from "../../Hooks/useSignUp";
import axios from "axios";
import { useLogin } from "../../Hooks/useLogin";

const PasswordReset = (props) => {
  const email = props.email;
  const [radioName, setRadioName] = useState("Buyer");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [errorPassword, setErrorPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorConfirmPassword, setErrorCPassword] = useState("");
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =useState(false);
  const [isDisabled, setIsDisabled] =useState(false);
  const [error,setError]=useState("");
  const passwordChange = (e) =>{
    const passwordValidation = passwordAuth(e.target.value);
    const confirmPasswordValidation = confirmPasswordAuth(confirmPassword);
    setErrorPassword(passwordValidation.error);
    setPassword(passwordValidation.password);
    setErrorCPassword(confirmPasswordValidation.error);
  }

  const confirmPasswordChange = (e) =>{
    const confirmPasswordValidation = confirmPasswordAuth(
      password,
      e.target.value
    );
    setErrorCPassword(confirmPasswordValidation.error);
    setConfirmPassword(confirmPasswordValidation.confirmPassword);
  }


  const {login,errorMsg,isLoading}=useLogin();

  const handleSubmit = async(e) =>{
    console.log('comes here');
    await e.preventDefault();
    axios.patch('/api/forgot/updatePassword/'+email,{
      password:CryptoJS.SHA512(password).toString()
    })
    .then(async (result)=>{
      await login(email,password);
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  return ( 
        <Form onSubmit={handleSubmit}> 
        <Form.Group>
                  <div className="errorMessage" style={{color:"red"}}>
                    {error===""?errorMessage:error}
                  </div>
                </Form.Group>

                <Form.Group
                controlId="errorPassword"
                style={{ overflowWrap: "anywhere" }}
              >
                <p style={{ color: "red" }}>{errorPassword}</p>
              </Form.Group>

                <Form.Group controlId="Password" className="w-100">
                <InputGroup className="mt-3 mb-3" size="sm">
                <InputGroup.Text>
                  <Lock color="#3354a9" />
                </InputGroup.Text>
                  <Form.Control
                    type={passwordVisibility?"text":"password"}
                    placeholder="Password"
                    required
                    className="float-end"
                    onChange={passwordChange}
                    value={password}
                  />
                <InputGroup.Text>
                  {(passwordVisibility && (
                    <EyeFill color="#3354a9" onClick={()=>setPasswordVisibility(false)} />
                  )) ||
                    (!passwordVisibility && (
                      <EyeSlashFill color="#3354a9" onClick={()=>setPasswordVisibility(true)} />
                    ))}
                </InputGroup.Text>
              </InputGroup>
                </Form.Group>
              <Form.Group controlId="errorConfirmPassword" className="w-100">
                <p style={{ color: "red" }}>{errorConfirmPassword}</p>
              </Form.Group>
                <Form.Group controlId="ConfirmPassword">
              <InputGroup className="mt-3 mb-3" size="sm">
                <InputGroup.Text>
                  <Lock color="#3354a9" />
                </InputGroup.Text>
                  <Form.Control
                    type={confirmPasswordVisibility?"text":"password"}
                    placeholder="Confirm Password"
                    required
                    className="float-end"
                    value={confirmPassword}
                    onChange={confirmPasswordChange}
                  />
                <InputGroup.Text>
                  {(confirmPasswordVisibility && (
                    <EyeFill color="#3354a9" onClick={()=>setConfirmPasswordVisibility(false)} />
                  )) ||
                    (!confirmPasswordVisibility && (
                      <EyeSlashFill color="#3354a9" onClick={()=>setConfirmPasswordVisibility(true)} />
                    ))}
                </InputGroup.Text>
              </InputGroup>
                </Form.Group>

                  <div className='d-flex justify-content-center'>
        <Button variant="primary" type="submit" disabled={isDisabled}>
          Reset Password
        </Button>
        </div>
      </Form>  
   );
}
 
export default PasswordReset;