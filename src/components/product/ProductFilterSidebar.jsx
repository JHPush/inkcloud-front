// components/product/ProductFilterSidebar.jsx
import React from "react";

const toggleItem = (item, list, setList) => {
  setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
};

const ProductFilterSidebar = ({ searchFields, setSearchFields, categoryIds, setCategoryIds, categories, onSearch }) => (
  <div className="w-1/4 p-4 border-r bg-gray-50">
    <h2 className="text-xl font-semibold mb-4">검색 조건</h2>
    <div className="mb-6">
      <h3 className="font-medium">검색 대상</h3>
      {["name", "author", "publisher", "isbn"].map((field) => (
        <label key={field} className="block">
          <input
            type="checkbox"
            checked={searchFields.includes(field)}
            onChange={() => toggleItem(field, searchFields, setSearchFields)}
            className="mr-2"
          />
          {field.toUpperCase()}
        </label>
      ))}
    </div>
    <div>
      <h3 className="font-medium">카테고리</h3>
      {categories.map((cat) => (
        <label key={cat.categoryId} className="block">
          <input
            type="checkbox"
            checked={categoryIds.includes(cat.categoryId)}
            onChange={() => toggleItem(cat.categoryId, categoryIds, setCategoryIds)}
            className="mr-2"
          />
          {cat.categoryName} ({cat.count})
        </label>
      ))}
    </div>
    <div className="mt-6">
        <button className="mt-6 w-full py-2 rounded-full bg-black text-white hover:bg-gray-800 transition-all">
        🔍 검색
        </button>
    </div>
  </div>
);

export default ProductFilterSidebar;
