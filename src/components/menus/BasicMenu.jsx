import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUtil } from "../../utils/logoutUtils";
import { useState } from "react";
import LoginPage from "./LoginPage";
import Modal from "react-modal";
import { ShoppingCart, User, LogOut, BookOpenIcon } from "lucide-react";

const BasicMenu = () => {
  const user = useSelector((state) => state.login.user);
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.length;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logoutUtil(dispatch);
    navigate("/");
  };

  const moveAdmin = () => {
    navigate("/admin/stats");
  };

  return (
    <>
      {/* 상단 네비게이션 */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* 로고 */}
            <Link
              to="/"
              className="text-2xl font-bold text-blue-800 flex items-center gap-2"
            >
              <BookOpenIcon strokeWidth={2} size={28} className="text-blue-800" />
              InkCloud
            </Link>

            {/* 사용자 계정 및 아이콘 */}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 mb-1">
                {isLoggedIn && user?.role === "ADMIN" && (
                  <button
                    onClick={moveAdmin}
                    className="inline-flex items-center px-1 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                  >
                    관리자페이지
                  </button>
                )}
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-1 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                  >
                    <LogOut size={10} className="mr-1" />
                    로그아웃
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      to="/signup"
                      className="inline-flex items-center px-1 py-1 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                    >
                      회원가입
                    </Link>
                    <button
                      onClick={() => setIsOpen(true)}
                      className="inline-flex items-center px-1 py-1 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                    >
                      로그인
                    </button>
                  </div>
                )}
              </div>

              {/* 하단 아이콘 */}
              <div className="flex items-center gap-3">
                <Link
                  to="/carts"
                  title="장바구니"
                  className="relative p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <ShoppingCart size={25} className="text-gray-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-semibold flex items-center justify-center shadow">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/mypage"
                  title="마이페이지"
                  className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <User size={25} className="text-gray-700" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 로그인 모달 */}
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        style={{
          overlay: {
            zIndex: 1000,
            backgroundColor: "rgba(0,0,0,0.3)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          content: {
            width: "100%",
            maxWidth: 400,
            minWidth: 320,
            margin: "auto",
            borderRadius: 12,
            padding: 10,
            minHeight: "unset",
            height: "fit-content",
            inset: "unset",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          },
        }}
      >
        <button onClick={() => setIsOpen(false)} className="absolute top-3 right-5 text-xl">
          ✕
        </button>
        <LoginPage onSuccess={() => setIsOpen(false)} />
      </Modal>
    </>
  );
};

export default BasicMenu;
