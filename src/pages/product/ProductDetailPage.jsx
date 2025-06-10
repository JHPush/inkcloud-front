import { useParams } from "react-router-dom";
import ProductReviewList from "../../components/review/ProductRevewList";


const ProductDetailPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>📘 상품 상세 페이지 - ID: {id}</h2>
      <ProductReviewList productId={id}/>
    </div>
  );
};

export default ProductDetailPage;
