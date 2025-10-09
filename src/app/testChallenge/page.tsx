'use client';

import { useEffect, useState } from 'react';
import styles from '../page.module.css';

const TestChallenge = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const timerId =
      isPlaying === true
        ? setInterval(() => {
            setTimer((time) => time + 1);
          }, 1000)
        : undefined;
    return () => timerId && clearInterval(timerId);
  }, [isPlaying, timer]);

  const resetTimer = () => {
    setTimer(0);
    setIsPlaying(false);
  };

  const startTimer = () => {
    setIsPlaying(true);
  };

  const stopTimer = () => {
    setIsPlaying(false);
  };

  const confirmTimer = () => {
    console.log(timer);
  };

  return (
    <div>
      <h1>testChallenge</h1>
      <div className={styles.timer}>
        {[
          timer / 100 > 0 ? Math.floor(timer / 100) * -220 : 0,
          timer / 10 > 0 ? Math.floor((timer % 100) / 10) * -220 : 0,
          timer % 10 > 0 ? (timer % 10) * -220 : 0,
        ].map((m, i) => (
          <div
            key={`${i}-${m}`}
            className={styles.timerItem}
            style={{ backgroundPositionX: `${m}px` }}
          />
        ))}
      </div>
      <div className={styles.buttons}>
        <button onClick={startTimer} className={styles.button}>
          Start
        </button>
        <button onClick={stopTimer} className={styles.button}>
          Stop
        </button>
        <button onClick={resetTimer} className={styles.button}>
          Reset
        </button>
        <button onClick={confirmTimer} className={styles.button}>
          次のステージへ
        </button>
      </div>
    </div>
  );
};

export default TestChallenge;
