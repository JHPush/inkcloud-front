const CategoryTable = ({ categories, onEdit, onDelete }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">카테고리 목록</h2>
      <table className="w-full border table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">이름</th>
            <th className="border px-4 py-2">상위 카테고리</th>
            <th className="border px-4 py-2">수정</th>
            <th className="border px-4 py-2">삭제</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="text-center">
              <td className="border px-4 py-2">{cat.id}</td>
              <td className="border px-4 py-2">{cat.name}</td>
              <td className="border px-4 py-2">
                {cat.parentName || "-"}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => onEdit(cat)}
                  className="text-blue-600 hover:underline"
                >
                  수정
                </button>
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => onDelete(cat.id)}
                  className="text-red-600 hover:underline"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
