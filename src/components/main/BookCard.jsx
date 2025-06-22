// src/components/Main/BookCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${book.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="w-40 bg-white shadow-lg rounded-lg p-3 text-center hover:shadow-xl transition-shadow cursor-pointer"
    >
      <img
        src={book.imageUrl}
        alt={book.name}
        className="w-full h-52 object-cover rounded"
      />
      <div className="mt-2 text-sm font-semibold truncate">{book.name}</div>
      <div className="text-xs text-gray-500 truncate">{book.author}</div>
    </div>
  );
};

export default BookCard;
