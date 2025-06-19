// src/layouts/BasicLayout.jsx
import BasicMenu from "../components/menus/BasicMenu";
import CategoryMenu from "../components/main/CategoryMenu";

const BasicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* 상단 메뉴 */}
      <div className="sticky top-0 z-30 bg-opacity-90 backdrop-blur transition-all duration-100 shadow-sm">
        <BasicMenu />
      </div>

      {/* 카테고리 메뉴 */}
      <div className="bg-base-200 shadow-inner">
        <div className="container mx-auto">
          <CategoryMenu />
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="container mx-auto py-6 flex-grow">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">{children}</div>
        </div>
      </div>

      {/* 푸터 (옵션) */}
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <div>
          <p>Copyright © 2025 - InkCloud</p>
        </div>
      </footer>
    </div>
  );
};

export default BasicLayout;
