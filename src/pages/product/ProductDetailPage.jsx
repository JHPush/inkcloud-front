import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductReviewList from "../../components/review/ProductRevewList";

import { fetchProductById } from "../../api/productApi";
import { addToCart } from "../../api/cartApi";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

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

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    if (product && quantity < product.quantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId: product.id, quantity });
      alert("장바구니에 추가되었습니다.");
    } catch (error) {
      console.error("🛒 장바구니 추가 실패:", error);
      alert("장바구니 추가 중 오류가 발생했습니다.");
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    alert("🛠️ 아직 구현되지 않은 기능입니다.");
  };

  if (!product) {
    return <div className="text-center py-10">로딩 중...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img src={product.image} alt={product.name} className="w-full h-auto rounded shadow" />
        <div>
          <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
          <p className="text-gray-600 mb-1">저자: {product.author}</p>
          <p className="text-gray-600 mb-1">출판사: {product.publisher}</p>
          <p className="text-gray-600 mb-1">출간일: {product.publicationDate}</p>
          <p className="text-lg text-red-600 font-semibold mt-4 mb-6">
            {product.price.toLocaleString()}원
          </p>
          <p className="text-sm text-gray-700 mb-6">{product.introduction}</p>

          {/* 수량 선택 */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-semibold">수량:</span>
            <button
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              onClick={handleDecrease}
              disabled={quantity === 1}
            >−</button>
            <span className="min-w-[2rem] text-center">{quantity}</span>
            <button
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              onClick={handleIncrease}
              disabled={product && quantity >= product.quantity}
            >＋</button>
            <span className="text-gray-500 text-sm">재고: {product.quantity}개</span>
          </div>

          {/* 장바구니 및 구매 버튼 */}
          <div className="flex gap-4">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              onClick={handleAddToCart}
            >
              장바구니
            </button>
            <button 
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              onClick={handleBuyNow}
            >
              바로 구매
            </button>
          </div>
        </div>
      </div>

      {/* 리뷰 섹션 */}
      <div className="mt-12 border-t pt-6">
        <h3 className="text-xl font-bold mb-4">리뷰</h3>

        {/* 리뷰 요약 */}
        <div className="mb-6">
          <p className="text-lg font-medium">평균 평점: ⭐ {product.rating.toFixed(1)} / 5</p>
          <p className="text-sm text-gray-600">총 {product.reviewsCount}개의 리뷰</p>
        </div>

        {/* 리뷰 리스트 (Mock) */}

      </div>
      <ProductReviewList productId={id}/>
    </div>
  );
};

export default ProductDetailPage;
