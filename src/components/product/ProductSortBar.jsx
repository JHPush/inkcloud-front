// components/product/ProductSortBar.jsx
import React from "react";

const ProductSortBar = ({ sortType, setSortType, onSearch }) => {
  const handleChange = (e) => {
    setSortType(e.target.value);
    onSearch(); // 선택 즉시 검색 수행
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800">📚 검색 결과</h2>
      <select
        className="border border-gray-300 rounded-full px-4 py-2 text-sm shadow-sm focus:outline-none"
        value={sortType}
        onChange={handleChange}
      >
        <option value="POPULAR">인기순</option>
        <option value="LATEST">최신순</option>
        <option value="RATING">평점순</option>
        <option value="PRICE_HIGH">높은 가격순</option>
        <option value="PRICE_LOW">낮은 가격순</option>
      </select>
    </div>
  );
};

export default ProductSortBar;
