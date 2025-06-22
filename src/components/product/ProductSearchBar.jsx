import React from "react";
import { Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const ProductSearchBar = ({ keyword, setKeyword, searchFields, categoryIds, sortType }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword) params.set("keyword", keyword);
    if (sortType) params.set("sortType", sortType);

    // ✅ 검색 필드는 항상 포함 (없으면 기본값 사용 필요)
    if (!searchFields || searchFields.length === 0) {
      ["name", "author", "publisher", "isbn"].forEach((field) =>
        params.append("searchFields", field)
      );
    } else {
      searchFields.forEach((field) => params.append("searchFields", field));
    }

    // ✅ '최초 검색 시 categoryIds는 제외'
    if (keyword && location.pathname === "/products/search") {
      // 필터 제거를 원하면 categoryIds는 제거
      // 만약 유지하고 싶다면 아래 라인 사용
      // categoryIds.forEach((id) => params.append("categoryIds", id));
    }

    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex justify-center w-full mb-6">
      <div className="relative w-full max-w-2xl">
        <input
          type="text"
          placeholder="도서명, 저자, 출판사 검색..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full py-3 pl-5 pr-12 rounded-full 
                     bg-white text-gray-800 text-base 
                     placeholder:text-gray-400 
                     border border-gray-300 
                     shadow-md focus:outline-none 
                     focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 
                     bg-black text-white p-2 rounded-full 
                     hover:bg-gray-800 transition-all"
        >
          <Search size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProductSearchBar;
