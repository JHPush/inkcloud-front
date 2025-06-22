import React, { useState, useEffect } from "react";

const NestedCategoryDropdown = ({ categories, selectedId, onSelect }) => {
  const [hoveredParentId, setHoveredParentId] = useState(null);
  const [selectedName, setSelectedName] = useState("");

  const parentCategories = categories.filter((cat) => cat.parentId === null);
  const getChildren = (parentId) =>
    categories.filter((cat) => cat.parentId === parentId);

  useEffect(() => {
    const selected = categories.find((c) => c.id === selectedId);
    setSelectedName(selected?.name || "");
  }, [selectedId, categories]);

  return (
    <div className="relative border rounded w-full bg-white">
      {/* 선택된 카테고리 표시 */}
      <div className="px-2 py-1 text-sm text-gray-700 border-b bg-gray-50">
        {selectedName ? `선택된 카테고리: ${selectedName}` : "카테고리를 선택하세요"}
      </div>

      {/* 상위 카테고리 + 하위 드롭다운 */}
      <div className="p-2 max-h-48 overflow-y-auto">
        {parentCategories.map((parent) => (
          <div
            key={parent.id}
            className="relative group"
            onMouseEnter={() => setHoveredParentId(parent.id)}
            onMouseLeave={() => setHoveredParentId(null)}
          >
            <div className="p-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap">
              {parent.name}
              <span className="ml-2">▶</span>
            </div>

            {/* 하위 카테고리 드롭다운 - 간격 줄이기 */}
            {hoveredParentId === parent.id && (
              <div className="absolute top-0 left-[100%] w-44 border bg-white shadow z-10">
                {getChildren(parent.id).map((child) => (
                  <div
                    key={child.id}
                    className={`p-2 hover:bg-blue-100 cursor-pointer whitespace-nowrap ${
                      selectedId === child.id ? "bg-blue-200" : ""
                    }`}
                    onClick={() => {
                      onSelect(child.id);
                      setHoveredParentId(null); // 닫힘 효과
                    }}
                  >
                    {child.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NestedCategoryDropdown;
