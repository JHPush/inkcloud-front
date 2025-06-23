import React from "react";
import { Search } from "lucide-react";

const ProductSearchBar = ({ keyword, setKeyword, onSearch }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearch();
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
          onClick={onSearch}
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
