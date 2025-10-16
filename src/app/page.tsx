'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './styles/page.module.css';

export default function Home() {
  const [createdGameData, setCreatedGameData] = useState(false);
  const router = useRouter();

  const createGameData = async () => {
    if (createdGameData) return;
    const response = await fetch('/api/createGameData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    const data = (await response.json()) as { id: string };
    void router.push(`/${data.id}/firstChallenge`);
    setCreatedGameData(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>タイムアタックへようこそ</h1>
        <a onClick={createGameData} className={styles.button}>
          タイムアタックを始める
        </a>
        <a href="/ranking" className={styles.button}>
          ランキングを見る
        </a>
      </div>
    </div>
  );
}
