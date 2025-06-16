// src/components/Main/BookRankingSection.jsx
import React from 'react';
import BookRankCard from './BookRankCard';

const BookRankingSection = ({ weeklyBooks = [] }) => {
  return (
    <div className="mt-10 space-y-4">
      <h2 className="text-xl font-bold">이 주의 베스트셀러</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {weeklyBooks.slice(0, 10).map((book, index) => (
          <BookRankCard key={book.id} book={book} rank={index + 1} />
        ))}
      </div>
    </div>
  );
};

export default BookRankingSection;
