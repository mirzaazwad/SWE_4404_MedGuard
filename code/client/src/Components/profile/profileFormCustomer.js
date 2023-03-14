import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { InputGroup } from "react-bootstrap";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import "../../index.css";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import { setBuyerUser } from "../../Contexts/action";
import CryptoJS from "crypto-js";

const ProfileFormCustomer = (id) => {
  const _id = id;
  const buyer = useSelector((state) => state.userState.buyerState);
  const user = useSelector((state) => state.userState.user);
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLocked, setisLocked] = useState(false);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error,setError]=useState("");
  const [currentPasswordVisibility, setCurrentPasswordVisibility] =useState(false);
  const [errorPassword,setErrorPassword] = useState(false);
  const [password, changePassword] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
    useEffect(() => {
    setUsername(buyer.username);
    setPhone(buyer.phone);
    setAddress(buyer.address);
  }, [buyer]);

  const setPassword = (e) =>{
    changePassword(e.target.value);
    setError("");
  }
  const turnOnEdit = () => {
    setIsDisabled(false);
    setIsEditing(true);
  };

  const turnOffEdit = () => {
    setIsDisabled(true);
    setIsEditing(false);
  };

  const verify = async (_id,password) => {
    await axios.post("/api/profile/user/verify", {_id,password}, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }).then((result)=>{
      console.log(result);
      setErrorPassword(!result.data.success);
    }).catch((error)=>{
      console.log(error);
      setErrorPassword(true);
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    turnOffEdit();
    setisLocked(true);
    setError("");
    await verify(_id.id,CryptoJS.SHA512(password).toString());
    if(!errorPassword){
      await axios
      .patch(
        "/api/profile/user/updateUser/" + _id.id,
        {
          username: username,
          phone: phone,
          address: address,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((result) => {
        handleClose();
        dispatch(setBuyerUser(result.data));
      })
    }
    else{
      console.log('comes here');
      setError("Password is incorrect");
    }
    setIsEditing(false);
    setisLocked(false);
  };
  

  return (
    <div>
      <div className="profileInfo d-flex justify-content-between">
        <h4 className="InfoHeader mb-4">Personal Information</h4>
        <button
          className="btn btn-outline-dark btn-editProfile "
          onClick={turnOnEdit}
        >
          Edit Profile
          <i className="bx bx-cog bx-sm"></i>
        </button>
      </div>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            disabled={isDisabled}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Contact No.</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter contact no."
            disabled={isDisabled}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="address"
            placeholder="Address"
            disabled={isDisabled}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            disabled={isDisabled}
            value={buyer.email}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          {isEditing && (
            <a href={"changePassword/" + user._id}>Change Password</a>
          )}
        </Form.Group>

        {isEditing && (
          <Button
            className="btn btn-outline-dark btn-save"
            disabled={isLocked}
            onClick={handleShow}
          >
            Save
          </Button>
        )}
      
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Password to Confirm Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="errorMessageShow" style={{color:"red"}}>{error}</div>
            <Form.Group className="mb-3" controlId="enterPassword">
              <Form.Label>Enter Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={currentPasswordVisibility ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={setPassword}
                />
                <InputGroup.Text>
                  {(currentPasswordVisibility && (
                    <EyeFill
                      color="#3354a9"
                      onClick={() => setCurrentPasswordVisibility(false)}
                    />
                  )) ||
                    (!currentPasswordVisibility && (
                      <EyeSlashFill
                        color="#3354a9"
                        onClick={() => setCurrentPasswordVisibility(true)}
                      />
                    ))}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Form>
    </div>
  );
};
export default ProfileFormCustomer;
