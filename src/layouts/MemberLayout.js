import BasicMenu from "../components/menus/BasicMenu";

const MemberLayout = ({ children, tab, setTab }) => {
  return (
    <>
      <BasicMenu />
      <div className="bg-gray-100 min-h-screen flex flex-col items-center py-8">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md flex flex-col md:flex-row overflow-hidden">
          {/* 사이드 메뉴 */}
          <aside className="bg-gray-200 w-full md:w-1/4 p-6 flex flex-col items-center border-r border-gray-300">
            <div className="text-2xl font-bold mb-6 text-gray-700">My Page</div>
            <ul className="w-full space-y-4">
              <li>
                <button
                  className={`block w-full text-left px-2 py-1 rounded ${
                    tab === "info"
                      ? "bg-white text-blue-600 font-bold"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  onClick={() => setTab("info")}
                >
                  내 정보
                </button>
              </li>
              <li>
                <button
                  className={`block w-full text-left px-2 py-1 rounded ${
                    tab === "address"
                      ? "bg-white text-blue-600 font-bold"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  onClick={() => setTab("address")}
                >
                  배송지 관리
                </button>
              </li>
              <li>
                <button
                  className={`block w-full text-left px-2 py-1 rounded ${
                    tab === "withdraw"
                      ? "bg-white text-blue-600 font-bold"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  onClick={() => setTab("withdraw")}
                >
                  회원탈퇴
                </button>
              </li>
            </ul>
          </aside>
          {/* 메인 컨텐츠 */}
          <main className="flex-1 p-8 bg-white">{children}</main>
        </div>
      </div>
    </>
  );
};

export default MemberLayout;