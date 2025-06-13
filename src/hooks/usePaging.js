import { useState } from "react";

export default function usePaging(initialPage = 0, initialTotalPages = 1, initialSize = 20) {
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [size, setSize] = useState(initialSize);

  // 페이지 변경 함수
  const handlePageChange = (newPage) => setPage(newPage);

  // size 변경 함수 (옵션)
  const handleSizeChange = (newSize) => setSize(newSize);

  return { page, setPage, totalPages, setTotalPages, size, setSize, handlePageChange, handleSizeChange };
}