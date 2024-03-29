import React, { useState, useEffect } from "react";
import axios from "axios";
import {Link, useLocation, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import NavbarCustomer from "../partials/profile/navbarCustomer";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useToken } from "../../Hooks/useToken";
import CollapsibleChat from "./collapsibleChat/collapsableChat";
import { Accordion, Pagination } from "react-bootstrap";
import Loader from "../partials/loader";

const PharmacyMedicines = () => {
  const user=useToken();
  const [medicines, setMedicines] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const cardsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState("medicine");
  const {id}=useParams();

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(
        `/api/pharmacy/${id}`
        ,{
          headers:{'Authorization': `Bearer ${user.token}`,
          'idType':user.googleId?'google':'email'}
        });
      setMedicines(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  const fetchCategories = async () => {
    
    try {
      const response = await axios.get(`/api/profile/addMedicine/findCategory`,{
        headers:{'Authorization': `Bearer ${user.token}`,
        'idType':user.googleId?'google':'email'}
      });
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTypes = async () => {
      const response = await axios.get('/api/profile/inventory/getTypes',{
        headers:{'Authorization': `Bearer ${user.token}`,
        'idType':user.googleId?'google':'email'}
      }).then(response=>response.data.result).catch((error)=>console.log(error));
      console.log(response);
      setTypes(response);
  };
  
  useEffect(() => {
    fetchMedicines();
    fetchCategories();
    fetchTypes();
  }, []);
  
  const filteredMedicines = medicines?medicines.filter((medicine) => {
    // Apply search term filtering
    const includesSearchTerm = searchCriteria === "medicine"
      ? medicine.MedicineName.toLowerCase().includes(searchTerm.toLowerCase())
      : medicine.GenericName.toLowerCase().includes(searchTerm.toLowerCase());
  
    // Apply category filtering
    const includesCategory = selectedCategory.length === 0
      || selectedCategory.includes(medicine.Category.category);

      const includesType = selectedType.length === 0
      || selectedType.includes(medicine.Type.Name);
  
    return includesCategory && includesSearchTerm && includesType;
  }):null;
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = medicines?filteredMedicines.slice(indexOfFirstCard, indexOfLastCard):null;

  // Handle page number click
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle "First" page click
  const handleFirstPageClick = () => {
    setCurrentPage(1);
  };

  // Handle "Previous" page click
  const handlePrevPageClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle "Next" page click
  const handleNextPageClick = () => {
    if (currentPage < Math.ceil((filteredMedicines?filteredMedicines.length:0) / cardsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle "Last" page click
  const handleLastPageClick = () => {
    setCurrentPage(Math.ceil((filteredMedicines?filteredMedicines.length:0) / cardsPerPage));
  };

  // Generate the page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil((filteredMedicines?filteredMedicines.length:0) / cardsPerPage); i++) {
    pageNumbers.push(i);
  }
  
  
  
  const handleCategoryChange = (event) => {
    const categoryName = event.target.nextSibling.textContent;
  
    setSelectedCategory((prevSelected) => {
      if (prevSelected.includes(categoryName)) {
        return prevSelected.filter((category) => category !== categoryName);
      } else {
        return [...prevSelected, categoryName];
      }
    
    });
  };
  const handleTypeChange = (event) => {
    const typeName = event.target.nextSibling.textContent;
  
    setSelectedType((prevSelected) => {
      if (prevSelected.includes(typeName)) {
        return prevSelected.filter((type) => type !== typeName);
      } else {
        return [...prevSelected, typeName];
      }
    
    });
  };

  return (
    <div>
  <NavbarCustomer user={user} />
  
  <section>
    <div className="container-fluid pharmacy-container">
      <div className="row">
        <div className="col-2">
          <div className="filter-options">
            <h4>Filter Options:</h4>
              <Accordion alwaysOpen>
              <Accordion.Item eventKey="0">
  <Accordion.Header>Category</Accordion.Header>
  <Accordion.Body>
    {categories.map((category) => (
      <div key={category.category}>
        <Form.Check
          type="checkbox"
          label={category.category}
          key={category.category}
          onChange={handleCategoryChange}
        />
      </div>
    ))}
  </Accordion.Body>
</Accordion.Item>

      <Accordion.Item eventKey="1">
        <Accordion.Header>Type</Accordion.Header>
        <Accordion.Body>
        {types.map((type) => (
      <div key={type._id}>
        <Form.Check
          type="checkbox"
          label={type.Name}
          onChange={handleTypeChange}
        />
      </div>
    ))}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
          </div>
        </div>
        <div className="col-10">
          <div>
            <div className="d-flex justify-content-center">
              <p style={{ fontSize: "14px", paddingRight: "5px" }}>
                Search By:{" "}
              </p>
              <Button
                className="btn btn-search btn-sm"
                onClick={() => setSearchCriteria("medicine")}
                style={{
                  backgroundColor: searchCriteria === "medicine" ? "#EB006F" : "#3b6ce7",
                  border: "none",
                  marginRight: "2px",
                }}
              >
                Medicine
              </Button>
              <Button
                className="btn btn-search btn-sm"
                onClick={() => setSearchCriteria("generic")}
                style={{
                  backgroundColor: searchCriteria === "generic" ? "#EB006F" : "#3b6ce7",
                  border: "none",
                }}
              >
                Generic Name
              </Button>
            </div>
            <div className="d-flex justify-content-center" style={{ paddingBottom: "0px" }}>
              <Form className="search-input d-flex">
                <Form.Control
                  type="search"
                  className=" me-2"
                  aria-label="Search"
                  placeholder="Search for a medicine..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button className="btn btn-search h-100">Search</Button>
              </Form>
            </div>
          </div>
          
          <div className="row">
            {medicines && currentCards.map((medicine) => (
              <div className="col-xs-6 col-sm-6 col-md-4 col-lg-2 mx-5" key={medicine._id}>
                <Card className="medicine-card">
                <Link to={`/pharmacy/medicine?pid=${id}&mid=${medicine._id}`} style={{ textDecoration: 'none', color: 'white' }}>
                    <Card.Img variant="top" src={medicine.imageURL} className="medicine-card-image" />
                    <Card.Body>
                      <Card.Title>{medicine.MedicineName}</Card.Title>
                      <Card.Subtitle className="description-text mb-2">
                        {medicine.GenericName}
                      </Card.Subtitle>
                    </Card.Body>
                  </Link>
                </Card>
              </div>
            ))}
            {!medicines && (<Loader/>)}
          </div>
          <div className="d-flex justify-content-center mt-0">
          <Pagination>
  <Pagination.First onClick={handleFirstPageClick} />
  <Pagination.Prev onClick={handlePrevPageClick}/>
  {currentPage >= 3 && (
    <>
      <Pagination.Ellipsis />
      <Pagination.Item onClick={() => handlePageClick(currentPage-2)}>
        {currentPage - 2}
      </Pagination.Item>
    </>
  )}
  {currentPage >= 2 && (
    <Pagination.Item onClick={() => handlePageClick(currentPage-1)}>
      {currentPage - 1}
    </Pagination.Item>
  )}
  <Pagination.Item active>{currentPage}</Pagination.Item>
  {currentPage < pageNumbers.length - 1 && (
    <Pagination.Item onClick={() => handlePageClick(currentPage+1)}>
      {currentPage + 1}
    </Pagination.Item>
  )}
  {currentPage < pageNumbers.length - 2 && (
    <>
      <Pagination.Item onClick={() => handlePageClick(currentPage+2)}>
        {currentPage + 2}
      </Pagination.Item>
      <Pagination.Ellipsis />
    </>
  )}
  <Pagination.Next onClick={handleNextPageClick}/>
  <Pagination.Last onClick={handleLastPageClick}/>
</Pagination>

      </div>
        </div>
    
          <CollapsibleChat senderID={id} receiverID={user._id} JWT={user} />

      </div>
    </div>
  </section>
</div>

  );
};
export default PharmacyMedicines;
