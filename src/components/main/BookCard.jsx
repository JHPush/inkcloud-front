// src/components/Main/BookCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${book.bookId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white shadow-md rounded-lg p-3 text-left hover:shadow-lg transition-shadow cursor-pointer"
    >
      <img
        src={book.imageUrl}
        alt={book.name}
        className="w-full h-48 object-cover rounded mb-2"
      />
      <div className="space-y-0.5">
        <div className="text-sm font-semibold text-gray-800 truncate">{book.name}</div>
        <div className="text-xs text-gray-500 truncate">{book.author}</div>
        <div className="text-xs text-gray-400 truncate">{book.publisher}</div>
        <div className="text-sm text-indigo-600 font-medium">
          {book.price?.toLocaleString()}원
        </div>
      </div>
    </div>
  );
};

export default BookCard;
