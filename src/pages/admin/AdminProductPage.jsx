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
      <div className="mb-6 p-4 bg-white border rounded shadow-sm">
        <h2 className="text-lg font-semibold mb-4">상품 검색</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">

          {/* 도서명 */}
          <div className="flex items-center gap-2">
            <label className="w-24 font-medium">도서명</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 border rounded px-2 py-1"
              placeholder="검색어 입력"
            />
          </div>

          {/* 상태 */}
          <div className="flex items-center gap-2">
            <label className="w-24 font-medium">판매 상태</label>
            <div className="flex flex-wrap gap-2">
              {["ON_SALE", "OUT_OF_STOCK", "DISCONTINUED"].map((status) => (
                <label key={status} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={statuses.includes(status)}
                    onChange={() => handleStatusChange(status)}
                  />
                  <span>
                    {status === "ON_SALE"
                      ? "판매중"
                      : status === "OUT_OF_STOCK"
                      ? "품절"
                      : "절판"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 카테고리 */}
          <div className="flex items-start gap-2">
            <label className="w-24 font-medium mt-1">카테고리</label>
            <div className="flex-1 border rounded p-2 h-28 overflow-y-auto">
              {categories.map((cat) => (
                <label key={cat.id} className="block">
                  <input
                    type="checkbox"
                    checked={categoryIds.includes(cat.id)}
                    onChange={() => handleCategoryChange(cat.id)}
                    className="mr-1"
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>

          {/* 출간일자 */}
          <div className="flex items-center gap-2">
            <label className="w-24 font-medium">출간일자</label>
            <div className="flex gap-1 items-center w-full">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded px-2 py-1 flex-1"
              />
              <span className="mx-1">~</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded px-2 py-1 flex-1"
              />
            </div>
          </div>

          {/* 연산자 */}
          <div className="flex items-center gap-2">
            <label className="w-24 font-medium">검색 연산</label>
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
              <option value="NOT">NOT</option>
            </select>
          </div>
        </div>

        {/* 버튼 */}
        <div className="mt-4 text-right">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
          >
            검색
          </button>
          <button
            onClick={() => {
              setKeyword("");
              setStatuses([]);
              setCategoryIds([]);
              setStartDate("");
              setEndDate("");
              setOperator("AND");
              fetchData(0);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            초기화
          </button>
        </div>
      </div>


      {/* 상품 리스트 */}
      <div className="grid grid-cols-1 gap-4 mt-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex justify-between border rounded-xl p-5 shadow-sm bg-white hover:shadow-md transition-all"
          >
            <div className="flex gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-28 h-40 object-cover rounded border"
              />
              <div className="space-y-1 text-sm">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p><span className="font-medium text-gray-600">저자:</span> {product.author}</p>
                <p><span className="font-medium text-gray-600">출판사:</span> {product.publisher}</p>
                <p><span className="font-medium text-gray-600">ISBN:</span> {product.isbn}</p>
                <p><span className="font-medium text-gray-600">출간일:</span> {product.publicationDate}</p>
                <p>
                  <span className="font-medium text-gray-600">상태:</span>{" "}
                  <span
                    className={
                      "inline-block px-2 py-1 text-xs rounded font-medium " +
                      (product.status === "ON_SALE"
                        ? "bg-green-100 text-green-800"
                        : product.status === "OUT_OF_STOCK"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800")
                    }
                  >
                    {product.status === "ON_SALE"
                      ? "판매중"
                      : product.status === "OUT_OF_STOCK"
                      ? "품절"
                      : "절판"}
                  </span>
                </p>
              </div>
            </div>

            <div className="text-right flex flex-col justify-between">
              <div className="text-lg font-semibold text-gray-900">
                {product.price.toLocaleString()}원
              </div>
              <button
                onClick={() => handleEdit(product)}
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm mt-2"
              >
                수정
              </button>
            </div>
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
