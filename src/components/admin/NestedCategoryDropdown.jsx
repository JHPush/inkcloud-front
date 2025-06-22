// components/admin/NestedCategoryDropdown.jsx
import React, { useState } from "react";

const NestedCategoryDropdown = ({ categories, selectedId, onSelect }) => {
  const [hoveredParentId, setHoveredParentId] = useState(null);

  const parentCategories = categories.filter((cat) => cat.parentId === null);
  const getChildren = (parentId) =>
    categories.filter((cat) => cat.parentId === parentId);

  return (
    <div className="relative border rounded w-full">
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

            {hoveredParentId === parent.id && (
              <div className="absolute top-0 left-full ml-1 w-40 border bg-white shadow z-10">
                {getChildren(parent.id).map((child) => (
                  <div
                    key={child.id}
                    className={`p-2 hover:bg-blue-100 cursor-pointer whitespace-nowrap ${
                      selectedId === child.id ? "bg-blue-200" : ""
                    }`}
                    onClick={() => onSelect(child.id)}
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
