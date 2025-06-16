// src/components/Main/CategoryMenu.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: 1, name: "소설" },
  { id: 2, name: "에세이" },
  { id: 3, name: "인문" },
  { id: 4, name: "자기계발" },
  { id: 5, name: "경제/경영" },
  { id: 6, name: "IT/프로그래밍" },
  { id: 7, name: "어린이" },
  { id: 8, name: "학습서" },
];

const CategoryMenu = () => {
  const navigate = useNavigate();

  const handleClick = (name) => {
    navigate(`/products?category=${encodeURIComponent(name)}`);
  };

  return (
    <div className="w-full bg-gray-100 border-b py-3 px-6">
      <div className="flex flex-wrap justify-start gap-4 text-sm font-medium">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="px-3 py-1 bg-white hover:bg-blue-100 rounded shadow-sm"
            onClick={() => handleClick(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
