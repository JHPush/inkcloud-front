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
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="mr-2"
            />
            전체 선택
            <button
              onClick={async () => {
                await Promise.all(selectedItems.map(deleteCartItem));
                setSelectedItems([]);
                fetchCart();
              }}
              disabled={selectedItems.length === 0}
              className={`ml-4 text-sm underline ${
                selectedItems.length === 0
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              선택 삭제
            </button>
          </div>

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

          <div className="text-right text-lg font-semibold text-gray-700 mt-4">
            선택된 상품 합계:{' '}
            <span className="text-blue-600">
              {calculateTotalPrice().toLocaleString()}원
            </span>
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