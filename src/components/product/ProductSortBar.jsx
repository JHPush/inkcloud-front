// components/product/ProductSortBar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ProductSortBar = ({ sortType, setSortType, keyword, searchFields, categoryIds }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const newSortType = e.target.value;
    setSortType(newSortType);

    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (newSortType) params.set("sortType", newSortType);
    searchFields.forEach((field) => params.append("searchFields", field));
    categoryIds.forEach((id) => params.append("categoryIds", id));

    navigate(`${location.pathname}?${params.toString()}`);
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
