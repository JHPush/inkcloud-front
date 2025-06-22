// src/components/Main/BookRankCard.jsx
import React from 'react';

const BookRankCard = ({ book, rank }) => {
  return (
    <div className="relative bg-white shadow-md rounded-xl p-3 text-center hover:shadow-lg transition-shadow">
      {/* 랭킹 뱃지 */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-sm font-bold px-3 py-1 rounded-full shadow">
        #{rank}
      </div>

      {/* 책 이미지 */}
      <img
        src={book.imageUrl}
        alt={book.name}
        className="w-full h-52 object-cover rounded-md"
      />

      {/* 책 정보 */}
      <div className="mt-3 space-y-1">
        <div className="text-sm font-semibold text-gray-800 truncate">{book.name}</div>
        <div className="text-xs text-gray-500 truncate">{book.author}</div>
        <div className="text-sm text-primary font-medium">{book.price?.toLocaleString()}원</div>
      </div>
    </div>
  );
};

export default BookRankCard;
