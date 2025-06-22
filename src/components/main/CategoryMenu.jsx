// src/components/main/CategoryMenu.jsx
import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { fetchAllCategories } from "../../api/productApi";

const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);
  const [showSubcategories, setShowSubcategories] = useState(true); // 기본 열려 있음
  const [selectedParentId, setSelectedParentId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllCategories();
      setCategories(data);
    };
    fetchData();
  }, []);

  const parentCategories = categories.filter((cat) => cat.parentId === null);
  const subcategoriesByParent = (parentId) =>
    categories.filter((cat) => cat.parentId === parentId);

  const toggleSubcategories = (parentId) => {
    if (selectedParentId === parentId) {
      setShowSubcategories(!showSubcategories);
    } else {
      setSelectedParentId(parentId);
      setShowSubcategories(true);
    }
  };

  return (
    <div className="relative bg-white shadow-sm border-b border-gray-200">
      {/* 메뉴 헤더 */}
      <div className="flex items-center space-x-3 px-4 py-3">
        <Menu className="cursor-pointer" onClick={() => setShowSubcategories(!showSubcategories)} />
        <div className="flex gap-3 overflow-x-auto">
          {parentCategories.map((parent) => (
            <button
              key={parent.id}
              onClick={() => toggleSubcategories(parent.id)}
              className={`text-sm whitespace-nowrap px-2 py-1 rounded hover:bg-gray-100 ${
                selectedParentId === parent.id && showSubcategories ? "font-bold text-blue-700" : ""
              }`}
            >
              {parent.name}
            </button>
          ))}
        </div>
      </div>

      {/* 하위 카테고리 섹션 */}
      {showSubcategories && selectedParentId && (
        <div className="w-full px-6 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {subcategoriesByParent(selectedParentId).map((sub) => (
              <button
                key={sub.id}
                className="text-sm text-gray-700 hover:text-blue-600 hover:underline text-left"
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;
