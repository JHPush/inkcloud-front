// src/components/Main/BookRankingSection.jsx
import React from 'react';
import BookRankCard from './BookRankCard';

const BookRankingSection = ({ weeklyBooks = [] }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">🏆 주간 베스트셀러 Top 10</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 px-4">
        {weeklyBooks.slice(0, 10).map((book, index) => (
          <BookRankCard key={book.id} book={book} rank={index + 1} />
        ))}
      </div>
    </div>
  );
};

export default BookRankingSection;
