import {
  Card,
  Form,
  Button,
  InputGroup,
  ToggleButton,
  ButtonGroup,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { LOGIN, setLogin } from "../../Contexts/action";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  emailAuth,
  passwordAuth,
  confirmPasswordAuth,
  userNameAuth,
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
import jwt_decode from 'jwt-decode';
import axios from "axios";

const SignUp = () => {
  useEffect(()=>{
    /* global google */
    google.accounts.id.initialize(
      {
        client_id: "430247778721-b4hss8mpbk8qhtfkr4v7h1d2gt32me82.apps.googleusercontent.com",
        callback: handleCallBackResponse
      }
    );
    google.accounts.id.renderButton(
      document.getElementById('googleSignIn'),
      {theme:'outline', size:'large'}
    )
  },[]);

  const dispatch = useDispatch();
  const [radioValue, setRadioValue] = useState(1);
  const navigate=useNavigate();
  const [radioName, setRadioName] = useState("Buyer");
  const radios = [
    { name: "Buyer", value: 1 },
    { name: "Seller", value: 2 },
  ];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorCPassword] = useState("");
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =useState(false);
  const {signup,error,isLoading}= useSignUp();

  const emailChange = (event) => {
    const result = emailAuth(event.target.value);
    setEmail(result.email);
    if (result.error) setErrorEmail("Not valid email");
    else setErrorEmail("");
  };

  const passwordChange = (event) => {
    const passwordValidation = passwordAuth(event.target.value);
    const confirmPasswordValidation = confirmPasswordAuth(confirmPassword);
    setErrorPassword(passwordValidation.error);
    setPassword(passwordValidation.password);
    setErrorCPassword(confirmPasswordValidation.error);
  };

  const radioChange = (event) => {
    setRadioValue(event.target.value);
    if (event.target.value === 1) {
      setRadioName("Buyer");
    } else {
      setRadioName("Seller");
    }
  };
  const confirmPasswordChange = (event) => {
    const confirmPasswordValidation = confirmPasswordAuth(
      password,
      event.target.value
    );
    setErrorCPassword(confirmPasswordValidation.error);
    setConfirmPassword(confirmPasswordValidation.confirmPassword);
  };

  
  const handleSubmit =async (e) =>{
    e.preventDefault();
    await signup(radioName==='Seller'?'seller':'buyer',username,email,password);
  }

  const signin = async (userType,username,email,googleId,imageURL,verified) =>{
    await axios.post('/api/google/signup',{userType:userType,username:username,email:email,googleId:googleId,imageURL:imageURL,verified:verified})
    .then((result)=>{
      dispatch(LOGIN({_id:result.data._id,userType:result.data.userType,token:result.data.token,verified:true}));
      localStorage.setItem('user',JSON.stringify({_id:result.data._id,email:result.data.email,userType:result.data.userType,token:result.data.token,verified:true}));
    })
    .catch((err)=>{
      console.log(err.response.data.error);
    })
  }

  async function handleCallBackResponse(response){
    const res= jwt_decode(response.credential);
    signin(radioName==='Seller'?'seller':'buyer',res.name,res.email,res.sub,res.picture,res.verified);
  }

  return (
    <div className="signup-container" style={{ marginTop: "10%" }}>
      <Card className="w-75" style={{ maxWidth: "100%" }}>
        <Card.Body>
          <Card.Title style={{ textAlign: "center" }}>SignUp</Card.Title>
          <Card.Text>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="errorMessageEmail">
                <p style={{ color: "red" }}>{error}</p>
              </Form.Group>
              <Form.Group
                controlId="UserType"
              >
                <div className="d-flex justify-content-center w-100" >
                <ButtonGroup className="singUp-button ">
                  {radios.map((radio, idx) => (
                    <ToggleButton
                      key={idx}
                      id={`radio-${idx}`}
                      type="radio"
                      variant={idx % 2 ? "primary" : "primary"}
                      name="radio"
                      value={radio.value}
                      checked={radioValue === radio.value}
                      onChange={radioChange}
                    >
                      {radio.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
                </div>
                
              </Form.Group>

                <Form.Group controlId="Username" className="w-100">
                <InputGroup className="mt-3 mb-3" size="sm">
                <InputGroup.Text>
                  <Person color="#3354a9" />
                </InputGroup.Text>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Username"
                    className="float-end"
                    value={username}
                    onChange={(e)=>setUsername(userNameAuth(e.target.value))}
                  />
              </InputGroup>
                </Form.Group>
              <Form.Group controlId="errorMessageEmail">
                <p style={{ color: "red" }}>{errorEmail}</p>
              </Form.Group>

                <Form.Group controlId="Email" className="w-100">
                <InputGroup className="mt-3 mb-3" size="sm">
                <InputGroup.Text>
                  <Envelope color="#3354a9" />
                </InputGroup.Text>
                  <Form.Control
                    type="email"
                    required
                    placeholder="Email"
                    className="float-end"
                    value={email}
                    onChange={emailChange}
                  />
              </InputGroup>
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
                <div className="d-flex justify-content-center">
              <Button className="btn btn-login align-content-center"
                type="submit"
                size="md"
                disabled={isLoading}
              >
                SignUp
              </Button>
              </div>
              <hr />
              <Form.Group controlId="LoginWithGoogle" className="d-flex justify-content-around">
                <div id="googleSignIn" className="google"></div>
              </Form.Group>
            </Form>
            <div className="existingAccount landingText" style={{ textAlign: "center"  }}>
              Already have an account?
              <Link
                to="/"
                style={{ color: "#3354a9", textAlign: "center"  }}
              >
                LOG IN!
              </Link>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SignUp;