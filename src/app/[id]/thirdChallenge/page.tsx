'use client';

import LoadingModal from '@/app/components/loadingModal';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../../styles/challenge.module.css';

const ThirdChallenge = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const id = useParams().id as string;
  const [distanceCm, setDistanceCm] = useState<number>(0);

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
    const deduction = Math.min((Number(distanceCm) || 0) * 0.01, 50);
    const adjustedTime = Math.round((timer - deduction) * 100) / 100;
    console.log('handleSubmit', {
      id,
      thirdTime: adjustedTime,
      rawTime: timer,
      distanceCm,
      deduction,
    });

    setIsLoading(true);
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/thirdChallenge`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, thirdTime: adjustedTime }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit time');
      }

      const data = (await response.json()) as { newTime: { id: string; thirdTime: number } };
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
    <div className={styles.container}>
      <div>{isLoading ? <LoadingModal isLoading={isLoading} /> : null}</div>
      <h1>thirdChallenge</h1>
      <div className={styles.timer}>
        {(() => {
          const hundreds = Math.floor(timer / 100) % 10;
          const tens = Math.floor(timer / 10) % 10;
          const ones = Math.floor(timer) % 10;
          const tenths = Math.floor((timer * 10) % 10);
          const hundredths = Math.floor((timer * 100) % 10);

          // 画面サイズに応じて背景位置を調整
          const isMobile = window.innerWidth <= 480;
          const integerOffset = isMobile ? -66 : -88;
          const decimalOffset = isMobile ? -46.2 : -61.6;

          return [
            hundreds * integerOffset,
            tens * integerOffset,
            ones * integerOffset,
            tenths * decimalOffset,
            hundredths * decimalOffset,
          ];
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
      {(() => {
        const deduction = Math.min((Number(distanceCm) || 0) * 0.01, 50);
        const adjustedTime = Math.round((timer - deduction) * 100) / 100;
        return (
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <div>現在のタイム: {timer.toFixed(2)}s</div>
            <div>飛距離ボーナス: -{deduction.toFixed(2)}s</div>
            <div>
              <strong>送信タイム: {adjustedTime.toFixed(2)}s</strong>
            </div>
          </div>
        );
      })()}
      <div className={styles.buttons}>
        <label style={{ textAlign: 'center', marginBottom: '8px' }}>
          紙飛行機の飛距離（cm）
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            value={distanceCm}
            onChange={(e) => setDistanceCm(Math.max(0, Number(e.target.value)))}
            style={{
              display: 'block',
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 12px',
              marginTop: '6px',
              marginBottom: '6px',
              borderRadius: '8px',
              border: '1px solid #ccc',
            }}
          />
          <small style={{ display: 'block', textAlign: 'left' }}>1cmごとに0.01秒ボーナス</small>
        </label>
        {isPlaying ? (
          <button onClick={stopTimer} className={styles.button}>
            ストップ
          </button>
        ) : (
          <button onClick={startTimer} className={styles.button}>
            スタート
          </button>
        )}
        <button onClick={resetTimer} className={styles.button}>
          リセット
        </button>
        {isSubmit ? (
          <button
            onClick={() => (window.location.href = `/${id}/result`)}
            className={styles.button}
          >
            結果を表示
          </button>
        ) : (
          <button onClick={handleSubmit} className={styles.button}>
            結果を送信
          </button>
        )}
      </div>
    </div>
  );
};

export default ThirdChallenge;
