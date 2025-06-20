// src/components/Main/BookRankCard.jsx
import React from 'react';

const BookRankCard = ({ book, rank }) => {
  return (
    <div className="relative bg-white shadow-xl rounded-xl p-3 text-center hover:scale-105 transition-transform">
      <div className="absolute top-2 left-2 bg-primary text-white text-xs rounded-full px-2 py-0.5">
        {rank}
      </div>
      <img
        src={book.image}
        alt={book.title}
        className="w-full h-48 object-cover rounded"
      />
      <div className="mt-2 text-sm font-semibold truncate">{book.title}</div>
      <div className="text-xs text-gray-500 truncate">{book.author}</div>
    </div>
  );
};

export default BookRankCard;
