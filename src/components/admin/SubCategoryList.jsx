// src/components/admin/SubCategoryList.jsx
import React, { useState } from "react";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from "../../api/productApi";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";

const SubCategoryList = ({ categories, parentId, onReload }) => {
  const [items, setItems] = useState(categories);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [newName, setNewName] = useState("");

  // 동기화
  React.useEffect(() => {
    setItems(categories);
  }, [categories]);

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
      await createCategory({ name: newName, parentId });
      setNewName("");
      onReload();
    } catch (e) {
      alert("추가 실패");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    try {
      await deleteCategory(id);
      onReload();
    } catch (e) {
      alert(e.response?.data?.message || "삭제 실패");
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const reordered = [...items];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setItems(reordered);

    try {
      await reorderCategories(reordered.map((c, idx) => ({
        id: c.id,
        order: idx,
      })));
      onReload();
    } catch (e) {
      alert("정렬 저장 실패");
    }
  };

  return (
    <div className="border rounded p-2 bg-white">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="subcategory-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items.map((cat, index) => (
                <Draggable
                  key={cat.id}
                  draggableId={String(cat.id)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center justify-between px-2 py-1 mb-1 border rounded bg-gray-50"
                    >
                      {editingId === cat.id ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleEditSubmit}
                          onKeyDown={(e) => e.key === "Enter" && handleEditSubmit()}
                          className="border px-2 py-1 rounded w-full mr-2"
                          autoFocus
                        />
                      ) : (
                        <span
                          onDoubleClick={() => handleEdit(cat)}
                          className="flex-1"
                        >
                          {cat.name}
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ✖
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="flex gap-2 mt-3">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="새 카테고리"
          className="border rounded px-2 py-1 w-full"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          추가
        </button>
      </div>
    </div>
  );
};

export default SubCategoryList;
