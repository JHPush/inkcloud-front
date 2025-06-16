import BasicLayout from "../../layouts/BasicLayout";
import LoginPage
 from "../../components/menus/LoginPage";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
const LayoutLoginPage = () =>{

  const isLoggedIn = useSelector(state => state.login.isLoggedIn);
  const user = useSelector(state => state.login.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      if (user?.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [isLoggedIn, user, navigate]);

    return(
        <BasicLayout>
            <LoginPage/>
        </BasicLayout>
    )
} 
export default LayoutLoginPage;