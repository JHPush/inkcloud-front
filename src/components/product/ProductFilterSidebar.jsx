// components/product/ProductFilterSidebar.jsx
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const SEARCH_FIELD_OPTIONS = [
  { value: "name", label: "도서명" },
  { value: "author", label: "저자" },
  { value: "publisher", label: "출판사" },
  { value: "isbn", label: "ISBN" },
];

const ProductFilterSidebar = ({ categories }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedFields = searchParams.getAll("searchFields");
  const selectedCategoryIds = searchParams.getAll("categoryIds").map(String);

  const toggleValue = (arr, value) =>
    arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value];

  const handleFieldToggle = (field) => {
    const newFields = toggleValue(selectedFields, field);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("searchFields");
    newFields.forEach((f) => newParams.append("searchFields", f));
    newParams.set("page", "0");
    navigate(`/products/search?${newParams.toString()}`);
  };

  const handleCategoryToggle = (id) => {
    const newCategories = toggleValue(selectedCategoryIds, String(id));
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("categoryIds");
    newCategories.forEach((cid) => newParams.append("categoryIds", cid));
    newParams.set("page", "0");
    navigate(`/products/search?${newParams.toString()}`);
  };

  const renderCategoryTree = () => {
    const parents = categories.filter((c) => c.parentId === null);
    const children = categories.filter((c) => c.parentId !== null);

    return parents.map((parent) => (
      <div key={parent.id}>
        <label className="flex items-center space-x-2 font-semibold text-black">
          <input
            type="checkbox"
            checked={selectedCategoryIds.includes(String(parent.id))}
            onChange={() => handleCategoryToggle(parent.id)}
          />
          <span>{parent.name}</span>
        </label>

        <div className="ml-6 space-y-1 mt-1">
          {children
            .filter((child) => child.parentId === parent.id)
            .map((child) => (
              <label
                key={child.id}
                className="flex items-center space-x-2 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  checked={selectedCategoryIds.includes(String(child.id))}
                  onChange={() => handleCategoryToggle(child.id)}
                />
                <span>ㄴ {child.name}</span>
              </label>
            ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="w-1/4 border-r p-6 space-y-6">
      {/* 검색 필드 */}
      <div>
        <h2 className="font-semibold mb-2">검색 대상</h2>
        <div className="space-y-1">
          {SEARCH_FIELD_OPTIONS.map((field) => (
            <label key={field.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedFields.includes(field.value)}
                onChange={() => handleFieldToggle(field.value)}
              />
              <span>{field.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div>
        <h2 className="font-semibold mb-2">카테고리</h2>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {renderCategoryTree()}
        </div>
      </div>
    </div>
  );
};

export default ProductFilterSidebar;
