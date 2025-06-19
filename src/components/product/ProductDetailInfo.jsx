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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-auto rounded-lg shadow-md"
      />
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-700 mb-1">저자: {product.author}</p>
        <p className="text-gray-700 mb-1">출판사: {product.publisher}</p>
        <p className="text-gray-700 mb-1">출간일: {product.publicationDate}</p>
        <p className="text-xl text-red-600 font-semibold mt-4">
          {product.price.toLocaleString()}원
        </p>
        <div className="mt-6 text-gray-600 whitespace-pre-line leading-relaxed">
          {product.introduction}
        </div>

        {/* 수량 */}
        {isSale && (
          <div className="flex items-center gap-4 mt-6">
            <span className="font-medium">수량</span>
            <button
              className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300"
              onClick={handleDecrease}
              disabled={quantity === 1}
            >
              −
            </button>
            <span className="w-8 text-center">{quantity}</span>
            <button
              className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300"
              onClick={handleIncrease}
              disabled={quantity >= product.quantity}
            >
              ＋
            </button>
            <span className="text-sm text-gray-500">({product.quantity}개 남음)</span>
          </div>
        )}

        {/* 버튼 */}
        <div className="flex gap-4 mt-6">
          {isSale ? (
            <>
              <button
                className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
                onClick={handleAddToCart}
              >
                장바구니
              </button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
                onClick={handleBuyNow}
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
