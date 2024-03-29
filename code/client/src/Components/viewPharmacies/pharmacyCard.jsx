import React from 'react';
import { Card } from 'react-bootstrap';

const PharmacyCard = ({image,name,location}) => {

  return (
    <Card
      className="pharmacy-card"
    >
      <Card.Img variant="top" src={image} className="pharmacy-card-image" />
      <Card.Body >
        <Card.Title>{name}</Card.Title>
        <Card.Text>{location}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default PharmacyCard;
