// src/pages/MainPage.jsx
import React, { useEffect, useState } from "react";
import BasicLayout from "../layouts/BasicLayout";
import MainCarousel from "../components/main/MainCarousel";
import BookRankingSection from "../components/main/BookRankingSection";
import { getDailyBestsellers, getWeeklyBestsellers } from "../api/bestsellerApi";
import { getNewBooks, getRecommendedBooks } from "../api/productApi";
import MainSearchBar from "../components/product/MainSearchBar";

const MainPage = () => {
  const [dailyBooks, setDailyBooks] = useState([]);
  const [weeklyBooks, setWeeklyBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  useEffect(() => {
    const fetchMainPageData = async () => {
      try {
        const [daily, weekly] = await Promise.all([
          getDailyBestsellers(),
          getWeeklyBestsellers(),
        ]);
        setDailyBooks(daily);
        setWeeklyBooks(weekly);
        // 추후 추가 가능
        // setNewBooks(await getNewBooks());
        // setRecommendedBooks(await getRecommendedBooks());
      } catch (error) {
        console.error("메인 페이지 데이터 로딩 실패:", error);
      }
    };

    fetchMainPageData();
  }, []);

  return (
    <BasicLayout>
      {/* HERO 영역 */}
      <section className="hero min-h-[60vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-2xl w-full">
            <h1 className="text-5xl font-bold mb-4">📚 InkCloud</h1>
            <p className="text-lg text-gray-600 mb-6">원하는 책을 지금 바로 검색해보세요!</p>
            <MainSearchBar />
          </div>
        </div>
      </section>

      {/* 캐러셀 영역 */}
      <section className="py-12 px-4 bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center">🔥 오늘의 인기 도서</h2>
        <MainCarousel
          bestsellers={dailyBooks}
          newBooks={newBooks}
          recommendedBooks={recommendedBooks}
        />
      </section>

      {/* 주간 랭킹 영역 */}
      <section className="py-12 px-4 bg-base-100">
        <h2 className="text-2xl font-bold mb-6 text-center">🏆 주간 베스트셀러 Top 10</h2>
        <BookRankingSection weeklyBooks={weeklyBooks} />
      </section>
    </BasicLayout>
  );
};

export default MainPage;
