// src/pages/MainPage.jsx
import React, { useEffect, useState } from "react";
import BasicLayout from "../layouts/BasicLayout";
import MainTabbedBookSection from "../components/main/MainTabbedBookSection";
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
        const [daily, weekly, newBooks, recommendedBooks] = await Promise.all([
          getDailyBestsellers(),
          getWeeklyBestsellers(),
          getNewBooks(),
          getRecommendedBooks(),
        ]);
        setDailyBooks(daily);
        setWeeklyBooks(weekly);
        setNewBooks(newBooks);
        setRecommendedBooks(recommendedBooks);
      } catch (error) {
        console.error("메인 페이지 데이터 로딩 실패:", error);
      }
    };

    fetchMainPageData();
  }, []);

  return (
    <BasicLayout>
      <section className="bg-base-100 py-12">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl px-4">
            <MainSearchBar />
          </div>
        </div>
      </section>

      {/* 캐러셀 영역 */}
      <section className="py-12 px-4 bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center">🔥 오늘의 인기 도서</h2>
        <MainTabbedBookSection
          bestsellers={dailyBooks}
          newBooks={newBooks}
          recommendedBooks={recommendedBooks}
        />
      </section>

      {/* 주간 랭킹 영역 */}
      <section className="py-12 px-4 bg-base-100">
        <BookRankingSection weeklyBooks={weeklyBooks} />
      </section>
    </BasicLayout>
  );
};

export default MainPage;
