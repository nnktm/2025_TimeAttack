'use client';

import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>タイムアタックへようこそ</h1>
        <a href="/testChallenge">タイムアタックを始める</a>
        <a href="/ranking">ランキングを見る</a>
      </div>
    </div>
  );
}
