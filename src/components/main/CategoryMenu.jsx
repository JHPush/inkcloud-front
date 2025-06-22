// src/components/main/CategoryMenu.jsx
import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { fetchAllCategories } from "../../api/productApi";

const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllCategories();
      setCategories(data);
    };
    fetchData();
  }, []);

  const parentCategories = categories.filter(cat => cat.parentId === null);
  const subcategories = categories.filter(cat => cat.parentId === selectedParentId);

  const toggleSubcategories = (parentId) => {
    if (selectedParentId === parentId) {
      setShowSubcategories(!showSubcategories);
    } else {
      setSelectedParentId(parentId);
      setShowSubcategories(true);
    }
  };

  return (
    <div className="relative bg-white shadow-sm py-2 px-4 border-b">
      {/* 상단 메뉴바 */}
      <div className="flex items-center space-x-4">
        {/* 메뉴 아이콘 */}
        <Menu className="cursor-pointer" onClick={() => setShowSubcategories(!showSubcategories)} />

        {/* 상위 카테고리 리스트 */}
        {parentCategories.map((parent) => (
          <button
            key={parent.id}
            onClick={() => toggleSubcategories(parent.id)}
            className={`text-sm px-2 py-1 rounded hover:bg-gray-100 ${
              selectedParentId === parent.id && showSubcategories ? "font-bold text-blue-700" : ""
            }`}
          >
            {parent.name}
          </button>
        ))}
      </div>

      {/* 하위 카테고리 리스트 */}
      {showSubcategories && subcategories.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md z-10 mt-2 px-4 py-3 border-t grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {subcategories.map((sub) => (
            <button
              key={sub.id}
              className="text-sm text-gray-700 hover:text-blue-600 hover:underline text-left"
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;
