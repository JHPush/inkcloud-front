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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const keyword = searchParams.get("keyword") || "";
  const searchFields = searchParams.getAll("field") || DEFAULT_FIELDS;
  const categoryIds = searchParams.getAll("category") || [];
  const sortType = searchParams.get("sort") || "POPULAR";
  const pageParam = parseInt(searchParams.get("page") || "0");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          keyword,
          searchFields,
          categoryIds,
          sortType,
          page: pageParam,
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

    fetchData();
  }, [searchParams]);

  const handleSearch = (updated = {}) => {
    const params = new URLSearchParams();

    // 기존 파라미터 유지
    const newKeyword = updated.keyword ?? keyword;
    const newFields = updated.searchFields ?? searchFields;
    const newCategories = updated.categoryIds ?? categoryIds;
    const newSort = updated.sortType ?? sortType;
    const newPage = updated.page ?? 0;

    if (newKeyword) params.set("keyword", newKeyword);
    newFields.forEach((field) => params.append("field", field));
    newCategories.forEach((id) => params.append("category", id));
    if (newSort) params.set("sort", newSort);
    params.set("page", newPage);

    setSearchParams(params);
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
          setSearchFields={(fields) => handleSearch({ searchFields: fields })}
          categoryIds={categoryIds}
          setCategoryIds={(ids) => handleSearch({ categoryIds: ids })}
          categories={categories}
          keyword={keyword}
          sortType={sortType}
          onSearch={() => handleSearch()}
        />
        <div className="w-3/4 p-6">
          <ProductSearchBar
            keyword={keyword}
            setKeyword={(k) => handleSearch({ keyword: k })}
            searchFields={searchFields}
            categoryIds={categoryIds}
            sortType={sortType}
            onSearch={() => handleSearch()}
          />
          <ProductSortBar
            sortType={sortType}
            setSortType={(sort) => handleSearch({ sortType: sort })}
            keyword={keyword}
            searchFields={searchFields}
            categoryIds={categoryIds}
            onSearch={() => handleSearch()}
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
            onPageChange={(p) => handleSearch({ page: p })}
          />
        </div>
      </div>
    </BasicLayout>
  );
};

export default ProductListPage;
