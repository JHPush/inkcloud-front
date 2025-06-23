// components/product/ProductSortBar.jsx
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SORT_OPTIONS = [
  { value: "POPULAR", label: "인기순" },
  { value: "LATEST", label: "최신순" },
  { value: "RATING", label: "평점순" },
  { value: "HIGH_PRICE", label: "높은 가격순" },
  { value: "LOW_PRICE", label: "낮은 가격순" },
];

const ProductSortBar = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentSort = searchParams.get("sortType") || "POPULAR";

  const handleSortChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortType", value);
    newParams.set("page", "0"); // 정렬 바꾸면 1페이지로 초기화
    navigate(`/products/search?${newParams.toString()}`);
  };

  return (
    <div className="flex items-center justify-end mb-4 space-x-2">
      {SORT_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => handleSortChange(option.value)}
          className={`px-3 py-1 rounded-md text-sm border ${
            currentSort === option.value
              ? "bg-black text-white"
              : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ProductSortBar;
