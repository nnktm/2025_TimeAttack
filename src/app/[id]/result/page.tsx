'use client';

import LoadingModal from '@/app/components/loadingModal';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../../styles/page.module.css';

const Result = () => {
  const [firstTime, setFirstTime] = useState(0);
  const [secondTime, setSecondTime] = useState(0);
  const [thirdTime, setThirdTime] = useState(0);
  const [sumTime, setSumTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const id = useParams().id as string;

  useEffect(() => {
    setIsLoading(true);
    const fetchResult = async () => {
      // クエリパラメータでIDを渡す
      const response = await fetch(`/api/getResult?id=${id}`);
      const data = (await response.json()) as {
        firstTime: number;
        secondTime: number;
        thirdTime: number;
        sumTime: number;
      };
      setFirstTime(data.firstTime);
      setSecondTime(data.secondTime);
      setThirdTime(data.thirdTime);
      setSumTime(data.sumTime);
      setIsLoading(false);
    };
    void fetchResult();
  }, [id]);

  return (
    <div className={styles.container}>
      {isLoading ? <LoadingModal isLoading={isLoading} /> : null}
      <div className={styles.content}>
        <h1>結果</h1>
        <div className={styles.resultList}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>第1ステージ</span>
            <span className={styles.resultValue}>{firstTime.toFixed(2)}s</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>第2ステージ</span>
            <span className={styles.resultValue}>{secondTime.toFixed(2)}s</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>第3ステージ</span>
            <span className={styles.resultValue}>{thirdTime.toFixed(2)}s</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>合計タイム</span>
            <span className={styles.resultValue}>{sumTime?.toFixed(2)}s</span>
          </div>
        </div>
        <a href="/ranking" className={styles.button}>
          ランキングを見る
        </a>
      </div>
    </div>
  );
};

export default Result;
