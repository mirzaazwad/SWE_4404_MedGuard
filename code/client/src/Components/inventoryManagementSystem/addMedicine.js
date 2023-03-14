import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { InputGroup, Form } from "react-bootstrap";
import NavbarPharmacy from "../profile/navbarPharmacy";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const AddMedicine = () => {
  const user=JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const id=useParams();
  const _id=id.id;
  const [sellerId,setSellerId]=useState();
  const [categories,setCategories] =useState(null);
  const [types,setTypes] =useState(null);
  const [medicineName,setMedicineName] =useState("");
  const [genericName,setGenericName] =useState("");
  const [description,setDescription] =useState("");
  const [stripsPerBox,setStripsPerBox] =useState();
  const [sellingPrice,setSellingPrice] =useState();
  const [pcsPerStrip,setPcsPerStrip] =useState();
  const [manufacturer,setManufacturer] =useState("");
  const [purchasePrice,setPurchasePrice] =useState();
  const [medicineType,setMedicineType]=useState("Default");
  const [medicineCateogry,setMedicineCategory]=useState("Default");
  
  useEffect(()=>{
    axios.get('/api/profile/user/getUserSellerId/'+_id,{headers: {
      'Authorization': `Bearer ${user.token}`
    }}).then((response)=>{
      console.log('res: ',response.data._id);
      setSellerId(response.data._id);
    })
    .catch(err=>console.log(err))
    axios.get('/api/profile/addMedicine/findCateogry',{headers: {
      'Authorization': `Bearer ${user.token}`
    }}).then((result)=>{
      setCategories(result.data);
    });
    axios.get('/api/profile/addMedicine/findType',{headers: {
      'Authorization': `Bearer ${user.token}`
    }}).then((result)=>{
      setTypes(result.data);
    });
  },[]);

  const handleSubmit = (e) =>{
    e.preventDefault();
    axios.patch('/api/profile/addMedicine/addNewMedicine/'+sellerId,{
        MedicineName:medicineName,
        GenericName:genericName,
        TypeID:medicineType,
        CateogryID:medicineCateogry,
        Manufacturer:manufacturer,
        SellingPrice:sellingPrice,
        PurchasePrice:purchasePrice,
        Description:description
    }).then((result)=>{
      navigate('/inventoryManagementSystem/inventory/'+_id);
    })
    .catch((err)=>console.log(err))
  }


  if(categories!==null && types!==null){
    return (
      <div>
        <NavbarPharmacy id={_id}/>
        <section className="d-flex justify-content-center">
          <Card className="addMedicineCard">
            <Card.Header
              className="addMedicineCardHeader"
              style={{ fontSize: "20px" }}
            >
              <b>Add Medicine</b>
            </Card.Header>
            <Card.Title className="addMedicineCardTitle">
              New Medicine Information:
              <Button
                  className="btn float-end"
                  variant="primary"
                  size="sm"
                >
                  Add Category
                </Button>
                <Button
                  className="btn float-end"
                  variant="primary"
                  size="sm"
                >
                  Add Medicine Type
                </Button>
            </Card.Title>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
              <div className="addMedicineSide d-flex justify-content-between">
                <div className="w-100 me-2">
                  <InputGroup className="mb-1">
                    <InputGroup.Text
                      className="required-field"
                      id="inputGroup-sizing-default"
                    >
                      Medicine Name
                    </InputGroup.Text>
                    <Form.Control
                      aria-describedby="inputGroup-sizing-default"
                      placeholder="Enter medicine name"
                      value={medicineName}
                      onChange={(e)=>setMedicineName(DOMPurify.sanitize(e.target.value))}
                      required
                    />
                  </InputGroup>
                </div>
                <div className="addMedicineSide w-100 pl-2">
                  <InputGroup className="mb-1">
                    <InputGroup.Text
                      className="required-field"
                      id="inputGroup-sizing-default"
                    >
                      Generic Name
                    </InputGroup.Text>
                    <Form.Control
                      aria-label="Default"
                      aria-describedby="inputGroup-sizing-default"
                      placeholder="Enter generic name of medicine"
                      value={genericName}
                      onChange={(e)=>setGenericName(DOMPurify.sanitize(e.target.value))}
                      required
                    />
                  </InputGroup>
                </div>
              </div>
  
              <br />
              <div className="addMedicineSide d-flex justify-content-between">
                <div className="w-100 me-2">
                  <InputGroup className="mb-1">
                    <InputGroup.Text
                      className="required-field"
                      id="inputGroup-sizing-default"
                    >
                      Medicine Type
                    </InputGroup.Text>
                    <Form.Select
                      aria-label="Select an option"
                      placeholder="Select an option"
                      onChange={(e)=>setMedicineType(e.target.value)}
                    >
                      <option value="default">Select an option</option>
                      {types.length!==0 && types.map((medicines)=>(
                        <option value={medicines._id}>{medicines.Name}</option>
                      ))}
                      
                    </Form.Select>
                  </InputGroup>
                </div>
                <div className="addMedicineSide w-100 pl-2">
                  <InputGroup className="mb-1">
                    <InputGroup.Text id="inputGroup-sizing-default">
                      Category
                    </InputGroup.Text>
                    <Form.Select
                      aria-label="Select an option"
                      placeholder="Select an option"
                      onChange={(e)=>setMedicineCategory(e.target.value)}
                    >
                      <option value="default">Select an option</option>
                      {categories.length!==0 && categories.map((category)=>(
                        <option value={category._id}>{category.cateogry}</option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </div>
              </div>
  
              <br />
              <div className="addMedicineSide d-flex justify-content-between">
                <div className="w-100 me-2">
                  <InputGroup className="mb-1">
                    <InputGroup.Text
                      className="required-field"
                      id="inputGroup-sizing-default"
                    >
                      Strips per box
                    </InputGroup.Text>
                    <Form.Control
                      aria-describedby="inputGroup-sizing-default"
                      placeholder="Enter amount"
                      value={stripsPerBox}
                      onChange={(e)=>setStripsPerBox(DOMPurify.sanitize(e.target.value))}
                      required
                    />
                  </InputGroup>
                </div>
                <div className="addMedicineSide w-100 pl-2">
                  <InputGroup className="mb-1">
                    <InputGroup.Text
                      className="required-field"
                      id="inputGroup-sizing-default"
                    >
                      Manufacturer
                    </InputGroup.Text>
                    <Form.Control
                      aria-label="Default"
                      aria-describedby="inputGroup-sizing-default"
                      placeholder="Enter manufacturer name"
                      value={manufacturer}
                      onChange={(e)=>setManufacturer(DOMPurify.sanitize(e.target.value))}
                      required
                    />
                  </InputGroup>
                </div>
              </div>
              <br />
              <div className="addMedicineSide d-flex justify-content-between  mb-2">
                <div className="w-100 me-2">
                  <InputGroup className="mb-1">
                    <InputGroup.Text
                      className="required-field"
                      id="inputGroup-sizing-default"
                    >
                      Purchase Price
                    </InputGroup.Text>
                    <Form.Control
                      aria-describedby="inputGroup-sizing-default"
                      placeholder="Enter amount"
                      value={purchasePrice}
                      onChange={(e)=>setPurchasePrice(DOMPurify.sanitize(e.target.value))}
                      required
                    />
                  </InputGroup>
                </div>
                <div className="addMedicineSide w-100 pl-2">
                  <InputGroup className="mb-1">
                    <InputGroup.Text
                      className="required-field"
                      id="inputGroup-sizing-default"
                    >
                      Selling Price
                    </InputGroup.Text>
                    <Form.Control
                      aria-label="Default"
                      aria-describedby="inputGroup-sizing-default"
                      placeholder="Enter number"
                      value={sellingPrice}
                      onChange={(e)=>setSellingPrice(DOMPurify.sanitize(e.target.value))}
                      required
                    />
                  </InputGroup>
                </div>
              </div>
              <br />
              <InputGroup className="mb-4">
              <InputGroup.Text
                      className="required-field"
                      id="inputGroup-sizing-default"
                    >
                     Pcs per Strip
                    </InputGroup.Text>
                <Form.Control
                  aria-label="Default"
                  aria-describedby="inputGroup-sizing-default"
                  placeholder="Enter number"
                  value={pcsPerStrip}
                  onChange={(e)=>setPcsPerStrip(DOMPurify.sanitize(e.target.value))}
                  required
                />
              </InputGroup>
              <InputGroup className="mb-4">
                <InputGroup.Text id="inputGroup-sizing-default">
                  Description
                </InputGroup.Text>
                <Form.Control
                  as="textarea"
                  aria-describedby="inputGroup-sizing-default"
                  placeholder="Add a description of the medicine, diagnosis, treatment, prevention of disease and side effects."
                  value={description}
                  onChange={(e)=>setDescription(DOMPurify.sanitize(e.target.value))}
                />
              </InputGroup>
              <div className="d-flex justify-content-center">
                <Button
                  className="btn btn-addMedicine w-25"
                  variant="primary"
                  type="submit"
                >
                  Add
                </Button>
              </div>
              </Form>
            </Card.Body>
          </Card>
        </section>
      </div>
    );
  }
  else{
    return (
      <p>loading</p>
    )
  }
  
};

export default AddMedicine;
