// src/components/main/CategoryMenu.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllCategories } from "../../api/productApi";
import { MenuIcon } from "lucide-react";

const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  // 카테고리 데이터 로딩
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("카테고리 불러오기 실패", err);
      }
    };
    loadCategories();
  }, []);

  const topCategories = categories.filter((c) => c.parentId === null);
  const getChildren = (parentId) =>
    categories.filter((c) => c.parentId === parentId);

  const handleCategoryClick = (id) => {
    navigate(`/products/search?categoryIds=${id}`);
  };

  return (
    <div className="relative">
      {/* 메뉴 아이콘 + 상위 카테고리 */}
      <div className="flex items-center space-x-3 px-4 py-2">
        <button onClick={() => setShowAll(!showAll)} className="text-gray-600 hover:text-black">
          <MenuIcon className="w-5 h-5" />
        </button>
        <div className="flex flex-wrap gap-4 text-sm">
          {topCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="hover:text-blue-600"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 전체 카테고리 박스 */}
      {showAll && (
        <div className="absolute z-40 w-full bg-white shadow-lg border rounded p-6">
          <div className="grid grid-cols-3 gap-6 text-sm">
            {topCategories.map((parent) => (
              <div key={parent.id}>
                <h4
                  className="font-semibold mb-2 cursor-pointer hover:text-blue-600"
                  onClick={() => handleCategoryClick(parent.id)}
                >
                  {parent.name}
                </h4>
                <ul className="space-y-1">
                  {getChildren(parent.id).map((child) => (
                    <li
                      key={child.id}
                      className="cursor-pointer hover:text-blue-600"
                      onClick={() => handleCategoryClick(child.id)}
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
