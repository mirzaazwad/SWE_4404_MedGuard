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
import ForgotPasswordSendEmail from './forgotPasswordSendEmail';
const ForgotPassword = () => {
    return ( 
      <div>
            <NavbarLanding/>
            <section className='d-flex justify-content-center'>
            <Card className='forgotPasswordCard'>
        <Card.Header className='' style={{textAlign: "center", fontSize: "20px"}}><b>Forgot Password</b></Card.Header>
        <Card.Body>
        
        <ForgotPasswordSendEmail/>
        </Card.Body>
      </Card>
      </section>
    </div>   
     );
}
 
export default ForgotPassword;