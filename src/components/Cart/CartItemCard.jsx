import React from 'react';
import QuantitySelect from './QuantitySelect';
import { useNavigate } from 'react-router-dom';

const CartItemCard = ({
  item,
  isChecked,
  onSelect,
  onQuantityChange,
  onDelete,
}) => {
  const navigate = useNavigate();
  const status = item.product.status;
  const isUnavailable = status === 'OUT_OF_STOCK' || status === 'DISCONTINUED';

  return (
    <div
      className={`border p-4 rounded flex justify-between items-center ${
        isUnavailable ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        {/* 체크박스 */}
        <div onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isChecked}
            disabled={isUnavailable}
            onChange={onSelect}
            className="mr-2"
          />
        </div>

        {/* 이미지 */}
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-24 h-32 object-cover rounded cursor-pointer"
          onClick={() => navigate(`/products/${item.product.id}`)}
        />

        {/* 정보 */}
        <div className="space-y-1">
          <p
            className="font-bold text-lg text-blue-700 cursor-pointer hover:underline"
            onClick={() => navigate(`/products/${item.product.id}`)}
          >
            {item.product.name}
          </p>
          <p className="text-sm text-gray-600">
            {item.product.author} / {item.product.publisher}
          </p>
          <p className="text-md text-blue-600">
            {item.product.price.toLocaleString()}원
          </p>

          {status === 'OUT_OF_STOCK' && (
            <p className="text-red-500">품절</p>
          )}
          {status === 'DISCONTINUED' && (
            <p className="text-gray-500">절판</p>
          )}

          {/* 수량 선택 */}
          <div onClick={(e) => e.stopPropagation()}>
            <QuantitySelect
              quantity={item.quantity}
              onChange={(qty) => onQuantityChange(item.id, qty)}
            />
          </div>
        </div>
      </div>

      {/* 삭제 버튼 */}
      <div onClick={(e) => e.stopPropagation()}>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded"
          onClick={() => onDelete(item.id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
