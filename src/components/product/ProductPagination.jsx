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

  const createPageButtons = () => {
    const buttons = [];
    const start = Math.max(1, page - 1); // 1-based
    const end = Math.min(totalPages - 2, page + 3); // reserve last page

    // always include first page
    buttons.push(
      <button
        key={0}
        onClick={() => goToPage(0)}
        className={`px-3 py-1 border rounded ${
          page === 0 ? "bg-black text-white" : "bg-white text-gray-700"
        }`}
      >
        1
      </button>
    );

    if (start > 1) {
      buttons.push(<span key="left-ellipsis">...</span>);
    }

    for (let i = start; i < end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 border rounded ${
            page === i ? "bg-black text-white" : "bg-white text-gray-700"
          }`}
        >
          {i + 1}
        </button>
      );
    }

    if (end < totalPages - 1) {
      buttons.push(<span key="right-ellipsis">...</span>);
    }

    // always include last page
    buttons.push(
      <button
        key={totalPages - 1}
        onClick={() => goToPage(totalPages - 1)}
        className={`px-3 py-1 border rounded ${
          page === totalPages - 1 ? "bg-black text-white" : "bg-white text-gray-700"
        }`}
      >
        {totalPages}
      </button>
    );

    return buttons;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => goToPage(Math.max(0, page - 1))}
        disabled={page === 0}
        className="px-3 py-1 border rounded disabled:opacity-30"
      >
        이전
      </button>

      {createPageButtons()}

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
