// src/pages/product/ProductDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../../api/productApi";
import ProductDetailInfo from "../../components/product/ProductDetailInfo";
import ProductReviewSection from "../../components/product/ProductReviewSection";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("❌ 상품 정보 불러오기 실패", error);
      }
    };
    loadProduct();
  }, [id]);

  if (!product) return <div className="text-center py-10">로딩 중...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ProductDetailInfo product={product} />
      <ProductReviewSection product={product} />
    </div>
  );
};

export default ProductDetailPage;
