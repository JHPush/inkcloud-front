import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUtil } from "../../utils/logoutUtils";
import { useState } from "react";
import Modal from "react-modal";
import LoginPage from "./LoginPage";

Modal.setAppElement("#root"); // App의 루트 엘리먼트에 맞게 설정

const BasicMenu = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.login.isLoggedIn);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logoutUtil(dispatch)
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
          <Link to={'/order'}>주문</Link>
        </li>
        <li className="pr-6 text-2xl">
          <Link to={'/products'}>상품</Link>
        </li>
        <li className="pr-6 text-2xl">
          <Link to={'/carts'}>장바구니</Link>
        </li>
        <li className="pr-6 text-2xl">
          <Link to={'/order/member'}>내 주문 내역</Link>
        </li>
        <li className="pr-6 text-2xl">
          <Link to={'/mypage'}>마이페이지</Link>
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
          <button
            onClick={() => setIsOpen(true)}
            className="text-white text-sm m-1 rounded"
          >
            Login
          </button>
        )}
    </div>
    <div className="w-1/5 flex justify-end bg-orange-300 p-4 font-medium">
          <Link to="/signup" className="text-white text-sm m-1 rounded">
            회원가입
          </Link>
    </div>

    {/* 로그인 모달 */}
    <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        style={{
          content: {
            maxWidth: 450,
            margin: "auto",
            borderRadius: 12,
            padding: 10, 
            minHeight: "unset",
            height: "fit-content",
          }
        }}
      >
        <button onClick={() => setIsOpen(false)} className="absolute top-3 right-5 text-xl">✕</button>
        <LoginPage />
      </Modal>
  </nav>
  );
}
 
export default BasicMenu;
