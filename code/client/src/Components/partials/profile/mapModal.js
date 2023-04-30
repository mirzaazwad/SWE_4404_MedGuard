import { Button, Form, Modal } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import PlacesAutocomplete from "./placesAutocomplete";

const MapModal = (props) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDKjGpZZoglgi9S73FYzlcdBqmmd4fA-18",
    libraries: ["places"],
  });
  if (!isLoaded) {
    return (<Loading show={props.show} handleClose={()=>props.setShow(false)}></Loading>)
  } 
  else{
    return (<Map startDropDown={props.startDropDown} dropdown={props.dropdown} show={props.show} handleClose={()=>props.setShow(false)} isValid={props.isValid} setLocation={props.setLocation} setIsValid={props.setIsValid}></Map>)
  }
}

const Map = (props)=>{
  const center = useMemo(() => ({ lat: 23.747423126189574, lng: 90.37496070911327 }), []);
  const [markerPosition, setMarkerPosition] = useState(center);
  const [error,setError]=useState("");
  const [address,setAddress]=useState("");

  const handleMapClick = (event) => {
    setMarkerPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const getPlaceDetails = async (lat, lng) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDKjGpZZoglgi9S73FYzlcdBqmmd4fA-18`
    );
    const data = await response.json();
    if (data.status === "OK") {
      return data.results[0].formatted_address;
    } else {
      console.log("Geocode was not successful for the following reason:", data.status);
      return null;
    }
  };

  const setNewAddress=async()=>{
    setAddress(await getPlaceDetails(markerPosition.lat,markerPosition.lng));
  }

  useEffect(()=>{
    setNewAddress();
  },[markerPosition])

  const handleMarkerDragEnd = (event) => {
    setMarkerPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const getUserLocation = () => {
    props.startDropDown(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMarkerPosition(userLocation);
      });
    } else {
      console.log('cant get location in legacy browser');
    }
  };

  const setLocation=(e)=>{
    e.preventDefault();
    if(props.isValid){
      setError("");
      props.setLocation(markerPosition);
      props.handleClose();
    }
    else{
      setError("Address is invalid");
    }
  }
  return ( 
    <Modal show={props.show} onHide={props.handleClose} style={{marginLeft:"50vh",width:"100vh",height:"100vh"}}>
      <Modal.Header closeButton>
         <Modal.Title>Add Location</Modal.Title>
      </Modal.Header>
      <Form onSubmit={setLocation}>
      <Modal.Body>
      <div className="errorMessage" style={{color:"red"}}>{error}</div>
      <div className="places-container">
        <PlacesAutocomplete startDropDown={props.startDropDown} dropdown={props.dropdown} currentAddress={address} setNewPosition={setMarkerPosition} isValid={props.isValid} setIsValid={props.setIsValid}/>
      </div>
        <GoogleMap zoom={16} center={markerPosition} mapContainerClassName="map-container">
        {markerPosition && (
        <MarkerF
          position={markerPosition}
          draggable={true}
          onDragEnd={handleMarkerDragEnd}
          visible={true}
        />
      )}
        </GoogleMap>
      </Modal.Body>
      <Modal.Footer><Button onClick={getUserLocation}>Get Current Location</Button>
      <Button type="submit">Set Location</Button>
      </Modal.Footer>
      </Form>
    </Modal>
   );
}

const Loading = (props) =>{
  return (
      <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
      <div
        className="spinner-border text-primary"
        role="status"
        style={{ marginLeft: "50%", marginTop: "10%" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      </Modal.Body>
    </Modal>
  );
}


 
export default MapModal;