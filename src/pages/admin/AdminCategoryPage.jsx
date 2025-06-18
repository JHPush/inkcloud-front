// src/pages/admin/AdminCategoryPage.jsx
import React, { useEffect, useState } from "react";
import { fetchAllCategories, createCategory, updateCategory } from "../../api/productApi";
import CategoryForm from "../../components/admin/CategoryForm";
import CategoryTable from "../../components/admin/CategoryTable";

const AdminCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [formValues, setFormValues] = useState({ name: "", parentId: null });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (form) => {
    try {
      if (isEditing) {
        await updateCategory(editingId, form);
        alert("카테고리 수정 완료");
      } else {
        await createCategory(form);
        alert("카테고리 등록 완료");
      }
      setFormValues({ name: "", parentId: null });
      setIsEditing(false);
      setEditingId(null);
      loadCategories();
    } catch (error) {
      console.error("카테고리 저장 실패", error);
      alert("작업 실패: " + error.message);
    }
  };

  const handleEdit = (cat) => {
    setFormValues({ name: cat.name, parentId: cat.parentId });
    setIsEditing(true);
    setEditingId(cat.id);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">카테고리 관리</h2>

      <CategoryForm
        mode={isEditing ? "edit" : "create"}
        values={formValues}
        onChange={handleChange}
        onSubmit={handleSubmit}
        categories={categories}
      />

      <CategoryTable categories={categories} onStartEdit={handleEdit} />
    </div>
  );
};


export default AdminCategoryPage;