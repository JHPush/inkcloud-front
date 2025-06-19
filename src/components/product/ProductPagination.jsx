// components/product/ProductPagination.jsx
import React from "react";

const ProductPagination = ({ page, totalPages, onPageChange }) => (
  <div className="flex justify-center mt-6 space-x-2">
    <button disabled={page === 0} className="px-3 py-1 border rounded disabled:opacity-50" onClick={() => onPageChange(page - 1)}>이전</button>
    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i}
        className={`px-3 py-1 border rounded ${i === page ? "bg-blue-600 text-white" : ""}`}
        onClick={() => onPageChange(i)}
      >{i + 1}</button>
    ))}
    <button disabled={page >= totalPages - 1} className="px-3 py-1 border rounded disabled:opacity-50" onClick={() => onPageChange(page + 1)}>다음</button>
  </div>
);

export default ProductPagination;
