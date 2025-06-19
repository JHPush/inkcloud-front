// components/product/ProductSearchBar.jsx
import React from "react";

const ProductSearchBar = ({ keyword, setKeyword, onSearch }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearch();
  };
  return (
    <div className="flex items-center mb-6">
      <input
        type="text"
        placeholder="도서명, 저자, 출판사 검색..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full border border-gray-300 px-4 py-2 rounded-l"
      />
      <button onClick={onSearch} className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700">
        검색
      </button>
    </div>
  );
};

export default ProductSearchBar;
