// components/product/ProductItem.jsx
// ProductListPage
import React from "react";

const ProductItem = ({ product, onClick, onAddToCart, onBuyNow }) => (
  <div className="flex border p-4 rounded mb-4 hover:bg-gray-50">
    <img src={product.image} alt={product.name} className="w-24 h-32 object-cover mr-4 cursor-pointer" onClick={onClick} />
    <div className="flex-1 cursor-pointer" onClick={onClick}>
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-sm text-gray-700 mt-1">{product.introduction}</p>
      <p className="text-sm text-gray-500 mt-1">{product.author} | {product.publisher} | {product.publicationDate}</p>
      <p className="text-red-600 mt-2 font-semibold">{product.price.toLocaleString()}원</p>
    </div>
    <div className="text-center w-24">
      <p className="text-sm text-gray-600">★ {product.rating.toFixed(1)} / 5</p>
      <button
        className={`mt-2 w-full text-sm px-2 py-1 rounded ${product.status !== "ON_SALE" ? "bg-gray-400 text-white cursor-not-allowed" : "bg-gray-300 hover:bg-gray-400"}`}
        disabled={product.status !== "ON_SALE"}
        onClick={() => onAddToCart(product.id)}
      >
        {product.status === "ON_SALE" ? "장바구니" : product.status === "OUT_OF_STOCK" ? "품절" : "절판"}
      </button>
      <button
        className={`mt-1 w-full text-white text-sm px-2 py-1 rounded ${product.status !== "ON_SALE" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        disabled={product.status !== "ON_SALE"}
        onClick={() => onBuyNow(product)}
      >
        바로 구매
      </button>
    </div>
  </div>
);

export default ProductItem;
