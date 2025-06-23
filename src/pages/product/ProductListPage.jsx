// pages/product/ProductListPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchProducts } from "../../api/productApi";
import { addToCart } from "../../api/cartApi";
import BasicLayout from "../../layouts/BasicLayout";
import ProductFilterSidebar from "../../components/product/ProductFilterSidebar";
import ProductSearchBar from "../../components/product/ProductSearchBar";
import ProductSortBar from "../../components/product/ProductSortBar";
import ProductItem from "../../components/product/ProductItem";
import ProductPagination from "../../components/product/ProductPagination";

const DEFAULT_FIELDS = ["name", "author", "publisher", "isbn"];

const ProductListPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchFields, setSearchFields] = useState(DEFAULT_FIELDS);
  const [categoryIds, setCategoryIds] = useState([]);
  const [sortType, setSortType] = useState("POPULAR");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const ids = searchParams.getAll("categoryIds");
    const keywordFromParam = searchParams.get("keyword") || "";
    const sortTypeFromParam = searchParams.get("sortType") || "POPULAR";
    const searchFieldsFromParam = searchParams.getAll("searchFields");

    setCategoryIds(ids);
    setKeyword(keywordFromParam);
    setSortType(sortTypeFromParam);
    setSearchFields(searchFieldsFromParam.length > 0 ? searchFieldsFromParam : DEFAULT_FIELDS);

    handleSearch(0, ids, keywordFromParam, false); // ✅ 초기 진입도 상태 유지
  }, [searchParams]);

  const handleSearch = async (
    targetPage = 0,
    externalCategoryIds = categoryIds,
    externalKeyword = keyword,
    shouldReset = true
  ) => {
    try {
      const params = {
        keyword: externalKeyword,
        searchFields,
        categoryIds: externalCategoryIds,
        sortType,
        page: targetPage,
        size: 10,
      };
      const data = await fetchProducts(params);
      setProducts(data?.products?.content ?? []);
      setCategories(data?.categoryCounts ?? []);
      setPage(data?.products?.number ?? 0);
      setTotalPages(data?.products?.totalPages ?? 1);

      if (shouldReset) {
        setKeyword("");
        setSearchFields(DEFAULT_FIELDS);
        setCategoryIds([]);
      }
    } catch (error) {
      console.error("❌ 검색 실패", error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({ productId, quantity: 1 });
      alert("장바구니에 추가되었습니다.");
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
      alert("장바구니 추가에 실패했습니다.");
    }
  };

  const handleBuyNow = (product) => {
    navigate("/order", {
      state: [
        {
          id: product.id,
          name: product.name,
          author: product.author,
          publisher: product.publisher,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ],
    });
  };

  return (
    <BasicLayout>
      <div className="flex min-h-screen">
        <ProductFilterSidebar
          searchFields={searchFields}
          setSearchFields={setSearchFields}
          categoryIds={categoryIds}
          setCategoryIds={setCategoryIds}
          categories={categories}
          keyword={keyword}
          sortType={sortType}
          onSearch={() => handleSearch(0, categoryIds, keyword, false)} // ✅ 초기화 방지
        />
        <div className="w-3/4 p-6">
          <ProductSearchBar
            keyword={keyword}
            setKeyword={setKeyword}
            searchFields={searchFields}
            categoryIds={categoryIds}
            sortType={sortType}
            onSearch={() => handleSearch(0, categoryIds, keyword, false)} // ✅ 초기화 방지
          />
          <ProductSortBar
            sortType={sortType}
            setSortType={setSortType}
            keyword={keyword}
            searchFields={searchFields}
            categoryIds={categoryIds}
            onSearch={() => handleSearch(0, categoryIds, keyword, false)} // ✅ 초기화 방지
          />
          {products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              onClick={() => navigate(`/products/${product.id}`)}
              onAddToCart={handleAddToCart}
              onBuyNow={() => handleBuyNow(product)}
            />
          ))}
          <ProductPagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) =>
              handleSearch(p, categoryIds, keyword, false) // ✅ 초기화 방지
            }
          />
        </div>
      </div>
    </BasicLayout>
  );
};

export default ProductListPage;
