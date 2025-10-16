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
    <div>
      {isLoading ? <LoadingModal isLoading={isLoading} /> : null}
      <h1>result</h1>
      <div>
        <p>だいいちタイム: {firstTime}</p>
        <p>だいにタイム: {secondTime}</p>
        <p>だいさんタイム: {thirdTime}</p>
        <p>ごうけいタイム: {sumTime}</p>
      </div>
      <a href="/ranking" className={styles.button}>
        ランキングを見る
      </a>
    </div>
  );
};

export default Result;
