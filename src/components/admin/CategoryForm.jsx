// src/components/admin/CategoryForm.jsx
import React, { useState, useEffect } from "react";

const CategoryForm = ({
  category,
  onSubmit,
  onCancel,
  categories = [],
}) => {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState(null);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setParentId(category.parentId || null);
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = {
      name,
      parentId: parentId || null,
    };
    onSubmit(form);
    setName("");
    setParentId(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border p-4 rounded mb-6 bg-gray-50"
    >
      <h2 className="text-xl font-bold mb-4">
        {category ? "카테고리 수정" : "카테고리 등록"}
      </h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">상위 카테고리</label>
        <select
          value={parentId || ""}
          onChange={(e) => setParentId(e.target.value || null)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">없음</option>
          {categories
            .filter((c) => !category || c.id !== category.id)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          저장
        </button>
        {category && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoryForm;
