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
    <div className="flex justify-center mt-12 w-full">
      <div className="form-control w-full max-w-2xl">
        <div className="input-group">
          <input
            type="text"
            placeholder="도서명, 저자, 출판사 검색..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input input-bordered w-full"
          />
          <button
            onClick={handleSearch}
            className="btn btn-primary"
          >
            검색
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainSearchBar;
