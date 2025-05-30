import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/loginSlice";
import Cookies from "js-cookie";

const BasicMenu = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.login.isLoggedIn);

  const handleLogout = () => {
    Cookies.remove('access_token');
    dispatch(logout());
    // 필요시 추가 동작
  };

  return (  
  <nav id='navbar' className=" flex  bg-blue-300">

    <div className="w-4/5 bg-gray-500" >
      <ul className="flex p-4 text-white font-bold">
        <li className="pr-6 text-2xl">
          <Link to={'/'}>Main</Link>
        </li>
        <li className="pr-6 text-2xl">
          <Link to={'/about'}>About</Link>
        </li>
        <li className="pr-6 text-2xl">
          <Link to={'/todo/'}>Todo</Link>
        </li>
        <li className="pr-6 text-2xl">
          <Link to={'/mypage'}>마이페이지</Link>
        </li>
          <li className="pr-6 text-2xl">
          <Link to={'/admin'}>관리자페이지</Link>
        </li>
     
      </ul>
    </div>

    <div className="w-1/5 flex justify-end bg-orange-300 p-4 font-medium">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-white text-sm m-1 rounded bg-red-500 px-3 py-1"
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="text-white text-sm m-1 rounded">
            Login
          </Link>
        )}
    </div>
    <div className="w-1/5 flex justify-end bg-orange-300 p-4 font-medium">
          <Link to="/signup" className="text-white text-sm m-1 rounded">
            회원가입
          </Link>
    </div>
  </nav>
  );
}
 
export default BasicMenu;
