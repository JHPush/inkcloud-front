import BasicMenu from "../components/menus/BasicMenu";

const MemberLayout = ({ children, tab, setTab }) => {
  return (
    <>
      <BasicMenu />
      <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col items-center py-10">
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden min-h-[80vh]">
          {/* 사이드 메뉴 */}
          <aside className="bg-blue-100 w-full md:w-1/5 p-10 flex flex-col items-center border-r border-blue-200 min-h-[80vh] relative">
            <div className="text-2xl font-bold mb-10 text-blue-700 tracking-tight">
              마이페이지
            </div>
            <ul className="w-full space-y-4">
              <li>
                <button
                  className={`block w-full text-left px-4 py-2 rounded-lg transition
                    ${
                      tab === "info"
                        ? "bg-white text-blue-600 font-bold shadow"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }
                  `}
                  onClick={() => setTab("info")}
                >
                  내 정보
                </button>
              </li>
              <li>
                <button
                  className={`block w-full text-left px-4 py-2 rounded-lg transition
                    ${
                      tab === "review"
                        ? "bg-white text-blue-600 font-bold shadow"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }
                  `}
                  onClick={() => setTab("review")}
                >
                  리뷰 관리
                </button>
              </li>
              <li>
                <button
                  className={`block w-full text-left px-4 py-2 rounded-lg transition
                    ${
                      tab === "address"
                        ? "bg-white text-blue-600 font-bold shadow"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }
                  `}
                  onClick={() => setTab("address")}
                >
                  배송지 관리
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
          <main className="flex-1 p-12 bg-white flex flex-col justify-center min-h-[80vh]">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default MemberLayout;