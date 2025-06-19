// src/components/admin/CategoryPanel.jsx
import React from "react";
import CategoryList from "./CategoryList";
import SubCategoryList from "./SubCategoryList";

const CategoryPanel = ({ categories, selectedParentId, onSelectParent, onReload }) => {
  const parents = categories.filter((cat) => cat.parentId === null);
  const children = categories.filter((cat) => cat.parentId === selectedParentId);

  return (
    <div className="flex gap-6">
      <div className="w-1/2">
        <h3 className="text-lg font-semibold mb-2">상위 카테고리</h3>
        <CategoryList
          categories={parents}
          selectedId={selectedParentId}
          onSelect={onSelectParent}
          onReload={onReload}
        />
      </div>
      <div className="w-1/2">
        <h3 className="text-lg font-semibold mb-2">하위 카테고리</h3>
        <SubCategoryList
          categories={children}
          parentId={selectedParentId}
          onReload={onReload}
        />
      </div>
    </div>
  );
};

export default CategoryPanel;
