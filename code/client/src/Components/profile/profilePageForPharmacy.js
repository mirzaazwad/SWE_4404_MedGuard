import { useParams } from 'react-router-dom';
import NavbarPharmacy from './navbarPharmacy';
import ProfileFormPharmacy from './profileFormPharmacy';
import ProfilePicture from './profilePictureBox';
import axios from 'axios';
import { useEffect} from 'react';
import {useDispatch, useSelector } from 'react-redux';
import { setSellerDetails, setSellerUser,LOGOUT } from '../../Contexts/action';

const  ProfilePageForPharmacy = () => {
  const user=useSelector((state)=>state.userState.user);
  const {id}=useParams();
  const dispatch=useDispatch();
  const retrieveUser = async() =>{
    await axios.get('/api/profile/user/getUser/'+id,{headers: {
      'Authorization': `Bearer ${user.token}`
    }}).then(async (result)=>{
      dispatch(setSellerUser(result.data));
      await axios.get('/api/profile/seller/'+result.data.email,{headers: {
        'Authorization': `Bearer ${user.token}`
      }}).then((res)=>{
        console.log(res.data);
        dispatch(setSellerDetails(res.data));
      })
      .catch((error)=>{
        if(error.status===401){
          localStorage.removeItem('user');
          dispatch(LOGOUT);
        }
      });
    },{headers: {
      'Authorization': `Bearer ${user.token}`
    }})
    .catch((error)=>{
      if(error.status===401){
        localStorage.removeItem('user');
      }
    });
    
    
  };
  useEffect(()=>{
    retrieveUser();
  },[])
  return (     
  <div>
    <NavbarPharmacy id={id}/>

    <section>
    <div className="container h-100">
      <div className="pt-5">
    <div className="mt-5 d-lg-none d-flex justify-content-center"><ProfilePicture/></div></div>
      <div className="d-flex justify-content-around h-100 mx-auto my-5 w-100" style={{alignItems : 'center'}}>
      <div className="my-3 d-none d-lg-flex"><ProfilePicture/></div>
        <div className="profile-form-outer w-50 mt-5">
          <ProfileFormPharmacy id={id}/>
        </div>
      </div>
    </div>
    
    </section>
          
    </div>
  );
}
 
export default  ProfilePageForPharmacy;
