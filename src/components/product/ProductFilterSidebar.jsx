import React from "react";

const toggleItem = (item, list, setList) => {
  setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
};

const FIELD_LABELS = {
  name: "도서명",
  author: "저자",
  publisher: "출판사",
  isbn: "ISBN"
};

const ProductFilterSidebar = ({
  searchFields,
  setSearchFields,
  categoryIds,
  setCategoryIds,
  categories,
  onSearch,
}) => {
  return (
    <div className="w-1/4 p-4 border-r bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">검색 조건</h2>

      {/* 검색 대상 필드 */}
      <div className="mb-6">
        <h3 className="font-medium">검색 대상</h3>
        {Object.entries(FIELD_LABELS).map(([fieldKey, label]) => (
          <label key={fieldKey} className="block">
            <input
              type="checkbox"
              checked={searchFields.includes(fieldKey)}
              onChange={() => toggleItem(fieldKey, searchFields, setSearchFields)}
              className="mr-2"
            />
            {label}
          </label>
        ))}
      </div>

      {/* 카테고리 필터 */}
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

      {/* 검색 버튼 */}
      <div className="mt-6">
        <button
          onClick={() => onSearch(categoryIds, searchFields)}
          className="w-full py-2 rounded-full bg-black text-white hover:bg-gray-800 transition-all"
        >
          🔍 검색
        </button>
      </div>
    </div>
  );
};

export default ProductFilterSidebar;
