import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import '../../index.css';

function navbarPharmacy() {
  return (
    <Navbar className='customNavbar fixed-top ' variant="dark" expand="lg">
      <Container fluid className='navbarContents px-0 px-lg-5 d-flex justify-content-between' >
        
       
        <Navbar.Brand className='px-2' href="#"  style={{fontsize: '400px'}}>M e d G u a r d</Navbar.Brand>
        <Navbar.Toggle className='px-2' aria-controls="navbarScroll" />
        
        
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0 px-2"
            style={{ maxHeight: '150px' }}
            navbarScroll
          >
            <Nav.Link href="#action1">Home</Nav.Link>
            <Nav.Link href="#action1">Profile</Nav.Link>
            <Nav.Link href="#action2">Inventory</Nav.Link>
            <Nav.Link href="#action2">Orders</Nav.Link>
            <Nav.Link href="#action2">Accounts</Nav.Link>
            <Nav.Link className="d-block d-lg-none" href="#action2">Log Out</Nav.Link>
            
          </Nav>
          <Form className="customLogOut d-none d-lg-flex justify-content-end">
            <Button className='customButton'>Log Out</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default navbarPharmacy;