import BasicLayout from "../../layouts/BasicLayout";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import LoginPage from "../../components/menus/LoginPage";



const LayoutLoginPage = () => {

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


  return (
    <BasicLayout>

      {/* 상단 헤더 - 로고와 홈 버튼 */}
        <LoginPage />
  
    </BasicLayout>
  );
};

export default LayoutLoginPage;