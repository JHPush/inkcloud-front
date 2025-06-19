// src/components/admin/CategoryList.jsx
import React, { useState } from "react";
import { createCategory, updateCategory, deleteCategory } from "../../api/productApi";

const CategoryList = ({ categories, selectedId, onSelect, onReload }) => {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setEditValue(cat.name);
  };

  const handleEditSubmit = async () => {
    try {
      await updateCategory(editingId, { name: editValue });
      setEditingId(null);
      onReload();
    } catch (e) {
      alert("수정 실패");
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      await createCategory({ name: newName, parentId: null });
      setIsAdding(false);
      setNewName("");
      onReload();
    } catch (e) {
      alert("등록 실패");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteCategory(id);
      onReload();
    } catch (e) {
      alert(e.response?.data?.message || "삭제 실패");
    }
  };

  return (
    <div className="border rounded p-2 bg-white max-h-[500px] overflow-y-auto">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className={`flex items-center justify-between px-2 py-1 cursor-pointer ${
            selectedId === cat.id ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
          onClick={() => onSelect(cat.id)}
        >
          {editingId === cat.id ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleEditSubmit}
              onKeyDown={(e) => e.key === "Enter" && handleEditSubmit()}
              className="border rounded px-2 py-1 w-full mr-2"
              autoFocus
            />
          ) : (
            <span onDoubleClick={() => handleEdit(cat)} className="flex-1">
              {cat.name}
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(cat.id);
            }}
            className="text-red-500 hover:text-red-700 ml-2"
          >
            ✖
          </button>
        </div>
      ))}

      {isAdding ? (
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="border rounded px-2 py-1 w-full"
            placeholder="카테고리 이름"
            autoFocus
          />
          <button onClick={handleAdd} className="text-blue-600 font-semibold">
            추가
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="text-sm text-blue-600 mt-2 hover:underline"
        >
          ➕ 카테고리 추가
        </button>
      )}
    </div>
  );
};

export default CategoryList;
