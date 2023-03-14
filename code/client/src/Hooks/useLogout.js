import { useDispatch } from "react-redux";
import { LOGOUT } from "../Contexts/action";

export const useLogout = () =>{
  const dispatch = useDispatch();
  const logout = () =>{
    localStorage.removeItem('user');
    dispatch(LOGOUT());
  }

  return {logout};
}