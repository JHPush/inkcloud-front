import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCartItems,
  deleteCartItem,
  clearCart,
  updateCartItemQuantity,
} from '../../api/cartApi';
import { fetchProductById } from '../../api/productApi';
import { ShoppingCart } from 'lucide-react';

const QuantitySelect = ({ quantity, onChange }) => {
  return (
    <select
      value={quantity}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="mt-2 border rounded px-2 py-1"
    >
      {[...Array(10)].map((_, i) => (
        <option key={i + 1} value={i + 1}>
          {i + 1}
        </option>
      ))}
    </select>
  );
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const items = await getCartItems();
      const itemsWithProduct = await Promise.all(
        items.map(async (item) => {
          const product = await fetchProductById(item.productId);
          return { ...item, product };
        })
      );
      setCartItems(itemsWithProduct);
      setSelectedItems([]);
      setSelectAll(false);
    } catch (err) {
      console.error('장바구니 불러오기 실패:', err);
    }
  };

  const handleQuantityChange = async (cartId, newQty) => {
    try {
      await updateCartItemQuantity(cartId, newQty);
      fetchCart();
    } catch (err) {
      console.error('수량 변경 실패:', err);
    }
  };

  const handleDelete = async (cartId) => {
    try {
      await deleteCartItem(cartId);
      fetchCart();
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      fetchCart();
    } catch (err) {
      console.error('전체 비우기 실패:', err);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allIds = cartItems
        .filter((item) => item.product.status !== 'OUT_OF_STOCK')
        .map((item) => item.id);
      setSelectedItems(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleOrderSelected = () => {
    const itemsToOrder = cartItems.filter((item) => selectedItems.includes(item.id));
    if (itemsToOrder.length === 0) {
      alert('주문할 상품을 선택해주세요.');
      return;
    }
    navigate('/order', { state: { items: itemsToOrder } });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ShoppingCart className="w-6 h-6" /> 장바구니
      </h2>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center text-gray-500">
          <ShoppingCart className="w-16 h-16 mb-4 opacity-70" />
          <p className="text-lg font-semibold mb-1">장바구니가 비어 있습니다.</p>
          <p className="mb-4">원하시는 도서를 장바구니에 담아보세요!</p>
          <button
            onClick={() => navigate('/products')}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            도서 보러 가기
          </button>
        </div>
      ) : (
        <>
          <div className="mb-2">
            <input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="mr-2" />
            전체 선택
            <button
              onClick={async () => {
                await Promise.all(selectedItems.map(deleteCartItem));
                setSelectedItems([]);
                fetchCart();
              }}
              disabled={selectedItems.length === 0}
              className={`ml-4 text-sm underline ${selectedItems.length === 0 ? 'text-gray-400' : 'text-gray-600'}`}
            >
              선택 삭제
            </button>
          </div>

          <div className="space-y-4">
            {cartItems.map((item) => {
              const isOutOfStock = item.product.status === 'OUT_OF_STOCK';
              const isChecked = selectedItems.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`border p-4 rounded flex justify-between items-center ${
                    isOutOfStock ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isOutOfStock}
                      onChange={() => handleSelectItem(item.id)}
                      className="mr-2"
                    />
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-32 object-cover rounded"
                    />
                    <div>
                      <p className="font-bold text-lg">{item.product.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.product.author} / {item.product.publisher}
                      </p>
                      <p className="text-md text-blue-600">
                        {item.product.price.toLocaleString()}원
                      </p>
                      {isOutOfStock && <p className="text-red-500">품절</p>}
                      <QuantitySelect
                        quantity={item.quantity}
                        onChange={(qty) => handleQuantityChange(item.id, qty)}
                      />
                    </div>
                  </div>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(item.id)}
                  >
                    삭제
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-6 border-t pt-4">
            <button
              className="px-4 py-2 bg-gray-700 text-white rounded"
              onClick={handleClear}
            >
              전체 비우기
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={handleOrderSelected}
            >
              선택 주문하기
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
