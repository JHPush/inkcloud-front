import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../../api/productApi";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("상품 조회 실패", err);
      }
    };

    loadProduct();
  }, [id]);

  if (!product) return <p>로딩 중...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} width="200" />
      <p>저자: {product.author}</p>
      <p>출판사: {product.publisher}</p>
      <p>ISBN: {product.isbn}</p>
      <p>가격: {product.price}원</p>
      <p>설명: {product.introduction}</p>

      <div>
        <label>수량: </label>
        <input type="number" min="1" max={product.quantity} defaultValue="1" />
      </div>

      <div style={{ marginTop: "10px" }}>
        <button>장바구니 담기</button>
        <button style={{ marginLeft: "10px" }}>바로 구매</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h4>리뷰</h4>
        <p>리뷰 기능은 추후 구현 예정</p>
      </div>
    </div>
  );
};

export default ProductDetailPage;