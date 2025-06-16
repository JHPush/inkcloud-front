// src/pages/product/ProductDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductReviewList from "../../components/review/ProductRevewList";
import { fetchProductById } from "../../api/productApi";
import { addToCart } from "../../api/cartApi";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

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

  const handleBuyNow = () => {
    const state = {
      itemId: product.id,
      name: product.name,
      author: product.author,
      publisher: product.publisher,
      price: product.price,
      quantity,
    };
    navigate("/order", { state });
  };

  if (!product) {
    return <div className="text-center py-10">로딩 중...</div>;
  }

  // 상태 판단
  const isOutOfStock = product.status === "OUT_OF_STOCK";
  const isDiscontinued = product.status === "DISCONTINUED";
  const isSale = product.status === "ON_SALE";

  const getStatusLabel = () => {
    if (isOutOfStock) return "품절";
    if (isDiscontinued) return "절판";
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 상품 정보 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-auto rounded shadow-md"
        />

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-700 mb-1">저자: {product.author}</p>
          <p className="text-gray-700 mb-1">출판사: {product.publisher}</p>
          <p className="text-gray-700 mb-1">출간일: {product.publicationDate}</p>
          <p className="text-xl text-red-600 font-bold mt-4">
            {product.price.toLocaleString()}원
          </p>

          <div className="mt-6 text-gray-600 whitespace-pre-line">
            {product.introduction}
          </div>

          {/* 수량 선택 */}
          <div className="flex items-center gap-4 mt-6">
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
              disabled={!isSale || quantity >= product.quantity}
            >＋</button>
            <span className="text-sm text-gray-500">재고: {product.quantity}개</span>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-4 mt-6">
            {isSale ? (
              <>
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
              </>
            ) : (
              <button
                disabled
                className="bg-gray-400 text-white px-6 py-2 rounded cursor-not-allowed"
              >
                {getStatusLabel()}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 리뷰 영역 */}
      <div className="mt-16 border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">리뷰</h2>
        <div className="mb-6">
          <p className="text-lg font-medium">
            평균 평점: <span className="text-yellow-500">★</span> {product.rating.toFixed(1)} / 5
          </p>
          <p className="text-sm text-gray-600">
            총 {product.reviewsCount}개의 리뷰
          </p>
        </div>
        <ProductReviewList productId={id} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
