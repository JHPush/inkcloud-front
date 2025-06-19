// components/product/ProductDetailInfo.jsx
// ProductDetailPage
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../api/cartApi";

const ProductDetailInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const isSale = product.status === "ON_SALE";
  const isOutOfStock = product.status === "OUT_OF_STOCK";
  const isDiscontinued = product.status === "DISCONTINUED";

  const handleDecrease = () => setQuantity((q) => Math.max(1, q - 1));
  const handleIncrease = () => {
    if (quantity < product.quantity) setQuantity((q) => q + 1);
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

  const getStatusLabel = () => {
    if (isOutOfStock) return "품절";
    if (isDiscontinued) return "절판";
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
      {/* 이미지 */}
      <div className="flex justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-64 max-h-[400px] object-contain rounded-lg shadow-md"
        />
      </div>

      {/* 정보 */}
      <div>
        {/* 상품명 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
          {product.name}
        </h1>

        {/* 메타 정보 */}
        <div className="space-y-1 text-sm text-gray-700 mb-6">
          <p>
            <span className="font-semibold text-gray-800">저자</span>: {product.author}
          </p>
          <p>
            <span className="font-semibold text-gray-800">출판사</span>: {product.publisher}
          </p>
          <p>
            <span className="font-semibold text-gray-800">출간일</span>: {product.publicationDate}
          </p>
        </div>

        {/* 가격 */}
        <p className="text-2xl font-bold text-red-600 mb-6">
          {product.price.toLocaleString()}
          <span className="text-base text-gray-500 ml-1">원</span>
        </p>

        {/* 한줄 소개 */}
        <p className="text-gray-500 italic text-sm mb-8">
          {product.introduction}
        </p>

        {/* 수량 선택 */}
        {isSale && (
          <div className="flex items-center gap-3 mb-6">
            <span className="font-medium text-gray-800">수량</span>
            <button
              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-lg"
              onClick={handleDecrease}
              disabled={quantity === 1}
            >
              −
            </button>
            <span className="w-6 text-center">{quantity}</span>
            <button
              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-lg"
              onClick={handleIncrease}
              disabled={quantity >= product.quantity}
            >
              ＋
            </button>
            <span className="text-sm text-gray-500">
              ({product.quantity}개 남음)
            </span>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex gap-3">
          {isSale ? (
            <>
              <button
                onClick={handleAddToCart}
                className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
              >
                장바구니
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                바로 구매
              </button>
            </>
          ) : (
            <button
              disabled
              className="bg-gray-400 text-white px-6 py-2 rounded-full cursor-not-allowed"
            >
              {getStatusLabel()}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailInfo;
