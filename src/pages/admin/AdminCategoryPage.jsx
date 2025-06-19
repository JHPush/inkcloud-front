// src/pages/admin/AdminCategoryPage.jsx
import React, { useEffect, useState } from "react";
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from "../../api/productApi";
import CategoryPanel from "../../components/admin/CategoryPanel";

const AdminCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(null);

  const loadCategories = async () => {
    try {
      const data = await fetchAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("카테고리 로딩 실패", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSelectParent = (id) => {
    setSelectedParentId(id);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">카테고리 관리</h2>
      <CategoryPanel
        categories={categories}
        selectedParentId={selectedParentId}
        onSelectParent={handleSelectParent}
        onReload={loadCategories}
      />
    </div>
  );
};

export default AdminCategoryPage;
