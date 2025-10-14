'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../../page.module.css';

const Result = () => {
  const [firstTime, setFirstTime] = useState(0);
  const [secondTime, setSecondTime] = useState(0);
  const [thirdTime, setThirdTime] = useState(0);
  const [sumTime, setSumTime] = useState(0);

  const id = useParams().id as string;

  useEffect(() => {
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
    };
    void fetchResult();

    setSumTime(firstTime + secondTime + thirdTime);
  }, [id, firstTime, secondTime, thirdTime]);

  return (
    <div>
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
