// components/product/ProductReviewSection.jsx
// ProductDetailPage
import React from "react";
import ProductReviewList from "../review/ProductRevewList";

const ProductReviewSection = ({ product }) => (
  <div className="border-t pt-8 mt-16">
    <h2 className="text-2xl font-bold mb-4">리뷰</h2>
    <div className="mb-6">
      <p className="text-lg font-medium text-gray-800">
        평균 평점: <span className="text-yellow-500">★</span> {product.rating.toFixed(1)} / 5
      </p>
      <p className="text-sm text-gray-600">
        총 {product.reviewsCount}개의 리뷰
      </p>
    </div>
    <ProductReviewList productId={product.id} />
  </div>
);

export default ProductReviewSection;
