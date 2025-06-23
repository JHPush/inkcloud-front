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
    const fields = searchParams.getAll("searchFields");
    const keywordFromParam = searchParams.get("keyword") || "";
    const sort = searchParams.get("sortType") || "POPULAR";

    setCategoryIds(ids);
    setSearchFields(fields.length ? fields : DEFAULT_FIELDS);
    setKeyword(keywordFromParam);
    setSortType(sort);

    handleSearch(0, ids, fields, keywordFromParam, sort);
  }, [searchParams]);

  const handleSearch = async (
    targetPage = 0,
    externalCategoryIds = categoryIds,
    externalSearchFields = searchFields,
    externalKeyword = keyword,
    externalSortType = sortType
  ) => {
    try {
      const params = {
        keyword: externalKeyword,
        searchFields: externalSearchFields,
        categoryIds: externalCategoryIds,
        sortType: externalSortType,
        page: targetPage,
        size: 10,
      };

      const queryParams = new URLSearchParams();
      externalCategoryIds.forEach((id) =>
        queryParams.append("categoryIds", id)
      );
      externalSearchFields.forEach((field) =>
        queryParams.append("searchFields", field)
      );
      queryParams.append("sortType", externalSortType);
      queryParams.append("keyword", externalKeyword);

      navigate(`/products/search?${queryParams.toString()}`);

      const data = await fetchProducts(params);
      setProducts(data?.products?.content ?? []);
      setCategories(data?.categoryCounts ?? []);
      setPage(data?.products?.number ?? 0);
      setTotalPages(data?.products?.totalPages ?? 1);
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
          onSearch={() => handleSearch(0, categoryIds, searchFields, keyword, sortType)}
        />
        <div className="w-3/4 p-6">
          <ProductSearchBar
            keyword={keyword}
            setKeyword={setKeyword}
            onSearch={() => handleSearch(0)}
          />
          <ProductSortBar
            sortType={sortType}
            setSortType={(val) => {
              setSortType(val);
              handleSearch(0, categoryIds, searchFields, keyword, val);
            }}
            keyword={keyword}
            searchFields={searchFields}
            categoryIds={categoryIds}
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
              handleSearch(p, categoryIds, searchFields, keyword, sortType)
            }
          />
        </div>
      </div>
    </BasicLayout>
  );
};

export default ProductListPage;
