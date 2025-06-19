// src/pages/admin/AdminCategoryPage.jsx
import React, { useEffect, useState } from "react";
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/productApi";
import CategoryForm from "../../components/admin/CategoryForm";
import CategoryTable from "../../components/admin/CategoryTable";

const AdminCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);

  const loadCategories = async () => {
    try {
      const data = await fetchAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("카테고리 조회 실패", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (form) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, form);
        alert("카테고리 수정 완료");
      } else {
        await createCategory(form);
        alert("카테고리 등록 완료");
      }
      setEditingCategory(null);
      await loadCategories();
    } catch (error) {
      console.error("카테고리 저장 실패", error);
      alert("작업 실패: " + error.message);
    }
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
  };

  const handleCancel = () => {
    setEditingCategory(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteCategory(id);
        alert("삭제 완료");
        loadCategories();
      } catch (error) {
        console.error("삭제 실패", error);
        alert("삭제 실패: " + error.message);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">카테고리 관리</h2>

      <CategoryForm
        category={editingCategory}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        categories={categories}
      />

      <CategoryTable
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminCategoryPage;
