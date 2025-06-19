import React, { useState, useEffect } from "react";
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
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    setItems(categories);
  }, [categories]);

  const handleEditClick = (cat) => {
    setEditingId(cat.id);
    setEditValue(cat.name);
  };

  const handleEditSubmit = async () => {
    if (!editValue.trim()) return;
    try {
      await updateCategory(editingId, { name: editValue });
      setEditingId(null);
      onReload();
    } catch (e) {
      alert("수정 실패");
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleAdd = async () => {
    if (!newName.trim() || !parentId) return;
    try {
      await createCategory({ name: newName, parentId });
      setIsAdding(false);
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
    if (!result.destination || !parentId) return;
    const reordered = [...items];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setItems(reordered);

    try {
      await reorderCategories(
        reordered.map((c, idx) => ({ id: c.id, order: idx }))
      );
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
                        <div className="flex items-center w-full gap-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="border px-2 py-1 rounded flex-1"
                            autoFocus
                          />
                          <button
                            onClick={handleEditSubmit}
                            className="text-green-600 font-semibold"
                          >
                            ✔
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="text-gray-600 font-semibold"
                          >
                            ✖
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="flex-1">{cat.name}</span>
                          <div className="flex gap-2 items-center">
                            <button
                              onClick={() => handleEditClick(cat)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              ✏
                            </button>
                            <button
                              onClick={() => handleDelete(cat.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✖
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

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
          ➕ 하위 카테고리 추가
        </button>
      )}
    </div>
  );
};

export default SubCategoryList;
