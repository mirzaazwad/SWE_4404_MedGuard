import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../Hooks/useLogout';
import '../../index.css';

const NavbarCustomer=()=>{
  const {logout} = useLogout();
  const navigate=useNavigate();
  const handleLogout = () =>{
    logout();
    return navigate('/');
  }
  return (
    <Navbar className='customNavbar fixed-top ' variant="dark" expand="lg">
      <Container fluid className='navbarContents px-0 px-lg-5 d-flex justify-content-between' >
        <Navbar.Brand className='px-2' href="#" style={{fontsize: '400px'}}>M e d G u a r d</Navbar.Brand>
        <Navbar.Toggle className='px-2' aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0 px-2"
            style={{ maxHeight: '150px' }}
            navbarScroll
          >
            <Nav.Link href="#action1">Home</Nav.Link>
            <Nav.Link href="#action2">Pharmacies</Nav.Link>
            <Nav.Link href="#action2">Medicines</Nav.Link>
            <Nav.Link href="#action2">My Orders</Nav.Link>
            <Nav.Link className="d-block d-lg-none" onClick={handleLogout}>Log Out</Nav.Link>
            
          </Nav>
          <button className='customCart bg-transparent me-3'><i className='bx bxs-cart-add bx-md' style={{color: 'white', fontSize: '15px'}}></i></button>
          <Form className="customLogOut d-none d-lg-flex justify-content-end">
            <Button className='customButton' onClick={handleLogout}>Log Out</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarCustomer;