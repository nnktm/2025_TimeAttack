'use client';

import { useEffect, useState } from 'react';
import LoadingModal from '../components/loadingModal';
import styles from '../styles/ranking.module.css';

const Ranking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [ranking, setRanking] = useState<
    { firstTime: number; secondTime: number; thirdTime: number; sumTime: number }[]
  >([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchRanking = async () => {
      const response = await fetch('/api/ranking');
      const data = (await response.json()) as {
        firstTime: number;
        secondTime: number;
        thirdTime: number;
        sumTime: number;
      }[];
      setRanking(data);
      setIsLoading(false);
    };
    void fetchRanking();
  }, []);

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}位`;
  };

  return (
    <div className={styles.container}>
      {isLoading ? <LoadingModal isLoading={isLoading} /> : null}
      <div className={styles.content}>
        <h1 className={styles.title}>ランキング</h1>

        {ranking.length === 0 ? (
          <p className={styles.noData}>まだランキングデータがありません</p>
        ) : (
          <div className={styles.rankingTable}>
            <div className={styles.tableHeader}>
              <div className={styles.rankColumn}>順位</div>
              <div className={styles.timeColumn}>第1ステージ</div>
              <div className={styles.timeColumn}>第2ステージ</div>
              <div className={styles.timeColumn}>第3ステージ</div>
              <div className={styles.totalColumn}>合計タイム</div>
            </div>

            {ranking.map((item, index) => (
              <div
                key={`${item.sumTime}-${index}`}
                className={`${styles.rankingRow} ${
                  index === 0
                    ? styles.rank1
                    : index === 1
                      ? styles.rank2
                      : index === 2
                        ? styles.rank3
                        : ''
                }`}
              >
                <div className={styles.rankColumn}>
                  <span className={styles.rankNumber}>{getRankDisplay(index + 1)}</span>
                </div>
                <div className={styles.timeColumn}>{item.firstTime.toFixed(2)}秒</div>
                <div className={styles.timeColumn}>{item.secondTime.toFixed(2)}秒</div>
                <div className={styles.timeColumn}>{item.thirdTime.toFixed(2)}秒</div>
                <div className={styles.totalColumn}>
                  <strong>{item.sumTime.toFixed(2)}秒</strong>
                </div>
              </div>
            ))}
          </div>
        )}

        <a href="/" className={styles.homeButton}>
          ホームに戻る
        </a>
      </div>
    </div>
  );
};

export default Ranking;
