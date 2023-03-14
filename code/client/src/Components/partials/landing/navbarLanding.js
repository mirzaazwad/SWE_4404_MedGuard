import {Navbar,Container} from 'react-bootstrap';

const NavbarLanding = () => {
  return (
    <Navbar className='customNavbar fixed-top ' variant="dark" expand="lg">
    <Container fluid className='navbarContents px-0 px-lg-5 d-flex justify-content-between' >
      
     
      <Navbar.Brand className='px-2' href="#"  style={{fontsize: '400px'}}>M e d G u a r d</Navbar.Brand>
      <Navbar.Toggle className='px-2' aria-controls="navbarScroll" />
    </Container>
  </Navbar>
  );
};

export default NavbarLanding;
