// src/pages/admin/AdminProductPage.jsx
import React, { useEffect, useState } from "react";
import ProductTable from "../../components/admin/ProductTable";
import ProductForm from "../../components/admin/ProductForm";
import { fetchProducts } from "../../api/productApi";

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // 상품 목록 불러오기
  const loadProducts = async () => {
    try {
      const result = await fetchProducts({ page: 0, size: 100 });
      setProducts(result.products?.content ?? []);
    } catch (e) {
      console.error("상품 목록 로딩 실패", e);
    }
  };

  // 등록 버튼 클릭 → 빈 폼 열기
  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  // 수정 버튼 클릭 → 수정할 상품 데이터 넘기기
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // 폼 닫기 시 → 목록 갱신
  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
    loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">상품 관리</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          상품 등록
        </button>
      </div>

      {/* 상품 목록 테이블 */}
      <ProductTable products={products} onEdit={handleEdit} />

      {/* 상품 등록/수정 폼 */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default AdminProductPage;
