// src/components/admin/ProductTable.jsx
import React from "react";

const ProductTable = ({ products, onEdit }) => {
  return (
    <div className="overflow-x-auto border rounded">
      <table className="min-w-full table-auto text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">도서명</th>
            <th className="px-4 py-2 text-left">저자</th>
            <th className="px-4 py-2 text-left">출판사</th>
            <th className="px-4 py-2 text-left">가격</th>
            <th className="px-4 py-2 text-left">상태</th>
            <th className="px-4 py-2 text-left">재고</th>
            <th className="px-4 py-2 text-left">수정</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                등록된 상품이 없습니다.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{product.id}</td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.author}</td>
                <td className="px-4 py-2">{product.publisher}</td>
                <td className="px-4 py-2">{product.price.toLocaleString()}원</td>
                <td className="px-4 py-2">{product.status}</td>
                <td className="px-4 py-2">{product.quantity}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => onEdit(product)}
                  >
                    수정
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
