import { Container, Card, Form, Button,InputGroup } from "react-bootstrap";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Envelope, EyeFill, Lock ,EyeSlashFill} from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { LOGIN, setSignUp } from "../../Contexts/action";
import { Link, useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { useEffect, useState } from "react";
import { useLogin } from "../../Hooks/useLogin";
import '../../boxicons-2.1.4/css/boxicons.min.css';
import jwt_decode from 'jwt-decode';
const Login = () => {
  const [errorMessage,setError]=useState("");
  useEffect(()=>{
    /* global google */
    google.accounts.id.initialize(
      {
        client_id: "430247778721-b4hss8mpbk8qhtfkr4v7h1d2gt32me82.apps.googleusercontent.com",
        callback: handleCallBackResponse
      }
    );
    google.accounts.id.renderButton(
      document.getElementById('googleLogin'),
      {theme:'outline', size:'large'}
    )
  },[]);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const {login,isLoading,error}=useLogin();
  const [passwordVisibility,setPasswordVisibility] = useState(false);
  const dispatch=useDispatch();
  const handleSubmit = async(e) =>{
    e.preventDefault();
    await login(email,password);
    setError(error);
  }



  const loginGoogle = async (email,googleId) =>{
    await axios.post('/api/google/loginGoogle',{email:email,googleId:googleId})
    .then((result)=>{
      dispatch(LOGIN({_id:result.data._id,userType:result.data.userType,token:result.data.token,verified:true}));
      localStorage.setItem('user',JSON.stringify({_id:result.data._id,email:result.data.email,userType:result.data.userType,token:result.data.token,verified:true}));
    })
    .catch((err)=>{
      setError(err.response.data.error)
      console.log(err.response.data.error);
    })
  }

  async function handleCallBackResponse(response){
    const res= jwt_decode(response.credential);
    loginGoogle(res.email,res.sub);
  }

  return (
    <div className="login-container"  style={{ marginTop: '15%' }}>
      <Card className="d-flex justify-items-center w-75" >
        <Card.Body>
          <Card.Title style={{ textAlign: "center" }}>Login</Card.Title>
          <Card.Text>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <div className="errorMessage" style={{color:"red"}}>
                  {errorMessage!==""?errorMessage:error}
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
                    
                    onChange={(e)=>setEmail(e.target.value)}
                  />
                 </InputGroup>
                </Form.Group>


                <Form.Group controlId="Password" className="w-100 h-50">
                <InputGroup className="mt-3 mb-3" size="sm">
                <InputGroup.Text><Lock color="#3354a9" /></InputGroup.Text>
                  <Form.Control
                    type={passwordVisibility?"text":"password"}
                    placeholder="Password"
                    required
                    className="float-end"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    
                  />
                  <InputGroup.Text>{(passwordVisibility && <EyeFill color="#3354a9" onClick={(e)=>setPasswordVisibility(false)} />) || (!passwordVisibility && <EyeSlashFill color="#3354a9" onClick={(e)=>setPasswordVisibility(true)} />)}</InputGroup.Text>
              </InputGroup>
                </Form.Group>

              <div className="d-flex justify-content-center">
              <Button className="btn btn-login"
                type="submit"
                size="md">Login</Button>
              </div>
              
                <hr />
                <Form.Group controlId="LoginWithGoogle" className="d-flex justify-content-around">
                <div id="googleLogin" className="google"></div>
              </Form.Group>
              
            </Form>
            <div className="noExistingAccount landingText" style={{textAlign: 'center'}}>
              Don't have an account?
            <Link
                to='/signup'
                style={{
                  all: "unset",
                  color: "#3354a9",
                  textDecoration: "underline",

                }}
              >
                REGISTER NOW!
            </Link>
            </div>
            <div className="forgotPassword landingText" style={{textAlign: 'center'}}>
              <Link
                to='/forgotPassword'
                style={{
                  all: "unset",
                  color: "#3354a9",
                  textDecoration: "underline",
                }}
              >
                FORGOT PASSWORD?
            </Link>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
);
}

export default Login;
