// src/components/Main/CategoryMenu.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllCategories } from "../../api/productApi";

const CategoryMenu = () => {
  const [topCategories, setTopCategories] = useState([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchAllCategories();

        const tops = data.filter((cat) => cat.parentId === null);
        const subs = data.filter((cat) => cat.parentId !== null);

        const subMap = {};
        subs.forEach((sub) => {
          if (!subMap[sub.parentId]) subMap[sub.parentId] = [];
          subMap[sub.parentId].push(sub);
        });

        setTopCategories(tops);
        setSubCategoriesMap(subMap);
      } catch (err) {
        console.error("카테고리 목록 불러오기 실패", err);
      }
    };

    fetchCategories();
  }, []);

  const handleClick = (categoryId) => {
    navigate(`/products?categoryIds=${categoryId}`);
  };

  return (
    <div className="w-full bg-white border-b px-4 py-2">
      <div className="flex flex-wrap gap-2 text-sm">
        {topCategories.map((top) => (
          <div key={top.id} className="relative group">
            <button
              onClick={() => handleClick(top.id)}
              className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
              {top.name}
            </button>

            {/* 하위 카테고리 드롭다운 */}
            {subCategoriesMap[top.id] && (
              <div className="absolute z-10 hidden group-hover:block bg-white shadow-md rounded mt-1 min-w-[10rem]">
                {subCategoriesMap[top.id].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleClick(sub.id)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
