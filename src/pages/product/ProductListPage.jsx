// pages/product/ProductListPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchProducts, fetchAllCategories } from "../../api/productApi";
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
  const [categories, setCategories] = useState([]); // 전체 카테고리
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const getParamsFromURL = () => {
    const keyword = searchParams.get("keyword") || "";
    const searchFields = searchParams.getAll("searchFields");
    const categoryIds = searchParams.getAll("categoryIds");
    const sortType = searchParams.get("sortType") || "POPULAR";
    const page = parseInt(searchParams.get("page") || "0", 10);
    return { keyword, searchFields, categoryIds, sortType, page };
  };

  const handleSearch = async () => {
    const { keyword, searchFields, categoryIds, sortType, page } = getParamsFromURL();
    try {
      const params = {
        keyword,
        searchFields: searchFields.length > 0 ? searchFields : DEFAULT_FIELDS,
        categoryIds,
        sortType,
        page,
        size: 10,
      };

      const data = await fetchProducts(params);
      setProducts(data?.products?.content ?? []);
      setPage(data?.products?.number ?? 0);
      setTotalPages(data?.products?.totalPages ?? 1);
    } catch (error) {
      console.error("❌ 검색 실패:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allCats = await fetchAllCategories();
        setCategories(allCats); // 전체 카테고리 설정
        handleSearch();
      } catch (error) {
        console.error("❌ 카테고리 로딩 실패:", error);
      }
    };
    fetchData();
  }, [searchParams]);

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
        <ProductFilterSidebar categories={categories} />
        <div className="w-3/4 p-6">
          <ProductSearchBar />
          <ProductSortBar />
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
          />
        </div>
      </div>
    </BasicLayout>
  );
};

export default ProductListPage;
