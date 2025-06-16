import { Star } from "lucide-react";

// 별점 표시 컴포넌트
const StarRating = ({ rating }) => (
  <span className="flex">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={18}
        color={n <= rating ? "#facc15" : "#e5e7eb"}
        fill={n <= rating ? "#facc15" : "none"}
        style={{ marginRight: 2 }}
      />
    ))}
  </span>
);
export default StarRating;