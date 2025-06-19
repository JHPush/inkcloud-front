// src/components/Main/MainCarousel.jsx
import React, { useState } from 'react';
import BookCard from './BookCard';

const TABS = ['일간 베스트셀러', '신작 소개', '추천 도서'];

const MainCarousel = ({ bestsellers = [], newBooks = [], recommendedBooks = [] }) => {
  const [activeTab, setActiveTab] = useState(0);

  const getCurrentBooks = () => {
    switch (activeTab) {
      case 0:
        return bestsellers;
      case 1:
        return newBooks;
      case 2:
        return recommendedBooks;
      default:
        return [];
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 탭 */}
      <div className="tabs justify-center">
        {TABS.map((tab, idx) => (
          <button
            key={idx}
            className={`tab tab-lg tab-bordered ${activeTab === idx ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 캐러셀 */}
      <div className="carousel carousel-center p-4 space-x-4 bg-base-100 rounded-box">
        {getCurrentBooks().map((book) => (
          <div key={book.id} className="carousel-item">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainCarousel;