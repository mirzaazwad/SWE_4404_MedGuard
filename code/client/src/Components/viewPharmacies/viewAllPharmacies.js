import React from 'react';
import PharmacyCard from './pharmacyCard';
import NavbarCustomer from '../partials/profile/navbarCustomer';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const PharmacyPage = () => {
  const [Pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/pharmacies/");
        setPharmacies(response.data.pharmacies);
        console.log(response.data);
        console.log(typeof Pharmacies);
        console.log(typeof response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const { id } = useParams();
  return (
    <div>
      <NavbarCustomer id={id} />
      <section>
        <div className="container-fluid pharmacy-container">
          <div className="row">
            
            {Pharmacies.map((pharmacy) => (
              <div className="col-xs-6 col-sm-6 col-md-3 col-lg-2 mx-5 my-4" key={pharmacy.id}>
                <PharmacyCard
                  name={pharmacy.name}
                  location={pharmacy.location}
                  image={'https://www.mawbiz.com.bd/application/views/module/product_image/IMG_3556_1.JPG'}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PharmacyPage;