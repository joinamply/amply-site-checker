import styles from './ScoreCard.module.css';

export default function ScoreCard({ score }) {
    let colorClass = styles.good;
    if (score < 50) colorClass = styles.poor;
    else if (score < 80) colorClass = styles.average;

    return (
        <div className={styles.card}>
            <div className={`${styles.scoreRing} ${colorClass}`}>
                <span className={styles.scoreValue}>{score}</span>
                <span className={styles.scoreLabel}>Score</span>
            </div>
        </div>
    );
}
