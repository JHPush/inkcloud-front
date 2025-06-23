// components/product/ProductPagination.jsx
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ProductPagination = ({ page, totalPages }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const goToPage = (targetPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", targetPage);
    navigate(`/products/search?${newParams.toString()}`);
  };

  if (totalPages <= 1) return null;

  const visiblePages = [];
  const start = Math.max(0, page - 2);
  const end = Math.min(totalPages - 1, page + 2);
  for (let i = start; i <= end; i++) {
    visiblePages.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => goToPage(Math.max(0, page - 1))}
        disabled={page === 0}
        className="px-3 py-1 border rounded disabled:opacity-30"
      >
        이전
      </button>

      {visiblePages.map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          className={`px-3 py-1 border rounded ${
            p === page ? "bg-black text-white" : "bg-white text-gray-700"
          }`}
        >
          {p + 1}
        </button>
      ))}

      <button
        onClick={() => goToPage(Math.min(totalPages - 1, page + 1))}
        disabled={page === totalPages - 1}
        className="px-3 py-1 border rounded disabled:opacity-30"
      >
        다음
      </button>
    </div>
  );
};

export default ProductPagination;
