const Pagination = ({ page, totalPages, setPage }) => {
  if (totalPages <= 1) return null;
  const pageButtons = [];
  for (let i = 0; i < totalPages; i++) {
    pageButtons.push(
      <button
        key={i}
        onClick={() => setPage(i)}
        className={`px-3 py-1 rounded border mx-1 ${
          page === i
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
        }`}
      >
        {i + 1}
      </button>
    );
  }
  return (
    <div className="flex justify-center my-6">
      {pageButtons}
    </div>
  );
};

export default Pagination;