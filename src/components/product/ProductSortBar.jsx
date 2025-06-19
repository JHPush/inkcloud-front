// components/product/ProductSortBar.jsx
import React from "react";

const ProductSortBar = ({ sortType, setSortType }) => (
  <div className="flex justify-between mb-4 items-center">
    <h2 className="text-2xl font-bold">검색 결과</h2>
    <select className="border p-2 rounded" value={sortType} onChange={(e) => setSortType(e.target.value)}>
      <option value="POPULAR">인기순</option>
      <option value="LATEST">최신순</option>
      <option value="RATING">평점순</option>
      <option value="PRICE_HIGH">높은 가격순</option>
      <option value="PRICE_LOW">낮은 가격순</option>
    </select>
  </div>
);

export default ProductSortBar;