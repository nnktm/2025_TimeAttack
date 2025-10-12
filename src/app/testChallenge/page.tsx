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
            setTimer((time) => Math.round((time + 0.01) * 100) / 100);
          }, 10)
        : undefined;
    return () => timerId && clearInterval(timerId);
  }, [isPlaying]);

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
        {(() => {
          const hundreds = Math.floor(timer / 100) % 10;
          const tens = Math.floor(timer / 10) % 10;
          const ones = Math.floor(timer) % 10;
          const tenths = Math.floor((timer * 10) % 10);
          const hundredths = Math.floor((timer * 100) % 10);

          return [hundreds * -110, tens * -110, ones * -110, tenths * -77, hundredths * -77];
        })().map((m, i) => {
          const isDecimal = i >= 3; // 3番目以降は小数部分
          return (
            <div
              key={`${i}-${m}`}
              className={`${styles.timerItemInteger} ${isDecimal ? styles.timerItemDecimal : ''}`}
              style={{ backgroundPositionX: `${m}px` }}
            />
          );
        })}
      </div>
      <div className={styles.buttons}>
        {isPlaying ? (
          <button onClick={stopTimer} className={styles.button}>
            Stop
          </button>
        ) : (
          <button onClick={startTimer} className={styles.button}>
            Start
          </button>
        )}
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
