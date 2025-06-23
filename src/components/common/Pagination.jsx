import React from 'react';

const Pagination = ({ page, totalPages, setPage }) => {
  if (totalPages <= 1) return null;

  // 현재 페이지 그룹 (1-10, 11-20 등)을 계산
  const pageGroupSize = 10;
  const currentGroup = Math.floor(page / pageGroupSize);
  const startPage = currentGroup * pageGroupSize;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages - 1);
  
  // 이전/다음 그룹 버튼을 위한 조건
  const hasNextGroup = totalPages > endPage + 1;
  const hasPrevGroup = startPage > 0;

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {/* 첫 페이지로 이동 */}
      <button
        onClick={() => setPage(0)}
        disabled={page === 0}
        className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        &lt;&lt;
      </button>

      {/* 이전 그룹으로 이동 */}
      {hasPrevGroup && (
        <button
          onClick={() => setPage(startPage - 1)}
          className="px-3 py-1 border rounded-md text-sm"
        >
          &lt;
        </button>
      )}

      {/* 페이지 번호 */}
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(
        (pageNum) => (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={`px-3 py-1 rounded-md text-sm ${
              page === pageNum
                ? 'bg-blue-600 text-white'
                : 'bg-white border hover:bg-gray-50'
            }`}
          >
            {pageNum + 1}
          </button>
        )
      )}

      {/* 다음 그룹으로 이동 */}
      {hasNextGroup && (
        <button
          onClick={() => setPage(endPage + 1)}
          className="px-3 py-1 border rounded-md text-sm"
        >
          &gt;
        </button>
      )}

      {/* 마지막 페이지로 이동 */}
      <button
        onClick={() => setPage(totalPages - 1)}
        disabled={page === totalPages - 1}
        className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        &gt;&gt;
      </button>
    </div>
  );
};

export default Pagination;