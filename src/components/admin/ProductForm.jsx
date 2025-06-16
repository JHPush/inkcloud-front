// src/components/admin/ProductForm.jsx
import React, { useEffect, useState } from "react";
import { createProduct, updateProduct } from "../../api/productApi";

const ProductForm = ({ product, onClose }) => {
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: "",
    author: "",
    publisher: "",
    price: 0,
    quantity: 0,
    status: "ON_SALE",
    introduction: "",
    image: "",
  });

  useEffect(() => {
    if (isEdit) {
      setForm({
        ...product,
        status: product.status?.toUpperCase() || "ON_SALE",
      });
    }
  }, [product]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateProduct(form.id, form);
        alert("상품이 수정되었습니다.");
      } else {
        await createProduct(form);
        alert("상품이 등록되었습니다.");
      }
      onClose();
    } catch (error) {
      console.error("상품 저장 실패", error);
      alert("상품 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-xl rounded shadow">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "상품 수정" : "상품 등록"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="도서명"
              value={form.name}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="text"
              name="author"
              placeholder="저자"
              value={form.author}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="text"
              name="publisher"
              placeholder="출판사"
              value={form.publisher}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="number"
              name="price"
              placeholder="가격"
              value={form.price}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="number"
              name="quantity"
              placeholder="재고 수량"
              value={form.quantity}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            />
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="ON_SALE">판매중</option>
              <option value="OUT_OF_STOCK">품절</option>
              <option value="DISCONTINUED">절판</option>
            </select>
          </div>

          <textarea
            name="introduction"
            placeholder="도서 소개"
            value={form.introduction}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            rows={3}
          />

          <input
            type="text"
            name="image"
            placeholder="도서 이미지 URL"
            value={form.image}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
