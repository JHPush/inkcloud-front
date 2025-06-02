import { removeAccessToken, removeRefreshToken } from "./cookieUtils";
import { logout } from "../store/loginSlice";

//로그아웃 공통함수 
export const logoutUtil = (dispatch) => {
  removeAccessToken();
  removeRefreshToken();
  dispatch(logout());

};