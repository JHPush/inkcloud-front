import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../../api/productApi";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchFields, setSearchFields] = useState(["name"]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [sortType, setSortType] = useState("LATEST");
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const params = {
        keyword,
        searchFields,
        categoryIds,
        sortType,
        page: 0,
        size: 12,
      };
      const data = await fetchProducts(params);
      console.log("📦 응답 데이터:", data);

      setProducts(data?.content ?? []);
      setCategories(data?.categoryCounts ?? []);
    } catch (error) {
      console.error("❌ 검색 실패", error);
      setProducts([]);
      setCategories([]);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div>
      <h2>도서 검색</h2>

      <input
        type="text"
        placeholder="검색어 입력"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <div>
        <label>
          <input
            type="checkbox"
            value="name"
            checked={searchFields.includes("name")}
            onChange={() =>
              handleFieldToggle("name", searchFields, setSearchFields)
            }
          />
          도서명
        </label>
        <label>
          <input
            type="checkbox"
            value="author"
            checked={searchFields.includes("author")}
            onChange={() =>
              handleFieldToggle("author", searchFields, setSearchFields)
            }
          />
          저자
        </label>
        <label>
          <input
            type="checkbox"
            value="publisher"
            checked={searchFields.includes("publisher")}
            onChange={() =>
              handleFieldToggle("publisher", searchFields, setSearchFields)
            }
          />
          출판사
        </label>
        <label>
          <input
            type="checkbox"
            value="isbn"
            checked={searchFields.includes("isbn")}
            onChange={() =>
              handleFieldToggle("isbn", searchFields, setSearchFields)
            }
          />
          ISBN
        </label>
      </div>

      <div>
        <strong>카테고리:</strong>
        {(categories || []).map((cat) => (
          <label key={cat.categoryId}>
            <input
              type="checkbox"
              value={cat.categoryId}
              checked={categoryIds.includes(cat.categoryId)}
              onChange={() =>
                handleCategoryToggle(cat.categoryId, categoryIds, setCategoryIds)
              }
            />
            {cat.categoryName} ({cat.count})
          </label>
        ))}
      </div>

      <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
        <option value="POPULAR">인기순</option>
        <option value="LATEST">최신순</option>
        <option value="RATING">평점순</option>
        <option value="PRICE_HIGH">높은 가격순</option>
        <option value="PRICE_LOW">낮은 가격순</option>
      </select>

      <button onClick={handleSearch}>검색</button>

      <div>
        {(products || []).map((product) => (
          <div
            key={product.id}
            style={{ cursor: "pointer", borderBottom: "1px solid #ccc", padding: "10px" }}
            onClick={() => navigate(`/products/${product.id}`)}
          >
            <img src={product.image} width="100" alt="book" />
            <p>{product.name}</p>
            <p>{product.author}</p>
            <p>{product.price}원</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 체크박스 필드 토글
const handleFieldToggle = (field, list, setList) => {
  setList(
    list.includes(field)
      ? list.filter((item) => item !== field)
      : [...list, field]
  );
};

// 카테고리 체크 토글
const handleCategoryToggle = (id, list, setList) => {
  setList(
    list.includes(id)
      ? list.filter((item) => item !== id)
      : [...list, id]
  );
};

export default ProductListPage;