import { BookOpenIcon, UsersIcon, ClipboardListIcon, StarIcon, LineChartIcon, Boxes, FolderKanban, LogOut, Home } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';

import { logoutUtil } from '../utils/logoutUtils';

const sideMenu = [
  { name: '매출현황', icon: <LineChartIcon className="w-5 h-5" />, path: '/admin/stats' },
  { name: '주문내역', icon: <ClipboardListIcon className="w-5 h-5" />, path: '/admin/orders' },
  { name: '상품관리', icon: <Boxes className="w-5 h-5" />, path: '/admin/products' },
  { name: '카테고리', icon: <FolderKanban className="w-5 h-5" />, path: '/admin/categories' },
  { name: '회원관리', icon: <UsersIcon className="w-5 h-5" />, path: '/admin/member' },
  { name: '리뷰관리', icon: <StarIcon className="w-5 h-5" />, path: '/admin/reviews' },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.login.isLoggedIn);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUtil(dispatch)
    window.alert("정상적으로 로그아웃 되었습니다.")
    navigate("/admin/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold flex items-center gap-2 cursor-pointer hover:text-blue-600"
          >
            <BookOpenIcon className="w-6 h-6" />
            <span>InkCloud</span>
          </Link>
          
          {/* 로그아웃 버튼 */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="text-xs text-gray-500"
            >
              로그아웃
            </button>
          )}
        </div>

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
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
