import { BookOpenIcon, UsersIcon, ClipboardListIcon, StarIcon, LineChartIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { logoutUtil } from '../utils/logoutUtils';

const sideMenu = [
  { name: '회원관리', icon: <UsersIcon className="w-5 h-5" />, path: '/admin/member' },
  { name: '주문내역', icon: <ClipboardListIcon className="w-5 h-5" />, path: '/admin/orders' },
  { name: '리뷰관리', icon: <StarIcon className="w-5 h-5" />, path: '/admin/reviews' },
  { name: '매출현황', icon: <LineChartIcon className="w-5 h-5" />, path: '/admin/stats' },
];

export default function AdminLayout({ children }) {
  const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.login.isLoggedIn);

    const handleLogout = () => {
      logoutUtil(dispatch)
    }


  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col gap-4">
        <div className="text-2xl font-bold flex items-center gap-2">
          <BookOpenIcon className="w-6 h-6" />
          <span>InkCloud</span>
        </div>
        <div className="text-sm text-gray-400 mt-6">관리자</div>
        <nav className="flex flex-col gap-2 mt-2">
          {sideMenu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
        {/* 하단에 작게 배치된 로그인/로그아웃/회원가입 텍스트 링크 */}
        <div className="mt-auto flex flex-col gap-1 pb-2">
          {isLoggedIn ? (
            <span
              onClick={handleLogout}
              className="text-s text-gray-500 cursor-pointer border-b border-gray-300 w-fit hover:text-gray-700 hover:border-gray-500 transition"
            >
              Logout
            </span>
          ) : (
            <>
              <Link
                to="/login"
                className="text-s text-gray-500 border-b border-gray-300 w-fit hover:text-gray-700 hover:border-gray-500 transition"
              >
                Login
              </Link>
              <Link
                to="/admin/signup"
                className="text-s text-gray-500 border-b border-gray-200 w-fit hover:text-gray-600 hover:border-gray-400 transition"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
        {/* 하단 버튼 끝 */}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-auto">
        {/* 여기에 내부 페이지 콘텐츠 들어감 */}
        {children || (
          <div className="text-gray-500 text-center mt-20">
            {/* 예시: 내부 페이지 컴포넌트 */}
            {/* <OrderManagement /> */}
            {/* <InquiriesPage /> */}
            내부 페이지 내용이 여기에 들어갑니다.
          </div>
        )}
      </main>
    </div>
  );
}
