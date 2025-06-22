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
import CartItemCard from '../../components/Cart/CartItemCard';
import BasicLayout from '../../layouts/BasicLayout';

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
        .filter((item) => item.product.status === 'ON_SALE')
        .map((item) => item.id);
      setSelectedItems(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleOrderSelected = () => {
    const itemsToOrder = cartItems.filter(
      (item) =>
        selectedItems.includes(item.id) && item.product.status === 'ON_SALE'
    );
    if (itemsToOrder.length === 0) {
      alert('주문할 상품을 선택해주세요.');
      return;
    }
    navigate('/order', {
      state: itemsToOrder.map((item) => ({
        ...item.product,
        quantity: item.quantity,
      })),
    });
  };

  const calculateTotalPrice = () => {
    return cartItems
      .filter(
        (item) =>
          selectedItems.includes(item.id) && item.product.status === 'ON_SALE'
      )
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <BasicLayout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-gray-900">
          <ShoppingCart className="w-6 h-6" />
          장바구니
        </h2>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-500">
            <ShoppingCart className="w-16 h-16 mb-4 opacity-60" />
            <p className="text-lg font-semibold mb-1">장바구니가 비어 있습니다.</p>
            <p className="mb-6 text-sm">원하시는 도서를 장바구니에 담아보세요!</p>
            <button
              onClick={() => navigate('/products')}
              className="px-5 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              도서 보러 가기
            </button>
          </div>
        ) : (
          <>
            {/* 선택 영역 */}
            <div className="flex items-center justify-between mb-4 text-sm text-gray-700">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="mr-2"
                />
                <span className="font-medium">전체 선택</span>
                <button
                  onClick={async () => {
                    await Promise.all(selectedItems.map(deleteCartItem));
                    setSelectedItems([]);
                    fetchCart();
                  }}
                  disabled={selectedItems.length === 0}
                  className={`ml-4 underline ${
                    selectedItems.length === 0
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  선택 삭제
                </button>
              </div>
            </div>

            {/* 장바구니 아이템들 */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  isChecked={selectedItems.includes(item.id)}
                  onSelect={() => handleSelectItem(item.id)}
                  onQuantityChange={handleQuantityChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* 합계 */}
            <div className="text-right mt-6 text-sm text-gray-800">
              <span className="mr-2">선택된 상품 합계:</span>
              <span className="text-lg font-semibold text-blue-600">
                {calculateTotalPrice().toLocaleString()}원
              </span>
            </div>

            {/* 액션 버튼 */}
            <div className="flex justify-between items-center mt-8 border-t pt-6">
              <button
                onClick={handleClear}
                className="text-sm px-4 py-2 rounded-full bg-gray-700 text-white hover:bg-gray-800 transition"
              >
                전체 비우기
              </button>
              <button
                onClick={handleOrderSelected}
                className="text-sm px-5 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
              >
                선택 주문하기
              </button>
            </div>
          </>
        )}
      </div>
    </BasicLayout>
  );
};

export default CartPage;
