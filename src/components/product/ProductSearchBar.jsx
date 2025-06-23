// components/product/ProductSearchBar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

const ProductSearchBar = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialKeyword = searchParams.get("keyword") || "";
  const [keyword, setKeyword] = useState(initialKeyword);

  // URL이 바뀌었을 때 keyword도 반영되게 (ex. 뒤로가기 등)
  useEffect(() => {
    setKeyword(searchParams.get("keyword") || "");
  }, [searchParams]);

  const handleSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    if (keyword) {
      newParams.set("keyword", keyword);
    } else {
      newParams.delete("keyword");
    }
    newParams.set("page", "0"); // 검색하면 페이지 초기화
    navigate(`/products/search?${newParams.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full border rounded-md px-4 py-2"
      />
      <button
        onClick={handleSearch}
        className="p-2 bg-black text-white rounded-md"
      >
        <Search size={18} />
      </button>
    </div>
  );
};

export default ProductSearchBar;
