import axios from "axios";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NonStripsForm = (props) => {
  const user = props.user;
  const types=props.types;
  const categories=props.categories;
  const _id=props._id;
  const navigate=useNavigate();
  const sellerId=props.sellerId;
  const [medicineName, setMedicineName] = useState(props.currentValue.medicineName);
  const [genericName, setGenericName] = useState(props.currentValue.genericName);
  const [description, setDescription] = useState(props.currentValue.description);
  const [sellingPrice, setSellingPrice] = useState(props.currentValue.sellingPrice);
  const [pcsPerBox, setPcsPerBox] = useState(props.currentValue.pcsPerBox);
  const [manufacturer, setManufacturer] = useState(props.currentValue.manufacturer);
  const [purchasePrice, setPurchasePrice] = useState(props.currentValue.purchasePrice);
  const [medicineType,setMedicineType]=useState(props.medicineType);
  const [medicineCateogry, setMedicineCategory] = useState("defaultCategory");

  const setError=(error)=>{
    props.onError(error);
  }

  useEffect(()=>{
    setMedicineType(props.medicineType)
  },[props])

  const handleMedicineType=(data)=>{
    console.log(data);
    setMedicineType(data);
    props.handleCurrentValue({
      medicineName:medicineName,
      genericName:genericName,
      description:description,
      pcsPerBox:pcsPerBox,
      sellingPrice:sellingPrice,
      stripsPerBox:props.currentValue.stripsPerBox,
      pcsPerStrip:props.currentValue.pcsPerStrip,
      manufacturer:manufacturer,
      purchasePrice:purchasePrice,
      medicineCateogry:medicineCateogry
    });
    props.onHandleType(data);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (medicineType === "default" || medicineType === "default") {
      setError("Medicine Type is required");
      return;
    }
    if (medicineCateogry === "defaultCategory" || medicineCateogry === "defaultCategory") {
      setError("Medicine Category is required");
      return;
    }
    axios
      .post(
        "/api/profile/addMedicine/addNewGlobalMedicine",
        {
          MedicineName: medicineName,
          GenericName: genericName,
          TypeID: medicineType,
          CateogryID: medicineCateogry,
          PcsPerBox: pcsPerBox,
          Manufacturer: manufacturer,
          SellingPrice: sellingPrice,
          PurchasePrice: purchasePrice,
          Description: description
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .catch((err) => console.log(err));
    axios
      .patch(
        "/api/profile/addMedicine/addNewMedicine/" + sellerId,
        {
          MedicineName: medicineName,
          GenericName: genericName,
          TypeID: medicineType,
          CateogryID: medicineCateogry,
          PcsPerBox: pcsPerBox,
          Manufacturer: manufacturer,
          SellingPrice: sellingPrice,
          PurchasePrice: purchasePrice,
          Description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((result) => {
        return navigate("/inventoryManagementSystem/inventory/" + _id);
      })
      .catch((err) => console.log(err));
  };
  return (
    <Form onSubmit={handleSubmit}>
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
              value={props.medicineType}
              onChange={(e) => handleMedicineType(e.target.value)}
            >
              <option value="default">Select an option</option>
              {types.length !== 0 &&
                types.map((medicines) => (
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
              onChange={(e) => setMedicineCategory(e.target.value)}
            >
              <option value="defaultCategory">Select an option</option>
              {categories.length !== 0 &&
                categories.map((category) => (
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
              Medicine Name
            </InputGroup.Text>
            <Form.Control
              aria-describedby="inputGroup-sizing-default"
              placeholder="Enter medicine name"
              value={medicineName}
              onChange={(e) =>
                setMedicineName(DOMPurify.sanitize(e.target.value))
              }
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
              onChange={(e) =>
                setGenericName(DOMPurify.sanitize(e.target.value))
              }
              required
            />
          </InputGroup>
        </div>
      </div>

      <br />
      <div className="addMedicineSide d-flex justify-content-between">
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
              onChange={(e) =>
                setManufacturer(DOMPurify.sanitize(e.target.value))
              }
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
              Box Purchase Price
            </InputGroup.Text>
            <Form.Control
              aria-describedby="inputGroup-sizing-default"
              placeholder="Enter amount"
              type="number"
              value={purchasePrice}
              onChange={(e) =>
                setPurchasePrice(DOMPurify.sanitize(e.target.value))
              }
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
              Box Selling Price
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              placeholder="Enter number"
              type="number"
              value={sellingPrice}
              onChange={(e) =>
                setSellingPrice(DOMPurify.sanitize(e.target.value))
              }
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
          Pieces per Box
        </InputGroup.Text>
        <Form.Control
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          placeholder="Enter number"
          type="number"
          value={pcsPerBox}
          onChange={(e) => setPcsPerBox(DOMPurify.sanitize(e.target.value))}
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
          onChange={(e) => setDescription(DOMPurify.sanitize(e.target.value))}
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
  );
};

export default NonStripsForm;
