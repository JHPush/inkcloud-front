import React, { useEffect, useState } from "react";
import { fetchAdminProducts, fetchAllCategories } from "../../api/productApi";
import ProductForm from "../../components/admin/ProductForm";

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 검색 조건 상태
  const [keyword, setKeyword] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [operator, setOperator] = useState("AND");
  const [sortType, setSortType] = useState("LATEST");

  // 페이징
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const searchFields = ["name"]; // 기본 검색 대상

  const fetchData = async (page = 0) => {
    try {
      const params = {
        keyword,
        searchFields,
        statuses,
        categoryIds,
        startDate,
        endDate,
        operator,
        sortType,
        page,
        size: 10,
      };
      const res = await fetchAdminProducts(params);
      setProducts(res.content || []);
      setCurrentPage(res.number || 0);
      setTotalPages(res.totalPages || 0);
    } catch (err) {
      console.error("상품 목록 조회 실패", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await fetchAllCategories();
      setCategories(data);
    } catch (err) {
      console.error("카테고리 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleStatusChange = (status) => {
    setStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const handleCategoryChange = (categoryId) => {
    setCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSearch = () => {
    fetchData(0); // 검색 시 페이지 초기화
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">상품 관리</h1>

      {/* 검색 필터 */}
      <div className="mb-6 p-4 bg-gray-50 border rounded grid grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm">제목</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="도서명 검색"
          />
        </div>
        <div>
          <label className="block text-sm">도서 상태</label>
          <div className="flex gap-2 mt-1 text-sm">
            {["ON_SALE", "OUT_OF_STOCK", "DISCONTINUED"].map((status) => (
              <label key={status}>
                <input
                  type="checkbox"
                  checked={statuses.includes(status)}
                  onChange={() => handleStatusChange(status)}
                />{" "}
                {status === "ON_SALE"
                  ? "판매중"
                  : status === "OUT_OF_STOCK"
                  ? "품절"
                  : "절판"}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm">출간일자</label>
          <div className="flex gap-1">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-2 py-1 rounded w-full"
            />
            <span className="px-1">~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-2 py-1 rounded w-full"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm">검색 연산</label>
          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
            <option value="NOT">NOT</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">카테고리</label>
          <div className="border rounded p-2 h-32 overflow-y-auto text-sm space-y-1">
            {categories.map((cat) => (
              <label key={cat.id} className="block">
                <input
                  type="checkbox"
                  value={cat.id}
                  checked={categoryIds.includes(cat.id)}
                  onChange={() => handleCategoryChange(cat.id)}
                />{" "}
                {cat.name}
              </label>
            ))}
          </div>
        </div>
        <div className="col-span-4 text-right">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            검색
          </button>
        </div>
      </div>

      {/* 상품 리스트 */}
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex border rounded p-4 shadow items-center justify-between"
          >
            <div className="flex gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-24 h-32 object-cover border"
              />
              <div className="text-sm">
                <p><strong>상품 ID:</strong> {product.id}</p>
                <p><strong>제목:</strong> {product.name}</p>
                <p><strong>저자:</strong> {product.author}</p>
                <p><strong>출판사:</strong> {product.publisher}</p>
                <p><strong>가격:</strong> {product.price.toLocaleString()}원</p>
                <p><strong>출간일:</strong> {product.publicationDate}</p>
                <p><strong>상태:</strong> {
                  product.status === "ON_SALE"
                    ? "판매중"
                    : product.status === "OUT_OF_STOCK"
                    ? "품절"
                    : "절판"
                }</p>
              </div>
            </div>
            <button
              onClick={() => handleEdit(product)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              수정
            </button>
          </div>
        ))}
      </div>

      {/* 하단 버튼 및 페이지네이션 */}
      <div className="flex justify-between items-center mt-8">
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 0}
            onClick={() => fetchData(currentPage - 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            이전
          </button>
          <span className="text-sm">
            {currentPage + 1} / {totalPages} 페이지
          </span>
          <button
            disabled={currentPage + 1 >= totalPages}
            onClick={() => fetchData(currentPage + 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            다음
          </button>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          상품 등록
        </button>
      </div>

      {/* 상품 등록/수정 폼 */}
      {isFormOpen && (
        <ProductForm
          product={selectedProduct}
          onClose={() => {
            setIsFormOpen(false);
            fetchData(currentPage);
          }}
        />
      )}
    </div>
  );
};

export default AdminProductPage;
