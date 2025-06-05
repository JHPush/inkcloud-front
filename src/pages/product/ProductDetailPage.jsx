import { useParams } from "react-router-dom";

const ProductDetailPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>📘 상품 상세 페이지 - ID: {id}</h2>
    </div>
  );
};

export default ProductDetailPage;
