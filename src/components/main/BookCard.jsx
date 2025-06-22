// src/components/Main/BookCard.jsx
import React from 'react';

const BookCard = ({ book }) => {
  return (
    <div className="w-40 bg-white shadow-lg rounded-lg p-3 text-center hover:shadow-xl transition-shadow">
      <img
        src={book.imageUrl}
        alt={book.title}
        className="w-full h-52 object-cover rounded"
      />
      <div className="mt-2 text-sm font-semibold truncate">{book.title}</div>
      <div className="text-xs text-gray-500 truncate">{book.author}</div>
    </div>
  );
};

export default BookCard;
