import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUtil } from "../../utils/logoutUtils";
import { useState } from "react";
import LoginPage from "./LoginPage";
import { ShoppingCart, User, Package, ClipboardList, LogIn, LogOut } from 'lucide-react';

const BasicMenu = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.login.isLoggedIn);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logoutUtil(dispatch)
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-lg">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost normal-case text-xl">InkCloud</Link>
        </div>
        
        {/* 메뉴 */}
        <div className="navbar-center">
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/products" className="text-base font-medium"><Package size={18} className="mr-1" /> 상품</Link></li>
            <li><Link to="/order" className="text-base font-medium"><ClipboardList size={18} className="mr-1" /> 주문</Link></li>
            <li><Link to="/carts" className="text-base font-medium"><ShoppingCart size={18} className="mr-1" /> 장바구니</Link></li>
            <li><Link to="/order/member" className="text-base font-medium"><ClipboardList size={18} className="mr-1" /> 내 주문 내역</Link></li>
            <li><Link to="/mypage" className="text-base font-medium"><User size={18} className="mr-1" /> 마이페이지</Link></li>
          </ul>
        </div>
        
        <div className="navbar-end">
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="btn btn-outline btn-error"
            >
              <LogOut size={18} />
              로그아웃
            </button>
          ) : (
            <div className="flex gap-2">
              <Link to="/signup" className="btn btn-outline btn-primary">
                회원가입
              </Link>
              <button 
                onClick={() => setIsOpen(true)}
                className="btn btn-primary"
              >
                <LogIn size={18} />
                로그인
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 로그인 모달 */}
      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative max-w-md">
            <button 
              onClick={() => setIsOpen(false)}
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </button>
            <LoginPage onSuccess={() => setIsOpen(false)} />
          </div>
          <div className="modal-backdrop" onClick={() => setIsOpen(false)}></div>
        </div>
      )}
    </>
  );
}
 
export default BasicMenu;
