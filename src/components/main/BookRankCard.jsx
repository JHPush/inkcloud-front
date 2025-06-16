// src/components/Main/BookRankCard.jsx
import React from 'react';

const BookRankCard = ({ book, rank }) => {
  return (
    <div className="relative bg-white shadow-md rounded-md p-2 text-center">
      <div className="absolute top-1 left-1 bg-gray-800 text-white text-xs rounded-full px-2 py-0.5">
        {rank}
      </div>
      <img
        src={book.image}
        alt={book.title}
        className="w-full h-48 object-cover rounded"
      />
      <div className="mt-2 text-sm font-semibold">{book.title}</div>
      <div className="text-xs text-gray-500">{book.author}</div>
    </div>
  );
};

export default BookRankCard;
