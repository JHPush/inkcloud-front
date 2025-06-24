// components/product/ProductSortBar.jsx
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SORT_OPTIONS = [
  { value: "POPULAR", label: "인기순" },
  { value: "LATEST", label: "최신순" },
  { value: "RATING", label: "평점순" },
  { value: "PRICE_HIGH", label: "높은 가격순" },
  { value: "PRICE_LOW", label: "낮은 가격순" },
];

const ProductSortBar = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentSort = searchParams.get("sortType") || "POPULAR";

  const handleSortChange = (e) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortType", value);
    newParams.set("page", "0"); // 정렬 변경 시 1페이지로 초기화
    navigate(`/products/search?${newParams.toString()}`);
  };

  return (
    <div className="flex justify-end mb-4">
      <select
        value={currentSort}
        onChange={handleSortChange}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductSortBar;
