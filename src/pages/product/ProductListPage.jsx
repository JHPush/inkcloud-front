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

const ProductListPage = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const keywordParam = searchParams.get("keyword") || "";
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState(keywordParam);
  const [searchFields, setSearchFields] = useState(["name"]);
  const [categoryIds, setCategoryIds] = useState(initialCategory ? [initialCategory] : []);
  const [sortType, setSortType] = useState("POPULAR");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const handleSearch = async (targetPage = 0) => {
    try {
      const params = { keyword, searchFields, categoryIds, sortType, page: targetPage, size: 10 };
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
  }, [initialCategory, keywordParam]);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({ productId, quantity: 1 });
      alert("장바구니에 추가되었습니다.");
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
      alert("장바구니 추가에 실패했습니다.");
    }
  };

  const handleBuyNow = () => {
    navigate("/order", {
      state: {
        id: product.id,
        name: product.name,
        author: product.author,
        publisher: product.publisher,
        price: product.price,
        quantity,
        image: product.image,
      },
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
          onSearch={() => handleSearch(0)}
        />
        <div className="w-3/4 p-6">
          <ProductSearchBar keyword={keyword} setKeyword={setKeyword} onSearch={() => handleSearch(0)} />
          <ProductSortBar sortType={sortType} setSortType={setSortType} />
          {products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              onClick={() => navigate(`/products/${product.id}`)}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          ))}
          <ProductPagination page={page} totalPages={totalPages} onPageChange={handleSearch} />
        </div>
      </div>
    </BasicLayout>
  );
};

export default ProductListPage;
