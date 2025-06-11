import {RouterProvider} from "react-router-dom";
import root from "./router/root";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "./store/loginSlice";
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from "./utils/cookieUtils";
import { refreshToken as refreshTokenApi } from "./api/keycloakApi";
import {jwtDecode} from "jwt-decode";
import 'react-datepicker/dist/react-datepicker.css';

//리프레시 토큰 미리 발급 
function scheduleTokenRefresh() {
  const token = getAccessToken();
  if (!token) return;
  const decoded = jwtDecode(token);
  const exp = decoded.exp * 1000; // 만료시각(ms)
  const now = Date.now();
  const refreshTime = exp - now - 120 * 1000; // 만료 2분전


  if (refreshTime > 0) {
    setTimeout(async () => {
      const refresh = getRefreshToken();

      if (refresh) {
        try {
          const data = await refreshTokenApi(refresh);

          setAccessToken(data.access_token);
          if (data.refresh_token) setRefreshToken(data.refresh_token);
          // 재귀적으로 다시 예약
   
          scheduleTokenRefresh();
        } catch (e) {
          window.location.href = "/login";
        }
      }
    }, refreshTime);
  }
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      const decoded = jwtDecode(token);
      dispatch(setLogin({
        isLoggedIn: true,
        user: {
          email: decoded.email,
          firstName: decoded.given_name,
          lastName: decoded.family_name,
          // ...role 등
        }
      }));
    }
  }, [dispatch]);

  useEffect(() => {
    scheduleTokenRefresh();
  }, []);

  return (
    <RouterProvider router={root}/>
  );
}

export default App;
