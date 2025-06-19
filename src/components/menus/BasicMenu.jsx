import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUtil } from "../../utils/logoutUtils";
import { useState } from "react";
import LoginPage from "./LoginPage";
import Modal from "react-modal";
import { ShoppingCart, User, Package, LogIn, LogOut } from 'lucide-react';

const BasicMenu = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.login.isLoggedIn);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logoutUtil(dispatch)
  };

  return (
    <>
      {/* 상단 네비게이션 */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          {/* 브랜드 및 메인 네비게이션 */}
          <div className="flex items-center justify-between h-16">
            {/* 로고 */}
            <Link 
              to="/" 
              className="text-2xl font-bold text-primary flex items-center gap-2"
            >
              <Package strokeWidth={2} size={28} className="text-primary" />
              InkCloud
            </Link>
            
            {/* 메인 메뉴 */}
            <div className="hidden md:flex space-x-1">
              <Link 
                to="/products" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
              >
                상품
              </Link>
              <Link 
                to="/order" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
              >
                주문
              </Link>
              <Link 
                to="/carts" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors flex items-center"
              >
                <ShoppingCart size={16} className="mr-1" />
                장바구니
              </Link>
              <Link 
                to="/order/member" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
              >
                주문내역
              </Link>
              <Link 
                to="/mypage" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors flex items-center"
              >
                <User size={16} className="mr-1" />
                마이페이지
              </Link>
            </div>
            
            {/* 사용자 계정 */}
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <button 
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none transition-colors duration-200"
                >
                  <LogOut size={16} className="mr-1" />
                  로그아웃
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link 
                    to="/signup" 
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                  >
                    회원가입
                  </Link>
                  <button 
                    onClick={() => setIsOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-focus focus:outline-none transition-colors duration-200"
                  >
                    <LogIn size={16} className="mr-1" />
                    로그인
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 로그인 모달 - 원래 react-modal 라이브러리 사용 */}
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
        <LoginPage onSuccess={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}
 
export default BasicMenu;
