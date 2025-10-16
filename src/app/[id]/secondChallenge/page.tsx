'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingModal from '../../components/loadingModal';
import styles from '../../styles/challenge.module.css';

const SecondChallenge = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const id = useParams().id as string;

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
    if (isSubmitting) return;
    setTimer(0);
    setIsPlaying(false);
  };

  const startTimer = () => {
    if (isSubmitting) return;
    setIsPlaying(true);
  };

  const stopTimer = () => {
    if (isSubmitting) return;
    setIsPlaying(false);
  };

  const handleSubmit = async () => {
    if (isSubmitting || isLoading) return;
    console.log('handleSubmit', { id, secondTime: timer });

    setIsLoading(true);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/secondChallenge`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, secondTime: timer }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit time');
      }

      const data = (await response.json()) as { newTime: { id: string; secondTime: number } };
      console.log('Success:', data);
      setIsSubmit(true);
    } catch (error) {
      console.error('Submit Error:', error);
      alert('タイムの保存に失敗しました');
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div>{isLoading ? <LoadingModal isLoading={isLoading} /> : null}</div>
      <h1>secondChallenge</h1>
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
        {isSubmit ? (
          <button
            onClick={() => (window.location.href = `/${id}/thirdChallenge`)}
            className={styles.button}
          >
            つぎのステージへ
          </button>
        ) : (
          <button onClick={handleSubmit} className={styles.button}>
            けっかをけってい
          </button>
        )}
      </div>
    </div>
  );
};

export default SecondChallenge;
