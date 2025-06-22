import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllCategories } from "../../api/productApi";
import { Menu, X } from "lucide-react";

const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("카테고리 목록 불러오기 실패:", err);
      }
    };
    fetchCategories();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const getChildren = (parentId) =>
    categories.filter((cat) => cat.parentId === parentId);

  // 🔽 재귀적으로 모든 하위 카테고리 ID 포함
  const getAllDescendantIds = (parentId) => {
    const result = [];
    const stack = [parentId];

    while (stack.length > 0) {
      const current = stack.pop();
      result.push(current);
      const children = getChildren(current).map((c) => c.id);
      stack.push(...children);
    }

    return result;
  };

  const handleCategoryClick = (categoryId) => {
    const allIds = getAllDescendantIds(categoryId);
    navigate(`/products/search?categoryIds=${allIds.join(",")}`);
    setIsOpen(false); // 클릭 시 메뉴 닫기
  };

  const topCategories = categories.filter((cat) => cat.parentId === null);

  return (
    <div className="relative">
      <button onClick={toggleMenu} className="p-2">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute z-10 bg-white border p-4 shadow-xl w-64">
          <h2 className="text-lg font-semibold mb-2">카테고리</h2>
          {topCategories.map((top) => (
            <div key={top.id} className="mb-2">
              <div
                onClick={() => handleCategoryClick(top.id)}
                className="cursor-pointer font-medium text-blue-600 hover:underline"
              >
                {top.name}
              </div>
              <div className="ml-4 mt-1 space-y-1">
                {getChildren(top.id).map((child) => (
                  <div
                    key={child.id}
                    onClick={() => handleCategoryClick(child.id)}
                    className="cursor-pointer text-sm text-gray-700 hover:underline"
                  >
                    └ {child.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;
