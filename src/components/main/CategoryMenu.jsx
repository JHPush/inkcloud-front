// src/components/main/CategoryMenu.jsx
import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { fetchAllCategories } from "../../api/productApi";

const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllCategories();
      setCategories(data);
    };
    fetchData();
  }, []);

  const parentCategories = categories.filter((cat) => cat.parentId === null);
  const getChildren = (parentId) =>
    categories.filter((cat) => cat.parentId === parentId);

  return (
    <div className="relative bg-white border-b border-gray-200">
      {/* 상단 메뉴 바 */}
      <div className="flex items-center space-x-4 px-4 py-3">
        <Menu
          className="cursor-pointer"
          onClick={() => setShowAllCategories(!showAllCategories)}
        />
        <div className="flex gap-4 overflow-x-auto">
          {parentCategories.map((parent) => (
            <span key={parent.id} className="text-sm text-gray-700">
              {parent.name}
            </span>
          ))}
        </div>
      </div>

      {/* 전체 카테고리 박스 */}
      {showAllCategories && (
        <div className="absolute left-0 w-full z-50 bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {parentCategories.map((parent) => (
              <div key={parent.id} className="space-y-2">
                <h3 className="font-bold text-base text-gray-900 border-b border-gray-300 pb-1">
                  {parent.name}
                </h3>
                <ul className="space-y-1">
                  {getChildren(parent.id).map((child) => (
                    <li
                      key={child.id}
                      className="text-sm text-gray-600 hover:text-blue-600 hover:underline cursor-pointer"
                    >
                      {child.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;
