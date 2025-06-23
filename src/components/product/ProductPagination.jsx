import React from "react";

const ProductPagination = ({ page, totalPages, onPageChange }) => {
  const MAX_VISIBLE = 7; // 보여줄 최대 페이지 수 (이미지 기준)

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= MAX_VISIBLE) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      const left = Math.max(0, page - 2);
      const right = Math.min(totalPages - 1, page + 2);

      if (page > 3) {
        pages.push(0);
        if (page > 4) pages.push("ellipsis-left");
      }

      for (let i = left; i <= right; i++) {
        pages.push(i);
      }

      if (page < totalPages - 4) {
        if (page < totalPages - 5) pages.push("ellipsis-right");
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center mt-6 space-x-2 text-sm">
      {/* ◀ 이전 */}
      <button
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 border rounded-full disabled:opacity-30"
      >
        ◀
      </button>

      {/* 페이지 숫자 & 생략 기호 */}
      {pageNumbers.map((p, idx) =>
        typeof p === "string" ? (
          <span key={idx} className="px-2 py-1 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 rounded-full border ${
              p === page
                ? "bg-gray-700 text-white font-bold"
                : "hover:bg-gray-100"
            }`}
          >
            {p + 1}
          </button>
        )
      )}

      {/* ▶ 다음 */}
      <button
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 border rounded-full disabled:opacity-30"
      >
        ▶
      </button>
    </div>
  );
};

export default ProductPagination;
