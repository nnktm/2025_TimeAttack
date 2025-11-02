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
  const [selectedBonus, setSelectedBonus] = useState<number>(0); // 選択されたボーナス秒数
  const [buildTimer, setBuildTimer] = useState(30); // 作成用30秒タイマー
  const [isBuildTimeUp, setIsBuildTimeUp] = useState(false);
  const [buildTimerActive, setBuildTimerActive] = useState(false);

  // 作成用30秒カウントダウンタイマー
  useEffect(() => {
    if (!buildTimerActive) return;
    const timerId = setInterval(() => {
      setBuildTimer((prev) => {
        if (prev <= 0.01) {
          setIsBuildTimeUp(true);
          setBuildTimerActive(false);
          return 0;
        }
        return Math.round((prev - 0.01) * 100) / 100;
      });
    }, 10);
    return () => clearInterval(timerId);
  }, [buildTimerActive]);

  // チャレンジタイマー（作成時間終了後に開始可能）
  useEffect(() => {
    const timerId =
      isPlaying === true && isBuildTimeUp
        ? setInterval(() => {
            setTimer((time) => Math.round((time + 0.01) * 100) / 100);
          }, 10)
        : undefined;
    return () => timerId && clearInterval(timerId);
  }, [isPlaying, isBuildTimeUp]);

  // 選択可能なボーナス秒数
  const bonusOptions = [5, 10, 15, 20, 25, 30];

  const startBuildTimer = () => {
    if (isSubmitting || buildTimerActive) return;
    setBuildTimerActive(true);
    setIsBuildTimeUp(false);
  };

  const stopBuildTimer = () => {
    if (isSubmitting) return;
    setBuildTimerActive(false);
    if (buildTimer > 0) {
      setIsBuildTimeUp(true);
    }
  };

  const startTimer = () => {
    if (isSubmitting || !isBuildTimeUp) return;
    setIsPlaying(true);
  };

  const stopTimer = () => {
    if (isSubmitting) return;
    setIsPlaying(false);
  };

  const handleSubmit = async () => {
    if (isSubmitting || isLoading) return;
    const deduction = selectedBonus;
    const adjustedTime = Math.round((timer - deduction) * 100) / 100;
    console.log('handleSubmit', {
      id,
      thirdTime: adjustedTime,
      rawTime: timer,
      selectedBonus,
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
      <h1>紙飛行機チャレンジ</h1>

      {/* 作成用30秒タイマー */}
      {!isBuildTimeUp && (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>作成時間</h2>
          <div className={styles.timer}>
            {(() => {
              const hundreds = Math.floor(buildTimer / 100) % 10;
              const tens = Math.floor(buildTimer / 10) % 10;
              const ones = Math.floor(buildTimer) % 10;
              const tenths = Math.floor((buildTimer * 10) % 10);
              const hundredths = Math.floor((buildTimer * 100) % 10);

              // 画面サイズに応じて背景位置を調整
              const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;
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
                  key={`build-${i}-${m}`}
                  className={`${styles.timerItemInteger} ${isDecimal ? styles.timerItemDecimal : ''}`}
                  style={{ backgroundPositionX: `${m}px` }}
                />
              );
            })}
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '1rem' }}>
            {buildTimerActive ? '作成中...' : '準備完了'}
          </div>
        </div>
      )}

      {/* 作成終了後の情報表示 */}
      {isBuildTimeUp && (
        <div style={{ textAlign: 'center', marginTop: '8px', marginBottom: '1rem' }}>
          {(() => {
            const deduction = selectedBonus;
            const adjustedTime = Math.round((timer - deduction) * 100) / 100;
            return (
              <>
                <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                  作成完了！飛距離ボーナスを選択してください
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <div>選択されたボーナス: -{deduction}s</div>
                  <div>
                    <strong>送信タイム: {adjustedTime.toFixed(2)}s</strong>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
      <div className={styles.buttons}>
        {/* 飛距離ボーナス選択 */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem' }}>
            飛距離ボーナスを選択
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            {bonusOptions.map((bonus) => (
              <button
                key={bonus}
                onClick={() => {
                  if (!buildTimerActive && !isPlaying) {
                    setSelectedBonus(bonus);
                  }
                }}
                disabled={buildTimerActive || isPlaying}
                className={styles.button}
                style={{
                  padding: '0.8rem 1rem',
                  fontSize: '1rem',
                  backgroundColor:
                    selectedBonus === bonus ? 'rgba(0, 183, 255, 0.8)' : 'rgba(0, 183, 255, 0.5)',
                  opacity: buildTimerActive || isPlaying ? 0.5 : 1,
                  cursor: buildTimerActive || isPlaying ? 'not-allowed' : 'pointer',
                }}
              >
                -{bonus}s
              </button>
            ))}
          </div>
          <small style={{ display: 'block', textAlign: 'center', fontSize: '0.9rem' }}>
            {buildTimerActive
              ? '作成中は選択できません'
              : isPlaying
                ? 'タイマー停止まで選択できません'
                : selectedBonus > 0
                  ? `選択中: -${selectedBonus}秒`
                  : 'ボーナスを選択してください'}
          </small>
        </div>

        {/* 作成タイマーのボタン */}
        {!isBuildTimeUp && (
          <>
            {buildTimerActive ? (
              <button onClick={stopBuildTimer} className={styles.button}>
                作成を終了
              </button>
            ) : (
              <button onClick={startBuildTimer} className={styles.button}>
                作成を開始
              </button>
            )}
          </>
        )}

        {/* チャレンジタイマーのボタン */}
        {isBuildTimeUp && (
          <>
            {isPlaying ? (
              <button onClick={stopTimer} className={styles.button}>
                ストップ
              </button>
            ) : (
              <button onClick={startTimer} className={styles.button}>
                スタート
              </button>
            )}
          </>
        )}

        {isSubmit ? (
          <button
            onClick={() => (window.location.href = `/${id}/result`)}
            className={styles.button}
          >
            結果を表示
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className={styles.button}
            disabled={!isBuildTimeUp || selectedBonus === 0}
          >
            結果を送信
          </button>
        )}
      </div>
    </div>
  );
};

export default ThirdChallenge;
