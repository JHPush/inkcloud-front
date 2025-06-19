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
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [newName, setNewName] = useState("");

  useEffect(() => {
    // 현재는 서버에서 받아온 categories를 직접 사용함 (items 상태 제거)
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

    const reordered = [...categories];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

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
              {categories.map((cat, index) => (
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

      <div className="flex gap-2 mt-3">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="하위 카테고리 이름"
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
