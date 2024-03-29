import React, { useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useParams} from "react-router-dom";
import NavbarPharmacy from "../../partials/profile/navbarPharmacy";
import {Badge, Table} from 'react-bootstrap';
import { useToken } from "../../../Hooks/useToken";
import Loader from "../../partials/loader";
import ConfirmationModal from "./confirmationModal";
import DeliveryManInformation from "./deliveryComponent";

const OrderDetailsCard = () => {
  const user=useToken();
  const [loader,setLoader]=useState(false);
  const { userId, orderId } = useParams();
  const [order, setOrder] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [delivery,setDelivery]=useState(null);
  const [show,setShow]=useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        
        const response = await axios.get(
          `/api/pharmacyOrders/getOrderDetails/${userId}/${orderId}`
        ,{
          headers:{'Authorization': `Bearer ${user.token}`,
          'idType':user.googleId?'google':'email'}
        });
        setOrder(response.data.order);
        if(response.data.order)
        {
          setLoader(true);
        }
        console.log(response.data.order);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrderDetails();
  }, [user]);

  useEffect(()=>{
    const getCompletedStatus=async()=>{
      await axios.get('/api/delivery/getcompletedstatus/'+orderId,{
        headers:{'Authorization': `Bearer ${user.token}`,
        'idType':user.googleId?'google':'email'}
      }).then( (result)=>{
        console.log(result);
        setShow(true);
      }).catch((error)=>{
        console.log(error);
      })
    }
    getCompletedStatus();
  },[orderId,user])

  useEffect(()=>{
    const fetchDeliveryMan=async()=>{
      const result=await axios.get('/api/profile/delivery/getdeliveryAndMan/'+orderId,{
        headers:{'Authorization': `Bearer ${user.token}`,
        'idType':user.googleId?'google':'email'}
      }).then((result)=>{
        return result.data;
      }).catch((error)=>{
        console.log(error);
      })
      setDelivery(result);
    }

    if(orderId!==null && orderId!==undefined){
      fetchDeliveryMan();
    }
    console.log('delivery',delivery);
  },[orderId,user]);

  const handleOrderApproval = async () => {
    try {
      await axios.patch(`http://localhost:4000/api/order/approveOrder/${userId}/${orderId}`, {status:"Approved"}, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          idType: user.googleId ? 'google' : 'email',
        },
      });
      // Handle any additional logic or UI updates after order approval
    } catch (error) {
      console.error(error);
      // Handle error response or display error message to the user
    }
  };
  const handleOrderCancellation = async () => {
    try {
      await axios.patch(`http://localhost:4000/api/order/approveOrder/${userId}/${orderId}`, {status:"Cancelled"}, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          idType: user.googleId ? 'google' : 'email',
        },
      });
      // Handle any additional logic or UI updates after order approval
    } catch (error) {
      console.error(error);
      // Handle error response or display error message to the user
    }
  };
  if (!loader) {
    return <Loader />;
  }
  
  if(order.medicines.length>0){
    return (
      <div>
        <div className="mb-5">
        <NavbarPharmacy id={user._id} user={user}/>
        </div>
        <div>
        {delivery && (<ConfirmationModal delivery={delivery} user={user} show={show} setShowModal={setShow} orderID={orderId}/>)}
        {((order.status==="Delivered" || order.status==="Completed") && (<DeliveryManInformation  delivery={delivery} setShowModal={setShow}/>))||(order.status==="Delivered" && (<DeliveryManInformation  delivery={delivery} setShowModal={setShow}/>))}
        <Card className="billing-details-card w-50 m-auto py-4">
            <Card.Header className="billing-details-card-header">
              Billing Details
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <b>Name: </b>
                {order.customer_data.fullName}
              </Card.Text>
              <Card.Text>
                <b>Phone Number: </b>
                {order.customer_data.phone}
              </Card.Text>
              <Card.Text>
                <b>Address: </b>
                {order.customer_data.address}
              </Card.Text>
                {order.customer_data.payment && (<Card.Text><b>Payment Method: </b>{order.customer_data.payment}</Card.Text>)}
            </Card.Body>
        </Card>
          <Card className='order-details-card'>
            <Card.Header className='order-details-card-header'>Order Details
            </Card.Header>
            
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr style={{textAlign: "center"}}>
                    <th>#</th>
                    <th>Name</th>
                    <th>Pcs</th>
                    <th>Strips</th>
                    <th>Boxes</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.medicines && order.medicines.map((medicine, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{medicine.MedicineName}
                     
                     {medicine.prescription && <Badge bg="warning" className="ms-2"><a href={medicine.prescriptionImage}>Prescription</a></Badge>}
                      </td>
                      <td>{medicine.quantityPcs}</td>
                      <td>{medicine.quantityStrips}</td>
                      <td>{medicine.quantityBoxes}</td>
                      <td>{medicine.price}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="5" style={{textAlign: "right"}}>Delivery Charges</td>
                    <td>50</td>
                  </tr>
                  <tr>
                    <td colSpan="5" style={{textAlign: "right"}}>Total</td>
                    <td>{order.payment_status?order.customer_data.amount:order.customer_data.amount}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
            <Card.Footer>
            <Button className="btn btn-approve-order float-end" disabled={(order.status === "Approved" || order.status==="Cancelled" || order.status==="Completed")} onClick={handleOrderApproval}>{order.status === "Approved"?"Approved":"Approve"}</Button>
            <Button className="float-end me-2" variant="danger" disabled={(order.status === "Approved" || order.status==="Cancelled" || order.status==="Completed")} onClick={handleOrderCancellation}>{order.status === "Cancelled"?"Cancelled":"Cancel"}</Button>
            </Card.Footer>
          </Card>
        </div>
      </div>
    );
  }
  else{
    return (
      <div>
        <div className="mb-5">
        <NavbarPharmacy />
      </div>
        <div>
        {delivery && (<ConfirmationModal delivery={delivery} user={user} show={show} setShowModal={setShow}  showModal={show} orderID={orderId}/>)}
        {(order.status==="Delivering" && (<DeliveryManInformation  delivery={delivery}/>))||(order.status==="Delivered" && (<DeliveryManInformation  delivery={delivery}/>))}
        <Card className="billing-details-card w-50 m-auto py-4">
            <Card.Header className="billing-details-card-header">
              Billing Details
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <b>Name: </b>
                {order.customer_data.fullName}
              </Card.Text>
              <Card.Text>
                <b>Phone Number: </b>
                {order.customer_data.phone}
              </Card.Text>
              <Card.Text>
                <b>Address: </b>
                {order.customer_data.address}
              </Card.Text>
                {order.customer_data.payment && (<Card.Text><b>Payment Method: </b>{order.customer_data.payment}</Card.Text>)}
            </Card.Body>
        </Card>
    <Card className='view-prescription-card'>
      <Card.Header style={{backgroundColor: "#EB006F", textAlign: "center", color: "white", fontSize:"1.5rem"}}>
       Prescription
      </Card.Header>
      <Card.Body>
      <Card.Img variant="top" src={order.prescription_image}/>
      </Card.Body>
      <Card.Footer>

            <Button className="btn btn-approve-order float-end" href={`/createOrder/${order.userID}/${order._id}`} disabled={(order.status === "Approved" || order.status==="Cancelled")} >Create Order</Button>
            <Button className="float-end me-2" variant="danger" disabled={(order.status === "Approved" || order.status==="Cancelled")} onClick={handleOrderCancellation}>{order.status === "Cancelled"?"Cancelled":"Cancel"}</Button>
            </Card.Footer>
    </Card>
        </div>
    </div>
    );
  }
  
};

export default OrderDetailsCard;
