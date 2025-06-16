// src/components/Main/BookCard.jsx
import React from 'react';

const BookCard = ({ book }) => {
  return (
    <div className="w-40 flex-shrink-0 bg-white shadow-md rounded-md p-2 text-center">
      <img
        src={book.image}
        alt={book.title}
        className="w-full h-52 object-cover rounded"
      />
      <div className="mt-2 text-sm font-semibold">{book.title}</div>
      <div className="text-xs text-gray-500">{book.author}</div>
    </div>
  );
};

export default BookCard;
