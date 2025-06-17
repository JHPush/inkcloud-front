import { useSelector } from "react-redux";
import LoginPage from "../../../components/menus/LoginPage";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminLoginPage = () => {

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
  <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
    <h2 className="text-2xl font-bold text-gray-800 mb-3 mt-4">관리자 로그인</h2>
    <p className="text-base text-gray-500 mb-8">InkCloud 관리자 전용 페이지입니다.</p>
    <div className="w-full max-w-md">
      <LoginPage isAdmin={true}/>
    </div>
  </div>
  )

}

export default AdminLoginPage;