// src/pages/product/ProductListPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../../api/productApi";
import { addToCart } from "../../api/cartApi";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchFields, setSearchFields] = useState(["name"]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [sortType, setSortType] = useState("POPULAR");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const handleSearch = async (targetPage = 0) => {
    try {
      const params = {
        keyword,
        searchFields,
        categoryIds,
        sortType,
        page: targetPage,
        size: 10,
      };
      const data = await fetchProducts(params);
      setProducts(data?.products?.content ?? []);
      setCategories(data?.categoryCounts ?? []);
      setPage(data?.products?.number ?? 0);
      setTotalPages(data?.products?.totalPages ?? 1);
    } catch (error) {
      console.error("❌ 검색 실패", error);
    }
  };

  useEffect(() => {
    handleSearch(0);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(0);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1); // 수량 기본값 1
      alert("장바구니에 추가되었습니다.");
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
      alert("장바구니 추가에 실패했습니다.");
    }
  };

  const handleBuyNow = (productId) => {
    console.log("바로 구매 클릭:", productId);
    // 추후 구매 페이지로 이동 또는 결제 로직 추가 예정
  };

  return (
    <div className="flex min-h-screen">
      {/* 왼쪽 필터 */}
      <div className="w-1/4 p-4 border-r bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">검색 조건</h2>

        <div className="mb-6">
          <h3 className="font-medium">검색 대상</h3>
          {["name", "author", "publisher", "isbn"].map((field) => (
            <label key={field} className="block">
              <input
                type="checkbox"
                checked={searchFields.includes(field)}
                onChange={() => toggleItem(field, searchFields, setSearchFields)}
                className="mr-2"
              />
              {field.toUpperCase()}
            </label>
          ))}
        </div>

        <div>
          <h3 className="font-medium">카테고리</h3>
          {categories.map((cat) => (
            <label key={cat.categoryId} className="block">
              <input
                type="checkbox"
                checked={categoryIds.includes(cat.categoryId)}
                onChange={() => toggleItem(cat.categoryId, categoryIds, setCategoryIds)}
                className="mr-2"
              />
              {cat.categoryName} ({cat.count})
            </label>
          ))}
        </div>

        <div className="mt-6">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
            onClick={() => handleSearch(0)}
          >
            검색
          </button>
        </div>
      </div>

      {/* 오른쪽 리스트 */}
      <div className="w-3/4 p-6">
        {/* 검색창 */}
        <div className="flex items-center mb-6">
          <input
            type="text"
            placeholder="도서명, 저자, 출판사 검색..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 px-4 py-2 rounded-l"
          />
          <button
            onClick={() => handleSearch(0)}
            className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
          >
            검색
          </button>
        </div>

        {/* 정렬 */}
        <div className="flex justify-between mb-4 items-center">
          <h2 className="text-2xl font-bold">검색 결과</h2>
          <select
            className="border p-2 rounded"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="POPULAR">인기순</option>
            <option value="LATEST">최신순</option>
            <option value="RATING">평점순</option>
            <option value="PRICE_HIGH">높은 가격순</option>
            <option value="PRICE_LOW">낮은 가격순</option>
          </select>
        </div>

        {/* 상품 목록 */}
        {products.map((product) => (
          <div
            key={product.id}
            className="flex border p-4 rounded mb-4 hover:bg-gray-50"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-32 object-cover mr-4 cursor-pointer"
              onClick={() => navigate(`/products/${product.id}`)}
            />
            <div className="flex-1 cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-gray-700 mt-1">{product.introduction}</p>
              <p className="text-sm text-gray-500 mt-1">
                {product.author} | {product.publisher} | {product.publicationDate}
              </p>
              <p className="text-red-600 mt-2 font-semibold">
                {product.price.toLocaleString()}원
              </p>
            </div>
            <div className="text-center w-24">
              <p className="text-sm text-gray-600">★ {product.rating} / 10</p>
              <button
                className="mt-2 w-full bg-gray-300 hover:bg-gray-400 text-sm px-2 py-1 rounded"
                onClick={() => handleAddToCart(product.id)}
              >
                장바구니
              </button>
              <button
                className="mt-1 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm px-2 py-1 rounded"
                onClick={() => handleBuyNow(product.id)}
              >
                바로 구매
              </button>
            </div>
          </div>
        ))}

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-6 space-x-2">
          <button
            disabled={page === 0}
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => handleSearch(page - 1)}
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 border rounded ${i === page ? "bg-blue-600 text-white" : ""}`}
              onClick={() => handleSearch(i)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page >= totalPages - 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => handleSearch(page + 1)}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

// 공통 토글 로직
const toggleItem = (item, list, setList) => {
  setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
};

export default ProductListPage;
