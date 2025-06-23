import { MapPin, Star, User, Receipt } from "lucide-react";
import BasicMenu from "../components/menus/BasicMenu";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MemberLayout = ({ children, tab, setTab }) => {
  const user = useSelector((state) => state.login.user);
  const navigate = useNavigate();

  // 이름 조합
  const userName =
    user?.lastName && user?.firstName
      ? `${user.lastName}${user.firstName}님`
      : "";

  return (
    <>
      <BasicMenu />
      <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen w-full flex flex-col items-center py-0">
        <div className="w-full flex flex-col md:flex-row min-h-screen">
          {/* 사이드 메뉴 */}
          <aside className="bg-blue-100 w-full md:w-1/5 p-10 flex flex-col items-center border-r border-blue-200 min-h-screen relative">
            {/* 사용자 이름만, 마이페이지 글씨 없이, 더 크게/굵게/검은색으로 */}
            {userName && (
              <div className="mb-10 mt-6 w-full flex flex-col items-center">
                <div
                  className="rounded-full bg-white shadow-md flex items-center justify-center mb-4"
                  style={{ width: 72, height: 72 }}
                >
                  <User className="w-10 h-10 text-blue-400" />
                </div>
                <span className="text-2xl font-extrabold text-gray-900 tracking-tight text-center">
                  {userName}
                </span>
              </div>
            )}
            <ul className="w-full space-y-4">
              <li>
                <button
                  className={`flex items-center w-full text-left px-4 py-2 rounded-lg transition
                    ${
                      tab === "order"
                        ? "bg-white text-blue-600 font-bold"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }
                  `}
                  onClick={() => {
                    setTab("order");
                  }}
                >
                  <Receipt className="w-5 h-5 mr-2" />
                  <span>주문내역</span>
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center w-full text-left px-4 py-2 rounded-lg transition
                    ${
                      tab === "review"
                        ? "bg-white text-blue-600 font-bold"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }
                  `}
                  onClick={() => setTab("review")}
                >
                  <Star className="w-5 h-5 mr-2" />
                  <span>리뷰 관리</span>
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center w-full text-left px-4 py-2 rounded-lg transition
                    ${
                      tab === "address"
                        ? "bg-white text-blue-600 font-bold"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }
                  `}
                  onClick={() => setTab("address")}
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>배송지 관리</span>
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center w-full text-left px-4 py-2 rounded-lg transition
                    ${
                      tab === "info"
                        ? "bg-white text-blue-600 font-bold"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }
                  `}
                  onClick={() => setTab("info")}
                >
                  <User className="w-5 h-5 mr-2" />
                  <span>내 정보</span>
                </button>
              </li>
            </ul>
            {/* 회원탈퇴: 메뉴 가장 아래 작은 글씨로 */}
            <div className="absolute bottom-8 left-0 w-full flex justify-center">
              <button
                className="text-xs text-gray-400 underline"
                onClick={() => setTab("withdraw")}
                tabIndex={-1}
              >
                회원탈퇴
              </button>
            </div>
          </aside>
          {/* 메인 컨텐츠 */}
          <main className="flex-1 p-12 bg-white flex flex-col justify-start min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default MemberLayout;