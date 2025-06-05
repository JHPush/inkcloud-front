// src/components/layout/AdminLayout.jsx

import { BookOpenIcon, UsersIcon, ClipboardListIcon, BellIcon, InboxIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const sideMenu = [
  { name: '주문내역', icon: <ClipboardListIcon className="w-5 h-5" />, path: '/admin/orders' },
  { name: '공지사항', icon: <BellIcon className="w-5 h-5" />, path: '/admin/notices' },
  { name: '1:1 문의', icon: <InboxIcon className="w-5 h-5" />, path: '/admin/inquiries' },
];

export default function AdminLayout({ children }) {
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
