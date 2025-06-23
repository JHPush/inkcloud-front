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
  const keyword = searchParams.get("keyword") || "";
  const sortType = searchParams.get("sortType") || "POPULAR";

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

  const handleSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", "0");
    navigate(`/products/search?${newParams.toString()}`);
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
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {categories.map((cat) => (
            <label key={cat.categoryId} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategoryIds.includes(String(cat.categoryId))}
                onChange={() => handleCategoryToggle(cat.categoryId)}
              />
              <span>{cat.categoryName} ({cat.count})</span>
            </label>
          ))}
        </div>
      </div>

      <button
        className="px-4 py-2 bg-black text-white rounded-md w-full"
        onClick={handleSearch}
      >
        검색
      </button>
    </div>
  );
};

export default ProductFilterSidebar;
