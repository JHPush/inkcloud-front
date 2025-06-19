// src/components/product/MainSearchBar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

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
    <div className="flex justify-center w-full px-4">
      <div className="relative w-full max-w-xl">
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
                     bg-black text-white p-2 rounded-full hover:bg-gray-800"
        >
          <Search size={18} />
        </button>
      </div>
    </div>
  );
};

export default MainSearchBar;
