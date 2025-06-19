// src/components/product/MainSearchBar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MainSearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex justify-center mt-10">
      <input
        type="text"
        placeholder="도서명, 저자, 출판사 검색..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full max-w-xl border border-gray-300 px-4 py-2 rounded-l"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
      >
        검색
      </button>
    </div>
  );
};

export default MainSearchBar;
