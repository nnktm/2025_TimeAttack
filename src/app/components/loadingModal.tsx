import styles from './styles/loadingModalStyles.module.css';

type LoadingModalProps = {
  isLoading: boolean;
};

const LoadingModal = ({ isLoading }: LoadingModalProps) => {
  if (!isLoading) return null;
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h1> loading...</h1>
        <p>しばらくお待ちください</p>
      </div>
    </div>
  );
};

export default LoadingModal;
